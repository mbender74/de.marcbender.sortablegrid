//
//  BMDragCellCollectionView.m
//
//  Copyright © 2017年 https://github.com/asiosldh/BMDragCellCollectionView/ All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

#import "BMDragCellCollectionView.h"
#import "BMDragCollectionViewCell.h"

#pragma mark - UICollectionView (BMDragCellCollectionViewRect)

/**
 内部工具
 */
@interface UICollectionView (BMDragCellCollectionViewRect)

/**
 获取一组的rect
 - (CGRect)rectForSection:(NSInteger)section;
 
 @param section 组
 @return Rect
 */
- (CGRect)BMDragCellCollectionView_rectForSection:(NSInteger)section;

/**
 获取 indexPath的Cell 的Rect
 - (CGRect)rectForRowAtIndexPath:(NSIndexPath *)indexPath;
 
 @param indexPath indexPath
 @return Rect
 */
- (CGRect)BMDragCellCollectionView_rectForRowAtIndexPath:(NSIndexPath *)indexPath;

@end

@implementation UICollectionView (BMRect)

- (CGRect)BMDragCellCollectionView_rectForSection:(NSInteger)section {
    
   // NSLog(@"[INFO] BMDragCellCollectionView_rectForSection: ");

    
    NSInteger sectionNum = [self.dataSource collectionView:self numberOfItemsInSection:section];
    if (sectionNum <= 0) {
        return CGRectZero;
    } else {
        CGRect firstRect = [self BMDragCellCollectionView_rectForRowAtIndexPath:[NSIndexPath indexPathForItem:0 inSection:section]];
        CGRect lastRect = [self BMDragCellCollectionView_rectForRowAtIndexPath:[NSIndexPath indexPathForItem:sectionNum-1 inSection:section]];
        return CGRectMake(0, CGRectGetMinY(firstRect), CGRectGetWidth(self.frame), CGRectGetMaxY(lastRect) - CGRectGetMidY(firstRect));
    }
}

- (CGRect)BMDragCellCollectionView_rectForRowAtIndexPath:(NSIndexPath *)indexPath {
   // NSLog(@"[INFO] BMDragCellCollectionView_rectForRowAtIndexPath: ");

    return [self layoutAttributesForItemAtIndexPath:indexPath].frame;
}

@end


@interface BMDragCellCollectionView (){
    BOOL inDeletingItem;
}


@property (strong, nonatomic) UIView *shadowView;
@property (strong, nonatomic) UIView *snapedView;                        ///< 截图快照
@property (strong, nonatomic) UILongPressGestureRecognizer *longGesture; ///< 长按手势
@property (strong, nonatomic) CADisplayLink *edgeTimer;                  ///< 定时器
@property (strong, nonatomic) NSIndexPath *oldIndexPath;                 ///< 旧的IndexPath
@property (strong, nonatomic) NSIndexPath *currentIndexPath;             ///< 当前路径
@property (assign, nonatomic) CGPoint oldPoint;                          ///< 旧的位置
@property (assign, nonatomic) CGPoint lastPoint;                         ///< 最后的触摸点
@property (assign, nonatomic) BOOL isEndDrag;                            ///< 是否正在拖动

@end

@implementation BMDragCellCollectionView

@dynamic delegate, dataSource;

#pragma mark -

- (void)awakeFromNib {
    [super awakeFromNib];
    [self initConfiguration];
}

#pragma mark - init

- (instancetype)init {
    if (self = [super init]) {
        [self initConfiguration];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self initConfiguration];
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame collectionViewLayout:(UICollectionViewFlowLayout *)layout {
    if (self = [super initWithFrame:frame collectionViewLayout:layout]) {
        [self initConfiguration];
    }
    return self;
}

- (instancetype)initWithCoder:(NSCoder *)aDecoder {
    if (self = [super initWithCoder:aDecoder]) {
        [self initConfiguration];
    }
    return self;
}

- (void)dealloc {
    [self _stopEdgeTimer];
    [super dealloc];
}

#pragma mark - getters setters

- (void)setCanDrag:(BOOL)canDrag {
    _canDrag = canDrag;
    self.longGesture.enabled = _canDrag;
}

- (void)setEditMode:(BOOL)editMode {
    _editMode = editMode;
}
- (void)setWobbleEnabled:(BOOL)wobbleEnabled {
    _wobbleEnabled = wobbleEnabled;
}

- (void)setMinimumPressDuration:(NSTimeInterval)minimumPressDuration {
    _minimumPressDuration = minimumPressDuration;
    self.longGesture.minimumPressDuration = minimumPressDuration;
}

- (void)setDragZoomScale:(CGFloat)dragZoomScale {
    if (dragZoomScale < 0) {
        dragZoomScale = 0.01;
    }
    _dragZoomScale = dragZoomScale;
}

- (void)setDragSpeed:(CGFloat)dragSpeed {
    if (dragSpeed < 0.5) {
        dragSpeed = 8.0;
    }
    _dragSpeed = dragSpeed;
}

- (UILongPressGestureRecognizer *)longGesture {
    if (!_longGesture) {
        _longGesture = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(handlelongGesture:)];
        _longGesture.minimumPressDuration = _minimumPressDuration;
    }
    return _longGesture;
}

- (void)setPrefetchingEnabled:(BOOL)prefetchingEnabled {
    [super setPrefetchingEnabled:prefetchingEnabled];
}


- (void)insertItemAtIndexPath:(NSIndexPath *)indexPath  {
  //  [self _updateSourceData];
    NSMutableArray *array = [[self.dataSource dataSourceWithDragCellCollectionView:self] mutableCopy];
   // [array[0] addObject:];

    [super insertItemsAtIndexPaths:@[indexPath]];

}

- (void)deleteItemAtIndexPath:(NSIndexPath *)indexPath {


    
        

    
  //  [self performBatchUpdates:^{
        inDeletingItem = YES;

        [[self.dataSource dataSourceWithDragCellCollectionView:self][0] removeObjectAtIndex:indexPath.item];
        
        [self _updateSourceData];
        
        [self deleteItemsAtIndexPaths:@[indexPath]];

        inDeletingItem = NO;

//    }completion:^(BOOL finished) {

   //     [UIView performWithoutAnimation: ^ {
   //         [self reloadData];
//            [self reloadItemsAtIndexPaths:[self indexPathsForVisibleItems]];
   //     }];

  //  }];
    
    
    
    
//    [self _updateSourceData];

   // _oldIndexPath = indexPath;

    //[self _updateSourceData];
    
}



#pragma mark

- (void)initConfiguration {
    _canDrag = YES;
    _minimumPressDuration = .5f;
    _dragZoomScale = 1.02f;
    _dragCellAlpha = 0.98;
    _dragSpeed     = 4.0;
    _editMode = NO;
    _wobbleEnabled = NO;
    self.pageCount = 0;
    dragCollectionViewContentSize = CGSizeZero;
    _scrollDirection = BMDragCellCollectionViewScrollDirectionNone;
    [self addGestureRecognizer:self.longGesture];
    self.prefetchingEnabled = YES;
    super.prefetchingEnabled = YES;
    inDeletingItem = NO;
    
    [self addObserver:self forKeyPath:@"contentSize" options:NSKeyValueObservingOptionOld context:NULL];

    
}



- (UICollectionViewCell *)dequeueReusableCellWithReuseIdentifier:(NSString *)identifier forIndexPath:(NSIndexPath *)indexPath {
    UICollectionViewCell *cell = [super dequeueReusableCellWithReuseIdentifier:identifier forIndexPath:indexPath];
    
    if (_isEndDrag) {
        cell.hidden = NO;

        return cell;
    }
    cell.hidden = (self.oldIndexPath && self.oldIndexPath.item == indexPath.item && self.oldIndexPath.section == indexPath.section);

    return cell;
}

- (NSIndexPath *)_firstNearlyIndexPath {
    __block CGFloat width = MAXFLOAT;
    __block NSIndexPath *index = nil;
    __weak __typeof(self)weakSelf = self;
    [[self visibleCells] enumerateObjectsUsingBlock:^(__kindof UICollectionViewCell * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        __strong __typeof(weakSelf) self = weakSelf;
        CGPoint p1 = self.snapedView.center;
        CGPoint p2 = obj.center;
        CGFloat distance = sqrt(pow((p1.x - p2.x), 2) + pow((p1.y - p2.y), 2));
        if (distance < width) {
            width = distance;
            index = [self indexPathForCell:obj];
        }
    }];
    if ((index.item == self.oldIndexPath.item) && (index.row == self.oldIndexPath.row)) {
        return nil;
    }
    return index;
}

- (BMDragCellCollectionViewScrollDirection)_setScrollDirection {

    if (self.bounds.size.height + self.contentOffset.y - _snapedView.center.y < _snapedView.bounds.size.height / 2 && self.bounds.size.height + self.contentOffset.y < self.contentSize.height) {
        return BMDragCellCollectionViewScrollDirectionDown;
    }
    if (_snapedView.center.y - self.contentOffset.y < _snapedView.bounds.size.height / 2 && self.contentOffset.y > 0) {
        return BMDragCellCollectionViewScrollDirectionUp;
    }
    if (self.bounds.size.width + self.contentOffset.x - _snapedView.center.x < _snapedView.bounds.size.width / 2 && self.bounds.size.width + self.contentOffset.x < self.contentSize.width) {
        return BMDragCellCollectionViewScrollDirectionRight;
    }
    if (_snapedView.center.x - self.contentOffset.x < _snapedView.bounds.size.width / 2 && self.contentOffset.x > 0) {
        return BMDragCellCollectionViewScrollDirectionLeft;
    }
    return BMDragCellCollectionViewScrollDirectionNone;
}

- (void)_updateSourceData {
   // NSLog(@" ");

   // NSLog(@"[INFO] _updateSourceData: ");

    NSMutableArray *array = [[self.dataSource dataSourceWithDragCellCollectionView:self] mutableCopy];

    BOOL dataTypeCheck = ([self numberOfSections] != 1 || ([self  numberOfSections] == 1 && [array[0] isKindOfClass:[NSArray class]]));
    if (dataTypeCheck) {
        for (int i = 0; i < array.count; i ++) {
            [array replaceObjectAtIndex:i withObject:[array[i] mutableCopy]];
        }
    }
    if (_currentIndexPath.section == _oldIndexPath.section) {
        NSMutableArray *orignalSection = dataTypeCheck ? (NSMutableArray *)array[_oldIndexPath.section] : (NSMutableArray *)array;
        if (_currentIndexPath.item > _oldIndexPath.item) {
            for (NSUInteger i = _oldIndexPath.item; i < _currentIndexPath.item ; i ++) {
                [orignalSection exchangeObjectAtIndex:i withObjectAtIndex:i + 1];
            }
        } else {
            for (NSUInteger i = _oldIndexPath.item; i > _currentIndexPath.item ; i --) {
                [orignalSection exchangeObjectAtIndex:i withObjectAtIndex:i - 1];
            }
        }
    } else {
        NSMutableArray *orignalSection = array[_oldIndexPath.section];
        NSMutableArray *currentSection = array[_currentIndexPath.section];
        [currentSection insertObject:orignalSection[_oldIndexPath.item] atIndex:_currentIndexPath.item];
        [orignalSection removeObject:orignalSection[_oldIndexPath.item]];
    }

    [self.delegate dragCellCollectionView:self newDataArrayAfterMove:array];
}

- (void)_setEdgeTimer{
    if (!_edgeTimer) {
        _edgeTimer = [CADisplayLink displayLinkWithTarget:self selector:@selector(_edgeScroll)];
        [_edgeTimer addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
    }
}

- (void)_stopEdgeTimer{
    if (_edgeTimer) {
        [_edgeTimer invalidate];
        _edgeTimer = nil;
    }
    
   
}


- (void)_edgeScroll {
    BMDragCellCollectionViewScrollDirection scrollDirection = [self _setScrollDirection];

    switch (scrollDirection) {
        case BMDragCellCollectionViewScrollDirectionLeft:{
            [self setContentOffset:CGPointMake(self.contentOffset.x - self.dragSpeed, self.contentOffset.y) animated:NO];
            _snapedView.center = CGPointMake(_snapedView.center.x - self.dragSpeed, _snapedView.center.y);
            _lastPoint.x -= self.dragSpeed;
            
           //  NSLog(@"[ERROR] directionLeft %f %f: ",_lastPoint.x, _lastPoint.y);

            
        }
            break;
        case BMDragCellCollectionViewScrollDirectionRight:{
            [self setContentOffset:CGPointMake(self.contentOffset.x + self.dragSpeed, self.contentOffset.y) animated:NO];
            _snapedView.center = CGPointMake(_snapedView.center.x + self.dragSpeed, _snapedView.center.y);
            _lastPoint.x += self.dragSpeed;
          //  NSLog(@"[ERROR] directionRight %f %f: ",_lastPoint.x, _lastPoint.y);

        }
            break;
        case BMDragCellCollectionViewScrollDirectionUp:{
            [self setContentOffset:CGPointMake(self.contentOffset.x, self.contentOffset.y - self.dragSpeed) animated:NO];
            _snapedView.center = CGPointMake(_snapedView.center.x, _snapedView.center.y - self.dragSpeed);
            _lastPoint.y -= self.dragSpeed;
            
         //   NSLog(@"[ERROR] directionUp %f %f: ",_lastPoint.x, _lastPoint.y);

            
        }
            break;
        case BMDragCellCollectionViewScrollDirectionDown:{
            [self setContentOffset:CGPointMake(self.contentOffset.x, self.contentOffset.y + self.dragSpeed) animated:NO];
            _snapedView.center = CGPointMake(_snapedView.center.x, _snapedView.center.y + self.dragSpeed);
            _lastPoint.y += self.dragSpeed;
         //   NSLog(@"[ERROR] directionDown %f %f: ",_lastPoint.x, _lastPoint.y);

        }
            break;
        default:
            break;
    }
    
    if (scrollDirection == BMDragCellCollectionViewScrollDirectionNone) {
        return;
    }

    [UIView animateWithDuration:0.016 animations:^{
        _snapedView.center = _lastPoint;
    }];

    NSIndexPath *index = [self _firstNearlyIndexPath];

    if (self.delegate && [self.delegate respondsToSelector:@selector(dragCellCollectionView:changedDragAtPoint:indexPath:)]) {
        [self.delegate dragCellCollectionView:self changedDragAtPoint:_lastPoint indexPath:index];
    }
    
    if (!index) {
        return;
    }
    
    if (self.delegate && [self.delegate respondsToSelector:@selector(dragCellCollectionViewShouldBeginExchange:sourceIndexPath:toIndexPath:)]) {
        if (![self.delegate dragCellCollectionViewShouldBeginExchange:self sourceIndexPath:_oldIndexPath toIndexPath:index]) {
            return;
        }
    }

    _currentIndexPath = index;
    
    UICollectionViewCell *cell = [self cellForItemAtIndexPath:_currentIndexPath];
    
   // self.oldPoint = [self cellForItemAtIndexPath:_currentIndexPath].center;

    
    
    self.oldPoint =  CGPointMake(cell.center.x - (cell.frame.size.width/2) + [cell contentView].subviews.firstObject.frame.origin.x + ([cell contentView].subviews.firstObject.frame.size.width / 2) +4,cell.center.y - (cell.frame.size.height/2) + ([cell contentView].subviews.firstObject.frame.size.height / 2) +4);

    
    
    
    [self _updateSourceData];

    [self moveItemAtIndexPath:_oldIndexPath toIndexPath:_currentIndexPath];
    _oldIndexPath = _currentIndexPath;

  //  [ self  reloadItemsAtIndexPaths: @[_oldIndexPath]];



}

#pragma mark


- (void)handlelongGesture:(UILongPressGestureRecognizer *)longGesture {

    if (_editMode == YES) {

        
        point = [longGesture locationInView:self];
        orgPoint = point;
        
        NSIndexPath *indexPath = [self indexPathForItemAtPoint:point];

        
        
                switch (longGesture.state) {
                    case UIGestureRecognizerStateBegan: {
                        self.userInteractionEnabled = NO;
                        if (self.delegate && [self.delegate respondsToSelector:@selector(dragCellCollectionView:beganDragAtPoint:indexPath:)]) {
                            [self.delegate dragCellCollectionView:self beganDragAtPoint:point indexPath:indexPath];
                        }

                        _oldIndexPath = indexPath;
                        
                        if (_oldIndexPath == nil) {
                            self.longGesture.enabled = NO;
                            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.25 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                                if (_canDrag) {
                                    self.longGesture.enabled = YES;
                                }
                            });
                            break;
                        }
                        if (self.delegate && [self.delegate respondsToSelector:@selector(dragCellCollectionViewShouldBeginMove:indexPath:)]) {
                            if (![self.delegate dragCellCollectionViewShouldBeginMove:self indexPath:_oldIndexPath]) {
                                _oldIndexPath = nil;
                                self.longGesture.enabled = NO;
                                dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.25 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
                                    if (_canDrag) {
                                        self.longGesture.enabled = YES;
                                    }
                                });
                                break;
                            }
                        }
                        UICollectionViewCell *cell = [self cellForItemAtIndexPath:_oldIndexPath];
                        
                        BMDragCollectionViewCell *thisCell = (BMDragCollectionViewCell*)cell;

                        if (thisCell.canBeMoved == YES){
                                self.isEndDrag = NO;

                                self.oldPoint = cell.center;
                                
                                CGRect newCellFrame = cell.frame;
                                
                                
                                _snapedView = [[[cell contentView].subviews.firstObject.subviews objectAtIndex:0] snapshotViewAfterScreenUpdates:NO];
                                
                                newCellFrame.size = [[cell contentView].subviews.firstObject.subviews objectAtIndex:0].frame.size;
                                newCellFrame.origin.x = newCellFrame.origin.x + 4;
                                newCellFrame.origin.y = newCellFrame.origin.y + 4;

                                CGFloat shadowRadius = 8;
                                
                                _snapedView.frame = newCellFrame;
                                _snapedView.layer.cornerRadius = [cell contentView].subviews.firstObject.layer.cornerRadius;
                                _snapedView.clipsToBounds = NO;
                                _snapedView.backgroundColor = [UIColor clearColor];
                                _snapedView.layer.masksToBounds = NO;
                                _snapedView.layer.shadowOffset = CGSizeMake(0,0);
                                _snapedView.layer.shadowRadius = 0;
                                _snapedView.layer.shadowColor = [UIColor blackColor].CGColor;
                                _snapedView.layer.shadowOpacity = self.dragItemShadowOpacity;

                                [self addSubview:_snapedView];
                    //            CGPoint currentPoint = point;
                                
                                CGPoint currentPoint = CGPointMake(cell.center.x - (cell.frame.size.width/2) + [cell contentView].subviews.firstObject.frame.origin.x + ([cell contentView].subviews.firstObject.frame.size.width / 2),cell.center.y - (cell.frame.size.height/2) + ([cell contentView].subviews.firstObject.frame.size.height / 2) - 6);
                                
                               // CGPoint currentPoint = CGPointMake(cell.center.x+4, cell.center.y+4);
                                _snapedView.center = currentPoint;
                                cell.hidden = YES;

                                [UIView animateWithDuration:0.25
                                          delay: 0.0
                                          options: UIViewAnimationOptionCurveEaseInOut
                                          animations:^{
                                    _snapedView.center = currentPoint;
                                   // _snapedView.layer.shadowOpacity = 1.0;
                                    _snapedView.layer.shadowRadius = shadowRadius;

                                    _snapedView.transform = CGAffineTransformMakeScale(_dragZoomScale, _dragZoomScale);
                                    _snapedView.alpha = _dragCellAlpha;
                                } completion:^(BOOL finished) {
                                    point = currentPoint;
                                    [self _setEdgeTimer];
                                }];
                        }
                        else {
                            _snapedView = nil;
                            self.isEndDrag = YES;
                            self.oldIndexPath = nil;
                            self.userInteractionEnabled = YES;

                            break;
                        }
                    }
                        break;
                    case UIGestureRecognizerStateChanged: {

                        
                        if (_snapedView != nil){
                        
                        if (self.delegate && [self.delegate respondsToSelector:@selector(dragCellCollectionView:changedDragAtPoint:indexPath:)]) {
                            [self.delegate dragCellCollectionView:self changedDragAtPoint:point indexPath:indexPath];
                        }
                        //point = CGPointMake(_snapedView.center.x, _snapedView.center.y);

                        if (!CGPointEqualToPoint(point,orgPoint)){
                       
                            _lastPoint = point;
                            [UIView animateWithDuration:0.25 animations:^{
                                _snapedView.center = _lastPoint;
                            }];
                        }
                        else {
                            _lastPoint = point;
                            [UIView animateWithDuration:0.016 animations:^{
                                _snapedView.center = _lastPoint;
                            }];

                        }
                        
                        NSIndexPath *index = [self _firstNearlyIndexPath];
                        
                        if (!index) {
                            break;
                        }
                        
                        if (self.delegate && [self.delegate respondsToSelector:@selector(dragCellCollectionViewShouldBeginExchange:sourceIndexPath:toIndexPath:)]) {
                            if (![self.delegate dragCellCollectionViewShouldBeginExchange:self sourceIndexPath:_oldIndexPath toIndexPath:index]) {
                                break;
                            }
                        }
                        

                        
                        _currentIndexPath = index;
                        self.oldPoint = [self cellForItemAtIndexPath:_currentIndexPath].center;
                        
                        
                        [self _updateSourceData];

                        [self moveItemAtIndexPath:_oldIndexPath toIndexPath:_currentIndexPath];
                        _oldIndexPath = _currentIndexPath;

                       // [ self  reloadItemsAtIndexPaths: @[_oldIndexPath]];


                        //if (_editMode == YES && _wobbleEnabled == YES){
                           // [self.visibleCells  makeObjectsPerformSelector:@selector(wobble)];
                      //  }
                        }
                        break;
                    }
                        break;
                    default: {
                        
                        if (_snapedView != nil){
                            
                        
                        
                        self.userInteractionEnabled = YES;
                        if (self.delegate && [self.delegate respondsToSelector:@selector(dragCellCollectionView:endedDragAtPoint:indexPath:)]) {
                            [self.delegate dragCellCollectionView:self endedDragAtPoint:point indexPath:indexPath];
                        }

                        if (self.delegate
                            && [self.delegate respondsToSelector:@selector(dragCellCollectionView:endedDragAutomaticOperationAtPoint:section:indexPath:)]) {
                            NSInteger section = -1;
                            NSInteger sec = [self.dataSource numberOfSectionsInCollectionView:self];
                            for (NSInteger i = 0; i < sec; i++) {
                                if (CGRectContainsPoint([self BMDragCellCollectionView_rectForSection:i], point)) {
                                    section = i;
                                    break;
                                }
                            }
                            if (![self.delegate dragCellCollectionView:self endedDragAutomaticOperationAtPoint:point section:section indexPath:indexPath]) {
                                return;
                            }
                        }

                        if (!self.oldIndexPath) {
                            return;
                        }

                        UICollectionViewCell *cell = [self cellForItemAtIndexPath:_oldIndexPath];

                        self.userInteractionEnabled = NO;
                        self.isEndDrag = YES;
                        [UIView animateWithDuration:0.25
                                         delay: 0.0
                                         options: UIViewAnimationOptionCurveEaseInOut
                                         animations:^{
                            if (!cell) {
                                _snapedView.center = _oldPoint;
                            } else {
         //                       _snapedView.center = cell.center;
                                _snapedView.center = CGPointMake(cell.center.x - (cell.frame.size.width/2) + [cell contentView].subviews.firstObject.frame.origin.x + ([cell contentView].subviews.firstObject.frame.size.width / 2) ,cell.center.y - (cell.frame.size.height/2) + ([cell contentView].subviews.firstObject.frame.size.height / 2) +4);

                            }
                            _snapedView.transform = CGAffineTransformMakeScale(1.0f, 1.0f);
                           // _snapedView.alpha = 0.0;
                           // _snapedView.layer.shadowOpacity = 0.0;
                            _snapedView.layer.shadowRadius = 0;

                        } completion:^(BOOL finished) {
                            [_snapedView removeFromSuperview];

                            cell.hidden = NO;

                            self.userInteractionEnabled = YES;
                            if (self.delegate && [self.delegate respondsToSelector:@selector(dragCellCollectionViewDidEndDrag:)]) {
                                [self.delegate dragCellCollectionViewDidEndDrag:self];
                            }


                        }];
                        self.oldIndexPath = nil;
                        [self _stopEdgeTimer];
                        }
                    }
                        break;
                }
        
    }

}

- (void)dragMoveItemToIndexPath:(NSIndexPath *)newIndexPath {

    if (self.isEndDrag) {
        return;
    }
    self.isEndDrag = YES;
    self.longGesture.enabled = NO;
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.25 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        if (_canDrag) {
            self.longGesture.enabled = YES;
        }
    });
    


    _currentIndexPath = newIndexPath;
    [self _updateSourceData];

    [self moveItemAtIndexPath:_oldIndexPath toIndexPath:_currentIndexPath];
    _oldIndexPath = newIndexPath;

   // [ self  reloadItemsAtIndexPaths: @[_oldIndexPath]];

    
    



    UICollectionViewCell *cell = [self cellForItemAtIndexPath:_oldIndexPath];
    cell.hidden = YES;

    self.userInteractionEnabled = NO;
    self.isEndDrag = YES;
    [UIView animateWithDuration:0.25
         delay: 0.0
         options: UIViewAnimationOptionCurveEaseInOut
        animations:^{
        if (!cell) {
            _snapedView.center = _oldPoint;
        } else {
//            _snapedView.center = cell.center;
            
            
            _snapedView.center =  CGPointMake(cell.center.x - (cell.frame.size.width/2) + [cell contentView].subviews.firstObject.frame.origin.x + ([cell contentView].subviews.firstObject.frame.size.width / 2),cell.center.y - (cell.frame.size.height/2) + ([cell contentView].subviews.firstObject.frame.size.height / 2) +4);

            
        }
        _snapedView.transform = CGAffineTransformMakeScale(1.0f, 1.0f);
       // _snapedView.alpha = 0.0;
        //_snapedView.layer.shadowOpacity = 0.0;
        _snapedView.layer.shadowRadius = 0;

    } completion:^(BOOL finished) {
        [_snapedView removeFromSuperview];

        cell.hidden = NO;

        self.userInteractionEnabled = YES;
        if (self.delegate && [self.delegate respondsToSelector:@selector(dragCellCollectionViewDidEndDrag:)]) {
            [self.delegate dragCellCollectionViewDidEndDrag:self];
        }
        


    }];
    self.oldIndexPath = nil;
    [self _stopEdgeTimer];
}



- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary  *)change context:(void *)context
{    
    if (!CGSizeEqualToSize(dragCollectionViewContentSize,self.contentSize)){
        dragCollectionViewContentSize = self.contentSize;
        if (self.delegate && [self.delegate respondsToSelector:@selector(pagerInit:)]) {
            [self.delegate pagerInit:self];
        }
    }
}


@end
