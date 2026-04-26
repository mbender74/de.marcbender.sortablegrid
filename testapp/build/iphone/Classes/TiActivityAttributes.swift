/**
 * testapp SDK
 * Copyright TiDev, Inc. 04/07/2022-Present. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 * 
 * WARNING: This is generated code. Modify at your own risk and without support.
 */

#if canImport(ActivityKit)
#if !targetEnvironment(macCatalyst)
import Foundation
import ActivityKit

public struct TiActivityAttributes: ActivityAttributes {
  public typealias Status = ContentState
  public struct ContentState: Codable, Hashable {
    var value: [String: String]
  }
}
#endif
#endif
