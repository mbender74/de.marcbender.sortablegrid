/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "DeMarcbenderSortablegridViewProxy.h"
#import "DeMarcbenderSortablegridView.h"
#import "DeMarcbenderSortablegridItemViewProxy.h"
#import <TitaniumKit/TiUtils.h>
#import <TitaniumKit/TiProxy.h>


@implementation DeMarcbenderSortablegridViewProxy

- (void)windowDidOpen
{
  [super windowDidOpen];
  [self reposition];
    
    //NSLog(@"[WARN] in windowDidOpen");
    [(DeMarcbenderSortablegridView *)[self view] initData];
}


- (id)init
{
  if (self = [super init]) {
    [self setValue:[NSNumber numberWithBool:YES] forUndefinedKey:@"editable"];
    canDelete = NO;
    verticalSpacing = 0;
  }
  return self;
}

- (NSString *)apiName
{
  return @"de.marcbender.sortablegridView";
}

- (void)startEditing:(id)args
{
  [self makeViewPerformSelector:@selector(startEditing) withObject:nil createIfNeeded:YES waitUntilDone:NO];
}

- (void)stopEditing:(id)args
{
  [self makeViewPerformSelector:@selector(stopEditing) withObject:nil createIfNeeded:YES waitUntilDone:NO];
}

- (void)initData:(id)args
{
  [self makeViewPerformSelector:@selector(initData) withObject:nil createIfNeeded:YES waitUntilDone:NO];
}



- (void)setDeleteButtonImage:(id)value
{
  closeButtonImage = [TiUtils image:value proxy:self];
}

- (UIImage *)deleteButtonImage
{
    if (closeButtonImage != nil){
        return closeButtonImage;
    }
    else {
        return nil;
    }
}

- (UIImage *)badgeViewImage
{
    if (badgeImage != nil){
        return badgeImage;
    }
    else {
        return nil;
    }
}


- (void)setBadgeViewImage:(id)value
{
  badgeImage = [TiUtils image:value proxy:self];
}


- (void)setColumnWidth:(id)value
{
  columnWidth = [TiUtils intValue:value];
 // [[self ensureItem] setCanDelete:canDelete];
}
- (NSInteger)columnWidth
{
    return columnWidth;
}


- (id)setCurrentPage:(id)value
{
    [(DeMarcbenderSortablegridView *)[self view] setCurrentPageOfLauncher:[TiUtils intValue:value]];
}

- (id)currentPage
{
    return [(DeMarcbenderSortablegridView *)[self view] currentPageOfLauncher];
}

- (id)pageCount
{
    return [(DeMarcbenderSortablegridView *)[self view] pagesCount];
}


- (void)setVerticalSpacing:(id)value
{
    verticalSpacing = [TiUtils intValue:value];
}
- (int)verticalSpacing
{
    return verticalSpacing;
}

#pragma mark Public Methods


- (void)insertItemAtIndex:(id)args
{
    ENSURE_SINGLE_ARG_OR_NIL(args, NSDictionary);
    
    [(DeMarcbenderSortablegridView *)[self view] addItem:[args valueForKey:@"item"] atIndex:[TiUtils intValue:@"index" properties:args]];
}



- (void)deleteItemAtIndex:(id)args
{
    ENSURE_SINGLE_ARG_OR_NIL(args, NSDictionary);

    
    //NSLog(@"[INFO] deleteItemInData %i ",[TiUtils intValue:@"index" properties:args]);

    
    [(DeMarcbenderSortablegridView *)[self view] deleteItemAtIndex:[TiUtils intValue:@"index" properties:args]];
}




@end

