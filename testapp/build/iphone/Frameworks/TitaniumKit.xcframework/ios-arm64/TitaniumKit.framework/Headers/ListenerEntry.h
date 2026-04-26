/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#import "TiEvaluator.h"
#import "TiModule.h"

/**
 A wrapper class used to store event listeners related to a given proxy and kroll-context.
 */
@interface ListenerEntry : NSObject {
  @private
  id<TiEvaluator> context;
  id listener;
  TiProxy *proxy;
  NSString *type;
}

/**
 The type of listener entry to use.
 @return The given type.
 */
@property (nonatomic, readwrite, retain) NSString *type;

- (id)initWithListener:(id)listener_ context:(id<TiEvaluator>)context_ proxy:(TiProxy *)proxy;

- (id<TiEvaluator>)context;

- (id)listener;

@end
