//
//  BMDragCollectionViewCell.h
//  BMDragCellCollectionViewDemo
//
//  Created by __liangdahong on 2017/7/17.
//  Copyright © 2017年 http://idhong.com. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DeMarcbenderSortablegridView.h"
#import <TitaniumKit/TiUtils.h>
#import "BMDragCellCollectionView.h"

@interface BMDragCollectionViewCell : UICollectionViewCell {
    BOOL isWobbeling;
    CGFloat delay;
}
@property (nonatomic, assign) NSInteger columnCount;
@property (nonatomic, assign) BOOL cellWobbeling;
@property (nonatomic, assign) BOOL stopByUser;
@property (nonatomic, assign) BOOL canBeDeleted;
@property (nonatomic, assign) BOOL canBeMoved;

@property (nonatomic, assign) BOOL doesWobblesLeft;
@property (nonatomic, assign) NSInteger cellId;
@property (nonatomic, assign) UIViewPropertyAnimator *playerViewAnimator;

@property (nonatomic, assign) CGFloat rotation;
@property (nonatomic, assign) CGAffineTransform wobbleLeft;
@property (nonatomic, assign) CGAffineTransform wobbleRight;
@property (nonatomic, assign) CGAffineTransform moveTransform;
@property (nonatomic, assign) CGAffineTransform conCatTransform;
@property (nonatomic, assign) CGAffineTransform startTransform;
@property (nonatomic, assign) CGAffineTransform normalTransform;


- (void)stopWobble;
- (void)wobble;
- (void)stopWobbleUser;
- (void)fadeIn;
- (void)stopWobbleHide;
- (void)hide;


@end
