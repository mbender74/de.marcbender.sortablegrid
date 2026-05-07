/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UIBUTTON

#import "TiToolbarButton.h"
#import "TiUINavBarButton.h"
#import <TitaniumKit/TiToolbar.h>
#import <TitaniumKit/TiViewProxy.h>

@interface TiUIButtonProxy : TiViewProxy <TiToolbarButton> {
  @private
  UIButtonType styleCache;
  TiUINavBarButton *button;
  id<TiToolbar> toolbar; // weak
}

@end

#endif
