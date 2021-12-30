/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "DeMarcbenderSortablegridView.h"
#import "DeMarcbenderSortablegridViewProxy.h"
#import <TitaniumKit/TiRect.h>
#import <TitaniumKit/TiUtils.h>
#import <TitaniumKit/TiDimension.h>
#import <TitaniumKit/TiViewProxy.h>




int const static kDirectionPanThreshold = 0;

@implementation DirectionPanGestureRecognizer

@synthesize direction = _direction;

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
    

    [super touchesMoved:touches withEvent:event];
    if (self.state == UIGestureRecognizerStateFailed) return;
    CGPoint nowPoint = [[touches anyObject] locationInView:self.view];
    CGPoint prevPoint = [[touches anyObject] previousLocationInView:self.view];
    _moveX += prevPoint.x - nowPoint.x;
    _moveY += prevPoint.y - nowPoint.y;
    if (!_drag) {

        if (abs(_moveX) > kDirectionPanThreshold) {
            if (_direction == DirectionPangestureRecognizerVertical) {

                self.state = UIGestureRecognizerStateFailed;
            }else {
                _drag = YES;
            }
        }else if (abs(_moveY) > kDirectionPanThreshold) {
            if (_direction == DirectionPanGestureRecognizerHorizontal) {

                self.state = UIGestureRecognizerStateFailed;
            }else {
                _drag = YES;
            }
        }
    }
}

- (void)reset {
    [super reset];
    _drag = NO;
    _moveX = 0;
    _moveY = 0;
}

@end



static const CGFloat kGridDashboardViewDefaultRowCount = 0;
static const CGFloat kGridDashboardViewDefaultColumnCount = 1;
static const CGFloat kGridDefaultHorizonatalSpacing = 0;
static const CGFloat kGridDefaultVerticalSpacing = 0;

static NSString *reuseIdentifier = @"forCellWithReuseIdentifier";
#define WIDTH  [[UIScreen mainScreen] bounds].size.width
#define HEIGHT [[UIScreen mainScreen] bounds].size.height


@interface TopAlignedCollectionViewFlowLayout : UICollectionViewFlowLayout {
    NSInteger lastPagesCount;
    CGSize lastContentSize;

}
@property (nonatomic, assign) ScrollDirection scrolldirection;

//- (void)alignToTopForSameLineElements:(NSArray *)sameLineElements;

@end

@implementation TopAlignedCollectionViewFlowLayout
/*
- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect;
{
    NSArray *attrs = [super layoutAttributesForElementsInRect:rect];
    CGFloat baseline = -2;
    NSMutableArray *sameLineElements = [NSMutableArray array];
    
    for (UICollectionViewLayoutAttributes *element in attrs) {
        if (element.representedElementCategory == UICollectionElementCategoryCell) {
            CGRect frame = element.frame;
            CGFloat centerY = CGRectGetMidY(frame);
            if (ABS(centerY - baseline) > 1) {

                baseline = centerY;
                [self alignToTopForSameLineElements:sameLineElements];
                [sameLineElements removeAllObjects];
            }
            [sameLineElements addObject:element];
        }
    }
    [self alignToTopForSameLineElements:sameLineElements];//align one more time for the last line
    return attrs;
}

- (void)alignToTopForSameLineElements:(NSArray *)sameLineElements
{
    if (sameLineElements.count == 0) {
        return;
    }
    NSArray *sorted = [sameLineElements sortedArrayUsingComparator:^NSComparisonResult(UICollectionViewLayoutAttributes *obj1, UICollectionViewLayoutAttributes *obj2) {
        CGFloat height1 = obj1.frame.size.height;
        CGFloat height2 = obj2.frame.size.height;
        CGFloat delta = height1 - height2;
        return delta == 0. ? NSOrderedSame : ABS(delta)/delta;
    }];
    UICollectionViewLayoutAttributes *tallest = [sorted lastObject];
    [sameLineElements enumerateObjectsUsingBlock:^(UICollectionViewLayoutAttributes *obj, NSUInteger idx, BOOL *stop) {
        obj.frame = CGRectOffset(obj.frame, 0, tallest.frame.origin.y - obj.frame.origin.y);
    }];
}

*/

- (CGSize)collectionViewContentSize
{
    CGSize size = [super collectionViewContentSize];
    if (self.scrolldirection == mkScrollVertical) {
        NSInteger pagesCount = ceil(size.height / self.collectionView.frame.size.height);
        if (pagesCount != lastPagesCount){
            CGFloat contentHeight = (pagesCount * (self.collectionView.frame.size.height))-self.collectionView.contentInset.top-self.collectionView.contentInset.bottom;
            lastPagesCount = pagesCount;

            lastContentSize = CGSizeMake(self.collectionView.frame.size.width-self.collectionView.contentInset.left-self.collectionView.contentInset.right, contentHeight);
        }
        return lastContentSize;
    }
    else {

        NSInteger pagesCount = ceil(size.width / self.collectionView.frame.size.width);
        if (pagesCount != lastPagesCount){
            CGFloat contentWidth = (pagesCount * (self.collectionView.frame.size.width))-self.collectionView.contentInset.left-self.collectionView.contentInset.right;
            lastPagesCount = pagesCount;
            lastContentSize = CGSizeMake(contentWidth, self.collectionView.frame.size.height-self.collectionView.contentInset.top-self.collectionView.contentInset.bottom);
        }
        return lastContentSize;
    }
}




@end


@implementation DeMarcbenderSortablegridView

- (void)dealloc
{
  launcher.delegate = nil;
  RELEASE_TO_NIL(launcher);
  [super dealloc];
}

- (void)initializeState
{
    [super initializeState];

    
    if (self){
        pagerEnabled = NO;
        self.dataSourceArray = [NSMutableArray array];
        editing = NO;
        cellWidth = 0;
        didScroll = NO;
        pagingEnabled = NO;
        cellData = [[NSMutableArray alloc] init];
        badgeImage = nil;
        [self pager];
        [self addSubview:[self launcher]];
        [launcher setEditMode:NO];
        launcher.editMode = NO;
        insetsCalcDone = NO;
        _leftInset = 0;
        _rightInset = 0;
        _initDone = NO;
        currentPage = -1;
        numberOfPages = -1;
        previousOffset = -1;
        showVerticalScrollIndicator = NO;
        showHorizontalScrollIndicator = NO;
        if ([self pager] != nil){
            [self addSubview:pager];
        }
      //  [self addSubview:hiddenScrollView];
      //  [self sendSubviewToBack:hiddenScrollView];

    }

    [super initializeState];
}



-(UIImage *)image:(UIImage*)image withMaskWithColor:(UIColor *)color
{
    CGImageRef maskImage = image.CGImage;
    CGFloat width = image.size.width;
    CGFloat height = image.size.height;
    CGRect bounds = CGRectMake(0,0,width,height);

    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef bitmapContext = CGBitmapContextCreate(NULL, width, height, 8, 0, colorSpace, kCGImageAlphaPremultipliedLast);
    CGContextClipToMask(bitmapContext, bounds, maskImage);
    CGContextSetFillColorWithColor(bitmapContext, color.CGColor);
    CGContextFillRect(bitmapContext, bounds);

    CGImageRef cImage = CGBitmapContextCreateImage(bitmapContext);
    UIImage *coloredImage = [UIImage imageWithCGImage:cImage];

    CGContextRelease(bitmapContext);
    CGColorSpaceRelease(colorSpace);
    CGImageRelease(cImage);

    return coloredImage;
}


- (BMDragCellCollectionView *)launcher
{
  if (launcher == nil) {
      _initDone = NO;
      self.leftInset = 0;
      self.rightInset = 0;

      cellWidth = [TiUtils floatValue:[self.proxy valueForKey:@"columnWidth"] def:0];
      showDeleteButton = [TiUtils boolValue:[self.proxy valueForKey:@"showDeleteButton"] def:NO];
      itemsBadgeEnabled = [TiUtils boolValue:[self.proxy valueForKey:@"itemsBadgeEnabled"] def:NO];

      
      horizontalSpacing = [TiUtils floatValue:[self.proxy valueForKey:@"minHorizontalSpacing"] def:kGridDefaultHorizonatalSpacing];
      verticalSpacing = [TiUtils floatValue:[self.proxy valueForKey:@"minVerticalSpacing"] def:kGridDefaultVerticalSpacing];
      
      
      if (showDeleteButton == YES && horizontalSpacing <= 16 || itemsBadgeEnabled == YES && horizontalSpacing <= 16){
          horizontalSpacing = 16;
          [[self proxy] replaceValue:[NSNumber numberWithFloat:horizontalSpacing] forKey:@"minHorizontalSpacing" notification:NO];
      }

      if (showDeleteButton == YES && verticalSpacing <= 16 || itemsBadgeEnabled == YES && verticalSpacing <= 16){
          verticalSpacing = 16;
          [[self proxy] replaceValue:[NSNumber numberWithFloat:verticalSpacing] forKey:@"minVerticalSpacing" notification:NO];
      }

     columnCount = [TiUtils floatValue:[self.proxy valueForKey:@"columnCount"] def:kGridDashboardViewDefaultColumnCount];
      
      if ([self.proxy valueForKey:@"scrollType"]){
          if ([[TiUtils stringValue:[self.proxy valueForKey:@"scrollType"]] isEqualToString:@"vertical"]){
              self.collectionViewScrollDirection = UICollectionViewScrollDirectionVertical;
              scrollDirection = mkScrollVertical;
          }
          else {
              self.collectionViewScrollDirection = UICollectionViewScrollDirectionHorizontal;
              scrollDirection = mkScrollHorizontal;
          }
      }
      else {
          self.collectionViewScrollDirection = UICollectionViewScrollDirectionVertical;
          scrollDirection = mkScrollVertical;
      }

      self.wobble = [TiUtils boolValue:[self.proxy valueForKey:@"wobble"] def:NO];
      
      self.waterFallLayout = [TiUtils boolValue:[self.proxy valueForKey:@"waterFallLayout"] def:NO];
      
      if (self.waterFallLayout == YES){
          XHWaterfallFlowLayout *layout = [[XHWaterfallFlowLayout alloc] init];
          waterfallLayout = layout;
          
          layout.minimumLineSpacing = verticalSpacing;
          layout.minimumInteritemSpacing = horizontalSpacing;
          layout.estimatedItemSize = UICollectionViewFlowLayoutAutomaticSize;
          
          layout.direction = scrollDirection;
          layout.columnCount = columnCount;
          layout.showDeleteButton = showDeleteButton;
          launcher = [[BMDragCellCollectionView alloc] initWithFrame:self.bounds collectionViewLayout:layout];
          layout.dragCollectionView = launcher;
          layout.sDelegate = self;

          
          if (showDeleteButton == YES || itemsBadgeEnabled == YES) {
              UIEdgeInsets sectionInset = UIEdgeInsetsMake((verticalSpacing/2), (horizontalSpacing/2), 0, (horizontalSpacing/2));
              [launcher setContentInset:sectionInset];
              UIEdgeInsets scrollInset = UIEdgeInsetsMake(0, 0, 0, -(horizontalSpacing/2));
              [launcher setScrollIndicatorInsets:scrollInset];

          }
          else {
              UIEdgeInsets sectionInset = UIEdgeInsetsMake(0, (horizontalSpacing/2), 0, (horizontalSpacing/2));
              [launcher setContentInset:sectionInset];
              UIEdgeInsets scrollInset = UIEdgeInsetsMake(0, 0, 0, -(horizontalSpacing/2));
              [launcher setScrollIndicatorInsets:scrollInset];

          }
          [launcher setCollectionViewLayout:layout animated:NO];

      }
      else {
          //UICollectionViewFlowLayout *layout = [[UICollectionViewFlowLayout alloc] init];
          
           TopAlignedCollectionViewFlowLayout *layout = [[TopAlignedCollectionViewFlowLayout alloc] init];
          layout.scrollDirection = self.collectionViewScrollDirection;
          layout.scrolldirection = scrollDirection;
          layout.minimumLineSpacing = verticalSpacing;
          layout.minimumInteritemSpacing = horizontalSpacing;
          
          launcher = [[BMDragCellCollectionView alloc] initWithFrame:self.bounds collectionViewLayout:layout];
          
          if (showDeleteButton == YES || itemsBadgeEnabled == YES) {
              UIEdgeInsets sectionInset;
              
              if (pagerEnabled == YES){
                  sectionInset = UIEdgeInsetsMake((verticalSpacing/2), (horizontalSpacing/2), 30, (horizontalSpacing/2));
              }
              else {
                  sectionInset = UIEdgeInsetsMake((verticalSpacing/2), (horizontalSpacing/2), 0, (horizontalSpacing/2));
              }
              [launcher setContentInset:sectionInset];

              UIEdgeInsets scrollInset = UIEdgeInsetsMake(0, 0, 0, -(horizontalSpacing/2));
              [launcher setScrollIndicatorInsets:scrollInset];
          }
          else {
              UIEdgeInsets sectionInset;
              
              if (pagerEnabled == YES){
                  sectionInset = UIEdgeInsetsMake(0, (horizontalSpacing/2), 30, (horizontalSpacing/2));
              }
              else {
                  sectionInset = UIEdgeInsetsMake(0, (horizontalSpacing/2), 0, (horizontalSpacing/2));
              }
              [launcher setContentInset:sectionInset];

              UIEdgeInsets scrollInset = UIEdgeInsetsMake(0, 0, 0, -(horizontalSpacing/2));
              [launcher setScrollIndicatorInsets:scrollInset];
          }
          [launcher setCollectionViewLayout:layout animated:NO];

      }
      
      launcher.delegate = self;
      launcher.dataSource = self;
      [launcher setWobbleEnabled:self.wobble];
      launcher.wobbleEnabled = self.wobble;
      
      
      [launcher registerClass:[BMDragCollectionViewCell class] forCellWithReuseIdentifier:reuseIdentifier];
      
      launcher.showDeleteButton = showDeleteButton;
      launcher.backgroundColor = [UIColor clearColor];
      [launcher longGesture].enabled = YES;
      
      hiddenScrollView = [[UIScrollView alloc] init];
      hiddenScrollView.hidden = YES;
//      launcher.canCancelContentTouches  = YES;

      launcher.delaysContentTouches = YES;
      hiddenScrollView.delaysContentTouches = YES;
      
      CGSize newContentSize = launcher.contentSize;
    //  hiddenScrollView.delegate = self;
      
      if (scrollDirection == mkScrollVertical) {

          newContentSize.width = 0;
          hiddenScrollView.contentSize = newContentSize;

          launcher.alwaysBounceVertical = YES;
          launcher.alwaysBounceHorizontal = NO;
          hiddenScrollView.alwaysBounceVertical = YES;
          hiddenScrollView.alwaysBounceHorizontal = NO;
      } else {
          newContentSize.height = 0;
          hiddenScrollView.contentSize = newContentSize;
          launcher.alwaysBounceHorizontal = YES;
          launcher.alwaysBounceVertical = NO;
          hiddenScrollView.alwaysBounceHorizontal = YES;
          hiddenScrollView.alwaysBounceVertical = NO;
      }
    //  [hiddenScrollView addGestureRecognizer:directionPanGesture];
    //  hiddenScrollView.panGestureRecognizer.enabled = NO;
      //launcher.panGestureRecognizer.enabled = NO;
    //  [launcher addGestureRecognizer:[hiddenScrollView panGestureRecognizer]];
     // launcher.panGestureRecognizer.enabled = NO;


  }
  return launcher;
}

- (id)accessibilityElement
{
  return [self launcher];
}


- (void)frameSizeChanged:(CGRect)frame bounds:(CGRect)bounds
{
    if (!CGRectIsEmpty(bounds)) {
       // NSLog(@"[ERROR] frameSizeChanged  ");

        CGRect contentFrame = bounds;
        
        contentFrame.size.width = bounds.size.width - 2;
        contentFrame.origin.x = contentFrame.origin.x + 1;
        
        if (pagerEnabled == YES){
            [TiUtils setView:launcher positionRect:contentFrame];
            pager.frame = CGRectMake(0, contentFrame.size.height-25, contentFrame.size.width, 25);
            pager.backgroundColor = [UIColor clearColor];
        }
        else {
            [TiUtils setView:launcher positionRect:contentFrame];
        }
        cellWidth = [self calcMaxCellWidth];

    }
    [super frameSizeChanged:frame bounds:bounds];
}

- (void)setDisableBounce_:(id)value
{
  [launcher setBounces:![TiUtils boolValue:value]];
  //[hiddenScrollView setBounces:![TiUtils boolValue:value]];
}


    
- (void)setData_:(id)args
{

    if (_initDone == YES){
    

        
        [self.dataSource[0] removeAllObjects];

        [launcher reloadData];
        launcher.alpha = 0.0;
       // [cellData removeAllObjects];

        NSMutableArray *tempCellData = [NSMutableArray array];

        if ([args count] != 0) {
           // launcher.alpha = 0.0;



         //   TiThreadPerformOnMainThread(^{
           // NSLog(@"[ERROR] new Data set  ");

                int positionIndex = 0;

                for (DeMarcbenderSortablegridItemViewProxy *proxy in args) {

                    [proxy replaceValue:[NSNumber numberWithInt:positionIndex] forKey:@"position" notification:NO];
                    [self.proxy rememberProxy:proxy];
                    [proxy windowWillOpen];
                    [proxy windowDidOpen];
                    [tempCellData addObject:proxy];
                    
                    positionIndex ++;

                }
           // },YES);
            [self.dataSourceArray removeAllObjects];
            [self.dataSource removeAllObjects];
            cellData = [tempCellData mutableCopy];
            [[self proxy] replaceValue:cellData forKey:@"data" notification:NO];

            [self pushWithGroup:1 sizeObj:nil itemsCount:(int)cellData.count];
        }
        else {
            //NSLog(@"[ERROR] empty Data set  ");

        }

    }
    else {
        launcher.alpha = 0.0;
                    int positionIndex = 0;
                    for (DeMarcbenderSortablegridItemViewProxy *proxy in args) {
                        TiThreadPerformOnMainThread(^{

                        [proxy replaceValue:[NSNumber numberWithInt:positionIndex] forKey:@"position" notification:NO];

                        
                            [proxy windowWillOpen];
                            [proxy windowDidOpen];
                        },
                            YES);
                        
                        [cellData addObject:proxy];

                        positionIndex ++;
                    }
       // [self pushWithGroup:1 sizeObj:nil itemsCount:(int)cellData.count];

    }
    
}
    
- (void)setItemsBadgeEnabled_:(id)args
{
  ENSURE_TYPE(args, NSNumber);
  itemsBadgeEnabled = [args boolValue];
  [[self proxy] replaceValue:args forKey:@"itemsBadgeEnabled" notification:NO];
}

- (void)setShowDeleteButton_:(id)args
{
  ENSURE_TYPE(args, NSNumber);
  showDeleteButton = [args boolValue];
  [[self proxy] replaceValue:args forKey:@"showDeleteButton" notification:NO];
}


- (void)setPagingEnabled_:(id)args
{
  ENSURE_TYPE(args, NSNumber);

  if (launcher != nil) {
  //  [launcher setPagingEnabled:[args boolValue]];
    pagingEnabled = [args boolValue];
      
    //[launcher scrollView].pagingEnabled = YES;
  }
  [[self proxy] replaceValue:args forKey:@"pagingEnabled" notification:NO];
}



- (void)setPagerEnabled_:(id)args
{
  ENSURE_TYPE(args, NSNumber);

  if (launcher != nil) {
    //[launcher setPagerEnabled:[args boolValue]];
   // [launcher pager].hidden = [args boolValue];
  }
  [[self proxy] replaceValue:args forKey:@"pagerEnabled" notification:NO];
}


- (void)setShowHorizontalScrollIndicator_:(id)args
{
  ENSURE_TYPE(args, NSNumber);
    showHorizontalScrollIndicator = [args boolValue];

  if (launcher != nil) {
    [launcher setShowsHorizontalScrollIndicator:showHorizontalScrollIndicator];
    launcher.showsHorizontalScrollIndicator = showHorizontalScrollIndicator;
  }
  [[self proxy] replaceValue:args forKey:@"showHorizontalScrollIndicator" notification:NO];
}


- (id)dataStore
{
    
    NSMutableDictionary *store = [NSMutableDictionary dictionary];
    [store setObject:self.dataSource[0] forKey:@"data"];
    
    return store;
}


- (void)setShowVerticalScrollIndicator_:(id)args
{
  ENSURE_TYPE(args, NSNumber);
    showVerticalScrollIndicator = [args boolValue];
  if (launcher != nil) {
    [launcher setShowsVerticalScrollIndicator:showVerticalScrollIndicator];
    launcher.showsVerticalScrollIndicator = showVerticalScrollIndicator;
  }
  [[self proxy] replaceValue:args forKey:@"showVerticalScrollIndicator" notification:NO];
}


- (void)setEditable_:(id)args
{
  ENSURE_TYPE(args, NSNumber);

  if (launcher != nil) {
    //[launcher setEditable:[args boolValue]];
  }
  [[self proxy] replaceValue:args forKey:@"editable" notification:NO];
}


- (UIPageControl *)pager
{
    
    if ([TiUtils boolValue:[self.proxy valueForKey:@"pagerEnabled"] def:NO] == YES){
        pagerEnabled = YES;
        pager = [[UIPageControl alloc] init];
        //pager.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleBottomMargin;
        [pager addTarget:self action:@selector(pageChanged) forControlEvents:UIControlEventValueChanged];
        
        if ([self.proxy valueForKey:@"pageIndicatorTintColor"]){
            pager.pageIndicatorTintColor = [[TiUtils colorValue:[self.proxy valueForKey:@"pageIndicatorTintColor"]] _color];
        }
        if ([self.proxy valueForKey:@"currentPageIndicatorTintColor"]){
            pager.currentPageIndicatorTintColor = [[TiUtils colorValue:[self.proxy valueForKey:@"currentPageIndicatorTintColor"]] _color];
        }
        
       // [pager addObserver:self forKeyPath:@"currentPage" options:NSKeyValueObservingOptionOld context:NULL];
    }
    
    if (pager != nil){
        return pager;
    }
    else {
        return nil;
    }
}

- (void)initData
{
    [self pushWithGroup:1 sizeObj:nil itemsCount:(int)cellData.count];
}


- (CGFloat)cellWidth
{
    return cellWidth;
}



- (void)startEditing
{
    
    //NSLog(@"[WARN] in startEditing");
   
        if (editing == NO){
            editing = YES;
            [launcher setEditMode:YES];
            launcher.editMode = YES;
            [launcher longGesture].enabled = YES;
            
           // [UIView performWithoutAnimation: ^ {
                for (int index = 0; index < [self.dataSource[0] count] ; index++) {
                    
                    NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
                    if (showDeleteButton == YES){
                        [(UIButton*)self.dataSource[0][thisIndexPath.item][@"closebutton"] setHidden:NO];
                    }
                    
                    
                    if (itemsBadgeEnabled == YES){
                        [(UIButton*)self.dataSource[0][thisIndexPath.item][@"badge"] setHidden:NO];
                    }
                    
                    [(UIView*)self.dataSource[0][thisIndexPath.item][@"cellview"] subviews].firstObject.userInteractionEnabled = NO;

                  //  if (self.wobble == YES){
                  //      [self.dataSource[0][thisIndexPath.item][@"cell"] performSelector:@selector(wobble)];
                  //  }
                }
            
            
            
           // }];
            if (self.wobble == YES){
                [launcher.visibleCells  makeObjectsPerformSelector:@selector(wobble)];
            }
            if ([self.proxy _hasListeners:@"editingStart"]) {
                [[self proxy] fireEvent:@"editingStart" withObject:nil];
            }

        }
}

- (void)stopEditing
{
    [UIView performWithoutAnimation: ^ {
        
        NSMutableArray *tempCellData = [NSMutableArray array];

        
        for (int index = 0; index < [self.dataSource[0] count] ; index++) {
            NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
            if (showDeleteButton == YES){
                [(UIButton*)self.dataSource[0][thisIndexPath.item][@"closebutton"] setHidden:YES];
            }
            
            if (itemsBadgeEnabled == YES){
                [(UIButton*)self.dataSource[0][thisIndexPath.item][@"badge"] setHidden:YES];
            }

            [(UIView*)self.dataSource[0][thisIndexPath.item][@"cellview"] subviews].firstObject.userInteractionEnabled = YES;

            
            DeMarcbenderSortablegridItemViewProxy *thisProxy = (DeMarcbenderSortablegridItemViewProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];
            [thisProxy replaceValue:[NSNumber numberWithInt:index] forKey:@"position" notification:NO];
            [self.proxy rememberProxy:thisProxy];

            [tempCellData addObject:thisProxy];

        }
        cellData = [tempCellData mutableCopy];
        [[self proxy] replaceValue:tempCellData forKey:@"data" notification:NO];
        editing = NO;
        [launcher setEditMode:NO];
        launcher.editMode = NO;
        [launcher longGesture].enabled = NO;

        if (self.wobble == YES){
            [launcher.visibleCells  makeObjectsPerformSelector:@selector(stopWobbleUser)];
        }

    }];
    if ([self.proxy _hasListeners:@"editingEnd"]) {
        [[self proxy] fireEvent:@"editingEnd" withObject:nil];
    }
}



- (UIButton *)createCloseButton
{
    UIImage *image;
    if ( [(DeMarcbenderSortablegridViewProxy *)[self proxy] deleteButtonImage] != nil) {
        image = [(DeMarcbenderSortablegridViewProxy *)[self proxy] deleteButtonImage];
    }
    else {
        image = [UIImage imageNamed:@"closeButton.png"];
    }
    UIButton *cbutton = [UIButton buttonWithType:UIButtonTypeCustom];
    [cbutton setImage:image forState:UIControlStateNormal];
    [cbutton.layer setCornerRadius:15];
    cbutton.frame = CGRectMake(0, 0, 34, 34);
    [cbutton setHidden:YES];
    return [cbutton retain];
}




-(CGFloat)calcMaxCellWidth {
    CGFloat maxCellWidth = 0;
    CGFloat spacingToUser = 0;
    //NSLog(@"[ERROR] columnCount: %i ",(int)columnCount);

    maxCellWidth = floorf( ((launcher.frame.size.width - launcher.contentInset.left - launcher.contentInset.right) - (horizontalSpacing * (columnCount - 1)) ) / columnCount);
    
    if (insetsCalcDone == NO){
        CGFloat totalCellWidth = 0;
        
        if (cellWidth <= 0){
            totalCellWidth = maxCellWidth * columnCount;
            //NSLog(@"[ERROR] totalCellWidth: %f ",totalCellWidth);

        }
        else if (cellWidth > maxCellWidth){
            totalCellWidth = maxCellWidth * columnCount;

            //NSLog(@"[ERROR] totalCellWidth2: %f ",totalCellWidth);

        }
        else {
            
            if (cellWidth < maxCellWidth){
                
                totalCellWidth = cellWidth * columnCount;
            }
            else {
                totalCellWidth = maxCellWidth * columnCount;
            }
            
           // NSLog(@"[ERROR] totalCellWidth3: %f ",totalCellWidth);

            
        }
        

        CGFloat totalSpacingWidth = (horizontalSpacing * (columnCount - 1));

        if ((totalCellWidth + totalSpacingWidth) < (launcher.frame.size.width)){
            
         //   NSLog(@"[ERROR] smaller calc newInset: ");

            
            CGFloat newInset = ceil(((launcher.frame.size.width) - (totalCellWidth + totalSpacingWidth)) / 2);
            
            if (newInset > 0){
                self.leftInset = newInset;
                self.rightInset = self.leftInset;
                UIEdgeInsets sectionInset = UIEdgeInsetsMake(launcher.contentInset.top, self.leftInset, launcher.contentInset.bottom, self.rightInset);
                [launcher setContentInset:sectionInset];

            }
        }
            
        
        insetsCalcDone = YES;

        //NSLog(@"[ERROR] insetsCalcDone NO %f  %f  %f : ",ceil(maxCellWidth),(launcher.frame.size.width - launcher.contentInset.left - launcher.contentInset.right),(totalCellWidth + totalSpacingWidth));
        
        return ([self calcMaxCellWidth]);
    }
    else {
       // NSLog(@"[ERROR] insetsCalcDone YES %f: ",ceil(maxCellWidth));

        return ceil(maxCellWidth);
    }
}


- (UIImage *)badgeButtonImage
{
    if (badgeImage != nil){
        return badgeImage;
    }
    else {
        return nil;
    }
    
}


-(void)addItem:(DeMarcbenderSortablegridItemViewProxy*)item atIndex:(int)index
{
    NSMutableArray *dataSource = [NSMutableArray array];

    if ([self.dataSource count] == 0){
        NSIndexPath *indexPath = [NSIndexPath indexPathForItem:0 inSection:0];
        [dataSource addObject:[self createItem:item atIndex:0]];
    
        [self.dataSourceArray addObject:dataSource];
        self.dataSource = [self.dataSourceArray mutableCopy];
        [launcher _updateSourceData];
        [launcher insertItemsAtIndexPaths:@[indexPath]];
    }
    else {
      //  [launcher performBatchUpdates:^{
        NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index inSection:0];
        NSMutableArray *array = [self.dataSource mutableCopy];
        [array[0] insertObject:[self createItem:item atIndex:index] atIndex:indexPath.item];
        
        if (showDeleteButton == YES && editing == YES){
            [(UIButton*)array[0][indexPath.item][@"closebutton"] setHidden:NO];
        }
        
        if (itemsBadgeEnabled == YES){
            [(UIButton*)array[0][indexPath.item][@"badge"] setHidden:NO];
        }

        
        self.dataSource = [array mutableCopy];

        [launcher insertItemsAtIndexPaths:@[indexPath]];


        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            NSMutableArray *tempCellData = [NSMutableArray array];


             for (int index = 0; index < [self.dataSource[0] count] ; index++) {
                 NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
                 DeMarcbenderSortablegridItemViewProxy *thisProxy = (DeMarcbenderSortablegridItemViewProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];
                 [thisProxy replaceValue:[NSNumber numberWithInt:index] forKey:@"position" notification:NO];
                 [self.proxy rememberProxy:thisProxy];

                 [tempCellData addObject:thisProxy];
             }
            cellData = [tempCellData mutableCopy];

             [[self proxy] replaceValue:tempCellData forKey:@"data" notification:NO];
            
            if ([self.proxy _hasListeners:@"itemAdded"]) {
                [[self proxy] fireEvent:@"itemAdded" withObject:@{
                    @"itemId": [NSNumber numberWithInt:(int)indexPath.item]
                }];
            }
        });
        
        
        
        
        
       // }completion:^(BOOL finished) {
/*
            [UIView performWithoutAnimation: ^ {
                if (editing == YES && _wobble == YES){
                    [launcher.visibleCells makeObjectsPerformSelector:@selector(stopWobble)];
                }
                [launcher reloadItemsAtIndexPaths:[launcher indexPathsForVisibleItems]];

            }];
*/
     //   }];
    }
}



-(NSObject *)createItem:(DeMarcbenderSortablegridItemViewProxy*)item atIndex:(int)index
{
    DeMarcbenderSortablegridItemViewProxy *cellItemProxy = item;
    [cellItemProxy windowWillOpen];
    [cellItemProxy replaceValue:[NSNumber numberWithInt:index] forKey:@"position" notification:NO];
    [self.proxy rememberProxy:cellItemProxy];

    UIView *cellView = [cellItemProxy view];
    UIButton *closeButton = nil;
    closeButton = [self createCloseButton];
    
    [cellItemProxy layoutChildrenIfNeeded];
    [cellItemProxy windowDidOpen];

    
    
    BOOL hasBadge = [TiUtils boolValue:[cellItemProxy valueForKey:@"badge"] def:NO];
    CGFloat badgeValue = [TiUtils floatValue:[cellItemProxy valueForKey:@"badgeValue"] def:0];
    
    if (badgeImage == nil){
        if ( [(DeMarcbenderSortablegridViewProxy *)[self proxy] badgeViewImage] != nil) {
            badgeImage = [(DeMarcbenderSortablegridViewProxy *)[self proxy] badgeViewImage];
        }
        else {
            badgeImage = [UIImage imageNamed:@"closeButton.png"];
        }
    }
    UIButton *badge = [UIButton buttonWithType:UIButtonTypeCustom];

    if (stretchImage == nil){
        stretchImage = [badgeImage stretchableImageWithLeftCapWidth:badgeImage.size.width/2 topCapHeight:badgeImage.size.height/2];
    }
    
    if ([cellItemProxy valueForKey:@"badgeImage"] && [cellItemProxy valueForKey:@"badgeTintColor"]) {
        UIImage *tintetedImage =  [self image:[TiUtils image:[cellItemProxy valueForKey:@"badgeImage"] proxy:cellItemProxy] withMaskWithColor:[[TiUtils colorValue:[cellItemProxy valueForKey:@"badgeTintColor"]] _color]];
        
        UIImage *tintetedStretchImage = [tintetedImage stretchableImageWithLeftCapWidth:tintetedImage.size.width/2 topCapHeight:tintetedImage.size.height/2];
                        
        [badge setBackgroundImage:tintetedStretchImage forState:UIControlStateNormal];
    }
    else {
        [badge setBackgroundImage:stretchImage forState:UIControlStateNormal];
    }
    badge.frame = CGRectMake(0, 0, 28, 28);
    badge.titleLabel.font = [UIFont boldSystemFontOfSize:12];
    badge.userInteractionEnabled = NO;
    badge.clipsToBounds = NO;

    NSInteger value = badgeValue;
    NSString *title = [NSString stringWithFormat:@"%ld", (long)value];
    if (value > 99) {
      title = @"99+";
    }
    if (value >= 0 && value < 100) {
      badge.frame = CGRectMake(0, 0, 28, 28);
    } else {
      badge.frame = CGRectMake(0, 0, 38, 28);
    }
    [badge setTitle:NSLocalizedString(title, title) forState:UIControlStateNormal];
   
    if (value <= 0){
        badge.hidden = YES;
    }

    UIView *cellViewContainer = [[UIView alloc] init];

    CGSize cellSize = CGSizeMake(cellWidth, cellView.bounds.size.height);
    CGRect cellFrame = cellView.bounds;
    cellFrame.size.width = cellSize.width;
    cellFrame.size.height = cellSize.height;
    CGRect newCellViewContainerFrame = cellFrame;
    cellViewContainer.frame = newCellViewContainerFrame;

    
    [cellViewContainer addSubview:cellView];

    cellView.frame = cellFrame;
    cellViewContainer.layer.cornerRadius = cellView.layer.cornerRadius;

    closeButton.hidden = YES;
    closeButton.frame = CGRectMake(cellViewContainer.bounds.origin.x-(closeButton.frame.size.width/4), cellViewContainer.bounds.origin.y-(closeButton.frame.size.height/3), closeButton.frame.size.width, closeButton.frame.size.height);
    [closeButton addTarget:self action:@selector(closeButtonTouchedUpInside:) forControlEvents:UIControlEventTouchUpInside];

    [cellViewContainer addSubview:closeButton];
    
   
    if (value > 99) {
        badge.frame = CGRectMake(cellViewContainer.bounds.origin.x+cellViewContainer.bounds.size.width-(badge.bounds.size.width/1.3)-3, cellViewContainer.bounds.origin.y-(badge.bounds.size.height/4), badge.bounds.size.width, badge.bounds.size.height);
    }
    else {
        badge.frame = CGRectMake(cellViewContainer.bounds.origin.x+cellViewContainer.bounds.size.width-(badge.bounds.size.width/1.3), cellViewContainer.bounds.origin.y-(badge.bounds.size.height/4), badge.bounds.size.width, badge.bounds.size.height);
    }
    
    [cellViewContainer addSubview:badge];
    badge.clipsToBounds = NO;
    if (itemsBadgeEnabled == NO){
        badge.hidden = YES;
    }
    
    
    [cellItemProxy _addBadgeButton:badge];
   

    return @{@"color" : [UIColor clearColor],
             @"id" : [NSNumber numberWithInt:index],
             @"showdeletebutton" : [NSNumber numberWithInt:showDeleteButton],
             @"closebutton" : closeButton,
             @"badge" : badge,
             @"cellview" : cellViewContainer,
            // @"cell" : cell,
             @"cellItemProxy" : cellItemProxy,
             @"size" :[NSValue valueWithCGSize:CGSizeMake(cellViewContainer.bounds.size.width, cellViewContainer.bounds.size.height)]};
}








-(void)pushWithGroup:(int)group sizeObj:(NSValue *)sizeObj itemsCount:(int)count {
    int arc = group;
    while (arc--) {
        NSMutableArray *dataSource = [NSMutableArray array];
        
        for (int i = 1; i <= count; i++) {

            [dataSource addObject:[self createItem:[cellData objectAtIndex:i-1] atIndex:i-1]];
        }
        [self.dataSourceArray addObject:dataSource];
    }
    [self pushVCWithArray:self.dataSourceArray];

}

- (void)pushVCWithArray:(NSArray *)array {
 
    
    if (_initDone == NO){
        _initDone = YES;
    }

    self.dataSource = [array mutableCopy];

    if (self.waterFallLayout == YES){
        [waterfallLayout doPrepareLayout];
    }

    [launcher reloadData];
    [UIView animateWithDuration:0.25
             delay: 0.0
             options: UIViewAnimationOptionCurveEaseInOut
             animations:^{
                launcher.alpha = 1.0;
            } completion:^(BOOL finished) {
    }];


   // NSLog(@"[ERROR] pushVCWithArray  ");
  //  [TiUtils setView:launcher positionRect:self.bounds];
    
    
  //  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
  //      [self pagerInit:launcher];
  //  });
    
}


- (void)itemsReordered {

}


- (void)didChangePage:(NSNumber *)pageNo;
{
    int correctedPageNumber = [pageNo intValue];
    correctedPageNumber = correctedPageNumber + 1;
    realCurrentPage = correctedPageNumber;

    if ([self.proxy _hasListeners:@"pageChanged"]) {
    NSMutableDictionary *event = [NSMutableDictionary dictionary];
    [event setObject:[NSNumber numberWithInt:correctedPageNumber] forKey:@"pageNo"];
    [self.proxy fireEvent:@"pageChanged" withObject:event propagate:NO];
  }
}

- (void)didChangeNumberOfPages:(int)numOfPages;
{
  if ([self.proxy _hasListeners:@"pageCountChanged"]) {
    numberOfPages = numOfPages;
    NSMutableDictionary *event = [NSMutableDictionary dictionary];
    [event setObject:[NSNumber numberWithInt:numOfPages] forKey:@"pageCount"];
    [self.proxy fireEvent:@"pageCountChanged" withObject:event propagate:NO];
  }
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self updatePagerWithContentOffset:launcher.contentOffset];
    });
}



-(void)closeButtonTouchedUpInside:(id)sender{
    UIView *senderButton = (UIButton*) sender;

    NSIndexPath *indexPath = [launcher indexPathForCell: (UICollectionViewCell *)[[[senderButton superview] superview] superview]];
   // [self.dataSource[0] removeObjectAtIndex:indexPath.item];
    inDeletingItem = YES;
    deletedItemId = (int)senderButton.tag;

//    [launcher deleteItemAtIndexPath:(NSIndexPath *)indexPath];

    [self deleteItemAtIndex:(int)indexPath.item];
    
//    [cellData removeObjectAtIndex:senderButton.tag];

//    [[self proxy] replaceValue:cellData forKey:@"data" notification:NO];
   
    
}

- (void)setScrollIndicatorInsets_:(id)value withObject:(id)props
{
  UIEdgeInsets insets = [TiUtils contentInsets:value];
  BOOL animated = [TiUtils boolValue:@"animated" properties:props def:NO];
  void (^setInset)(void) = ^{
    [launcher setScrollIndicatorInsets:insets];
  };
  if (animated) {
    double duration = [TiUtils doubleValue:@"duration" properties:props def:300] / 1000;
    [UIView animateWithDuration:duration animations:setInset];
  } else {
    setInset();
  }
}



- (void)setContentInsets_:(id)value withObject:(id)props
{
  UIEdgeInsets insets = [TiUtils contentInsets:value];
  BOOL animated = [TiUtils boolValue:@"animated" properties:props def:NO];
  void (^setInset)(void) = ^{
    [launcher setContentInset:insets];
  };
  if (animated) {
    double duration = [TiUtils doubleValue:@"duration" properties:props def:300] / 1000;
    [UIView animateWithDuration:duration animations:setInset];
  } else {
    setInset();
  }
}



-(void)isertItemAtIndex:(int)index item:(DeMarcbenderSortablegridItemViewProxy *)object
{
    NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index inSection:0];
    
    [launcher insertItemAtIndexPath:(NSIndexPath *)indexPath];

}


-(void)deleteItemAtIndex:(int)index
{
    
    
   // [launcher performBatchUpdates:^{
        
    
    NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index inSection:0];
    NSMutableArray *array = [self.dataSource mutableCopy];
    [array[0] removeObjectAtIndex:indexPath.item];
    self.dataSource = [array mutableCopy];
    [launcher deleteItemsAtIndexPaths:@[indexPath]];
    
    
    
   // if (inDeletingItem == YES) {
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        NSMutableArray *tempCellData = [NSMutableArray array];


         for (int index = 0; index < [self.dataSource[0] count] ; index++) {
             NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
             DeMarcbenderSortablegridItemViewProxy *thisProxy = (DeMarcbenderSortablegridItemViewProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];
             [thisProxy replaceValue:[NSNumber numberWithInt:index] forKey:@"position" notification:NO];
             [self.proxy rememberProxy:thisProxy];

             [tempCellData addObject:thisProxy];
         }
        cellData = [tempCellData mutableCopy];

         [[self proxy] replaceValue:tempCellData forKey:@"data" notification:NO];
        
        if ([self.proxy _hasListeners:@"itemDeleted"]) {
            [[self proxy] fireEvent:@"itemDeleted" withObject:@{
                @"itemId": [NSNumber numberWithInt:(int)indexPath.item]
            }];
        }
    });
    

    //    inDeletingItem = NO;
    //    deletedItemId = -1;
   // }
    
    
 //   } completion:^(BOOL finished) {
    
        /*
    [UIView performWithoutAnimation: ^ {
            if (editing == YES && _wobble == YES){
                [launcher.visibleCells makeObjectsPerformSelector:@selector(stopWobble)];
            }
            [launcher reloadItemsAtIndexPaths:[launcher indexPathsForVisibleItems]];
            
        }];
         */
 //   }];
  //  if (editing == YES && _wobble == YES){
  //      [launcher.visibleCells makeObjectsPerformSelector:@selector(wobble)];
  //  }

}


#pragma mark Delegates
    
- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {

    return self.dataSource.count;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section
{
    return [self.dataSource[section] count];
}


- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    BMDragCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:reuseIdentifier forIndexPath:indexPath];
    cell.translatesAutoresizingMaskIntoConstraints = NO;
    [[cell contentView] setAutoresizingMask:UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight];
    
    NSInteger id = [TiUtils intValue:_dataSource[indexPath.section][indexPath.item][@"id"]];
    cell.cellId = id;
    cell.columnCount = columnCount;
    [(UIButton *)_dataSource[indexPath.section][indexPath.item][@"closebutton"] setTag:id];
    

    if ([cell contentView].subviews.count > 0){
        NSArray *viewsToRemove = [cell contentView].subviews;
        for (UIView *v in viewsToRemove) {
            [v removeFromSuperview];
        }
    }

    [[cell contentView] addSubview:(UIView *)_dataSource[indexPath.section][indexPath.item][@"cellview"]];
    [cell contentView].subviews.firstObject.frame = cell.bounds;

    return cell;
}

- (NSArray *)dataSourceWithDragCellCollectionView:(BMDragCellCollectionView *)dragCellCollectionView
{
    return self.dataSource;
}


- (void)dragCellCollectionView:(BMDragCellCollectionView *)dragCellCollectionView newDataArrayAfterMove:(NSArray *)newDataArray {
        self.dataSource = [newDataArray mutableCopy];
    
        NSMutableArray *tempCellData = [NSMutableArray array];
        for (int index = 0; index < [self.dataSource[0] count] ; index++) {
             NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
             DeMarcbenderSortablegridItemViewProxy *thisProxy = (DeMarcbenderSortablegridItemViewProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];
             [thisProxy replaceValue:[NSNumber numberWithInt:index] forKey:@"position" notification:NO];
             [self.proxy rememberProxy:thisProxy];

             [tempCellData addObject:thisProxy];
         }
         [[self proxy] replaceValue:tempCellData forKey:@"data" notification:NO];
         cellData = [tempCellData mutableCopy];
}


-(void)dragCellCollectionViewDidEndDrag:(BMDragCellCollectionView *)dragCellCollectionView {
    //dispatch_async(dispatch_get_main_queue(), ^{

  //  TiThreadPerformOnMainThread(
  //   ^{
        // [cellData removeAllObjects];
        NSMutableArray *tempCellData = [NSMutableArray array];

    
         for (int index = 0; index < [self.dataSource[0] count] ; index++) {
             NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
             DeMarcbenderSortablegridItemViewProxy *thisProxy = (DeMarcbenderSortablegridItemViewProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];
             [thisProxy replaceValue:[NSNumber numberWithInt:index] forKey:@"position" notification:NO];
             [self.proxy rememberProxy:thisProxy];

             [tempCellData addObject:thisProxy];
         }
        cellData = [tempCellData mutableCopy];

         [[self proxy] replaceValue:tempCellData forKey:@"data" notification:NO];
         
         if ([self.proxy _hasListeners:@"itemsReordered"]) {
             [[self proxy] fireEvent:@"itemsReordered" withObject:nil];
         }

  //   },NO);
   // [launcher reloadData];

   // });
}



- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewFlowLayout *)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {

    CGSize cellSizeForItem = [self.dataSource[indexPath.section][indexPath.item][@"size"] CGSizeValue];
    
    return cellSizeForItem;
}


-(void)collectionView:(UICollectionView *)collectionView didEndDisplayingCell:(UICollectionViewCell *)cell forItemAtIndexPath:(NSIndexPath *)indexPath {
    if (editing == YES && _wobble == YES){
        TiThreadPerformOnMainThread(
         ^{
        [cell performSelector:@selector(stopWobble)];
    },NO);
    }
    else if (editing == NO && _wobble == YES){
        TiThreadPerformOnMainThread(
         ^{
        [cell performSelector:@selector(stopWobble)];
    },NO);
    }

}

-(void)collectionView:(UICollectionView *)collectionView willDisplayCell:(UICollectionViewCell *)cell forItemAtIndexPath:(NSIndexPath *)indexPath {
        
    if (editing == YES && _wobble == YES){
        TiThreadPerformOnMainThread(
         ^{
        [cell performSelector:@selector(wobble)];
         },NO);
    }
    else if (editing == NO && _wobble == YES){
        TiThreadPerformOnMainThread(
         ^{
        [cell performSelector:@selector(stopWobble)];
         },NO);
    }

}


- (UICollectionViewCell *)getCellAtIndex:(NSIndexPath *)indexPath
{
    BMDragCollectionViewCell *cell = [launcher dequeueReusableCellWithReuseIdentifier:reuseIdentifier forIndexPath:indexPath];
    return cell;
}


- (CGFloat)getHeightExceptImageAtIndex:(NSIndexPath *)indexPath
{
    CGSize cellSizeForItem = [self.dataSource[indexPath.section][indexPath.item][@"size"] CGSizeValue];
   
    return cellSizeForItem.height;
}

- (CGFloat)getImageRatioOfWidthAndHeight:(NSIndexPath *)indexPath
{
    CGFloat ratio = (CGFloat)(arc4random() % 10)/10;
    return ratio;
}

- (void)scrollViewWillEndDragging:(UIScrollView *)scrollView withVelocity:(CGPoint)velocity targetContentOffset:(inout CGPoint *)targetContentOffset
{

    if (pagingEnabled == YES){
        
        
        if (scrollDirection == mkScrollHorizontal){
            float pageWidth = scrollView.frame.size.width; // width + space

            float currentOffset = scrollView.contentOffset.x;
            float targetOffset = targetContentOffset->x;
            float newTargetOffset = 0;

            if (targetOffset > currentOffset)
                newTargetOffset = ceilf(currentOffset / pageWidth) * pageWidth;
            else
                newTargetOffset = floorf(currentOffset / pageWidth) * pageWidth;

            
            if (newTargetOffset == 0){
                newTargetOffset = -(scrollView.contentInset.left);
            }
            
            if (newTargetOffset < -(scrollView.contentInset.left))
                newTargetOffset = -(scrollView.contentInset.left);
            else if (newTargetOffset > scrollView.contentSize.width)
                newTargetOffset = scrollView.contentSize.width;
            else
                newTargetOffset = newTargetOffset - scrollView.contentInset.left;

            targetContentOffset->x = currentOffset;
            
            [scrollView setContentOffset:CGPointMake(newTargetOffset,scrollView.contentOffset.y) animated:YES];
        }
        else {
            float pageWidth = scrollView.frame.size.height; // width + space

            float currentOffset = scrollView.contentOffset.y;
            float targetOffset = targetContentOffset->y;
            float newTargetOffset = 0;

            if (targetOffset > currentOffset)
                newTargetOffset = ceilf(currentOffset / pageWidth) * pageWidth;
            else
                newTargetOffset = floorf(currentOffset / pageWidth) * pageWidth;

            
            if (newTargetOffset == 0){
                newTargetOffset = -(scrollView.contentInset.top);
            }
            
            if (newTargetOffset < -(scrollView.contentInset.top))
                newTargetOffset = -(scrollView.contentInset.top);
            else if (newTargetOffset > scrollView.contentSize.height)
                newTargetOffset = scrollView.contentSize.height;
            else
                newTargetOffset = newTargetOffset - scrollView.contentInset.top;

            targetContentOffset->y = currentOffset;
            
            [scrollView setContentOffset:CGPointMake(scrollView.contentOffset.x, newTargetOffset) animated:YES];
        }
        
        
    }
}




- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    
}



- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate
{


}


- (void) scrollViewDidScroll:(UIScrollView *)scrollView {
    [self updatePagerWithContentOffset:launcher.contentOffset];
}

- (void)pageChanged
{
    
    
    if (pagingEnabled == YES){
        
        
        if (scrollDirection == mkScrollHorizontal){
            float pageWidth = launcher.frame.size.width; // width + space

            float currentOffset = launcher.contentOffset.x;
            float targetOffset = pager.currentPage * launcher.frame.size.width;
            float newTargetOffset = 0;

            newTargetOffset = targetOffset;
            
            if (newTargetOffset == 0){
                newTargetOffset = -(launcher.contentInset.left);
            }
            
            if (newTargetOffset <= -(launcher.contentInset.left))
                newTargetOffset = -(launcher.contentInset.left);
            else if (newTargetOffset > launcher.contentSize.width)
                newTargetOffset = launcher.contentSize.width;
            else
                newTargetOffset = newTargetOffset - launcher.contentInset.left;

            
            [launcher setContentOffset:CGPointMake(newTargetOffset,launcher.contentOffset.y) animated:NO];
        }
        else {
            float pageWidth = launcher.frame.size.height; // width + space

            float currentOffset = launcher.contentOffset.y;
            float targetOffset = pager.currentPage * launcher.frame.size.height;
            
            float newTargetOffset = 0;

            newTargetOffset = targetOffset;


            if (newTargetOffset == 0){
                newTargetOffset = -(launcher.contentInset.top);
            }
            
            if (newTargetOffset <= -(launcher.contentInset.top))
                newTargetOffset = -(launcher.contentInset.top);
            else if (newTargetOffset > launcher.contentSize.height)
                newTargetOffset = launcher.contentSize.height;
            else
                newTargetOffset = newTargetOffset - launcher.contentInset.top;

            
            [launcher setContentOffset:CGPointMake(launcher.contentOffset.x, newTargetOffset) animated:NO];
        }
        
        
    }
    if ([self respondsToSelector:@selector(didChangePage:)]) {
          [self didChangePage:[NSNumber numberWithInteger:pager.currentPage]];
    }

}


-(void)pagerInit:(BMDragCellCollectionView *)dragCellCollectionView {
    
        NSInteger oldNumberOfPages;
    
    
        if (scrollDirection == mkScrollHorizontal){
 
            oldNumberOfPages = numberOfPages;
            
            numberOfPages = ceil(launcher.contentSize.width / launcher.frame.size.width);

            dragCellCollectionView.pageCount = numberOfPages;
            
            if (numberOfPages != oldNumberOfPages){
                CGSize newContentSize = launcher.contentSize;

                    if (pager != nil){
                        pager.numberOfPages = numberOfPages;
                    }
                    [self didChangeNumberOfPages:(int)numberOfPages];
                    
                    if ((currentPage+1) > numberOfPages){
                        [self didChangePage:[NSNumber numberWithInt:(int)(currentPage-1)]];
                    }
            }
            
            if (currentPage < 0){
                currentPage = 0;
                pager.currentPage = currentPage;
                previousOffset = launcher.contentOffset.y;
                oldContentOffset = launcher.contentOffset;
            }

        }
        else {
            
            CGSize newContentSize = launcher.contentSize;
            newContentSize.width = hiddenScrollView.frame.size.width;
            hiddenScrollView.contentSize = newContentSize;

            
            oldNumberOfPages = numberOfPages;

            numberOfPages = ceil(launcher.contentSize.height / launcher.frame.size.height);

            if (numberOfPages != oldNumberOfPages){

                if (pager != nil){
                    pager.numberOfPages = numberOfPages;
                }
                [self didChangeNumberOfPages:(int)numberOfPages];
                if ((currentPage+1) > numberOfPages){
                    [self didChangePage:[NSNumber numberWithInt:(int)(currentPage-1)]];
                }
            }
            if (currentPage < 0){
                currentPage = 0;
                pager.currentPage = currentPage;
                previousOffset = launcher.contentOffset.x;
                oldContentOffset = launcher.contentOffset;
            }

        }
}


-(void)setCurrentPageOfLauncher:(int)newPage {
    
    if (pager != nil){
        if (newPage <= 0){
            newPage = newPage + 1;
            currentPage = (newPage - 1);
        }
        else {
            if (newPage > numberOfPages){
                currentPage = numberOfPages;
            }
            else {
                currentPage = (newPage - 1);
            }
        }
        
        [pager setCurrentPage:(NSInteger)currentPage];
    }
}


- (id)currentPageOfLauncher {
   
    return [NSNumber numberWithInt:realCurrentPage];
}


- (id)pagesCount {
      return [NSNumber numberWithInt:(int)numberOfPages];
}




- (void)updatePagerWithContentOffset:(CGPoint)contentOffset
{
    NSInteger oldPageNo;

    if (scrollDirection == mkScrollHorizontal){
        CGFloat pageWidth = launcher.frame.size.width;
        
        if (pager != nil){
            oldPageNo = pager.currentPage;
        }
        else {
            oldPageNo = currentPage;
        }
        currentPage = floor((contentOffset.x - pageWidth / 2) / pageWidth) + 1;

        if (oldPageNo != currentPage) {
            if (pager != nil){
                pager.currentPage = currentPage;
            }
          if ([self respondsToSelector:@selector(didChangePage:)]) {
            [self didChangePage:[NSNumber numberWithInteger:currentPage]];
          }
        }
    }
    else {
        CGFloat pageWidth = launcher.frame.size.height - launcher.contentInset.top;

        if (pager != nil){
            oldPageNo = pager.currentPage;
        }
        else {
            oldPageNo = currentPage;
        }
        currentPage = floor((contentOffset.y - pageWidth / 2) / pageWidth) + 1;
        
        if (pager != nil){
            pager.currentPage = currentPage;
        }
        if (oldPageNo != currentPage) {
          if ([self respondsToSelector:@selector(didChangePage:)]) {
            [self didChangePage:[NSNumber numberWithInteger:currentPage]];
          }
        }
    }
    

    
}





/*

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer{
    return NO;
}
*/
@end


