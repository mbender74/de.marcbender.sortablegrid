//
//  LNWaterfallFlowLayout.m
//  WaterfallFlowDemo
//
//  Created by echo on 09/08/2016.
//  Copyright (c) 2016 echo. All rights reserved.
//

#import "XHWaterfallFlowLayout.h"
#import "TiBase.h"

#define PADDING 0

@interface XHWaterfallFlowLayout ()

@property (nonatomic, strong) NSArray *layoutAttributesArray;
@property (nonatomic, assign) CGFloat contentHeight;
@property (nonatomic, assign) CGFloat contentWidth;
@property (nonatomic, assign) CGFloat pagesCount;
@property (nonatomic, assign) BOOL initDone;

@property (nonatomic, assign) NSUInteger itemsInPage;

@property (nonatomic, strong) UICollectionViewLayoutAttributes *headerAttr;
@property (nonatomic, strong) UICollectionViewLayoutAttributes *footerAttr;

@end

@implementation XHWaterfallFlowLayout


- (instancetype)init
{
    self = [super init];
    if (self) {
        self.sectionInset = UIEdgeInsetsMake(PADDING, PADDING, PADDING, PADDING);
        self.pagesCount = 1;
        self.itemsInPage = 0;
        self.rowCount = 0;
        self.initDone = NO;
   }
    return self;
}

- (void)setMinLineSpacing:(CGFloat)minimumLineSpacing {
    self.minimumLineSpacing = 0;
    topInset = (minimumLineSpacing/2);
    //[self invalidateLayout];
}

- (void)setMinInteritemSpacing:(CGFloat)minimumInteritemSpacing {
   // self.minimumInteritemSpacing = (minimumInteritemSpacing/2);
    minHorizontal = (minimumInteritemSpacing/2);
    //self.minimumInteritemSpacing = 0;
    //[self invalidateLayout];
}

-(void)setDirection:(ScrollDirection)direction
{
    scrolldirection = direction;
    if (direction == mkScrollVertical) {
        self.scrollDirection = UICollectionViewScrollDirectionVertical;
    }
    else {
        self.scrollDirection = UICollectionViewScrollDirectionHorizontal;
    }
   // [self invalidateLayout];
  //  NSLog(@"[WARN] setDirection ");

}

- (void)doPrepareLayout {

    self.initDone = YES;
    [self prepareLayout];
}


- (void)prepareLayout {
    
    
    // NSLog(@"[INFO] item %i: ",(int)index + 1);

    if (!self.initDone){
        return;
    }
    
    [super prepareLayout];


    CGFloat contentWidth = self.collectionView.frame.size.width - self.collectionView.contentInset.left - self.collectionView.contentInset.right;
    
    maxHeight = self.collectionView.bounds.size.height - self.collectionView.contentInset.top - self.collectionView.contentInset.bottom - self.minimumLineSpacing;

    CGFloat itemwidth;
    
    
    /*
    
    if (scrolldirection == mkScrollVertical && self.showDeleteButton == NO){
        itemwidth = (contentWidth - ((minHorizontal) * (CGFloat)(self.columnCount - 1))) / (CGFloat)self.columnCount;
    }
    else {
        itemwidth = (contentWidth - ( (minHorizontal/2) * (CGFloat)(self.columnCount - 1))) / (CGFloat)self.columnCount;
    }
    
    if (scrolldirection == mkScrollHorizontal && self.showDeleteButton == NO){
        itemwidth = (contentWidth - ( (minHorizontal/2) * (CGFloat)(self.columnCount - 1))) / (CGFloat)self.columnCount;
    }
    else {
        itemwidth = (contentWidth - ( (minHorizontal/2) * (CGFloat)(self.columnCount - 1))) / (CGFloat)self.columnCount;
    }

    */

    itemwidth = ((contentWidth) - (self.minimumInteritemSpacing * (CGFloat)(self.columnCount - 1))) / (CGFloat)self.columnCount;
    
   // TiThreadPerformOnMainThread(^{
        [self computeAttributesWithItemWidth:itemwidth];
   // },YES);

}

- (void)computeAttributesWithItemWidth:(CGFloat)itemWidth {
    
  //  NSLog(@"[WARN] in computeAttributesWithItemWidth");

    
    self.pagesCount = 1;
    self.contentWidth = 0;
    self.contentHeight = 0;

    if (self.showDeleteButton == NO){
        topInset = self.sectionInset.top;
    }
    
    columnHeight = (CGFloat *) malloc(self.columnCount * sizeof(CGFloat));
    columnItemCount = (NSInteger *) malloc(self.columnCount * sizeof(NSInteger));
    
    for (int i = 0; i < self.columnCount; i++) {
        columnHeight[i] = 0;
        columnItemCount[i] = 0;
    }
    
    NSUInteger count = [self.collectionView numberOfItemsInSection:0];
    NSMutableArray *attributesArray = [NSMutableArray arrayWithCapacity:count];
   
    for (NSUInteger index = 0; index < count; index++) {
       
        NSIndexPath *indexPath = [NSIndexPath indexPathForItem:index inSection:0];
        UICollectionViewLayoutAttributes *attributes = [UICollectionViewLayoutAttributes layoutAttributesForCellWithIndexPath:indexPath];
        
        if (scrolldirection == mkScrollVertical) {
            column = [self shortestColumn:columnHeight];
            if (self.showDeleteButton == NO){
                itemX = self.contentWidth + (itemWidth + (self.minimumInteritemSpacing)) * column;
            }
            else {
                itemX = self.contentWidth + (itemWidth + (self.minimumInteritemSpacing)) * column;
            }

        }
        else {
            column = [self shortestColumnHorizontal:columnHeight];

            if (self.showDeleteButton == NO){
                itemX = roundf(self.contentWidth + (itemWidth+(self.minimumInteritemSpacing)) * column);
            }
            else {
                itemX = roundf(self.contentWidth + (itemWidth+(self.minimumInteritemSpacing)) * column);
            }
        }
        itemY = columnHeight[column];
      //  NSLog(@" ");

        
        
        CGFloat itemH = [self.sDelegate getHeightExceptImageAtIndex:[NSIndexPath indexPathForItem:index inSection:0]];


        
        if (scrolldirection == mkScrollVertical) {
            columnItemCount[column]++;

           // columnHeight[column] += (itemH + self.minimumLineSpacing);

            columnHeight[column] += (itemH + self.minimumLineSpacing);

            
          //  NSLog(@"[WARN] computeAttributesWithItemWidth vertical: ");

            
            if (columnHeight[column] > self.contentHeight)
            {
                self.contentHeight = columnHeight[column];

            }

            

            
            
            //  NSLog(@"[INFO] contentHeight  %f: ",self.contentHeight);

        }
        else {

            if ((columnHeight[column]+(itemH)) > maxHeight){
                
             //   NSLog(@"[WARN] computeAttributesWithItemWidth Horizontal GREATER %f  %f: ",columnHeight[column]+(itemH + self.minimumLineSpacing), self.contentHeight);
                NSInteger newcolumn = [self shortestColumnThatFitsPage:columnHeight withPageHeight:maxHeight withItemHeight:(itemH)];
                
               // NSLog(@"[WARN] newcolumn: %i ",(int)newcolumn);

                
                
                if (newcolumn > self.columnCount) {
                  //  NSLog(@"[WARN] all columns height greater than page height: ");
                    
                    self.contentWidth = self.contentWidth + (self.collectionView.frame.size.width);
                    
                    self.pagesCount = self.pagesCount + 1;

                    columnHeight = (CGFloat *) malloc(self.columnCount * sizeof(CGFloat));
                    columnItemCount = (NSInteger *) malloc(self.columnCount * sizeof(NSInteger));

                    for (int k = 0; k < self.columnCount; k++) {
                        columnHeight[k] = 0;
                        columnItemCount[k] = 0;
                    }
                    column = [self shortestColumnHorizontal:columnHeight];
                    columnItemCount[column]++;

                                        
                    itemX = roundf(self.contentWidth + (itemWidth +(self.minimumInteritemSpacing)) * column);

                    
                    itemY = columnHeight[column];

                    
                    columnHeight[column] += (itemH + self.minimumLineSpacing);
                  //  NSLog(@"[WARN] AFTER all columns computeAttributesWithItemWidth Horizontal %f  %f: ",columnHeight[column], self.contentHeight);

                }
                else {
                  //  NSLog(@"[WARN] ELSE found fitting newcolumn %i: ",(int)newcolumn);

                    column = newcolumn;
                    columnItemCount[column]++;

                    itemX = roundf(self.contentWidth + (itemWidth +(self.minimumInteritemSpacing)) * column);
                    itemY = columnHeight[column];

                    
                    columnHeight[column] += (itemH + self.minimumLineSpacing);
                   // NSLog(@"[WARN] AFTER fitting computeAttributesWithItemWidth Horizontal %f  %f: ",columnHeight[column], self.contentHeight);

                }
                


            
            }
            else {
                columnItemCount[column]++;

                columnHeight[column] += (itemH + self.minimumLineSpacing);

               // NSLog(@"[WARN] computeAttributesWithItemWidth Horizontal %f  %f: ",columnHeight[column], self.contentHeight);
              //  NSLog(@"[WARN] sizeForItemAtIndexPath %i: ",(int)index);
            }
            
        }
        attributes.frame = CGRectMake(itemX, itemY, itemWidth, itemH);
        [attributesArray addObject:attributes];

    }
    
    
    if (scrolldirection == mkScrollVertical) {
        self.pagesCount = ceil(self.contentHeight / self.collectionView.frame.size.height);
    }

    
        
    self.layoutAttributesArray = attributesArray.copy;
   // NSLog(@" ");
 //   NSLog(@"[WARN] computeAttributesWithItemWidth DONE");


}

/**
 *  找出columnHeight数组中最短列号 追加数据的时候追加在最短列中
 */
- (NSInteger)shortestColumn:(CGFloat *)columnHeight {
    
    CGFloat max = CGFLOAT_MAX;
    NSInteger column = 0;
    for (int i = 0; i < self.columnCount; i++) {
        if (columnHeight[i] < max) {
            max = columnHeight[i];
            column = i;
        }
    }
    return column;
}

- (NSInteger)shortestColumnHorizontal:(CGFloat *)columnHeight {
    
    CGFloat max = maxHeight;
    NSInteger column = 0;
    for (int i = 0; i < self.columnCount; i++) {
        if (columnHeight[i] < max) {
            return i;
        }
        else {
            max = columnHeight[i];
            column = i;
        }
    }
    return column;
}




- (NSInteger)shortestColumnThatFitsPage:(CGFloat *)columnHeight withPageHeight:(CGFloat )pageHeight withItemHeight:(CGFloat)itemHeight {
    
    CGFloat max = pageHeight;
    NSInteger column = 99;
    for (int i = 0; i < self.columnCount; i++) {
        if (columnHeight[i]+itemHeight < max) {
            return i;
        }
    }
    return column;
}




/**
 *  找出columnHeight数组中最高列号
 */
- (NSInteger)highestColumn:(CGFloat *)columnHeight {
    CGFloat min = 0;
    NSInteger column = 0;
    for (int i = 0; i < self.columnCount; i++) {
        if (columnHeight[i] > min) {
            min = columnHeight[i];
            column = i;
        }
    }
    return column;
}


- (NSArray *)layoutAttributesForElementsInRect:(CGRect)rect {
   // NSLog(@"[WARN] layoutAttributesForElementsInRect");
    if (!self.layoutAttributesArray) {
        self.layoutAttributesArray = [super layoutAttributesForElementsInRect:rect];
    }
    
    
    [self.collectionView setCollectionViewLayout:self.collectionView.collectionViewLayout animated:NO];

    
//    [self.collectionView reloadItemsAtIndexPaths:[self.collectionView indexPathsForVisibleItems]];
    return self.layoutAttributesArray;
}



- (CGSize)collectionViewContentSize
{
    
   
    [super collectionViewContentSize];

    if (scrolldirection == mkScrollVertical) {
        CGFloat contentHeight = (self.pagesCount * (self.collectionView.frame.size.height))-self.collectionView.contentInset.top-self.collectionView.contentInset.bottom;
        if (contentHeight <= CGRectGetHeight(self.collectionView.frame)) {
            contentHeight = CGRectGetHeight(self.collectionView.frame) + 1;
        }
        return CGSizeMake((self.collectionView.frame.size.width)-self.collectionView.contentInset.left-self.collectionView.contentInset.right, contentHeight);
    }
    else {

        CGFloat contentWidth = (self.pagesCount * (self.collectionView.frame.size.width))-self.collectionView.contentInset.left-self.collectionView.contentInset.right;
        return CGSizeMake(contentWidth, self.collectionView.frame.size.height-self.collectionView.contentInset.top-self.collectionView.contentInset.bottom);
    }
    
}


@end
