/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import <TitaniumKit/TiRect.h>
#import <TitaniumKit/TiUtils.h>
#import <TitaniumKit/TiDimension.h>
#import "ImageLoader.h"
#import "DeMarcbenderSortablegridView.h"






@interface TopAlignedCollectionViewFlowLayout : UICollectionViewFlowLayout {
    NSInteger lastPagesCount;
    CGSize lastContentSize;

}
@property (nonatomic, assign) ScrollDirection scrolldirection;
@property (nonatomic, assign) BOOL pagingEnabled;
@property (nonatomic, strong) UIDynamicAnimator *dynamicAnimator;

//- (void)alignToTopForSameLineElements:(NSArray *)sameLineElements;

@end

@implementation TopAlignedCollectionViewFlowLayout

-(id)init {
    if (!(self = [super init])) return nil;
    
   // self.dynamicAnimator = [[UIDynamicAnimator alloc] initWithCollectionViewLayout:self];
    
    return self;
}
/*
-(NSArray *)layoutAttributesForElementsInRect:(CGRect)rect
{
    return [self.dynamicAnimator itemsInRect:rect];
}

-(UICollectionViewLayoutAttributes *)layoutAttributesForItemAtIndexPath:(NSIndexPath *)indexPath
{
    return [self.dynamicAnimator layoutAttributesForCellAtIndexPath:indexPath];
}


- (void)prepareLayout {
    [super prepareLayout];

    CGSize contentSize = self.collectionViewContentSize;
    NSArray *items = [super layoutAttributesForElementsInRect:
        CGRectMake(0.0f, 0.0f, contentSize.width, contentSize.height)];
    if (self.dynamicAnimator.behaviors.count == 0) {
        [items enumerateObjectsUsingBlock:^(id<UIDynamicItem> obj, NSUInteger idx, BOOL *stop) {
            UIAttachmentBehavior *behaviour = [[UIAttachmentBehavior alloc] initWithItem:obj
                                                                        attachedToAnchor:[obj center]];
            
            behaviour.length = 0.0f;
            behaviour.damping = 0.9f;
            behaviour.frequency = 0.9f;
            
            [self.dynamicAnimator addBehavior:behaviour];
        }];
    }
}
*/


/*
- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect {
    NSArray *attributes = [super layoutAttributesForElementsInRect:rect];

    CGFloat leftMargin = self.sectionInset.left; //initalized to silence compiler, and actaully safer, but not planning to use.
    CGFloat maxY = -1.0f;

    //this loop assumes attributes are in IndexPath order
    for (UICollectionViewLayoutAttributes *attribute in attributes) {
        if (attribute.frame.origin.y >= maxY) {
            leftMargin = self.sectionInset.left;
        }

        attribute.frame = CGRectMake(leftMargin, attribute.frame.origin.y, attribute.frame.size.width, attribute.frame.size.height);

        leftMargin += attribute.frame.size.width + self.minimumInteritemSpacing;
        maxY = MAX(CGRectGetMaxY(attribute.frame), maxY);
    }

    return attributes;
}
*/
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
        if (self.pagingEnabled == YES){
            NSInteger pagesCount = ceil(size.height / self.collectionView.frame.size.height);
            if (pagesCount != lastPagesCount){
                
                CGFloat contentHeight;
                
                contentHeight = (pagesCount * (self.collectionView.frame.size.height))-self.collectionView.contentInset.top-self.collectionView.contentInset.bottom;
                lastPagesCount = pagesCount;

                lastContentSize = CGSizeMake(self.collectionView.frame.size.width-self.collectionView.contentInset.left-self.collectionView.contentInset.right, contentHeight);
            }
        }
        else {
            lastContentSize = size;
        }
        
        return lastContentSize;
    }
    else {
        if (self.pagingEnabled == YES){
            NSInteger pagesCount = ceil(size.width / self.collectionView.frame.size.width);
            if (pagesCount != lastPagesCount){
                CGFloat contentWidth = (pagesCount * (self.collectionView.frame.size.width))-self.collectionView.contentInset.left-self.collectionView.contentInset.right;
                lastPagesCount = pagesCount;
                lastContentSize = CGSizeMake(contentWidth, self.collectionView.frame.size.height-self.collectionView.contentInset.top-self.collectionView.contentInset.bottom);
            }
        }
        else {
            lastContentSize = size;
        }
        return lastContentSize;
    }
}

/*

-(BOOL)shouldInvalidateLayoutForBoundsChange:(CGRect)newBounds
{
    UIScrollView *scrollView = self.collectionView;
    CGFloat delta = newBounds.origin.y - scrollView.bounds.origin.y;
    
    CGPoint touchLocation = [self.collectionView.panGestureRecognizer locationInView:self.collectionView];
    
    [self.dynamicAnimator.behaviors enumerateObjectsUsingBlock:^(UIAttachmentBehavior *springBehaviour, NSUInteger idx, BOOL *stop) {
        CGFloat yDistanceFromTouch = fabs(touchLocation.y - springBehaviour.anchorPoint.y);
        CGFloat xDistanceFromTouch = fabs(touchLocation.x - springBehaviour.anchorPoint.x);
        CGFloat scrollResistance = (yDistanceFromTouch + xDistanceFromTouch) / 1500.0f;
        UICollectionViewLayoutAttributes *item = [springBehaviour.items firstObject];

        CGPoint center = item.center;
        if (delta < 0) {
            center.y += MAX(delta, delta*scrollResistance);
        }
        else {
            center.y += MIN(delta, delta*scrollResistance);
        }
        item.center = center;
        
        [self.dynamicAnimator updateItemUsingCurrentState:item];
    }];
    
    return NO;
}
*/

@end




static const CGFloat kGridDashboardViewDefaultRowCount = 0;
static const CGFloat kGridDashboardViewDefaultColumnCount = 1;
static const CGFloat kGridDefaultHorizonatalSpacing = 0;
static const CGFloat kGridDefaultVerticalSpacing = 0;

static NSString *reuseIdentifier = @"forCellWithReuseIdentifier";
#define WIDTH  [[UIScreen mainScreen] bounds].size.width
#define HEIGHT [[UIScreen mainScreen] bounds].size.height


@implementation DeMarcbenderSortablegridView

- (void)dealloc
{
  launcher.delegate = nil;
  RELEASE_TO_NIL(launcher);
  [super dealloc];
}


- (id)init
{
  self = [super init];
  if (self != nil) {
      columnCount = 1;
      _columnsCount = 1;
      _initDone = NO;
      self.leftInset = 0;
      self.rightInset = 0;
      cellWidth = 0;
      contentInsetsArgs = nil;
      oldContentInsetBottomForPager = 0;
      window = UIApplication.sharedApplication.windows.firstObject;
      topSafeAreaPadding = window.safeAreaInsets.top;
      bottomSafeAreaPadding = window.safeAreaInsets.bottom;
      pagerEnabled = NO;
      observerAdded = NO;
      pagerFollowsBottomInset = NO;
      self.dataSourceArray = [NSMutableArray array];
      editing = NO;
      didScroll = NO;
      pagingEnabled = NO;
      cellData = [[NSMutableArray alloc] init];
      badgeImage = nil;
      self.columnsCount = columnCount;
      insetsCalcDone = NO;
      insetsScroll = UIEdgeInsetsZero;
      _leftInset = 0;
      _rightInset = 0;
      _initDone = NO;
      currentPage = -1;
      numberOfPages = -1;
      previousOffset = -1;
      showVerticalScrollIndicator = NO;
      showHorizontalScrollIndicator = NO;
      self.collectionViewScrollDirection = UICollectionViewScrollDirectionVertical;
      scrollDirection = mkScrollVertical;
  }
  return self;
}



/*
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

*/
- (BMDragCellCollectionView *)launcher
{
  if (launcher == nil) {
      showDeleteButton = [TiUtils boolValue:[self.proxy valueForKey:@"showDeleteButton"] def:NO];
      itemsBadgeEnabled = [TiUtils boolValue:[self.proxy valueForKey:@"itemsBadgeEnabled"] def:NO];


      
      horizontalSpacing = [TiUtils floatValue:[self.proxy valueForKey:@"minHorizontalSpacing"] def:kGridDefaultHorizonatalSpacing];
      verticalSpacing = [TiUtils floatValue:[self.proxy valueForKey:@"minVerticalSpacing"] def:kGridDefaultVerticalSpacing];
      
      
      if (showDeleteButton == YES && horizontalSpacing <= 20 || itemsBadgeEnabled == YES && horizontalSpacing <= 20){
          horizontalSpacing = 20;
          [self.proxy replaceValue:[NSNumber numberWithFloat:horizontalSpacing] forKey:@"minHorizontalSpacing" notification:NO];
      }

      if (showDeleteButton == YES && verticalSpacing <= 10 || itemsBadgeEnabled == YES && verticalSpacing <= 10){
          verticalSpacing = 10;
          [self.proxy replaceValue:[NSNumber numberWithFloat:verticalSpacing] forKey:@"minVerticalSpacing" notification:NO];
      }

      


      self.wobble = [TiUtils boolValue:[self.proxy valueForKey:@"wobble"] def:NO];
      
      self.waterFallLayout = [TiUtils boolValue:[self.proxy valueForKey:@"waterFallLayout"] def:NO];
      
      if (self.waterFallLayout == YES){
          XHWaterfallFlowLayout *layout = [[XHWaterfallFlowLayout alloc] init];
          waterfallLayout = layout;
          
          layout.minimumLineSpacing = verticalSpacing;
          layout.minimumInteritemSpacing = horizontalSpacing;
         // layout.estimatedItemSize = UICollectionViewFlowLayoutAutomaticSize;
          
          layout.direction = scrollDirection;
          layout.columnCount = [self numberOfColumns];
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
          layout.pagingEnabled = pagingEnabled;
          
       //   layout.estimatedItemSize = UICollectionViewFlowLayoutAutomaticSize;


          
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
      

      launcher.delaysContentTouches = NO;
      
      CGSize newContentSize = launcher.contentSize;
    //  hiddenScrollView.delegate = self;
      
      if (scrollDirection == mkScrollVertical) {

          newContentSize.width = 0;

          launcher.alwaysBounceVertical = YES;
          launcher.alwaysBounceHorizontal = NO;
      } else {
          newContentSize.height = 0;
          launcher.alwaysBounceHorizontal = YES;
          launcher.alwaysBounceVertical = NO;
      }
    //  [hiddenScrollView addGestureRecognizer:directionPanGesture];
    //  hiddenScrollView.panGestureRecognizer.enabled = NO;
      //launcher.panGestureRecognizer.enabled = NO;
    //  [launcher addGestureRecognizer:[hiddenScrollView panGestureRecognizer]];
     // launcher.panGestureRecognizer.enabled = NO;

      self.collectionView = (UICollectionView*)launcher;

      if ([self.proxy valueForKey:@"scrollIndicatorInsets"]){
              [self setScrollIndicatorInsets_:[self.proxy valueForKey:@"scrollIndicatorInsets"] withObject:nil];
      }

      
      if (contentInsetsArgs != nil || [self.proxy valueForKey:@"contentInsets"]){
          if ([self.proxy valueForKey:@"contentInsets"]){
              [self setContentInsets_:[self.proxy valueForKey:@"contentInsets"]];
          }
          else {
              [self setContentInsets_:contentInsetsArgs];
          }
      }
      
      [self addSubview:launcher];

  }
  return launcher;
}

- (id)accessibilityElement
{
  return [self launcher];
}


- (CGFloat)numberOfColumns
{
  return columnCount;
}

- (void)setColumnCount_:(id)value
{
    columnCount = [TiUtils floatValue:value];
}

- (void)setScrollType_:(id)value
{
    if ([[TiUtils stringValue:value] isEqualToString:@"vertical"]){
        self.collectionViewScrollDirection = UICollectionViewScrollDirectionVertical;
        scrollDirection = mkScrollVertical;
    }
    else {
        self.collectionViewScrollDirection = UICollectionViewScrollDirectionHorizontal;
        scrollDirection = mkScrollHorizontal;
    }
}



- (void)frameSizeChanged:(CGRect)frame bounds:(CGRect)bounds
{
    if (!CGRectIsEmpty(bounds)) {

        [TiUtils setView:launcher positionRect:bounds];

        if (pagerEnabled == YES) {

            [self pager];
            
            if (pagerFollowsBottomInset == YES){
                topSafeAreaPadding = window.safeAreaInsets.top;
                bottomSafeAreaPadding = window.safeAreaInsets.bottom;
                
                
                
                if (frame.origin.y < 0 && launcher.contentInset.top > 0){
                    
                    pager.frame = CGRectMake(0,bounds.origin.y + frame.size.height - bottomSafeAreaPadding - launcher.contentInset.bottom - 25, bounds.size.width, 25);
                    oldContentInsetBottomForPager = launcher.contentInset.bottom-25;
                }
                else {
                    pager.frame = CGRectMake(0, bounds.origin.y + bounds.size.height - launcher.contentInset.bottom - 25, bounds.size.width, 25);
                    oldContentInsetBottomForPager = launcher.contentInset.bottom-25;
                }
                
                if (observerAdded == NO){
                    observerAdded = YES;
                    [launcher addObserver:self forKeyPath:@"contentInset" options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld context:nil];
                }
                
            }
            else {
                
                if (frame.origin.y < 0 && launcher.contentInset.top > 0){

                    pager.frame = CGRectMake(0,bounds.origin.y + frame.size.height - bottomSafeAreaPadding - launcher.contentInset.bottom - 25, bounds.size.width, 25);
                }
                else {
                    pager.frame = CGRectMake(0, bounds.size.height-25, bounds.size.width, 25);
                }
            }

            pager.backgroundColor = [UIColor clearColor];

            [self addSubview:pager];

            [self bringSubviewToFront:pager];
        }
        
        cellWidth = [self calcMaxCellWidth];

    }
    [super frameSizeChanged:frame bounds:bounds];

}


- (void)setPagerFollowsBottomInset_:(id)value
{
    pagerFollowsBottomInset = [TiUtils boolValue:value];
  //[hiddenScrollView setBounces:![TiUtils boolValue:value]];
}


- (void)setDisableBounce_:(id)value
{
  [[self launcher] setBounces:![TiUtils boolValue:value]];
  //[hiddenScrollView setBounces:![TiUtils boolValue:value]];
}


    
- (void)setViewData_:(id)args
{
    //[self launcher];

    ENSURE_TYPE(args, NSArray);

    
    if (_initDone == YES){
    
        [self.dataSource[0] removeAllObjects];

        [launcher reloadData];
        //launcher.alpha = 0.0;
       // [cellData removeAllObjects];

        NSMutableArray *tempCellData = [NSMutableArray array];

        if ([args count] != 0) {
           // launcher.alpha = 0.0;



         //   TiThreadPerformOnMainThread(^{
           // NSLog(@"[ERROR] new Data set  ");

                int positionIndex = 0;

                for (DeMarcbenderSortablegridItemProxy *proxy in args) {
                    ENSURE_TYPE(proxy, DeMarcbenderSortablegridItemProxy)
                    [self.proxy rememberProxy:proxy];

                    [proxy replaceValue:[NSNumber numberWithInt:positionIndex] forKey:@"position" notification:NO];
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
                    if (launcher != nil){
                        [self.dataSource[0] removeAllObjects];

                        [launcher reloadData];

                        // launcher.alpha = 0.0;
                    }
                    int positionIndex = 0;
                    for (DeMarcbenderSortablegridItemProxy *proxy in args) {
                        ENSURE_TYPE(proxy, DeMarcbenderSortablegridItemProxy)
                        [self.proxy rememberProxy:proxy];

                        [proxy replaceValue:[NSNumber numberWithInt:positionIndex] forKey:@"position" notification:NO];

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
  pagingEnabled = [TiUtils boolValue:args def:NO];

}



- (void)setPagerEnabled_:(id)args
{
  ENSURE_TYPE(args, NSNumber);

    pagerEnabled = [args boolValue];
}


- (void)setShowHorizontalScrollIndicator_:(id)args
{
  ENSURE_TYPE(args, NSNumber);
    showHorizontalScrollIndicator = [args boolValue];

  if ([self launcher] != nil) {
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
  if ([self launcher] != nil) {
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

- (BOOL)isLazyLoadingEnabled
{
    return [TiUtils boolValue: [[self proxy] valueForKey:@"lazyLoadingEnabled"] def:YES];
}


- (UIPageControl *)pager
{
    
    if (pagerEnabled == YES){
        pager = [[UIPageControl alloc] init];
        //pager.autoresizingMask = UIViewAutoresizingFlexibleLeftMargin | UIViewAutoresizingFlexibleRightMargin | UIViewAutoresizingFlexibleBottomMargin;
        [pager addTarget:self action:@selector(pageChanged) forControlEvents:UIControlEventValueChanged];
        
        if ([self.proxy valueForKey:@"pageIndicatorTintColor"]){
            pager.pageIndicatorTintColor = [[TiUtils colorValue:[self.proxy valueForKey:@"pageIndicatorTintColor"]] _color];
        }
        if ([self.proxy valueForKey:@"currentPageIndicatorTintColor"]){
            pager.currentPageIndicatorTintColor = [[TiUtils colorValue:[self.proxy valueForKey:@"currentPageIndicatorTintColor"]] _color];
        }
        
       
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
    
    [self launcher];
    
    [launcher setEditMode:NO];
    launcher.editMode = NO;
    
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
                    
                    DeMarcbenderSortablegridItemProxy *thisProxy = (DeMarcbenderSortablegridItemProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];

                    BOOL canBeDeleted = [TiUtils boolValue:[thisProxy valueForUndefinedKey:@"canBeDeleted"] def:YES];
                    BOOL hasBadge = [TiUtils boolValue:[thisProxy valueForUndefinedKey:@"badge"] def:NO];
                    CGFloat badgeValue = [TiUtils floatValue:[thisProxy valueForKey:@"badgeValue"] def:0];

                    if (showDeleteButton == YES && canBeDeleted == YES){
                        [(UIButton*)self.dataSource[0][thisIndexPath.item][@"closebutton"] setHidden:NO];
                    }
                    
                    
                    if (itemsBadgeEnabled == YES){
                        if (hasBadge == YES && badgeValue > 0){
                            [(UIButton*)self.dataSource[0][thisIndexPath.item][@"badge"] setHidden:NO];
                        }
                    }
                    
                    [(UIView*)self.dataSource[0][thisIndexPath.item][@"cellview"] subviews].firstObject.userInteractionEnabled = NO;
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
   // [UIView performWithoutAnimation: ^ {
        
        NSMutableArray *tempCellData = [NSMutableArray array];

        
        for (int index = 0; index < [self.dataSource[0] count] ; index++) {
            NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
            DeMarcbenderSortablegridItemProxy *thisProxy = (DeMarcbenderSortablegridItemProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];

            BOOL canBeDeleted = [TiUtils boolValue:[thisProxy valueForUndefinedKey:@"canBeDeleted"] def:YES];
            BOOL hasBadge = [TiUtils boolValue:[thisProxy valueForUndefinedKey:@"badge"] def:NO];
            CGFloat badgeValue = [TiUtils floatValue:[thisProxy valueForKey:@"badgeValue"] def:0];

            
            if (showDeleteButton == YES && canBeDeleted == YES){
                [(UIButton*)self.dataSource[0][thisIndexPath.item][@"closebutton"] setHidden:YES];
            }
            
            if (itemsBadgeEnabled == YES){
                
                if (hasBadge == YES && badgeValue > 0){
                    [(UIButton*)self.dataSource[0][thisIndexPath.item][@"badge"] setHidden:NO];
                }
                
                //[(UIButton*)self.dataSource[0][thisIndexPath.item][@"badge"] setHidden:YES];
            }

            [(UIView*)self.dataSource[0][thisIndexPath.item][@"cellview"] subviews].firstObject.userInteractionEnabled = YES;

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

   // }];
    if ([self.proxy _hasListeners:@"editingEnd"]) {
        [[self proxy] fireEvent:@"editingEnd" withObject:nil];
    }
}



- (UIButton *)createCloseButton
{
    UIButton *cbutton = [UIButton buttonWithType:UIButtonTypeCustom];

    if ( [(DeMarcbenderSortablegridViewProxy *)[self proxy] deleteButtonImage] != nil) {
        UIImage *image = [(DeMarcbenderSortablegridViewProxy *)[self proxy] deleteButtonImage];
        [cbutton setImage:image forState:UIControlStateNormal];
    }
    else {
        cbutton.backgroundColor = [UIColor redColor];
    }
    [cbutton.layer setCornerRadius:17];
    cbutton.frame = CGRectMake(0, 0, 34, 34);
    [cbutton setHidden:YES];
    return [cbutton retain];
}




-(CGFloat)calcMaxCellWidth {
    CGFloat maxCellWidth = 0;
    CGFloat spacingToUser = 0;

    maxCellWidth = floorf( ((launcher.frame.size.width - launcher.contentInset.left - launcher.contentInset.right) - (horizontalSpacing * ([self numberOfColumns] - 1)) ) / [self numberOfColumns]);
    
    if (insetsCalcDone == NO){
        CGFloat totalCellWidth = 0;
        
        if (cellWidth <= 0){
            totalCellWidth = maxCellWidth * [self numberOfColumns];
            //NSLog(@"[ERROR] totalCellWidth: %f ",totalCellWidth);

        }
        else if (cellWidth > maxCellWidth){
            totalCellWidth = maxCellWidth * [self numberOfColumns];

            //NSLog(@"[ERROR] totalCellWidth2: %f ",totalCellWidth);

        }
        else {
            
            if (cellWidth < maxCellWidth){
                
                totalCellWidth = cellWidth * [self numberOfColumns];
            }
            else {
                totalCellWidth = maxCellWidth * [self numberOfColumns];
            }
            
           // NSLog(@"[ERROR] totalCellWidth3: %f ",totalCellWidth);

            
        }
        

        CGFloat totalSpacingWidth = (horizontalSpacing * ([self numberOfColumns] - 1));

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

/*
- (UIImage *)badgeButtonImage
{
    if (badgeImage != nil){
        return badgeImage;
    }
    else {
        return nil;
    }
    
}
*/


-(void)addItem:(DeMarcbenderSortablegridItemProxy*)item atIndex:(NSInteger)index
{

    NSMutableArray *dataSource = [NSMutableArray array];

    if ([self.dataSource count] == 0){
        
        
        NSIndexPath *indexPath = [NSIndexPath indexPathForItem:0 inSection:0];
        [dataSource addObject:[self createItem:item atIndex:index]];
        BOOL hasBadge = [TiUtils boolValue:[item valueForUndefinedKey:@"badge"] def:NO];
        BOOL canBeDeleted = [TiUtils boolValue:[item valueForUndefinedKey:@"canBeDeleted"] def:YES];

        

        [self.dataSourceArray addObject:dataSource];
        self.dataSource = [self.dataSourceArray mutableCopy];

        if (showDeleteButton == YES && editing == YES && canBeDeleted==YES){
            [(UIButton*)self.dataSource[0][indexPath.item][@"closebutton"] setHidden:NO];
        }
        
        if (itemsBadgeEnabled == YES && hasBadge==YES){
            CGFloat badgeValue = [TiUtils floatValue:[item valueForKey:@"badgeValue"] def:0];
            if (badgeValue > 0){
                [(UIButton*)self.dataSource[0][indexPath.item][@"badge"] setHidden:NO];
            }
        }

        [launcher _updateSourceData];
        [launcher insertItemsAtIndexPaths:@[indexPath]];
    }
    else {

      //  [launcher performBatchUpdates:^{
        NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index inSection:0];
        NSMutableArray *array = [self.dataSource mutableCopy];
        [array[0] insertObject:[self createItem:item atIndex:index] atIndex:indexPath.item];
        
        BOOL hasBadge = [TiUtils boolValue:[item valueForUndefinedKey:@"badge"] def:NO];
        BOOL canBeDeleted = [TiUtils boolValue:[item valueForUndefinedKey:@"canBeDeleted"] def:YES];

        
        if (showDeleteButton == YES && editing == YES && canBeDeleted==YES){
            [(UIButton*)array[0][indexPath.item][@"closebutton"] setHidden:NO];
        }
        
        if (itemsBadgeEnabled == YES && hasBadge==YES){
            CGFloat badgeValue = [TiUtils floatValue:[item valueForKey:@"badgeValue"] def:0];
            if (badgeValue > 0){
                [(UIButton*)array[0][indexPath.item][@"badge"] setHidden:NO];
            }
        }

        
        self.dataSource = [array mutableCopy];

        [launcher insertItemsAtIndexPaths:@[indexPath]];


        
        //  dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.3 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            NSMutableArray *tempCellData = [NSMutableArray array];

             for (int index = 0; index < [self.dataSource[0] count] ; index++) {
                 NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
                 DeMarcbenderSortablegridItemProxy *thisProxy = (DeMarcbenderSortablegridItemProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];
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
       // });
        
        
        
        
        
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







-(NSObject *)createItem:(DeMarcbenderSortablegridItemProxy*)item atIndex:(NSInteger)index
{
    DeMarcbenderSortablegridItemProxy *cellItemProxy = item;
    [cellItemProxy windowWillOpen];
    cellItemProxy.parentVisible = YES;
    [cellItemProxy refreshSize];
    [cellItemProxy willChangeSize];
    [cellItemProxy layoutChildren:NO];
  
    
    BOOL cellContentEqualCellSize = YES;
    
    CGSize cellSize;

    id heightValue = [cellItemProxy valueForKey:@"height"];
    id widthValue = [cellItemProxy valueForKey:@"width"];

    TiDimension height = [TiUtils dimensionValue:heightValue];
    TiDimension width = [TiUtils dimensionValue:widthValue];


    if (TiDimensionIsDip(height)) {
        //cellSize = CGSizeMake(width.value,height.value);
        #ifndef TI_USE_AUTOLAYOUT
            if (TiDimensionIsAutoFill(width) || TiDimensionIsUndefined(width)) {
                [cellItemProxy layoutProperties]->width = TiDimensionAutoFill;
            }
            else {
                if (TiDimensionIsDip(width)) {
                    if (cellWidth > width.value){
                        [cellItemProxy layoutProperties]->width = width;
                    }
                    else {
                        [cellItemProxy layoutProperties]->width = TiDimensionAutoFill;
                    }
                }
                else {
                    [cellItemProxy layoutProperties]->width = TiDimensionAutoSize;
                }
            }
        #endif
        cellSize = CGSizeMake(cellWidth,height.value);
    }
    else if (TiDimensionIsAutoSize(height) || TiDimensionIsUndefined(height) || TiDimensionIsAutoFill(height)) {
              #ifndef TI_USE_AUTOLAYOUT
                  [cellItemProxy layoutProperties]->height = TiDimensionAutoSize;
                    if (TiDimensionIsAutoFill(width) || TiDimensionIsUndefined(width)) {
                        [cellItemProxy layoutProperties]->width = TiDimensionAutoFill;
                    }
                    else {
                        cellContentEqualCellSize = NO;
                        if (TiDimensionIsDip(width)) {
                            if (cellWidth > width.value){
                                [cellItemProxy layoutProperties]->width = width;
                            }
                            else {
                                [cellItemProxy layoutProperties]->width = TiDimensionAutoFill;
                            }
                        }
                        else {
                            [cellItemProxy layoutProperties]->width = TiDimensionAutoSize;
                        }
                    }
              #endif
            cellSize = CGSizeMake(cellWidth, [cellItemProxy minimumParentHeightForSize:CGSizeMake(cellWidth, launcher.frame.size.height)]);
    }
        
        
    
    
    [cellItemProxy replaceValue:[NSNumber numberWithInteger:index] forKey:@"position" notification:NO];
    [self.proxy rememberProxy:cellItemProxy];

    UIView *cellView = [cellItemProxy view];
    UIButton *closeButton = nil;
    closeButton = [self createCloseButton];
    closeButton.tag = index;
    
    UIView *cellViewContainer = [[UIView alloc] init];
    [cellViewContainer setAutoresizingMask:UIViewAutoresizingFlexibleWidth|UIViewAutoresizingFlexibleHeight];
    cellViewContainer.translatesAutoresizingMaskIntoConstraints = YES;

    cellViewContainer.frame = cellView.bounds;
    
    
    BOOL canBeDeleted = [TiUtils boolValue:[cellItemProxy valueForUndefinedKey:@"canBeDeleted"] def:YES];
    BOOL canBeMoved = [TiUtils boolValue:[cellItemProxy valueForUndefinedKey:@"canBeMoved"] def:YES];

    
    BOOL hasBadge = [TiUtils boolValue:[(TiViewProxy*)cellItemProxy valueForUndefinedKey:@"badge"] def:NO];
    CGFloat badgeValue = [TiUtils floatValue:[cellItemProxy valueForKey:@"badgeValue"] def:0];
    
    UIButton *badge = [UIButton buttonWithType:UIButtonTypeCustom];
    badge.frame = CGRectMake(0, 0, 28, 28);
    [badge.layer setCornerRadius:14];

    badge.titleLabel.font = [UIFont boldSystemFontOfSize:12];
    badge.userInteractionEnabled = NO;
    badge.clipsToBounds = NO;
    if ([cellItemProxy valueForKey:@"badgeTintColor"]){
        badge.backgroundColor = [[TiUtils colorValue:[cellItemProxy valueForKey:@"badgeTintColor"]] _color];
    }
    else {
        badge.backgroundColor = [UIColor redColor];
    }

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
    [badge setTitle:title forState:UIControlStateNormal];
  


    CGRect cellFrame = cellView.bounds;
    CGFloat cellOriginX;
    
    if (cellContentEqualCellSize == NO){
        
        CGFloat newWidth = [cellItemProxy minimumParentWidthForSize:CGSizeMake(cellWidth, launcher.frame.size.height)];
        
        if (newWidth > cellWidth){
            cellFrame.size.width = cellWidth - 40 - launcher.contentInset.left;
            
            cellFrame.size.height = [cellItemProxy minimumParentHeightForSize:CGSizeMake(cellFrame.size.width, launcher.frame.size.height)];
            
        }
        else {
            cellFrame.size.width = newWidth;
            cellFrame.size.height = cellSize.height;
        }
        
        if (  (TiDimensionIsUndefined([cellItemProxy layoutProperties]->left)) ){
            cellFrame.origin.x = (cellWidth - cellFrame.size.width);
            cellOriginX = (cellWidth - cellFrame.size.width);
        }

        else {
            cellOriginX = cellFrame.origin.x;
        }
        
    }
    else {
        cellFrame.size.width = cellSize.width;
        cellFrame.size.height = cellSize.height;
        cellOriginX = cellFrame.origin.x;
    }
    
    [cellViewContainer addSubview:cellView];

    cellViewContainer.clipsToBounds = NO;
    cellViewContainer.layer.masksToBounds = NO;
    cellViewContainer.frame = cellFrame;
    cellViewContainer.layer.cornerRadius = cellView.layer.cornerRadius;

    closeButton.hidden = YES;
    closeButton.frame = CGRectMake(cellViewContainer.bounds.origin.x-(closeButton.frame.size.width/4), cellViewContainer.bounds.origin.y-(closeButton.frame.size.height/3), closeButton.frame.size.width, closeButton.frame.size.height);
    [closeButton addTarget:self action:@selector(closeButtonTouchedUpInside:) forControlEvents:UIControlEventTouchUpInside];

    [cellViewContainer addSubview:closeButton];
    badge.hidden = YES;

   
    if (value > 99) {
        badge.frame = CGRectMake(cellViewContainer.bounds.origin.x+cellViewContainer.frame.size.width-(badge.bounds.size.width/1.3)-3, cellViewContainer.bounds.origin.y-(badge.bounds.size.height/4), badge.bounds.size.width, badge.bounds.size.height);
    }
    else {
        badge.frame = CGRectMake(cellViewContainer.bounds.origin.x+cellViewContainer.frame.size.width-(badge.bounds.size.width/1.3), cellViewContainer.bounds.origin.y-(badge.bounds.size.height/4), badge.bounds.size.width, badge.bounds.size.height);
    }
    

    if (itemsBadgeEnabled == YES && hasBadge == YES){
        if (value > 0) {
            badge.hidden = NO;
        }
    }
  
    [cellViewContainer addSubview:badge];

    [cellItemProxy _addBadgeButton:badge];

    [cellItemProxy windowDidOpen];

    
    return @{@"id" : [NSNumber numberWithInteger:index],
             @"canBeDeleted" : [NSNumber numberWithInt:canBeDeleted],
             @"canBeMoved" : [NSNumber numberWithInt:canBeMoved],
             @"showdeletebutton" : [NSNumber numberWithInt:showDeleteButton],
             @"closebutton" : closeButton,
             @"badge" : badge,
             @"cellview" : cellViewContainer,
             @"cellOriginX" : [NSNumber numberWithFloat:cellOriginX],
             @"cellItemProxy" : cellItemProxy,
             @"size" :[NSValue valueWithCGSize:CGSizeMake(cellWidth,cellViewContainer.frame.size.height)]};
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
    /*[UIView animateWithDuration:0.25
             delay: 0.0
             options: UIViewAnimationOptionCurveEaseInOut
             animations:^{
                launcher.alpha = 1.0;
            } completion:^(BOOL finished) {
    }];
    */
  //  launcher.alpha = 1.0;
}


- (void)itemsReordered {

}


- (void)didChangePage:(NSNumber *)pageNo;
{
    int correctedPageNumber = [pageNo intValue];
    correctedPageNumber = correctedPageNumber + 1;
    realCurrentPage = correctedPageNumber;

    
    if (oldPage != realCurrentPage){
        if ([self.proxy _hasListeners:@"pageChanged"]) {
            NSMutableDictionary *event = [NSMutableDictionary dictionary];
            [event setObject:[NSNumber numberWithInt:correctedPageNumber] forKey:@"pageNo"];
            [self.proxy fireEvent:@"pageChanged" withObject:event propagate:NO];
        }
    }
    oldPage = realCurrentPage;

}

- (void)didChangeNumberOfPages:(int)numOfPages;
{
  if ([self.proxy _hasListeners:@"pageCountChanged"]) {
          NSMutableDictionary *event = [NSMutableDictionary dictionary];
          [event setObject:[NSNumber numberWithInt:(numOfPages+1)] forKey:@"pageCount"];
          [self.proxy fireEvent:@"pageCountChanged" withObject:event propagate:NO];
  }
   // numberOfPages = numOfPages;

    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(0.1 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [self updatePagerWithContentOffset:launcher.contentOffset];
    });
}



-(void)closeButtonTouchedUpInside:(id)sender{
    UIView *senderButton = (UIButton*) sender;

    NSIndexPath *indexPath = [launcher indexPathForCell: (UICollectionViewCell *)[[[senderButton superview] superview] superview]];
    inDeletingItem = YES;
    deletedItemId = (int)senderButton.tag;
    [self deleteItemAtIndex:(int)indexPath.item];
}

- (void)setScrollIndicatorInsets_:(id)value withObject:(id)props
{
  insetsScroll = [TiUtils contentInsets:value];
    
  BOOL animated = NO;
    
  if (props != nil){
      animated = [TiUtils boolValue:@"animated" properties:props def:NO];
  }
    
  
  void (^setInset)(void) = ^{
      if (launcher != nil){
          [launcher setScrollIndicatorInsets:insetsScroll];
      }
  };
  if (animated) {
    double duration = [TiUtils doubleValue:@"duration" properties:props def:300] / 1000;
    [UIView animateWithDuration:duration animations:setInset];
  } else {
    setInset();
  }
}





- (void)scrollToItemAtIndex:(id)args
{
        ENSURE_ARG_COUNT(args, 2);
        NSUInteger itemIndex = [TiUtils intValue:[args objectAtIndex:0]];
        NSDictionary *properties = [args count] > 1 ? [args objectAtIndex:1] : nil;
        UICollectionViewScrollPosition scrollPosition = [TiUtils intValue:@"position" properties:properties def:UICollectionViewScrollPositionBottom];
        BOOL animated = [TiUtils boolValue:@"animated" properties:properties def:YES];
        //TiThreadPerformOnMainThread(^{
            NSIndexPath *indexPath = [NSIndexPath indexPathForItem:itemIndex inSection:0];
            [launcher scrollToItemAtIndexPath:indexPath atScrollPosition:scrollPosition animated:animated];
        //}, [NSThread isMainThread]);
}

- (void)setContentInsets:(id)args
{
    contentInsetsArgs = args;
    [self setContentInsets_:args];
}


- (void)setContentInsets_:(id)args
{
  ENSURE_UI_THREAD(setContentInsets_, args);
  contentInsetsArgs = args;
  id arg1;
  id arg2;
  if ([args isKindOfClass:[NSDictionary class]]) {
    arg1 = args;
    arg2 = [NSDictionary dictionary];
  } else {
    arg1 = [args objectAtIndex:0];
    arg2 = [args count] > 1 ? [args objectAtIndex:1] : [NSDictionary dictionary];
  }
  [self setContentInset:arg1 withObject:arg2];
}



-(void)setContentInset:(id)value withObject:(id)props
{

    insets = [TiUtils contentInsets:value];
    
    if (insets.left > 0 && launcher.contentInset.left > 0){
        insets.left = (insets.left > launcher.contentInset.left) ? insets.left : launcher.contentInset.left;
    }
    else {
        if (insets.left > 0){
            insets.left = (insets.left > (horizontalSpacing/2)) ? insets.left : (horizontalSpacing/2);
        }
        else {
            insets.left = launcher.contentInset.left;
        }
    }
    if (insets.right > 0 && launcher.contentInset.right > 0){
        insets.right = (insets.right > launcher.contentInset.right) ? insets.right : launcher.contentInset.right;
    }
    else {
        if (insets.right > 0){
            insets.right = (insets.right > (horizontalSpacing/2)) ? insets.right : (horizontalSpacing/2);
        }
        else {
            insets.right = launcher.contentInset.right;
        }
    }

   // self.contentInsets = value;
    
    int newoffset = [TiUtils intValue:@"newoffset" properties:props def:0];

    int safeArea = [TiUtils intValue:@"safearea" properties:props def:0];

    BOOL animated = [TiUtils boolValue:@"animated" properties:props def:NO];
    BOOL nobottom = [TiUtils boolValue:@"nobottom" properties:props def:NO];
    BOOL noOffset = [TiUtils boolValue:@"noOffset" properties:props def:NO];

    
    void (^setInset)(void) = ^{
                
        CGFloat topInset = insets.top + (verticalSpacing/2);
        CGFloat bottomInset = insets.bottom + (verticalSpacing/2);
        CGFloat leftInset = insets.left;
        CGFloat rightInset = insets.right;

        if (launcher != nil){
            [[self launcher] setContentInset:insets];
            [[self launcher] setScrollIndicatorInsets:insetsScroll];
        }
        
        NSMutableDictionary *contentDictionary = [[NSMutableDictionary alloc]init];
        [contentDictionary setValue:[NSNumber numberWithFloat:topInset] forKey:@"top"];
        [contentDictionary setValue:[NSNumber numberWithFloat:bottomInset] forKey:@"bottom"];
        [contentDictionary setValue:[NSNumber numberWithFloat:leftInset] forKey:@"left"];
        [contentDictionary setValue:[NSNumber numberWithFloat:rightInset] forKey:@"right"];
        
        
        [self.proxy replaceValue:contentDictionary
                    forKey:@"contentInsets"
              notification:NO];
        
        if (noOffset == NO){
            if (nobottom == NO){
                
               // TiThreadPerformOnMainThread(^{

                    CGSize svContentSize = [self launcher].contentSize;
                    CGSize svBoundSize = [self launcher].bounds.size;
                    CGFloat svBottomInsets = [self launcher].contentInset.bottom;
                    CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + safeArea;
                    CGFloat bottomWidth = svContentSize.width - svBoundSize.width;
                    CGPoint newOffset = CGPointMake(launcher.contentOffset.x, bottomHeight);
                  //  NSLog(@"[ERROR] setContentInset  ");
                    if (launcher != nil){
                        [[self launcher] setContentOffset:newOffset];
                    }
              //  }, [NSThread isMainThread]);

            }
            if (newoffset != 0){
              //  TiThreadPerformOnMainThread(^{
                    CGSize svContentSize = [self launcher].contentSize;
                    CGSize svBoundSize = [self launcher].bounds.size;
                    CGFloat svBottomInsets = [self launcher].contentInset.bottom;
                    CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + safeArea;
                    CGFloat bottomWidth = svContentSize.width - svBoundSize.width;

                    CGPoint newOffset = CGPointMake(launcher.contentOffset.x, newoffset);
                    if (launcher != nil){
                        [[self launcher] setContentOffset:newOffset];
                    }
               // }, [NSThread isMainThread]);

            }
        }

    };
    if (animated) {
        double duration = [TiUtils doubleValue:@"duration" properties:props def:180]/1000;
        [UIView animateWithDuration:duration animations:setInset];
    }
    else {
        setInset();
    }
}






-(void)isertItemAtIndex:(int)index item:(DeMarcbenderSortablegridItemProxy *)object
{
    NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index inSection:0];
    
    [launcher insertItemAtIndexPath:(NSIndexPath *)indexPath];

}


-(void)deleteItemAtIndex:(NSInteger)index
{
    
    NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index inSection:0];
    NSMutableArray *array = [self.dataSource mutableCopy];
    [array[0] removeObjectAtIndex:indexPath.item];
    self.dataSource = [array mutableCopy];
    [launcher deleteItemsAtIndexPaths:@[indexPath]];
    
        NSMutableArray *tempCellData = [NSMutableArray array];


         for (int index = 0; index < [self.dataSource[0] count] ; index++) {
             NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
             DeMarcbenderSortablegridItemProxy *thisProxy = (DeMarcbenderSortablegridItemProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];
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

    NSInteger id = [TiUtils intValue:_dataSource[indexPath.section][indexPath.item][@"id"]];
    cell.cellId = id;
    cell.columnCount = [self numberOfColumns];
    
    
    BOOL canBeDeleted = [TiUtils boolValue:_dataSource[indexPath.section][indexPath.item][@"canBeDeleted"]];
    BOOL canBeMoved = [TiUtils boolValue:_dataSource[indexPath.section][indexPath.item][@"canBeMoved"]];

    if ([cell contentView].subviews.count > 0){
        NSArray *viewsToRemove = [cell contentView].subviews;
        for (UIView *v in viewsToRemove) {
            [v removeFromSuperview];
        }
    }
    [cell contentView].frame = cell.bounds;

    UIView *content = (UIView *)_dataSource[indexPath.section][indexPath.item][@"cellview"];
    
    [[cell contentView] addSubview:content];

    cell.canBeDeleted = canBeDeleted;
    cell.canBeMoved = canBeMoved;
    
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
             DeMarcbenderSortablegridItemProxy *thisProxy = (DeMarcbenderSortablegridItemProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];
             [thisProxy replaceValue:[NSNumber numberWithInt:index] forKey:@"position" notification:NO];
             [self.proxy rememberProxy:thisProxy];

             [tempCellData addObject:thisProxy];
         }
         [[self proxy] replaceValue:tempCellData forKey:@"data" notification:NO];
         cellData = [tempCellData mutableCopy];
}


-(void)dragCellCollectionViewDidEndDrag:(BMDragCellCollectionView *)dragCellCollectionView {
        NSMutableArray *tempCellData = [NSMutableArray array];

    
         for (int index = 0; index < [self.dataSource[0] count] ; index++) {
             NSIndexPath *thisIndexPath = [NSIndexPath indexPathForItem:index inSection:0];
             DeMarcbenderSortablegridItemProxy *thisProxy = (DeMarcbenderSortablegridItemProxy*)self.dataSource[0][thisIndexPath.item][@"cellItemProxy"];
             [thisProxy replaceValue:[NSNumber numberWithInt:index] forKey:@"position" notification:NO];
             [self.proxy rememberProxy:thisProxy];

             [tempCellData addObject:thisProxy];
         }
        cellData = [tempCellData mutableCopy];

         [[self proxy] replaceValue:tempCellData forKey:@"data" notification:NO];
         
         if ([self.proxy _hasListeners:@"itemsReordered"]) {
             [[self proxy] fireEvent:@"itemsReordered" withObject:nil];
         }
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



- (void)scrollViewWillBeginDragging:(UIScrollView *)scrollView
{
    if ([self isLazyLoadingEnabled]) {
        [[ImageLoader sharedLoader] suspend];
    }
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



-(void)scrollToBottom:(id)props
{
    /*
     * Calculate the bottom height & width and, sets the offset from the
     * content view’s origin that corresponds to the receiver’s origin.
     */
    
    BOOL animated = [TiUtils boolValue:@"animated" properties:props def:NO];
    if ([self isLazyLoadingEnabled]) {
        [[ImageLoader sharedLoader] suspend];
    }

    
    [UIView performWithoutAnimation:^{
        CGSize svContentSize = [self launcher].contentSize;
        CGSize svBoundSize = [self launcher].bounds.size;
        CGFloat svBottomInsets = [self launcher].contentInset.bottom;
        
        CGFloat bottomHeight = svContentSize.height - svBoundSize.height + svBottomInsets + 34;
        CGFloat bottomWidth = svContentSize.width - svBoundSize.width;
        
        CGPoint newOffset = CGPointMake(bottomWidth,bottomHeight);
        [[self launcher] setContentOffset:newOffset animated:NO];
    }];
}



- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    if ([self isLazyLoadingEnabled]) {
        [[ImageLoader sharedLoader] resume];
    }

}



- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate
{
    if (!decelerate) {
        if ([self isLazyLoadingEnabled]) {
            [[ImageLoader sharedLoader] resume];
        }
    }
}


- (void) scrollViewDidScroll:(UIScrollView *)scrollView {
    if ([self isLazyLoadingEnabled]) {
        [[ImageLoader sharedLoader] suspend];
    }

    if (pagerEnabled == YES){
        [self updatePagerWithContentOffset:launcher.contentOffset];
    }
    [self fireScrollEvent:launcher];
}



- (NSDictionary *)eventObjectForScrollView:(UIScrollView *)scrollView
{
  return [NSDictionary dictionaryWithObjectsAndKeys:
                       [TiUtils pointToDictionary:scrollView.contentOffset], @"contentOffset",
                       [TiUtils sizeToDictionary:scrollView.contentSize], @"contentSize",
                       nil];
}

- (void)fireScrollEvent:(UIScrollView *)scrollView
{

  if ([self.proxy _hasListeners:@"scroll"]) {

    [self.proxy fireEvent:@"scroll" withObject:[self eventObjectForScrollView:scrollView]];
  }
}




- (void)pageChanged
{
        
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

        if ([self respondsToSelector:@selector(didChangePage:)]) {
            if (pager != nil){
                [self didChangePage:[NSNumber numberWithInteger:pager.currentPage]];
            }
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



- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary  *)change context:(void *)context
{
    if (pagerFollowsBottomInset == YES && pagerEnabled == YES){
        if (oldContentInsetBottomForPager != (launcher.contentInset.bottom-25)){
            
            if (self.frame.origin.y < 0 && launcher.contentInset.top > 0){
                CGFloat diff = self.frame.origin.y;
                diff = (0 - diff);
                pager.frame = CGRectMake(0,self.bounds.origin.y + self.frame.size.height - bottomSafeAreaPadding - launcher.contentInset.bottom - 25, self.bounds.size.width, 25);
                oldContentInsetBottomForPager = launcher.contentInset.bottom-25;
            }
            else {
                pager.frame = CGRectMake(0, self.bounds.size.height - launcher.contentInset.bottom - 25, self.bounds.size.width, 25);
                oldContentInsetBottomForPager = launcher.contentInset.bottom-25;
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


