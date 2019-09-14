
class OstWalletSdkHelper {
  constructor() {}

  static isDeviceUnauthorizedError(ostError ) {
    if ( ostError.isApiError() ) {
      // OstError is base error class.
      // If this flag is true, we have received an object of OstApiError.
      // OstApiError is derived from OstError.
      // In javascript, you don't need to typecast, so we shall use the same object.

      // Check if user's device is revoked.
      if ( ostError.isApiSignerUnauthorized() ) {
        // IMPORTANT: User's Device has been revoked.
        // Application must logout the user in this case.
        return true;
      }
    } else if ("DEVICE_NOT_SETUP" === ostError.getErrorCode() ) {
      // User's device is not set-up.
      // IMPORTANT: User's Device has been revoked.
      // Application must logout the user in this case.

      return true;
    } else if ("DEVICE_NOT_REGISTERED" === ostError.getErrorCode() ) {
      // User's device is not registered.
      // IMPORTANT: User's Device can't make api calls.
      // Application must logout the user in this case.
      return true;
    }

    return false
  }

  static isUserCancelled (ostError) {
    if ( "WORKFLOW_CANCELLED" === ostError.getErrorCode() ) {
      return true
    }

    return false
  }

  static canDeviceMakeApiCall(device ) {
    if ( null === device ) {
      return false;
    }
    switch( device.status ) {
      case "REGISTERED":
      case "AUTHORIZING":
      case "AUTHORIZED":
      case "REVOKING":
      case "RECOVERING":
        return true;
      default:
        return false;
    }
  }

  static isDeviceTimeOutOfSync(ostError) {
    if ( ostError.isApiError() ) {
      if (ostError.isDeviceTimeOutOfSync()) {
        return true
      }
    }
    return false
  }
}

export default OstWalletSdkHelper;
