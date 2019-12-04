//
//  PepoEventEmitter.m
//  Pepo2
//
//  Created by aniket ayachit on 18/11/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PepoEventEmitter.h"

static NSMutableDictionary<NSString *, RCTResponseSenderBlock> *subscribeEvents;
@implementation PepoEventEmitter

+ (id)sharedInstance {
  static PepoEventEmitter *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [[PepoEventEmitter alloc] init];
    
  });
  return sharedInstance;
}
- (id)init {
  if (self = [super init]) {
    subscribeEvents = [[NSMutableDictionary alloc]init];
  }
  return self;
}

-(void)subscribeCallback:(RCTResponseSenderBlock)callback forWorkflowId: (NSString *)wfid {
  subscribeEvents[wfid] = callback;
}

-(void)sendEventWithParams:(NSDictionary *)params forWorkflowId: (NSString *)wfid {
  RCTResponseSenderBlock callback = subscribeEvents[wfid];
  if (callback) {
    callback(@[ params ]);
  }
  subscribeEvents[wfid] = nil;
}
@end
