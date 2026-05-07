/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#import <TitaniumKit/TiProxy.h>

@interface TiNetworkCookieProxy : TiProxy {
  NSMutableDictionary *_cookieDict;
}

@property (nonatomic) BOOL isHTTPOnly;
- (id)initWithCookie:(NSHTTPCookie *)cookie andPageContext:(id<TiEvaluator>)context;
- (NSHTTPCookie *)newCookie;
@end
