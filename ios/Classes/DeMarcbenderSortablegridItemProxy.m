/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "DeMarcbenderSortablegridItemProxy.h"
#import <TitaniumKit/TiUtils.h>
#import <TitaniumKit/TiViewProxy.h>
#import "ImageLoader.h"
#import "Ti2DMatrix.h"
#import "Ti3DMatrix.h"
#import "TiBlob.h"
#import "TiColor.h"
#import "TiRect.h"
#import "UIImage+Resize.h"

@implementation DeMarcbenderSortablegridItemProxy

@synthesize item;

- (void)_destroy
{
  item.userData = nil;
  item.view = nil;
  RELEASE_TO_NIL(item);
  [super _destroy];
}

- (void)dealloc
{
  item.userData = nil;
  item.button = nil;
  item.view = nil;
  RELEASE_TO_NIL(item);
  [super dealloc];
}

- (NSString *)apiName
{
  return @"de.marcbender.sortablegridItem";
}


- (void)setItem:(GridLauncherItem *)item_
{
  if (item != nil) {
    item.userData = nil;
    item.view = nil;
    RELEASE_TO_NIL(item);
  }
  item = [item_ retain];
  item.userData = self;
}

- (GridLauncherItem *)ensureItem
{
  if (item == nil) {
    item = [[GridLauncherItem alloc] init];
    //  CGRect myFrame = CGRectMake(CGFloat x, <#CGFloat y#>, <#CGFloat width#>, <#CGFloat height#>);
      
      CGFloat width = [self autoWidthForSize:CGSizeMake(1000, 1000)];
      CGFloat height = [self autoHeightForSize:CGSizeMake(width, 0)];
      CGRect myFrame = CGRectMake( 0 , 0, width, height);
      
      item.view.frame = myFrame;
    item.userData = self;
  }
  return item;
}

- (void)setDeleteButtonImage:(id)value
{
  UIImage *image = [TiUtils image:value proxy:self];

  [[self ensureItem] setCloseButtonImage:image];
}


- (void)setBadgeViewImage:(id)value
{
  UIImage *image = [TiUtils image:value proxy:self];

  [[self ensureItem] setBadgeViewImage:image];
}



- (void)setBadge:(id)value
{
  NSInteger badgeValue = [TiUtils intValue:value];
  [[self ensureItem] setBadgeValue:badgeValue];
}

- (void)setTitle:(id)value
{
  NSString *badgeValue = [TiUtils stringValue:value];
  [[self ensureItem] setTitle:badgeValue];
}

- (void)setItemView:(id)value
{
  TiViewProxy *viewProxy = value;
  UIView *itemView = viewProxy.view;
  [[self ensureItem] setItemView:itemView];
}

- (void)setSelectedImage:(id)value
{
  UIImage *image = [TiUtils image:value proxy:self];
  [[self ensureItem] setSelectedImage:image];
}

- (void)setCanDelete:(id)value
{
  BOOL canDelete = [TiUtils boolValue:value];
  [[self ensureItem] setCanDelete:canDelete];
}

#pragma mark internal

- (void)add:(id)child
{
  [super add:child];

  // called when we have a child, which means we want to use ourself
  // as the view

  // TODO: This isn't entirely accurate... doing this may cause the view to be set twice
  // because -[TiViewProxy add:] could exit early if it's not on the main thread.
  // On the other hand, blocking this to execute on the main thread only doesn't appear to work right.

  TiThreadPerformOnMainThread(
      ^{
        GridLauncherItem *item_ = [self ensureItem];
        if (item_.view == nil) {
          [item_ setView:[self view]];
        }
      },
      NO);
}

@end

