/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>
#import <Firebase.h>
#import "RNFirebaseMessaging.h"
#import "RNFirebaseNotifications.h"
#import "RNFirebaseLinks.h"
#import <TrustKit/TrustKit.h>
#import "React/RCTLinkingManager.h"
#import <OstWalletSdk/OstWalletSdk-Swift.h>
#import "Pepo2-Swift.h"

static NSString *const CUSTOM_URL_SCHEME = @"com.pepo.staging";
//static NSString *const CUSTOM_URL_SCHEME = @"com.pepo.v2.sandbox";
//static NSString *const CUSTOM_URL_SCHEME = @"com.pepo.v2.production";

@implementation AppDelegate

+ (NSArray *)getPepoDomains
{
    static NSArray *_domains;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _domains = @[@"https://stagingpepo.com/", @"https://pepo.com/", @"https://sandboxpepo.com/"];
    });
    return _domains;
}
 
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
 
  
  PepoLoaderManager *loaderManager = [[PepoLoaderManager alloc]init];
  [OstWalletUI setLoaderManager: loaderManager];
  
  [FIROptions defaultOptions].deepLinkURLScheme = CUSTOM_URL_SCHEME;
  [FIRApp configure];
  [RNFirebaseNotifications configure];
  [application registerForRemoteNotifications];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"Pepo2"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
  [Fabric with:@[[Crashlytics class]]];

  [self setupTrustKit];
  
  [self initZoomSdk];
  
  return YES;
}

- (void) setupTrustKit {
  // Initialize TrustKit
  NSDictionary *trustKitConfig =
  @{
    kTSKSwizzleNetworkDelegates: @YES,
    kTSKPinnedDomains: @{
      @"stagingpepo.com" : @{
        kTSKEnforcePinning:@YES,
        kTSKIncludeSubdomains: @NO,
        kTSKPublicKeyHashes : @[
          @"93m2RcpFNG6qGhj6NKDplTVTL7jcqAnkd69kelXSxxI=",
          @"5i3RtbkFS7nt/4viEcyy7PdCO58byAt54uQ8gSuccjg=",
          @"KupuWHThXgu73zCS0XD67PIkVGxl0FAH9sKrNRA+T/w=",
          @"8uSMBSa5X2xQ2bHvkFif3SB4v7Kpsds+f9hYQJJ95qg=",
          @"7LpmFlRSq6cS/+XRRanI8tKCBTTSkBSMYBqKtMVD+lo="
        ],
      },

      @"sandboxpepo.com" : @{
          kTSKEnforcePinning:@YES,
          kTSKIncludeSubdomains: @NO,
          kTSKPublicKeyHashes : @[
              @"rxifILU6WUJ5WvsbiTr+q2uLD3wkjsokyRpqEe/u6ck=", //deactivated
              @"DYo5lqgDZl75OmwvtxvNkpDMfeoDcyVaZi1rANPi4GA=", //deactivated
              @"ImWdHMV2ca7NG/Gl542B/RXBXuiT+CF93UZl+jqowGI=", //deactivated
              @"6cN2gRsHMiv4iDmgoQoG49RTbm1Ec44hNBNQS0f0SnA=",
              @"/oaFmxrP6EZ4Qi7B1+hjcQcyZ9Atf9hKJ1QEKzoMdbQ="
          ],
      },
      @"pepo.com" : @{
          kTSKEnforcePinning:@YES,
          kTSKIncludeSubdomains: @YES,
          kTSKPublicKeyHashes : @[
              @"ky8nCk4FQhMGlsodEkZAtJsKgf6pGBHCVE0EThWZog8=",
              @"AcAc8wzZwwW7PQ9hdEwubX1YshNI5FF495tRJxkpYLw=",
              @"fAeYjyy5PcAEYkvlxLqQqleSup1huF4ZKNfftmfSmsQ=",
              @"AC09ehpGZCY0nd9gZDM7ah4Fi+13wsVl4A9QBuxEdo4=",
              @"P+kBO3agvFcJWWtwknvbODfmogOW1m8yE12wvmAHyTY="
          ],
      }
    }
  };

  [TrustKit initSharedInstanceWithConfiguration:trustKitConfig];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
  BOOL handled;
 
  // Firebase consume valid links and throw errors, hence first handle the whitelisted domains
  // And then let Firebase do it job.
  if ([self isWhiteListedUrl:url]) {
    handled = [RCTLinkingManager application:app openURL:url options:options];
    if (handled) {
      return handled;
    }
  }
  
  // If we are not able to handle whitelisted domains, let firebase handle it here
  handled = [[RNFirebaseLinks instance] application:app openURL:url options:options];
  if (handled) {
    return handled;
  }
  
  // If links are neither whitelsted nor handled by Firebase, fallback
  handled = [RCTLinkingManager application:app openURL:url options:options];
  if (handled) {
    return handled;
  }
  return [self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url];
  
  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

-(BOOL) isWhiteListedUrl:(NSURL *) url {
  // Get whitelisted Pepo Domains
  NSArray<NSString *> *domains = [[self class] getPepoDomains];
  
  // Check if domain is whitelisted or not
  BOOL isWhiteListedDomain = false;
  for (NSString *domain in domains) {
    if ([[url absoluteString] hasPrefix:domain]) {
      isWhiteListedDomain = true;
      continue;
    }
  }
  
  return isWhiteListedDomain;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  
  // Get the URL from userActivity
  NSURL *url = userActivity.webpageURL;
    
  // Firebase consume valid links and throw errors, hence first handle the whitelisted domains
  // And then let Firebase do it job.
  BOOL handled = NO;
  if ([self isWhiteListedUrl:url]) {
    handled = [RCTLinkingManager application:application
                              continueUserActivity:userActivity
                                restorationHandler:restorationHandler];
    if ( handled ) {
       return handled;
    }
  }
  
  // If we are not able to handle whitelisted domains, let firebase handle it here
  handled = [[RNFirebaseLinks instance] application:application
                                    continueUserActivity:userActivity
                                      restorationHandler:restorationHandler];
  if ( handled ) {
    return handled;
  }

  // If links are neither whitelsted nor handled by Firebase, fallback
  handled = [RCTLinkingManager application:application
                           continueUserActivity:userActivity
                             restorationHandler:restorationHandler];
  return handled;
  
}

#pragma mark Zoom Sdk

-(void)initZoomSdk {
  // Step 1: Set SDK Domain and Enable log (You may disable the log feature in release version).
  // In current sdk this function is not present.
  // [[MobileRTC sharedRTC] setMobileRTCDomain:kSDKDomain enableLog:YES];
  
  MobileRTCSDKInitContext *context = [[MobileRTCSDKInitContext alloc] init];
  context.domain = kSDKDomain;
  context.enableLog = YES;
  
  BOOL initializeSuc = [[MobileRTC sharedRTC] initialize:context];
  NSLog(@"initializeSuccessful======>%@",@(initializeSuc));
  NSLog(@"MobileRTC Version: %@", [[MobileRTC sharedRTC] mobileRTCVersion]);
  
  // Step 2: Get Auth Service
  MobileRTCAuthService *authService = [[MobileRTC sharedRTC] getAuthService];
    
  if (authService) {
      // Step 3: Setup Auth Service
      authService.delegate        = self;
      
      authService.clientKey       = kSDKAppKey;
      authService.clientSecret    = kSDKAppSecret;
      // Step 4: Call authentication function to initialize SDK
      [authService sdkAuth];
  }else {
    NSLog(@"MobileRTC unable to fetch: %@", [[MobileRTC sharedRTC] getAuthService]);
  }
}

- (void)onMobileRTCAuthReturn:(MobileRTCAuthError)returnValue {
    NSLog(@"onMobileRTCAuthReturn %d", returnValue);
    
    if (returnValue != MobileRTCAuthError_Success)
    {
        NSString *message = [NSString stringWithFormat:NSLocalizedString(@"SDK authentication failed, error code: %zd", @""), returnValue];
        NSLog(@"%@", message);
    }
}

- (void) joinMeeting: (NSString*) meetingNo andUserName:(NSString *)userName {
    NSLog(@"meetingNO: %@", meetingNo);
    
    if(![meetingNo length]) {
        // If the meeting number is empty, return error.
        NSLog(@"Please enter a meeting number");
        return;
    } else {
        // If the meeting number is not empty.
        MobileRTCMeetingService *service = [[MobileRTC sharedRTC] getMeetingService];
        
        if (service) {
            service.delegate = self;
            // initialize a parameter dictionary to store parameters.
          NSString *finalUserName = userName;
          if (nil == finalUserName) {
            finalUserName = @"Unknown";
          }
            NSDictionary *paramDict = @{
                                        kMeetingParam_Username: finalUserName,
                                        kMeetingParam_MeetingNumber:meetingNo
                                        };
            
            MobileRTCMeetError response = [service joinMeetingWithDictionary:paramDict];
            
            NSLog(@"onJoinMeeting, response: %d", response);
        }
    }
}


#pragma mark PushNotification

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

@end
