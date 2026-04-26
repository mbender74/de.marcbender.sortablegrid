/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import "TiUIApplication.h"
#import <TitaniumKit/TiBase.h>

@implementation TiUIApplication

#ifdef USE_TI_APPTRACKUSERINTERACTION
- (void)sendEvent:(UIEvent *)event
{
  for (UITouch *touch in event.allTouches) {
    if (touch.phase == UITouchPhaseBegan) {
      [[NSNotificationCenter defaultCenter] postNotificationName:kTiUserInteraction object:nil];
    }
  }

  [super sendEvent:event];
}
#endif

@end
