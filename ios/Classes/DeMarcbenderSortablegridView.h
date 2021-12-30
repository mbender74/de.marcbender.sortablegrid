/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import <TitaniumKit/TiUIView.h>
#import "BMDragCellCollectionView.h"
#import "BMDragCollectionViewCell.h"
#import "XHWaterfallFlowLayout.h"
#import "DeMarcbenderSortablegridItemViewProxy.h"
#import <UIKit/UIGestureRecognizerSubclass.h>


typedef enum {
    DirectionPangestureRecognizerVertical,
    DirectionPanGestureRecognizerHorizontal
} DirectionPangestureRecognizerDirection;

@interface DirectionPanGestureRecognizer : UIPanGestureRecognizer {
    BOOL _drag;
    int _moveX;
    int _moveY;
    DirectionPangestureRecognizerDirection _direction;
}

@property (nonatomic, assign) DirectionPangestureRecognizerDirection direction;

@end

@interface DeMarcbenderSortablegridView : TiUIView <XHWaterfallFlowLayoutDelegate, UIScrollViewDelegate, BMDragCellCollectionViewDelegate,BMDragCollectionViewDataSource> {
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
}
@property (strong, nonatomic) NSMutableArray *dataSource;
@property (nonatomic, assign) UICollectionViewScrollDirection collectionViewScrollDirection;
@property (strong, nonatomic) NSMutableArray *dataSourceArray;


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
- (void)deleteItemAtIndex:(int)index;
- (void)addItem:(DeMarcbenderSortablegridItemViewProxy*)item atIndex:(int)index;
- (void)startEditing;
- (void)stopEditing;
- (void)initData;
- (CGFloat)cellWidth;

- (void)itemsReordered;
- (id)currentPageOfLauncher;
- (id)pagesCount;
-(void)setCurrentPageOfLauncher:(int)newPage;
- (id)dataStore;

- (UIImage *)badgeButtonImage;

@end

