//
//  QTDragGestureInCollectionView.m
//  QTTourAppStore
//
//  Created by yxl on 2018/5/7.
//  Copyright © 2018年 Markphone Culture Media Co.Ltd. All rights reserved.
//

#import "QTDragGestureInCollectionView.h"

@implementation QTDragGestureInCollectionView
{
    NSIndexPath* _sourceIndexPath;
    UIView* _snapshot;
    UICollectionView* _collectionView;
    NSMutableArray* _dataSource;
}

-(instancetype)init{
    if(self=[super init]){
        _dataSource=[NSMutableArray array];
    }
    
    return self;
}

-(void)bindLongPressGestureToCollectionView:(UICollectionView*)collectionView dataSource:(NSMutableArray*)dataSource{
    if(![collectionView isKindOfClass:[UICollectionView class]])
        return;
    if(![dataSource isKindOfClass:[NSMutableArray class]])
        return;
    UILongPressGestureRecognizer* pressGesture=[[UILongPressGestureRecognizer alloc]initWithTarget:self action:@selector(longPressHandler:)];
    pressGesture.minimumPressDuration=0.2;
    _collectionView=collectionView;
    _dataSource=dataSource;
    [_collectionView addGestureRecognizer:pressGesture];
}

-(void)longPressHandler:(UILongPressGestureRecognizer*)sender{
    switch (sender.state) {
        case UIGestureRecognizerStateBegan:
            [self handlePressBegan:sender];
            break;
            
        case UIGestureRecognizerStateChanged:
            [self handlePressChanged:sender];
            break;
        case UIGestureRecognizerStateCancelled:
            [self handlePressEnded:sender];
            break;
        case UIGestureRecognizerStateEnded:
            [self handlePressEnded:sender];
            break;
        default:
            break;
    }
}

-(void)handlePressBegan:(UILongPressGestureRecognizer*)PressGesture{
    //手势识别开始阶段获取对应的触碰位置.
    CGPoint location=[PressGesture locationInView:_collectionView];
    NSIndexPath* indexPath=[_collectionView indexPathForItemAtPoint:location];
    
    //判断触碰位置是否为tableview的某一行
    if(indexPath){
        //_sourceIndexPath为属性变量用于保存初始被移动的cell的位置。
        _sourceIndexPath=indexPath;
        //获取cell
        UICollectionViewCell* cell=[_collectionView cellForItemAtIndexPath:indexPath];
        //对cell进行截图并保存到属性变量
        _snapshot=[cell resizableSnapshotViewFromRect:CGRectMake(0, 0, cell.frame.size.width, cell.frame.size.height) afterScreenUpdates:NO withCapInsets:UIEdgeInsetsZero];
        //得到初始位置的cell的中心。然后隐藏cell，并将截图放到cell对应的位置，用此截图来假装一个cell来拖动。
        CGPoint center=cell.center;
        [_collectionView addSubview:_snapshot];
        center.y=location.y;
        _snapshot.center=center;
        _snapshot.transform=CGAffineTransformMakeScale(1, 1);
        _snapshot.alpha=1;
        _snapshot.backgroundColor=cell.backgroundColor;
        cell.backgroundColor=[UIColor clearColor];
        cell.hidden=true;
        
    }
}

-(void)handlePressChanged:(UILongPressGestureRecognizer*)PressGesture{
    //当手势改变的时候，获取所处的位置，然后一步步交换截图以及对应的cell和相对应的数据。
    CGPoint location=[PressGesture locationInView:_collectionView];
    NSIndexPath* indexPath=[_collectionView indexPathForItemAtPoint:location];
    CGPoint center=_snapshot.center;
    center.y=location.y;
    center.x=location.x;
    _snapshot.center=center;
    
    if(indexPath&&![indexPath isEqual:_sourceIndexPath]){
        //这里的_dataSource对应着数据模型数组
        id modelToMove=_dataSource[_sourceIndexPath.row];
        [_dataSource removeObjectAtIndex:_sourceIndexPath.row];
        [_dataSource insertObject:modelToMove atIndex:indexPath.row];
        [_collectionView moveItemAtIndexPath:_sourceIndexPath toIndexPath:indexPath];
        _sourceIndexPath=indexPath;
    }
}

-(void)handlePressEnded:(UILongPressGestureRecognizer*)PressGesture{
    UICollectionViewCell* cell=[_collectionView cellForItemAtIndexPath:_sourceIndexPath];
    //手势结束以后，将截图置为nil，将原来的cell展示出来。
    [UIView animateWithDuration:0.25 animations:^{
        _snapshot.center=cell.center;
        _snapshot.transform=CGAffineTransformIdentity;
        _snapshot.alpha=0;
        cell.backgroundColor=_snapshot.backgroundColor;
        cell.hidden=false;
    } completion:^(BOOL finished) {
        [_snapshot removeFromSuperview];
        _snapshot=nil;
    }];
    _sourceIndexPath=nil;
}

@end
