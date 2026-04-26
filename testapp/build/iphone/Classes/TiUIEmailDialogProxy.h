/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */
#ifdef USE_TI_UIEMAILDIALOG

#import <MessageUI/MessageUI.h>
#import <TitaniumKit/TiProxy.h>

@interface TiUIEmailDialogProxy : TiProxy <MFMailComposeViewControllerDelegate> {
  NSMutableArray *attachments;
}

- (void)open:(id)args;
- (void)addAttachment:(id)args;

@property (nonatomic, readonly) NSArray *attachments;

@property (nonatomic, readonly) NSNumber *SENT;
@property (nonatomic, readonly) NSNumber *SAVED;
@property (nonatomic, readonly) NSNumber *CANCELLED;
@property (nonatomic, readonly) NSNumber *FAILED;

@end

#endif
