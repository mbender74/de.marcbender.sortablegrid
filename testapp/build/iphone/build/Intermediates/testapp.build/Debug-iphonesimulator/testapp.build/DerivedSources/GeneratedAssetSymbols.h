#import <Foundation/Foundation.h>

#if __has_attribute(swift_private)
#define AC_SWIFT_PRIVATE __attribute__((swift_private))
#else
#define AC_SWIFT_PRIVATE
#endif

/// The "LaunchLogo" asset catalog image resource.
static NSString * const ACImageNameLaunchLogo AC_SWIFT_PRIVATE = @"LaunchLogo";

/// The "badge" asset catalog image resource.
static NSString * const ACImageNameBadge AC_SWIFT_PRIVATE = @"badge";

/// The "closeButton" asset catalog image resource.
static NSString * const ACImageNameCloseButton AC_SWIFT_PRIVATE = @"closeButton";

/// The "images/heart1" asset catalog image resource.
static NSString * const ACImageNameImagesHeart1 AC_SWIFT_PRIVATE = @"images/heart1";

/// The "images/heart2" asset catalog image resource.
static NSString * const ACImageNameImagesHeart2 AC_SWIFT_PRIVATE = @"images/heart2";

/// The "images/heart3" asset catalog image resource.
static NSString * const ACImageNameImagesHeart3 AC_SWIFT_PRIVATE = @"images/heart3";

/// The "images/heart4" asset catalog image resource.
static NSString * const ACImageNameImagesHeart4 AC_SWIFT_PRIVATE = @"images/heart4";

/// The "images/heart5" asset catalog image resource.
static NSString * const ACImageNameImagesHeart5 AC_SWIFT_PRIVATE = @"images/heart5";

/// The "assets/images/tab1" asset catalog image resource.
static NSString * const ACImageNameAssetsImagesTab1 AC_SWIFT_PRIVATE = @"assets/images/tab1";

/// The "assets/images/tab2" asset catalog image resource.
static NSString * const ACImageNameAssetsImagesTab2 AC_SWIFT_PRIVATE = @"assets/images/tab2";

#undef AC_SWIFT_PRIVATE
