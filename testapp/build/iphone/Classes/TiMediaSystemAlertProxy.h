/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_MEDIASYSTEMALERT

#import <AudioToolbox/AudioServices.h>
#import <TitaniumKit/TiProxy.h>

@interface TiMediaSystemAlertProxy : TiProxy {
  NSURL *url;
  SystemSoundID sound;
}

@property (nonatomic, readonly) NSURL *url;

- (void)play:(id)args;

@end

#endif
