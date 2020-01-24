import {PERMISSIONS, request, check} from 'react-native-permissions';
import { Platform } from 'react-native';

const instanceMap  = {
  "camera" : Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  }),
  "photo" : Platform.select({
    android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ios: PERMISSIONS.IOS.PHOTO_LIBRARY
  }),
  "microphone" : Platform.select({
    android: PERMISSIONS.ANDROID.RECORD_AUDIO,
    ios: PERMISSIONS.IOS.MICROPHONE,
  })
}

class CameraPermissionsApi {

  async checkPermission(permissionType) {
    return await check(instanceMap[permissionType]);
  }

  async requestPermission(permissionType) {
    return await request(instanceMap[permissionType]);
  }

  async requestPermissionWithRationale(permissionType, rationaleTitle, rationaleMsg) {
    return await request(instanceMap[permissionType], {
      rationale: {
        title: rationaleTitle,
        message: rationaleMsg
      }
    });
  }
}

export default new CameraPermissionsApi();
