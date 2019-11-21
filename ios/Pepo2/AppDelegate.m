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
#import <TwitterKit/TWTRKit.h>
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
  
  if ([[url absoluteString] hasPrefix:@"twitterkit-"]) {
    handled = [[Twitter sharedInstance] application:app openURL:url options:options];
     if (handled) {
       return handled;
     }
  }
 
  handled = [[RNFirebaseLinks instance] application:app openURL:url options:options];
  if (handled) {
    return handled;
  }
  
  handled = [RCTLinkingManager application:app openURL:url options:options];
  if (handled) {
    return handled;
  }
  
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

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
  BOOL handled = [[RNFirebaseLinks instance] application:application
                                    continueUserActivity:userActivity
                                      restorationHandler:restorationHandler];
  
  if ( handled ) {
    return handled;
  }

  handled = [RCTLinkingManager application:application
                           continueUserActivity:userActivity
                             restorationHandler:restorationHandler];

  return handled;
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
