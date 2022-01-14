/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
#import <TitaniumKit/TiViewProxy.h>
#import <TitaniumKit/TiUtils.h>
#import <TitaniumKit/TiProxy.h>

@interface DeMarcbenderSortablegridViewProxy : TiViewProxy  <TiProxyObserver> {
    UIImage *closeButtonImage;
    UIImage *badgeImage;
    BOOL canDelete;
    int verticalSpacing;
}
- (UIImage *)deleteButtonImage;
- (int)verticalSpacing;
- (id)currentPage;
- (id)pageCount;
- (void)deleteItemAtIndex:(id)args;
- (void)insertItemAtIndex:(id)args;
- (void)scrollToItemAtIndex:(id)args;
- (void)setContentInsets:(id)args;
@end

