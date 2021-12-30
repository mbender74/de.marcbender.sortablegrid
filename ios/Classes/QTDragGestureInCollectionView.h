//
//  QTDragGestureInCollectionView.h
//  QTTourAppStore
//
//  Created by yxl on 2018/5/7.
//  Copyright © 2018年 Markphone Culture Media Co.Ltd. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface QTDragGestureInCollectionView : NSObject
-(void)bindLongPressGestureToCollectionView:(UICollectionView*)collectionView dataSource:(NSMutableArray*)dataSource;
@end
