/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import <TitaniumKit/TiViewProxy.h>
#import "TiUIViewProxy.h"
#import "DeMarcbenderSortablegridItemView.h"

@interface DeMarcbenderSortablegridItemViewProxy : TiViewProxy <TiProxyObserver> {
    TiDimension poWidth;
    TiDimension poHeight;
    UIButton *badgeButton;
    NSInteger badgevalue;
}
- (id)badgeValue;

// Private API
- (void)_addBadgeButton:(UIButton *)button;
- (void)_updateBadgeValue:(id)value;


@end

