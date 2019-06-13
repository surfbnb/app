# Steps to publish pepo app
## Setting up Gradle variables
1. Place the keystore file under the android/app directory in the project folder.
2. Edit the file android/gradle.properties, and add the following (replace < > tags with the keystore filename correct keystore password, alias and key password),
```
PEPO_UPLOAD_STORE_FILE=<pepo store file>
PEPO_UPLOAD_KEY_ALIAS=<pepo production key alias>
PEPO_UPLOAD_STORE_PASSWORD=<key store password>
PEPO_UPLOAD_KEY_PASSWORD=<key password>
```
These are global Gradle variables, which we are using in our Gradle config to sign our app.

## Generating the release AAB
Run the following in a terminal:
```
$ cd android
$ ./gradlew bundleRelease
```
This will generate AAB file which can be found under android/app/build/outputs/bundle/release/app.aab, 
and is ready to be uploaded to Google Play.