/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "DeMarcbenderSortablegridItem.h"
#import <TitaniumKit/TiUtils.h>

@implementation DeMarcbenderSortablegridItem


- (void)initializeState
{
    [super initializeState];
}

 
- (void)frameSizeChanged:(CGRect)frame bounds:(CGRect)bounds
{
    

   // self.contentView.frame = bounds;
   // [super frameSizeChanged:frame bounds:bounds];

    CGRect newFrame = self.superview.bounds;

    if (newFrame.size.width != bounds.size.width){
       // NSLog(@"[WARN] frameSizeChanged: cellITEM  ");

        if (  (TiDimensionIsUndefined([(TiViewProxy*)self.proxy layoutProperties]->left)) ){
            
           // NSLog(@"[WARN] cellITEM  %f  %f  %f   %f ",(self.superview.frame.size.width - frame.size.width), self.superview.frame.origin.x,frame.origin.x,frame.origin.x);

            
            newFrame.origin.x = self.superview.frame.origin.x + (self.superview.frame.size.width - frame.size.width);
        }
        newFrame.size = bounds.size;
        
        self.superview.frame = newFrame;
    }
    
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

