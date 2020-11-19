# Pepo 2.0

A mobile-only app with "channels" of topics that people can join in and to video chat. What I like is the gathering of like-minded folks, or even for people to talk about their surf trip experiences for example. There's even a feature where you can post Insta-story like post which does not disappear after 24 hours (that's great) but can only be taken on the surf spot. As it is with any platform, there will be early adopters before the majority starts to come on. It is my hope that more people will join it because it is honestly such a liberating experience to participate in topics of interests and get insider info and tips into surf spots and destinations. Pepo features 30 second videos. Tokens are used in the app to support and thank makers (each “like” automatically transfers a token to the maker), for curation and personalization, and soon for replies and  messaging.

### Check-points for build

#### API / Endpoints `(src/constants/index.js)`
1. API endpoint
2. Platform endpoint
3. Tracker endpoint

#### Economy / Wallet config `(src/constants/index.js)`
1. Token ID
2. Session key expiry time
3. Spending limit
4. High key session key expiry time

#### Keys / Certificates
1. Twitter Key, Twitter Secret `(src/constants/index.js)`
    1. Twitter Key in iOS `info.plist` - `twitterkit-<secret>`
2. Firebase
    1. iOS: `ios/GoogleService-Info.plist`
    2. Android: `android/app/google-services.json`
    3. In case of iOS, the APN certificate needs to be uploaded to Firebase.
3. Crashlytics: No specific set-up needed as same keys used in all environments.
4. Certificates (for SSL pinning) for API endpoints to be added
    1. iOS: `ios/Pepo2/AppDelegate.m`
    2. Android: `android/app/src/main/res/xml/network_security_config.xml`

#### Universal linking
1. In website (`pepo-web`), make sure the universal links config is updated
2. Within app, update capabilites / manifest:
    1. iOS: `ios/Pepo2/Pepo2.entitlements`
    2. Android: `android/app/src/main/AndroidManifest.xml`

#### Dynamic linking
1. Within app, update capabilites / manifest with deeplinking domain:
    1. iOS: `ios/Pepo2/Info.plist` and `ios/Pepo2/Pepo2.entitlements` 
    2. Android: `android/app/src/main/AndroidManifest.xml`

### Build Instructions (for iOS)

- [ios-publish_app_production.md](iOS_production.md)

### Build Instructions (for Android)

- [android/publish_app_production.md](android/publish_app_production.md)
- [android/publish_app_sandbox.md](android/publish_app_sandbox.md)

### Manual installations needed (for iOS)

#### FFmpeg 

1. Download the frameworks from: https://github.com/tanersener/mobile-ffmpeg/releases/download/v4.2.2.LTS/mobile-ffmpeg-min-gpl-4.2.2.LTS-ios-framework.zip
2. Move the unzipped folder to `pepo-react/ios/ReactNativeFFmpeg`

#### Fabric Crashlytics

1. Download the frameworks from: https://s3.amazonaws.com/kits-crashlytics-com/ios/com.twitter.crashlytics.ios/3.13.4/com.crashlytics.ios-manual.zip.
2. Move the unzipped folder to `pepo-react/ios/Crashlytics`
 
You can also use https://fabric.io/kits/ios/crashlytics/manual-install?step=0 to get updated download links if needed.

#### Firebase

1. Download the frameworks from: http://sdk.stagingost.com.s3.amazonaws.com/ThirdPartyFrameworks/Firebase.zip
2. Move the unzipped folder to `pepo-react/ios/Firebase` (all unzipped files and folders should be inside `pepo-react/ios/Firebase`)

You can also use https://github.com/firebase/firebase-ios-sdk/releases/ to get updated download links if needed.
