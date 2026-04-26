/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import "TiAppiOSActivityAttributesProxy.h"

@implementation TiAppiOSActivityAttributesProxy

- (void)startActivity:(id)args
{
  ENSURE_SINGLE_ARG(args, NSDictionary);
  [TiAppiOSActivityAttributesProxy _startActivity:args];
}

@end
