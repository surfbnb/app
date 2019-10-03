# Publishing Production App

* Edit App Name
 * File Path: pepo-react/android/app/src/main/res/values/strings.xml
 * Change To: 
  ```xml
    <string name="app_name">Pepo</string>
  ```

* Edit src/main/AndroidManifest 
Make sure `android:host` is set to `"pepo.com"`.
```xml
<intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https"
          android:host="pepo.com"/>
    <data android:scheme="http"
          android:host="pepo.com"/>
</intent-filter>
```


* Edit File build.gradle: 
 * File Path: pepo-react/android/app/build.gradle
 * Change application Id to `com.pepo.v2.production`.
 * Bump up versionCode by 1 **[ALWAYS]**
 * Bump up version **[ALWAYS]**


* Stop gradlew Daemon in Android Studio Terminal
```
./gradlew --stop
```

* Clean the project **DO NOT FORGET / DO NOT SKIP**
 * `Android Studio` > `Build` > `Clean Project`


* Generate Signed Bundle
 * `Android Studio` > `Build` > `Generate Signed Bundle / APK`
 * Choose `Android App Bundle` and click on next.
 * Select the right keysotre. Browse and select `PepoV2Production` keystore.
 * Put the keystore password.
 * Browse and select `pepo2production` key
 * Put the key password.
 > As a practice, do not save the password. All keystores and keys have different passwords.
 * Click Next
 * Note down or select the location of the build.
 * Select `release` in Build Variants.

* Upload the app.aab file to https://play.google.com



