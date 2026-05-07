/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#if defined(USE_TI_APPIOSSEARCHQUERY) || defined(USE_TI_APPIOSSEARCHABLEITEM)
#import <CoreSpotlight/CoreSpotlight.h>
#import <TitaniumKit/TiProxy.h>

@interface TiAppiOSSearchableItemProxy : TiProxy {
}
- (id)initWithUniqueIdentifier:(NSString *)identifier
          withDomainIdentifier:(NSString *)domainIdentifier
              withAttributeSet:(CSSearchableItemAttributeSet *)attributeSet;

@property (nonatomic, retain) CSSearchableItem *item;

@end
#endif
