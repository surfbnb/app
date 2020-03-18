//
//  PepoNativeHelper.m
//  Pepo2
//
//  Created by Rachin Kapoor on 26/09/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "PepoNativeHelper.h"
#import "PepoEventEmitter.h"
#import "AppDelegate.h"

@implementation PepoNativeHelper

RCT_EXPORT_MODULE(PepoNativeHelper);

RCT_EXPORT_METHOD(getGroupAndDecimalSeparators:(RCTResponseSenderBlock)callback
                  failureCallback:(RCTResponseSenderBlock)errorCallback) {
  
  NSNumberFormatter *formatter = [[NSNumberFormatter alloc] init];
  [formatter setLocale: [NSLocale currentLocale]];
  [formatter setNumberStyle:NSNumberFormatterDecimalStyle];
  [formatter setUsesGroupingSeparator:YES];
  NSNumber *number = [[NSNumber alloc]initWithFloat:1000.1];
  NSString *formattedValue = [formatter stringFromNumber: number];
  
  NSInteger decimalSeparatorIndex = [formattedValue length]-2;
  
  NSString *decimalSeparator = [formattedValue substringWithRange:NSMakeRange(decimalSeparatorIndex, 1)];
  
  NSString *groupSeparator = [formattedValue substringWithRange:NSMakeRange(1, 1)];
  NSMutableString *finalGroupSeparator = [NSMutableString stringWithString:groupSeparator];
  
  if ([groupSeparator caseInsensitiveCompare:@"0"] == NSOrderedSame) {
    finalGroupSeparator = [NSMutableString stringWithString:@""];
  }
  
  
  NSLog(@"decimalSeparator: %@ and groupSeparator: %@", decimalSeparator, finalGroupSeparator);
  
  callback( @[finalGroupSeparator, decimalSeparator] );
}

RCT_EXPORT_METHOD(subscribeForEvent:(NSString *)workflowId
                  completion:(RCTResponseSenderBlock)callback) {
  
  PepoEventEmitter *instance = [PepoEventEmitter sharedInstance];
  [instance subscribeCallback:callback forWorkflowId:workflowId];
}

RCT_EXPORT_METHOD(startZoomChat:(NSString *)meetingId
                  userName:(NSString * _Nullable) userName) {
  //AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
 dispatch_async(dispatch_get_main_queue(), ^{
      AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
   [delegate joinMeeting:meetingId andUserName: userName];
  });
}

@end
