//
//  TiWebView.h
//  testapp
//
//  Created by Hans Knöchel on 02.02.26.
//

#import <WebKit/WebKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface TiWebView : WKWebView

@property (nonatomic, assign) BOOL hideInputAccessoryView;

@end

NS_ASSUME_NONNULL_END
