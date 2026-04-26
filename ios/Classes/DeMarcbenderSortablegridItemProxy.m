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

// Allowed: id, height, width, badge, canBeDeleted, canBeMoved, badgeValue, badgeTintColor, borderRadius, borderWidth, borderColor, backgroundColor
// Block all other Ti.UI.View properties

- (void)setTop:(id)value              { [self replaceValue:nil forKey:@"top" notification:NO]; }
- (void)setBottom:(id)value           { [self replaceValue:nil forKey:@"bottom" notification:NO]; }
- (void)setLeft:(id)value             { [self replaceValue:nil forKey:@"left" notification:NO]; }
- (void)setRight:(id)value            { [self replaceValue:nil forKey:@"right" notification:NO]; }
- (void)setCenter:(id)value           { [self replaceValue:nil forKey:@"center" notification:NO]; }
- (void)setClip:(id)value             { [self replaceValue:nil forKey:@"clip" notification:NO]; }
- (void)setClipMode:(id)value         { [self replaceValue:nil forKey:@"clipMode" notification:NO]; }
- (void)setOpacity:(id)value          { [self replaceValue:nil forKey:@"opacity" notification:NO]; }
- (void)setVisible:(id)value          { [self replaceValue:nil forKey:@"visible" notification:NO]; }
- (void)setHidden:(id)value           { [self replaceValue:nil forKey:@"hidden" notification:NO]; }
- (void)setImage:(id)value            { [self replaceValue:nil forKey:@"image" notification:NO]; }
- (void)setBackgroundImage:(id)value  { [self replaceValue:nil forKey:@"backgroundImage" notification:NO]; }
- (void)setViewShadowColor:(id)value  { [self replaceValue:nil forKey:@"viewShadowColor" notification:NO]; }
- (void)setViewShadowOffset:(id)value { [self replaceValue:nil forKey:@"viewShadowOffset" notification:NO]; }
- (void)setViewShadowRadius:(id)value { [self replaceValue:nil forKey:@"viewShadowRadius" notification:NO]; }
- (void)setTouchEnabled:(id)value     { [self replaceValue:nil forKey:@"touchEnabled" notification:NO]; }
- (void)setFlex:(id)value             { [self replaceValue:nil forKey:@"flex" notification:NO]; }
- (void)setLayout:(id)value           { [self replaceValue:nil forKey:@"layout" notification:NO]; }
- (void)setTransform:(id)value        { [self replaceValue:nil forKey:@"transform" notification:NO]; }
- (void)setRotation:(id)value         { [self replaceValue:nil forKey:@"rotation" notification:NO]; }
- (void)setRotationX:(id)value        { [self replaceValue:nil forKey:@"rotationX" notification:NO]; }
- (void)setRotationY:(id)value        { [self replaceValue:nil forKey:@"rotationY" notification:NO]; }
- (void)setScaleX:(id)value           { [self replaceValue:nil forKey:@"scaleX" notification:NO]; }
- (void)setScaleY:(id)value           { [self replaceValue:nil forKey:@"scaleY" notification:NO]; }

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

