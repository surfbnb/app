import {NativeModules} from "react-native";
const RNDeviceInfo = NativeModules.RNDeviceInfo;
import PepoApi from "../services/PepoApi";

let devicesWithNotch =  [
  {
    "brand": "Apple",
    "model": "iPhone X"
  },
  {
    "brand": "Apple",
    "model": "iPhone XS"
  },
  {
    "brand": "Apple",
    "model": "iPhone XS Max"
  },
  {
    "brand": "Apple",
    "model": "iPhone XR"
  },
  {
    "brand": "Asus",
    "model": "ZenFone 5"
  },
  {
    "brand": "Asus",
    "model": "ZenFone 5z"
  },
  {
    "brand": "Huawei",
    "model": "P20"
  },
  {
    "brand": "Huawei",
    "model": "P20 Plus"
  },
  {
    "brand": "Huawei",
    "model": "P20 Lite"
  },
  {
    "brand": "Huawei",
    "model": "Honor 10"
  },
  {
    "brand": "Huawei",
    "model": "Nova 3"
  },
  {
    "brand": "Huawei",
    "model": "Nova 3i"
  },
  {
    "brand": "Oppo",
    "model": "R15"
  },
  {
    "brand": "Oppo",
    "model": "R15 Pro"
  },
  {
    "brand": "Oppo",
    "model": "F7"
  },
  {
    "brand": "Vivo",
    "model": "V9"
  },
  {
    "brand": "Vivo",
    "model": "X21"
  },
  {
    "brand": "Vivo",
    "model": "X21 UD"
  },
  {
    "brand": "OnePlus",
    "model": "6"
  },
  {
    "brand": "OnePlus",
    "model": "A6003"
  },
  {
    "brand": "OnePlus",
    "model": "OnePlus A6003"
  },
  {
    "brand": "LG",
    "model": "G7"
  },
  {
    "brand": "LG",
    "model": "G7 ThinQ"
  },
  {
    "brand": "LG",
    "model": "G7+ ThinQ"
  },
  {
    "brand": "Leagoo",
    "model": "S9"
  },
  {
    "brand": "Oukitel",
    "model": "U18"
  },
  {
    "brand": "Sharp",
    "model": "Aquos S3"
  },
  {
    "brand": "Nokia",
    "model": "6.1 Plus"
  },
  {
    "brand": "xiaomi",
    "model": "Redmi Note 7 Pro"
  }
];

class NotchHelper {

  syncList(){
    let listUrl = "https://d3attjoi5jlede.cloudfront.net/pepo-app/devices-list/notch-devices.json";
    new PepoApi(listUrl).get().then((res)=> {
      const devices = res && res.devices;
      if( devices && devices instanceof Array && devices.length < 1 ) {
        devicesWithNotch = devices;
      }
    }).catch((error)=> {
      console.log("ignore")
    })
  }

  hasNotch() {
    return devicesWithNotch.findIndex(item => item.brand === RNDeviceInfo.brand && (  item.model === RNDeviceInfo.deviceName || item.model === RNDeviceInfo.model )) !== -1;
  }

}

export default new NotchHelper()