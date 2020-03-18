/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "RNAppAuthAuthorizationFlowManager.h"
#import <MobileRTC/MobileRTC.h>

#define kSDKAppKey      @"71SSNSr38hKBDiBjvwew8CHo7qay1pzrKGj5"
#define kSDKAppSecret   @"LWiGzeEjEZhF3zpo4WAgMKvUqu1WZRGPfFm7"
#define kSDKDomain      @"zoom.us"

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, RNAppAuthAuthorizationFlowManager, MobileRTCAuthDelegate, MobileRTCMeetingServiceDelegate>

@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;

@property (nonatomic, strong) UIWindow *window;

- (void) joinMeeting: (NSString*) meetingNo andUserName:(NSString *)userName;

@end
