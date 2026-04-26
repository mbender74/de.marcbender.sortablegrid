/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UISCROLLVIEW

#import <TitaniumKit/TiViewProxy.h>

@interface TiUIScrollViewProxy : TiViewProxy <UIScrollViewDelegate> {
  TiPoint *contentOffset;
}
- (void)setContentOffset:(id)value withObject:(id)animated;
- (void)layoutChildrenAfterContentSize:(BOOL)optimize;

@end

#endif
