//
//  Titanium SDK
//  WARNING: this is a generated file and should not be modified
//

#import <TitaniumKit/TiApp.h>
#import <TitaniumKit/TiLogServer.h>
#import <TitaniumKit/TiSharedConfig.h>

NSString *const TI_APPLICATION_DEPLOY_TYPE = @"development";
NSString *const TI_APPLICATION_ID = @"de.marcbender.testapp";
NSString *const TI_APPLICATION_PUBLISHER = @"not specified";
NSString *const TI_APPLICATION_URL = @"";
NSString *const TI_APPLICATION_NAME = @"testapp";
NSString *const TI_APPLICATION_VERSION = @"1.0";
NSString *const TI_APPLICATION_DESCRIPTION = @"";
NSString *const TI_APPLICATION_COPYRIGHT = @"not specified";
NSString *const TI_APPLICATION_GUID = @"8956dbd4-0d40-40b8-a78b-f7ec248bb38f";
BOOL const TI_APPLICATION_SHOW_ERROR_CONTROLLER = true;
NSString *const TI_APPLICATION_BUILD_TYPE = @"";
#ifdef TARGET_OS_SIMULATOR
NSString *const TI_APPLICATION_RESOURCE_DIR = @"";
#endif
NSString *const TI_LOG_ID = @"8956dbd4-0d40-40b8-a78b-f7ec248bb38f";
NSUInteger const TI_LOG_SERVER_PORT = 0 ? 0 : 10571;
CGFloat const TI_APPLICATION_DEFAULT_BGCOLOR_RED = 1;
CGFloat const TI_APPLICATION_DEFAULT_BGCOLOR_GREEN = 1;
CGFloat const TI_APPLICATION_DEFAULT_BGCOLOR_BLUE = 1;

int main(int argc, char *argv[])
{
  [[TiSharedConfig defaultConfig] setApplicationDeployType:TI_APPLICATION_DEPLOY_TYPE];
  [[TiSharedConfig defaultConfig] setApplicationID:TI_APPLICATION_ID];
  [[TiSharedConfig defaultConfig] setApplicationPublisher:TI_APPLICATION_PUBLISHER];
  [[TiSharedConfig defaultConfig] setApplicationURL:[NSURL URLWithString:TI_APPLICATION_URL]];
  [[TiSharedConfig defaultConfig] setApplicationName:TI_APPLICATION_NAME];
  [[TiSharedConfig defaultConfig] setApplicationVersion:TI_APPLICATION_VERSION];
  [[TiSharedConfig defaultConfig] setApplicationDescription:TI_APPLICATION_DESCRIPTION];
  [[TiSharedConfig defaultConfig] setApplicationCopyright:TI_APPLICATION_COPYRIGHT];
  [[TiSharedConfig defaultConfig] setApplicationGUID:TI_APPLICATION_GUID];
  [[TiSharedConfig defaultConfig] setShowErrorController:TI_APPLICATION_SHOW_ERROR_CONTROLLER];
  [[TiSharedConfig defaultConfig] setApplicationBuildType:TI_APPLICATION_BUILD_TYPE];
  [[TiSharedConfig defaultConfig] setApplicationResourcesDirectory:TI_APPLICATION_RESOURCE_DIR];
#ifdef DISABLE_TI_LOG_SERVER
  [[TiSharedConfig defaultConfig] setLogServerEnabled:NO];
#else
  [[TiSharedConfig defaultConfig] setLogServerEnabled:YES];
  [[TiLogServer defaultLogServer] setPort:TI_LOG_SERVER_PORT];
#endif

  UIColor *defaultBgColor = [UIColor colorWithRed:TI_APPLICATION_DEFAULT_BGCOLOR_RED
                                            green:TI_APPLICATION_DEFAULT_BGCOLOR_GREEN
                                             blue:TI_APPLICATION_DEFAULT_BGCOLOR_BLUE
                                            alpha:1.0f];
  [[TiSharedConfig defaultConfig] setDefaultBackgroundColor:defaultBgColor];

#if defined(DEBUG) || defined(DEVELOPER)
  [[TiSharedConfig defaultConfig] setDebugEnabled:YES];
#endif

#ifdef LOGTOFILE
  NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
  NSString *documentsDirectory = [paths objectAtIndex:0];
  NSString *logPath = [documentsDirectory stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.log", TI_LOG_ID]];
  freopen([logPath cStringUsingEncoding:NSUTF8StringEncoding], "w+", stderr);
  fprintf(stderr, "[INFO] Application started\n");
#endif

  NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
  int retVal = UIApplicationMain(argc, argv, @"TiUIApplication", @"TiApp");
  [pool release];
  return retVal;
}
