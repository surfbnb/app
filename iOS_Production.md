# Pepo 2.0

## Check-points for build

### Update `ios/Info.plist`
1. Under section ios, look for 
    ```
    com.pepo.v2.production-info.plist
    ```
    * If you are using `xcode`
    > 1. right click on file
    > 2. check for `open as` option and select `source code`  
    
    <b>Copy content from file.</b> ( command+c )
    
2. Open `info.plist`
    * If you are using `xcode`
    > 1. right click on file
    > 2. check for `open as` option and select `source code` 
    
    <b>Paste copied content.</b> ( command+v )
    
3. Verify copied data
    1. CFBundleShortVersionString (Bundle versions string, short)
    ```
       Use appropriate version (it's buid version)
    ```
    2. CFBundleVersion (Bundle version)
    ```
     User apporiate build number (it's build number)
    ```
    3. CFBundleURLTypes -> CFBundleURLSchemes (URL types -> Item 0 -> URL Schemes -> Item 0) 
        ```Swift
         <string>twitterkit-53Q0hHEe4Hhartej9lFVWZX4C</string>
        ```
    
 > <b>IMPORTANT</b> <br/>
 >Dont forget to press <b>`command+s`</b>
 
### Update `ios/GoogleService-Info.plist`

1. Under section ios, look for 
    ```
    com.pepo.v2.production.GoogleService-Info
    ```
    * If you are using `xcode`
    > 1. right click on file
    > 2. check for `open as` option and select `source code`  
    
    <b>Copy content from file.</b> ( command+c )
    
2. Open `info.plist`
    * If you are using `xcode`
    > 1. right click on file
    > 2. check for `open as` option and select `source code` 
    
    <b>Paste copied content.</b> (command+v)
    
3. Verify copied data(check for next line)
    1. BUNDLE_ID
    ```
       <string>com.pepo.v2.production</string>
    ```
    
### Mostly don't need to modify

#### Check for `(src/constants/index.js)`
  ```
      'com.pepo.v2.production': {
          API_ROOT: 'https://pepo.com/api/v1',
          PLATFORM_API_ENDPOINT: 'https://api.ost.com/mainnet/v2',
          TRACKER_ENDPOINT: 'https://px.pepo.com/pp1001_pixel.png',
          TOKEN_ID: '1009',
          TWITTER_CONSUMER_KEY: '53Q0hHEe4Hhartej9lFVWZX4C',
          TWITTER_CONSUMER_SECRET: 'L3jOhUfHr8drwrx8qT7GnvObFtPxTxZkFQbdCWGKawzo7l9avV',
          SESSION_KEY_EXPIRY_TIME: 2 * 7 * 24 * 60 * 60, //14 days
          SPENDING_LIMIT: PProduction.toString( 10 ),
          HIGH_SPEND_SESSION_KEY_EXPIRY_TIME: 1 * 60 * 60 // 1 hour + buffer from config 1 hr = 2 hr
      }
  ``` 
#### Check for `Crashlytics`
No specific set-up needed as same keys used in all environments.
In case to `update/modify` keys
1. Click on `Pepo2` (top most file).
2. Click on `Build Phases`
3. Expand `Run Script` and look for `${PROJECT_DIR}/Crashlytics`. If you won't find this check in another `Run Script`
4. You can update keys in 
```
"${PROJECT_DIR}/Crashlytics/com.crashlytics.ios-manual/Fabric.framework/run" e500ef3e75c9fb12689f830748bd17e7bfae62a5 f51f922e21caf07d64ae713d3d1aa129a273b1fc28701e78ec67df4b316e21a6
```    
   
#### Check for `Certificates (for SSL pinning)` 
1. Open `ios/Pepo2/AppDelegate.m`
2. Check for function `- (void) setupTrustKit`
3. Check for respective domain under `kTSKPinnedDomains` key.
```
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
```