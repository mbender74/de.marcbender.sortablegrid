/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

// A good bit of this code was derived from the Three20 project
// and was customized to work inside Titanium
//
// All modifications by Appcelerator are licensed under
// the Apache License, Version 2.0
//
//
// Copyright 2009 Facebook
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

#import <UIKit/UIKit.h>
#import "DeMarcbenderSortablegridViewProxy.h"

@class GridLauncherButton;
@class GridLauncherItem;
@protocol GridLauncherViewDelegate;

@interface GridLauncherView : UIView <UIScrollViewDelegate> {
  @private
  id<GridLauncherViewDelegate> delegate;
  UIScrollView *scrollView;
  UIPageControl *pager;
  BOOL pagerEnabled;
  NSMutableArray *pages;
  NSMutableArray *buttons;
  NSInteger columnCount;
  NSInteger rowCount;
  NSString *scrollType;
  CGFloat itemHeight;
  GridLauncherButton *dragButton;
  NSTimer *editHoldTimer;
  NSTimer *springLoadTimer;
  UITouch *dragTouch;
  NSInteger positionOrigin;
  CGPoint dragOrigin;
  CGPoint touchOrigin;
  CGSize contentSize;
  BOOL editing;
  BOOL springing;
  BOOL editable;
  BOOL pagingEnabled;
  BOOL renderingButtons;
  BOOL showsVerticalScrollIndicator;
  BOOL showsHorizontalScrollIndicator;

}

@property (nonatomic) NSInteger columnCount;
@property (nonatomic) NSInteger rowCount;
@property (nonatomic) NSInteger currentPageIndex;
@property (nonatomic, assign) id<GridLauncherViewDelegate> delegate;
@property (nonatomic, readonly) BOOL editing;
@property (nonatomic, assign) CGFloat itemHeight;
@property (nonatomic, assign) BOOL editable;
@property (nonatomic, assign) CGSize contentSize;
@property (nonatomic, assign) BOOL pagerEnabled;
@property (nonatomic, assign) NSString *scrollType;
@property (nonatomic, assign) BOOL pagingEnabled;
@property (nonatomic, assign) BOOL showsVerticalScrollIndicator;
@property (nonatomic, assign) BOOL showsHorizontalScrollIndicator;

- (id)initWithFrame:(CGRect)frame withRowCount:(int)newRowCount withColumnCount:(int)newColumnCount withProxy:(TiProxy *)proxy;

- (void)addItem:(GridLauncherItem *)item animated:(BOOL)animated;
- (void)removeItem:(GridLauncherItem *)item animated:(BOOL)animated;
- (UIScrollView *)scrollView;
- (UIPageControl *)pager;

- (void)beginEditing;
- (void)endEditing;
- (void)recreateButtons;
- (void)layoutButtons;

- (GridLauncherItem *)itemForIndex:(NSInteger)index;
- (NSArray *)launcheritems_;
- (NSArray *)items;

@end

@protocol GridLauncherViewDelegate <NSObject>

@optional

- (void)launcherView:(GridLauncherView *)launcher didAddItem:(GridLauncherItem *)item;

- (void)launcherView:(GridLauncherView *)launcher didRemoveItem:(GridLauncherItem *)item;

- (void)launcherView:(GridLauncherView *)launcher willDragItem:(GridLauncherItem *)item;

- (void)launcherView:(GridLauncherView *)launcher didDragItem:(GridLauncherItem *)item;

- (void)launcherView:(GridLauncherView *)launcher didMoveItem:(GridLauncherItem *)item;

- (void)launcherView:(GridLauncherView *)launcher didSelectItem:(GridLauncherItem *)item;

- (void)launcherViewDidBeginEditing:(GridLauncherView *)launcher;

- (void)launcherViewDidEndEditing:(GridLauncherView *)launcher;
- (BOOL)launcherViewShouldWobble:(GridLauncherView *)launcher;

- (void)launcherView:(GridLauncherView *)launcher didChangePage:(NSNumber *)pageNo;

@end

