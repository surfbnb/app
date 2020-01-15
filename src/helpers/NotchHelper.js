import DeviceInfo from 'react-native-device-info';
import DeviceInfoCache from "../helpers/DeviceInfoCache";
import AsyncStorage from '@react-native-community/async-storage';
import { devices } from '../constants/notch-devices';

let devicesWithNotch =  Object.assign([], devices);
const NotchDataKey = 'NotchData';

export const getRemoteNotchData = async () => {
  return fetch(`https://d3attjoi5jlede.cloudfront.net/pepo-app/devices-list/notch-devices.json?${Date.now()}`) // For local cache busting
    .then((response) => response.json())
    .then((responseJson) => {
      const devices = responseJson && responseJson.devices;
      if( devices && devices instanceof Array && devices.length > 0 ) {
        console.log('Remote Notch Data fetched and seeded to local: ', devices);
        return AsyncStorage.setItem(NotchDataKey, JSON.stringify(devices));
      }
    })
    .catch((error) => {
      console.log("Remote Notch Data fetch failed :(");
    });
};


export const getLocalNotchData = async () => {
  return AsyncStorage.getItem(NotchDataKey)
    .then((response) => JSON.parse(response))
    .then((responseJson) => {
      const devices = responseJson;
      if( devices && devices instanceof Array && devices.length > 0 ) {
        console.log('Local Notch Data fetched: ', devices);
        devicesWithNotch = Object.assign(devicesWithNotch, devices);
      }
    })
    .catch((error) => {
      console.log("Local Notch Data fetch failed :(");
    });
};


const hasNotchRemote =  () => {
  if(devicesWithNotch.length > 0){
    const deviceName = DeviceInfoCache.getDeviceName() ;
    return (
      devicesWithNotch.findIndex(
        item =>
          item.brand.toLowerCase() === DeviceInfo.getBrand().toLowerCase() &&
          (item.model.toLowerCase() === deviceName.toLowerCase() || item.model.toLowerCase() === DeviceInfo.getModel().toLowerCase())
      ) !== -1
    );
  }
  return false;
};

//TODO version update read from Cache
export const hasNotch = () =>  { return DeviceInfo.hasNotch() || hasNotchRemote() } ;
