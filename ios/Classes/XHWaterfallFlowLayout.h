//
//  LNWaterfallFlowLayout.h
//  WaterfallFlowDemo
//
//  Created by echo on 09/08/2016.
//  Copyright (c) 2016 echo. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "BMDragCellCollectionView.h"

@protocol XHWaterfallFlowLayoutDelegate <NSObject>

@optional
- (CGFloat)getHeightExceptImageAtIndex:(NSIndexPath *)indexPath;
- (CGFloat)getImageRatioOfWidthAndHeight:(NSIndexPath *)indexPath;
- (UICollectionViewCell *)getCellAtIndex:(NSIndexPath *)indexPath;

@end


typedef enum {
    mkScrollHorizontal,
    mkScrollVertical
} ScrollDirection;


@interface XHWaterfallFlowLayout : UICollectionViewFlowLayout {
    CGFloat *columnHeight;
    NSInteger *columnItemCount;
    CGFloat maxHeight;
    CGFloat minHorizontal;
    CGFloat minVertical;
    NSInteger column;
    NSInteger row;
    CGFloat itemX;
    CGFloat itemY;
    CGFloat topInset;
    ScrollDirection scrolldirection;
}

- (void)doPrepareLayout;

@property (nonatomic, weak) id<XHWaterfallFlowLayoutDelegate> sDelegate;
@property (nonatomic, assign) BOOL showDeleteButton;
@property (nonatomic, assign) NSInteger columnCount;
@property (nonatomic, assign) NSInteger rowCount;
@property (nonatomic, assign) ScrollDirection direction;
@property (nonatomic, assign) CGFloat minInteritemSpacing;
@property (nonatomic, assign) CGFloat minLineSpacing;
@property (nonatomic, assign) BMDragCellCollectionView *dragCollectionView;

@end
