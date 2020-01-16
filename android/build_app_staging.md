# Building Staging App

### **DEBUG**
* In react-native project home directory
    ```
    react-native run-android --variant=StagingDebug
    ```

### **RELEASE** 
* Edit File build.gradle: 
    * File Path: pepo-react/android/app/build.gradle
    * Bump up versionCode by 1 **[ALWAYS]**
    * Bump up version **[ALWAYS]**

**Note**: Do every step on the same terminal
* Stop gradlew Daemon in Android Studio Terminal
    ```
    ./gradlew --stop
    ```

* Clean the project **DO NOT FORGET / DO NOT SKIP**
    ```
    ./gradlew clean
    ```

* Generate Signed Bundle
    * Set Environment variables having keystore path and its secrets.</br>
```
    export KEYSTORE_FILE=<Absolute keystore file path>
```
    
```    
    export STORE_PASS='<KeyStore password>'
```   
    
```
    export KEY_ALIAS=<KeyStore Alias>
```
    
```
    export KEY_PASS='<Key password>'

```
* Generate App Staging release build.
```
    ./gradlew assembleStagingRelease
```
* Find your apk build in:  app/build/outputs/apk/release/app-staging-release.apk
    



