/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "DeMarcbenderSortablegridItemView.h"
#import "DeMarcbenderSortablegridItemViewProxy.h"
#import <TitaniumKit/TiUIView.h>
#import <TitaniumKit/TiUtils.h>
#import <TitaniumKit/TiViewProxy.h>

@implementation DeMarcbenderSortablegridItemView


- (void)initializeState
{
  [super initializeState];
}
 
- (void)frameSizeChanged:(CGRect)frame bounds:(CGRect)bounds
{
  // Sets the size and position of the view
 // [TiUtils setView:square positionRect:bounds];
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldReceiveTouch:(UITouch *)touch {
    if ([self hitTest:[touch locationInView:self] withEvent:nil]) {
     
        return YES;
    }

    return NO;
}

- (BOOL)gestureRecognizer:(UIGestureRecognizer *)gestureRecognizer shouldRecognizeSimultaneouslyWithGestureRecognizer:(UIGestureRecognizer *)otherGestureRecognizer{
    return YES;
}




@end

