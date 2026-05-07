/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#ifdef USE_TI_UIIOSBLURVIEW
#import "TiUIiOSBlurViewProxy.h"
#import "TiUIiOSBlurView.h"
#import <TitaniumKit/TiUtils.h>

@implementation TiUIiOSBlurViewProxy

#pragma mark Proxy lifecycle

- (NSString *)apiName
{
  return @"Ti.UI.iOS.BlurView";
}

- (void)dealloc
{
  [super dealloc];
}

#pragma mark Public APIs

- (TiUIiOSBlurView *)blurView
{
  return (TiUIiOSBlurView *)self.view;
}

@end
#endif
