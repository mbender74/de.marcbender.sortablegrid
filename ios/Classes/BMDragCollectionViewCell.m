
//
//  BMDragCollectionViewCell.m
//  BMDragCellCollectionViewDemo
//
//  Created by __liangdahong on 2017/7/17.
//  Copyright © 2017年 http://idhong.com. All rights reserved.
//

#import "BMDragCollectionViewCell.h"
static const NSTimeInterval kGridLauncherViewWobbleTime = 0.07;
static const CGFloat kGridLauncherViewWobbleRadians = 1.5;
#define kAnimationRotateDeg 0.5
#define kAnimationTranslateX 1.0
#define kAnimationTranslateY 1.0
static  BOOL wobblesLeft = YES;
static  NSInteger lastIndex = 0;
static  BOOL wobbleEnabled = NO;

@implementation BMDragCollectionViewCell

- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
       // NSLog(@"[INFO] cell initWithFrame");
        _playerViewAnimator = [[UIViewPropertyAnimator alloc] init];
        [_playerViewAnimator setInterruptible:YES];

        _normalTransform = CGAffineTransformMakeRotation(0.0);
        _cellWobbeling = NO;
        isWobbeling = NO;
        delay = 0.0;
        _stopByUser = NO;
        _doesWobblesLeft = wobblesLeft;
        wobblesLeft = !wobblesLeft;
        _rotation = (kGridLauncherViewWobbleRadians * M_PI) / 180.0;
        _wobbleLeft = CGAffineTransformMakeRotation(_rotation);
        _wobbleRight = CGAffineTransformMakeRotation(-_rotation);
        if (_doesWobblesLeft){
            _moveTransform = CGAffineTransformTranslate(_wobbleLeft, -1, -1);
            _conCatTransform = CGAffineTransformConcat(_wobbleLeft, _moveTransform);
            _startTransform = _wobbleRight;

        }
        else {
            _moveTransform = CGAffineTransformTranslate(_wobbleRight, -1, -1);
            _conCatTransform = CGAffineTransformConcat(_wobbleRight, _moveTransform);
            _startTransform = _wobbleLeft;
        }
    }
    return self;
}

- (void)dealloc {
    _playerViewAnimator = nil;
    _cellWobbeling = NO;
    isWobbeling = NO;
    _stopByUser = NO;
    _doesWobblesLeft = wobblesLeft;
    wobblesLeft = !wobblesLeft;
    [super dealloc];
}


- (void)stopWobbleUser
{
    [[self contentView].subviews.firstObject.layer removeAllAnimations];
    [self contentView].subviews.firstObject.transform = _normalTransform;

    
    _stopByUser = NO;
    isWobbeling = NO;
    _cellWobbeling = NO;
}


- (void)stopWobble
{
    delay = 0.0;
    
    [[self contentView].subviews.firstObject.layer removeAllAnimations];
    [self contentView].subviews.firstObject.transform = _normalTransform;
    
    _stopByUser = NO;
    isWobbeling = NO;
    _cellWobbeling = NO;
}



- (void)wobble
{
    
    
    if ( [(BMDragCellCollectionView *)[self superview] isEditMode] == YES){
        if (!_cellWobbeling && !wobbleEnabled){
            wobbleEnabled = YES;
        }

        
        if (_cellWobbeling == NO && wobbleEnabled){
            
            isWobbeling = YES;
            _cellWobbeling = YES;
            
           
            if (_doesWobblesLeft){
                _moveTransform = CGAffineTransformTranslate(_wobbleLeft, -1, -1);
                _conCatTransform = CGAffineTransformConcat(_wobbleLeft, _moveTransform);
                _startTransform = _wobbleRight;

            }
            else {
                _moveTransform = CGAffineTransformTranslate(_wobbleRight, -1, -1);
                _conCatTransform = CGAffineTransformConcat(_wobbleRight, _moveTransform);
                _startTransform = _wobbleLeft;
            }
            [self contentView].subviews.firstObject.transform = _startTransform;

            
           
                [UIView animateWithDuration:0.3
                      delay:0
                      options:UIViewAnimationOptionAutoreverse | UIViewAnimationOptionRepeat| UIViewAnimationOptionAllowUserInteraction
                      animations:^{
                    [self contentView].subviews.firstObject.transform = _conCatTransform;
                      }
                      completion:^(BOOL finished) {

                }];
            
        }
    }
}


- (void)fadeIn
{
    if ([self contentView].alpha < 1.0){
        [UIView animateWithDuration:0.5
                  delay: 0.0
                  options: UIViewAnimationOptionCurveEaseInOut
                  animations:^{
                    [self contentView].alpha = 1.0;
        } completion:nil];
    }
}

- (void)hide
{
    [self contentView].alpha = 0.0;
    self.hidden = YES;
}

- (void)stopWobbleHide
{
    delay = 0.0;
    
    [[self contentView].subviews.firstObject.layer removeAllAnimations];
    [self contentView].subviews.firstObject.transform = _normalTransform;
    
    _stopByUser = NO;
    isWobbeling = NO;
    _cellWobbeling = NO;
    [self contentView].alpha = 0.0;
    self.hidden = YES;

}




@end
