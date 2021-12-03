/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "GridLauncherView.h"
#import <TitaniumKit/TiUIView.h>

@interface DeMarcbenderSortablegridView : TiUIView <GridLauncherViewDelegate> {

  @private
  GridLauncherView *launcher;
}

- (GridLauncherView *)launcher;
- (void)setViewData_:(NSArray *)data;
- (void)startEditing;
- (void)stopEditing;

@end

