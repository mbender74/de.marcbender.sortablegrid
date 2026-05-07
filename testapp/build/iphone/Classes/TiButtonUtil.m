/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "TiButtonUtil.h"
#import <TitaniumKit/TiBase.h>

@implementation TiButtonUtil

+ (UIView *)systemButtonWithType:(int)type
{
  switch (type) {
  case UItestappNativeItemInfoLight: {
    return [UIButton buttonWithType:UIButtonTypeInfoLight];
  }
  case UItestappNativeItemInfoDark: {
    return [UIButton buttonWithType:UIButtonTypeInfoDark];
  }
  case UItestappNativeItemDisclosure: {
    return [UIButton buttonWithType:UIButtonTypeDetailDisclosure];
  }
  case UItestappNativeItemContactAdd: {
    return [UIButton buttonWithType:UIButtonTypeContactAdd];
  }
  case UItestappNativeItemSpinner: {
    UIActivityIndicatorView *button = [[[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhite] autorelease];
    [button startAnimating];
    return button;
  }
  }
  return nil;
}

+ (UIView *)buttonWithType:(int)type
{
  UIView *button = [TiButtonUtil systemButtonWithType:type];
  if (button == nil) {
    button = [UIButton buttonWithType:type];
  }
  return button;
}

@end
