/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
#import "TiUIViewProxy.h"
#import <TitaniumKit/TiViewProxy.h>

@interface DeMarcbenderSortablegridViewProxy : TiUIViewProxy {
    UIImage *closeButtonImage;
    UIImage *badgeImage;
    BOOL canDelete;
    NSInteger columnWidth;
    int verticalSpacing;

}
- (UIImage *)deleteButtonImage;
- (UIImage *)badgeViewImage;
- (NSInteger)columnWidth;
- (int)verticalSpacing;
- (id)currentPage;
- (id)pageCount;
- (void)deleteItemAtIndex:(id)args;
- (void)insertItemAtIndex:(id)args;

@end

