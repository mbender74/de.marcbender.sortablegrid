/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "DeMarcbenderSortablegridItemProxy.h"
#import "DeMarcbenderSortablegridView.h"

#import <TitaniumKit/TiUtils.h>
#import "TiColor.h"
#import "TiRect.h"

@implementation DeMarcbenderSortablegridItemProxy

- (id)init
{
  if (self = [super init]) {
    poWidth = TiDimensionUndefined;
    poHeight = TiDimensionUndefined;
    badgeButton = nil;
    badgevalue = 0;
  }
  return self;
}

- (void)_destroy
{
  [super _destroy];
}

- (void)dealloc
{
  [super dealloc];
}

- (NSString *)apiName
{
  return @"de.marcbender.sortablegridItem";
}

// All Ti.UI.View properties are supported (opacity, borderRadius, borderWidth, borderColor, backgroundColor, transform, etc.)
// Only module-specific properties are handled: badge, canBeDeleted, canBeMoved, badgeValue, badgeTintColor

- (void)setBadgeValue:(id)value
{
    NSInteger badgeValue = [TiUtils intValue:value];
    badgevalue = badgeValue;
    BOOL hasBadge = [TiUtils boolValue:[self valueForUndefinedKey:@"badge"] def:NO];

    
    
    if (badgeButton != nil){
        NSString *title = [NSString stringWithFormat:@"%ld", (long)badgeValue];
        if (badgeValue > 99) {
          title = @"99+";
        }
        
        CGRect newButtonFrame = badgeButton.frame;
        if (badgeValue > 0 && badgeValue < 100) {
            if (badgeButton.frame.size.width != 28){
                newButtonFrame.size.width = 28;
                newButtonFrame.origin.x = badgeButton.frame.origin.x + 3;
                badgeButton.frame = newButtonFrame;
            }
        } else {
            if (badgeButton.frame.size.width != 38){
                newButtonFrame.origin.x = badgeButton.frame.origin.x - 3;
                newButtonFrame.size.width = 38;
                badgeButton.frame = newButtonFrame;
            }
        }
        [badgeButton setTitle:NSLocalizedString(title, title) forState:UIControlStateNormal];
        if (badgeValue > 0 && hasBadge==YES){
            badgeButton.hidden = NO;
        }
        badgevalue = badgeValue;
    }
     
    
}

- (id)badgeValue
{
    return [NSNumber numberWithInt:(int)badgevalue];
}


// Private API
- (void)_addBadgeButton:(UIButton *)button
{
    badgeButton = button;
}
- (void)_updateBadgeValue:(id)value
{
    [self setBadgeValue:value];
}

@end

