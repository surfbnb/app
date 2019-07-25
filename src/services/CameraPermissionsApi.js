import Permissions from 'react-native-permissions';

class CameraPermissionsApi {
  async checkPermission(permissionTypes) {
    return await Permissions.check(permissionTypes);
  }

  async requestPermission(permissionType) {
    return await Permissions.request(permissionType);
  }

  async requestPermissionWithRationale(permissionType, rationaleTitle, rationaleMsg) {
    return await Permissions.request(permissionType, {
      rationale: {
        title: rationaleTitle,
        message: rationaleMsg
      }
    });
  }
}

export default new CameraPermissionsApi();
