//
//  PepoEventEmitter.h
//  Pepo2
//
//  Created by aniket ayachit on 18/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

NS_ASSUME_NONNULL_BEGIN

static 
@interface PepoEventEmitter :  NSObject
+ (id)sharedInstance;
-(void)subscribeCallback:(RCTResponseSenderBlock)callback forWorkflowId: (NSString *)wfid;
-(void)sendEventWithParams:(NSDictionary *)params forWorkflowId: (NSString *)wfid;
@end

NS_ASSUME_NONNULL_END
