/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "DeMarcbenderSortablegridItemViewProxy.h"
#import "DeMarcbenderSortablegridView.h"

#import <TitaniumKit/TiUtils.h>
#import "TiColor.h"
#import "TiRect.h"

@implementation DeMarcbenderSortablegridItemViewProxy

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

- (void)setBadgeValue:(id)value
{
    NSInteger badgeValue = [TiUtils intValue:value];
    badgevalue = badgeValue;

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
        if (badgeValue <= 0){
            badgeButton.hidden = YES;
        }
        else {
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


-(UIImage *)image:(UIImage*)image withMaskWithColor:(UIColor *)color
{
    CGImageRef maskImage = image.CGImage;
    CGFloat width = image.size.width;
    CGFloat height = image.size.height;
    CGRect bounds = CGRectMake(0,0,width,height);

    CGColorSpaceRef colorSpace = CGColorSpaceCreateDeviceRGB();
    CGContextRef bitmapContext = CGBitmapContextCreate(NULL, width, height, 8, 0, colorSpace, kCGImageAlphaPremultipliedLast);
    CGContextClipToMask(bitmapContext, bounds, maskImage);
    CGContextSetFillColorWithColor(bitmapContext, color.CGColor);
    CGContextFillRect(bitmapContext, bounds);

    CGImageRef cImage = CGBitmapContextCreateImage(bitmapContext);
    UIImage *coloredImage = [UIImage imageWithCGImage:cImage];

    CGContextRelease(bitmapContext);
    CGColorSpaceRelease(colorSpace);
    CGImageRelease(cImage);

    return coloredImage;
}



@end

