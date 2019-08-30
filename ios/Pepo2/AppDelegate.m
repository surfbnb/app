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
#import <TrustKit/TrustKit.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
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
          @"5i3RtbkFS7nt/4viEcyy7PdCO58byAt54uQ8gSuccjg=",
          @"HXXQgxueCIU5TTLHob/bPbwcKOKw6DkfsTWYHbxbqTY="//just to avoid crash. (add backup key)
        ],
      },
      
      @"sandboxpepo.com" : @{
          kTSKEnforcePinning:@YES,
          kTSKIncludeSubdomains: @NO,
          kTSKPublicKeyHashes : @[
              @"rxifILU6WUJ5WvsbiTr+q2uLD3wkjsokyRpqEe/u6ck=",
              @"HXXQgxueCIU5TTLHob/bPbwcKOKw6DkfsTWYHbxbqTY="//just to avoid crash. (add backup key)
          ],
      },
    }
  };
  
  [TrustKit initSharedInstanceWithConfiguration:trustKitConfig];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options {
  return [[Twitter sharedInstance] application:app openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
