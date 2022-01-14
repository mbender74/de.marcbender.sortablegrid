/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
#import <TitaniumKit/TiViewProxy.h>
#import <TitaniumKit/TiUIViewProxy.h>
#import <TitaniumKit/TiUIView.h>
#import "BMDragCellCollectionView.h"
#import "BMDragCollectionViewCell.h"
#import "XHWaterfallFlowLayout.h"
#import "DeMarcbenderSortablegridViewProxy.h"
#import "DeMarcbenderSortablegridItemProxy.h"


@interface DeMarcbenderSortablegridView : TiUIView <LayoutAutosizing, XHWaterfallFlowLayoutDelegate, UIScrollViewDelegate, BMDragCellCollectionViewDelegate,BMDragCollectionViewDataSource> {
    CGFloat bottomSafeAreaPadding;
    CGFloat topSafeAreaPadding;
    UIWindow *window;
    CGFloat oldContentInsetBottomForPager;
  UIImage *deleteButtonImage;
  UIImage *badgeImage;
  CGFloat previousOffset;
  CGFloat columnCount;
  CGFloat rowCount;
  CGPoint oldContentOffset;
  CGFloat correctedHorizontalSpacing;
  CGFloat horizontalSpacing;
  CGFloat verticalSpacing;
  UIScrollView *scrollView;
  BOOL pagerFollowsBottomInset;
  BOOL observerAdded;
  BOOL showDeleteButton;
  BOOL showVerticalScrollIndicator;
  BOOL showHorizontalScrollIndicator;
  UIImage *stretchImage;
  BOOL editing;
  BOOL didScroll;
  BOOL itemsBadgeEnabled;
  BOOL pagerEnabled;
  BOOL pagingEnabled;
  BOOL insetsCalcDone;
  UIPageControl *pager;
  NSInteger numberOfPages;
  NSInteger currentPage;
  NSInteger oldPage;
  int realCurrentPage;
  ScrollDirection scrollDirection;
  NSMutableArray *cellData;
  CGFloat cellWidth;
  BOOL inDeletingItem;
  int deletedItemId;
  @private
  BMDragCellCollectionView *launcher;
  XHWaterfallFlowLayout *waterfallLayout;
  UIScrollView *hiddenScrollView;
  UIEdgeInsets insets;
  UIEdgeInsets insetsScroll;
  id contentInsetsArgs;
}
@property (strong, nonatomic) NSMutableArray *dataSource;
@property (nonatomic, assign) UICollectionViewScrollDirection collectionViewScrollDirection;
@property (strong, nonatomic) NSMutableArray *dataSourceArray;
@property (nonatomic, assign) UICollectionView *collectionView;

@property (nonatomic, assign) CGFloat columnsCount;

@property (nonatomic, assign) CGFloat leftInset;
@property (nonatomic, assign) CGFloat rightInset;

@property (nonatomic, assign) CGFloat minimumColumnSpacing;
@property (nonatomic, assign) CGFloat minimumInteritemSpacing;
@property (nonatomic, assign) CGFloat headerHeight;
@property (nonatomic, assign) CGFloat footerHeight;
@property (nonatomic, assign) BOOL waterFallLayout;
@property (nonatomic, assign) BOOL wobble;
@property (nonatomic, assign) BOOL initDone;

@property (nonatomic, assign) UIEdgeInsets sectionInset;

- (BMDragCellCollectionView *)launcher;
- (void)deleteItemAtIndex:(NSInteger)index;
- (void)addItem:(DeMarcbenderSortablegridItemProxy*)item atIndex:(NSInteger)index;
- (void)scrollToItemAtIndex:(id)args;
-(void)setContentInset:(id)value withObject:(id)props;
- (void)setContentInsets:(id)args;
-(void)scrollToBottom:(id)props;
- (void)startEditing;
- (void)stopEditing;
- (void)initData;
- (CGFloat)cellWidth;

- (void)itemsReordered;
- (id)currentPageOfLauncher;
- (id)pagesCount;
-(void)setCurrentPageOfLauncher:(int)newPage;
- (id)dataStore;

//- (UIImage *)badgeButtonImage;

@end

