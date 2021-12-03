/**
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2010 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

#import "DeMarcbenderSortablegridViewProxy.h"
#import "GridLauncherButton.h"
#import "GridLauncherItem.h"
#import "GridLauncherView.h"
#import "DeMarcbenderSortablegridItemProxy.h"
#import "DeMarcbenderSortablegridView.h"
#import <TitaniumKit/TiUtils.h>

NSArray *griddashboardKeySequence;

@implementation DeMarcbenderSortablegridViewProxy

- (NSArray *)keySequence
{
  if (griddashboardKeySequence == nil) {
      griddashboardKeySequence = [[NSArray arrayWithObjects:@"rowCount", @"columnCount", nil] retain];
  }
  return griddashboardKeySequence;
}

- (id)init
{
  if (self = [super init]) {
    [self setValue:[NSNumber numberWithBool:YES] forUndefinedKey:@"editable"];
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

//TODO: Remove when deprication is done.
- (void)fireEvent:(NSString *)type withObject:(id)obj withSource:(id)source propagate:(BOOL)propagate reportSuccess:(BOOL)report errorCode:(int)code message:(NSString *)message;
{
  if ([type isEqual:@"click"]) {
    DeMarcbenderSortablegridView *v = (DeMarcbenderSortablegridView *)[self view];
    GridLauncherView *launcher = [v launcher];
    if (launcher.editing) {
      return;
    }
  }
  [super fireEvent:type withObject:obj withSource:source propagate:propagate];
}

- (void)fireEvent:(NSString *)type withObject:(id)obj propagate:(BOOL)propagate reportSuccess:(BOOL)report errorCode:(NSInteger)code message:(NSString *)message;
{
  if ([type isEqual:@"click"]) {
    DeMarcbenderSortablegridView *v = (DeMarcbenderSortablegridView *)[self view];
    GridLauncherView *launcher = [v launcher];
    if (launcher.editing) {
      return;
    }
  }
  [super fireEvent:type withObject:obj propagate:propagate reportSuccess:report errorCode:code message:message];
}

- (void)setData:(id)data
{
  for (TiViewProxy *proxy in data) {
    ENSURE_TYPE(proxy, DeMarcbenderSortablegridItemProxy)
        [self rememberProxy:proxy];
  }

  [self replaceValue:data forKey:@"data" notification:NO];
  [self replaceValue:data forKey:@"viewData" notification:YES];
}

@end

