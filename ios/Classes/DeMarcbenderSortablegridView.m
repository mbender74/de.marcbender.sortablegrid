/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "DeMarcbenderSortablegridView.h"
#import "GridLauncherButton.h"
#import "GridLauncherItem.h"
#import "GridLauncherView.h"
#import "DeMarcbenderSortablegridItemProxy.h"
#import "DeMarcbenderSortablegridViewProxy.h"
#import <TitaniumKit/TiRect.h>
#import <TitaniumKit/TiUtils.h>
#import <TitaniumKit/TiDimension.h>

static const NSInteger kGridDashboardViewDefaultRowCount = 3;
static const NSInteger kGridDashboardViewDefaultColumnCount = 3;

@implementation DeMarcbenderSortablegridView

- (void)dealloc
{
  launcher.delegate = nil;
  if (launcher.editing) {
    [launcher endEditing];
  }
  RELEASE_TO_NIL(launcher);
  [super dealloc];
}

- (GridLauncherView *)launcher
{
  if (launcher == nil) {
    int rowCount = [TiUtils intValue:[self.proxy valueForKey:@"rowCount"] def:kGridDashboardViewDefaultRowCount];
    int columnCount = [TiUtils intValue:[self.proxy valueForKey:@"columnCount"] def:kGridDashboardViewDefaultColumnCount];
      
//      if ([[self proxy] valueForKey:@"scrollType"]){
//          if([ [[[self proxy] valueForKey:@"scrollType"] stringValue] isEqualToString:@"vertical"]){
//              NSMutableArray *itemList = [[self proxy] valueForKey:@"data"];
//              NSInteger itemCount = [itemList count];
//              rowCount = (int)itemCount / columnCount;
//              [[self proxy] replaceValue:[NSNumber numberWithInt:rowCount] forKey:@"rowCount" notification:NO];
//
//          }
//      }
      
    launcher = [[GridLauncherView alloc] initWithFrame:CGRectMake(0, 0, 320, 400)
                                      withRowCount:rowCount
                                   withColumnCount:columnCount withProxy:[self proxy]];
    launcher.delegate = self;
    [launcher setEditable:[[[self proxy] valueForUndefinedKey:@"editable"] boolValue]];
    [launcher setPagerEnabled:[[[self proxy] valueForUndefinedKey:@"pagerEnabled"] boolValue]];

    [self addSubview:launcher];
  }
  return launcher;
}

- (id)accessibilityElement
{
  return [self launcher];
}

- (void)frameSizeChanged:(CGRect)frame bounds:(CGRect)bounds
{
  if (!CGRectIsEmpty(bounds)) {
    [TiUtils setView:launcher positionRect:bounds];
    [launcher layoutButtons];
  }
  [super frameSizeChanged:frame bounds:bounds];
}

- (void)setContentSize_:(id)args
{
  ENSURE_SINGLE_ARG_OR_NIL(args, NSDictionary);
  CGFloat height;
  CGFloat width;
  if ([args valueForKey:@"height"]){
      height = [TiUtils dimensionValue:[args valueForKey:@"height"]].value;
  }
  else {
      height = self.bounds.size.height;
  }
  if ([args valueForKey:@"width"]){
      width = [TiUtils dimensionValue:[args valueForKey:@"width"]].value;
  }
  else {
      width = self.bounds.size.width;
  }
  CGSize newSize = CGSizeMake(width, height);

  if (launcher != nil) {
    [launcher setContentSize:newSize];
  }
}

- (void)setPagingEnabled_:(id)args
{
  ENSURE_TYPE(args, NSNumber);

  if (launcher != nil) {
    [launcher setPagingEnabled:[args boolValue]];
    [launcher scrollView].pagingEnabled = YES;
  }
  [[self proxy] replaceValue:args forKey:@"pagingEnabled" notification:NO];
}

- (void)setScrollType_:(id)args
{
  ENSURE_TYPE(args, NSString);

  if (launcher != nil) {
    [launcher setScrollType:[args stringValue]];
  }
  [[self proxy] replaceValue:args forKey:@"scrollType" notification:NO];
}




- (void)setPagerEnabled_:(id)args
{
  ENSURE_TYPE(args, NSNumber);

  if (launcher != nil) {
    [launcher setPagerEnabled:[args boolValue]];
    [launcher pager].hidden = [args boolValue];
  }
  [[self proxy] replaceValue:args forKey:@"pagerEnabled" notification:NO];
}


- (void)setShowHorizontalScrollIndicator_:(id)args
{
  ENSURE_TYPE(args, NSNumber);

  if (launcher != nil) {
    [launcher setShowsHorizontalScrollIndicator:[args boolValue]];
    [launcher scrollView].showsHorizontalScrollIndicator = [args boolValue];
  }
  [[self proxy] replaceValue:args forKey:@"showHorizontalScrollIndicator" notification:NO];
}


- (void)setShowVerticalScrollIndicator_:(id)args
{
  ENSURE_TYPE(args, NSNumber);

  if (launcher != nil) {
    [launcher setShowsVerticalScrollIndicator:[args boolValue]];
    [launcher scrollView].showsVerticalScrollIndicator = [args boolValue];
  }
  [[self proxy] replaceValue:args forKey:@"showVerticalScrollIndicator" notification:NO];
}


- (void)setEditable_:(id)args
{
  ENSURE_TYPE(args, NSNumber);

  if (launcher != nil) {
    [launcher setEditable:[args boolValue]];
  }
  [[self proxy] replaceValue:args forKey:@"editable" notification:NO];
}

- (void)setViewData_:(id)args
{
  [self launcher];

  NSArray *items = [launcher launcheritems_];
  for (GridLauncherItem *item in items) {
    [launcher removeItem:item animated:NO];
  }

  for (DeMarcbenderSortablegridItemProxy *proxy in args) {
      [proxy windowWillOpen];
      [proxy reposition];
      [proxy layoutChildrenIfNeeded];
      
      if ([(DeMarcbenderSortablegridViewProxy*)[self proxy] deleteButtonImage]!=nil){
          [proxy.item setCloseButtonImage:[(DeMarcbenderSortablegridViewProxy*)[self proxy] deleteButtonImage]];
      }
      
      if ([(DeMarcbenderSortablegridViewProxy*)[self proxy] badgeViewImage]!=nil){
          [proxy.item setBadgeViewImage:[(DeMarcbenderSortablegridViewProxy*)[self proxy] badgeViewImage]];
      }

      [launcher addItem:proxy.item animated:NO];
  }
}

- (void)startEditing
{
  [launcher beginEditing];
}

- (void)stopEditing
{
  [launcher endEditing];
}

#pragma mark Delegates

- (void)launcherView:(GridLauncherView *)launcher didChangePage:(NSNumber *)pageNo;
{
  if ([self.proxy _hasListeners:@"pagechanged"]) {
    NSMutableDictionary *event = [NSMutableDictionary dictionary];
    [event setObject:pageNo forKey:@"pageNo"];
    [self.proxy fireEvent:@"pagechanged" withObject:event propagate:NO];
  }
}

- (void)launcherView:(GridLauncherView *)launcher didAddItem:(GridLauncherItem *)item
{
}

- (void)launcherView:(GridLauncherView *)launcher_ didRemoveItem:(GridLauncherItem *)item
{
  // update our data array
  [[self proxy] forgetProxy:item.userData];
  [self.proxy replaceValue:[launcher items] forKey:@"data" notification:NO];

  NSMutableDictionary *event = [NSMutableDictionary dictionary];
  [event setObject:item.userData forKey:@"item"];

  if ([self.proxy _hasListeners:@"delete"]) {
    [self.proxy fireEvent:@"delete" withObject:event];
  }
  if ([item.userData _hasListeners:@"delete"]) {
    [item.userData fireEvent:@"delete" withObject:event];
  }
}

- (void)launcherView:(GridLauncherView *)launcher_ willDragItem:(GridLauncherItem *)item
{
  NSMutableDictionary *event = [NSMutableDictionary dictionary];
  // the actual item being moved
  [event setObject:item.userData forKey:@"item"];

  if ([self.proxy _hasListeners:@"dragStart"]) { //TODO: Deprecate old event
    [self.proxy fireEvent:@"dragStart" withObject:event];
  }
  if ([item.userData _hasListeners:@"dragStart"]) { //TODO: Deprecate old event
    [item.userData fireEvent:@"dragStart" withObject:event];
  }
  if ([self.proxy _hasListeners:@"dragstart"]) {
    [self.proxy fireEvent:@"dragstart" withObject:event];
  }
  if ([item.userData _hasListeners:@"dragstart"]) {
    [item.userData fireEvent:@"dragstart" withObject:event];
  }
}

- (void)launcherView:(GridLauncherView *)launcher_ didDragItem:(GridLauncherItem *)item
{
  NSMutableDictionary *event = [NSMutableDictionary dictionary];
  // the actual item being moved
  [event setObject:item.userData forKey:@"item"];

  if ([self.proxy _hasListeners:@"dragEnd"]) { //TODO: Deprecate old event
    [self.proxy fireEvent:@"dragEnd" withObject:event];
  }
  if ([item.userData _hasListeners:@"dragEnd"]) { //TODO: Deprecate old event
    [item.userData fireEvent:@"dragEnd" withObject:event];
  }
  if ([self.proxy _hasListeners:@"dragend"]) {
    [self.proxy fireEvent:@"dragend" withObject:event];
  }
  if ([item.userData _hasListeners:@"dragend"]) {
    [item.userData fireEvent:@"dragend" withObject:event];
  }
}

- (void)launcherView:(GridLauncherView *)launcher_ didMoveItem:(GridLauncherItem *)item
{
  NSMutableDictionary *event = [NSMutableDictionary dictionary];
  // the actual item being moved
  [event setObject:item.userData forKey:@"item"];
  // the new (uncommitted) items in order
  [event setObject:[launcher items] forKey:@"items"];

  if ([self.proxy _hasListeners:@"move"]) {
    [self.proxy fireEvent:@"move" withObject:event];
  }
  if ([item.userData _hasListeners:@"move"]) {
    [item.userData fireEvent:@"move" withObject:event];
  }
}

- (void)launcherView:(GridLauncherView *)launcher didSelectItem:(GridLauncherItem *)item
{
  NSMutableDictionary *event = [NSMutableDictionary dictionary];
  [event setObject:item.userData forKey:@"item"];

  // convert our location to the location within our superview
  CGRect curFrame = [self convertRect:item.button.frame toView:[self superview]];
  TiRect *rect = [[TiRect alloc] _initWithPageContext:[self.proxy pageContext]];
  [rect setRect:curFrame];
  [event setObject:rect forKey:@"location"];
  [rect release];

  if ([self.proxy _hasListeners:@"click"]) {
    [self.proxy fireEvent:@"click" withObject:event];
  }
  if ([item.userData _hasListeners:@"click"]) {
    [item.userData fireEvent:@"click" withObject:event];
  }
}

- (void)launcherViewDidBeginEditing:(GridLauncherView *)launcher
{
  if ([self.proxy _hasListeners:@"edit"]) {
    NSMutableDictionary *event = [NSMutableDictionary dictionary];
    [self.proxy fireEvent:@"edit" withObject:event];
  }
}

- (void)launcherViewDidEndEditing:(GridLauncherView *)launcher_
{
  // update our data array since it's possible been reordered
  [self.proxy replaceValue:[launcher_ items] forKey:@"data" notification:NO];

  if ([self.proxy _hasListeners:@"commit"]) {
    NSMutableDictionary *event = [NSMutableDictionary dictionary];
    [self.proxy fireEvent:@"commit" withObject:event];
  }
}

- (BOOL)launcherViewShouldWobble:(GridLauncherView *)launcher_
{
  // all the wobble effect to be turned off if required by Apple
  return [TiUtils boolValue:[self.proxy valueForUndefinedKey:@"wobble"] def:YES];
}

@end

