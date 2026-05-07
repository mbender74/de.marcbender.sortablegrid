/**
 * testapp APSHTTPClient Library
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#ifndef DebugLog
#if defined(DEBUG) || defined(DEVELOPER)
#define DebugLog(...)   \
  {                     \
    NSLog(__VA_ARGS__); \
  }
#else
#define DebugLog(...) \
  {                   \
  }
#endif
#endif

#import "APSHTTPHelper.h"
#import "APSHTTPPostForm.h"
#import "APSHTTPRequest.h"
#import "APSHTTPResponse.h"
