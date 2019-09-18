import {OstJsonApi, OstWalletSdk} from "@ostdotcom/ost-wallet-sdk-react-native/js/index";
import OstWalletSdkHelper from "./OstWalletSdkHelper";

function fetchDeviceByUserId(userId) {
  return new Promise(function (resolve, reject) {
    OstWalletSdk.getCurrentDeviceForUserId(userId, (device) => {
      if (device && OstWalletSdkHelper.canDeviceMakeApiCall(device)) {
        OstJsonApi.getCurrentDeviceForUserId(userId, (device) => {
          let resultType = device["result_type"]
            , data = device[resultType]
          ;
          resolve(data);
        }, (error) => {
          reject(error);
        });
      }
    });
  });
}

export {fetchDeviceByUserId};
