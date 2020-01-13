import {Platform, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import qs from 'qs';
import assignIn from 'lodash/assignIn';

import { TRACKER_ENDPOINT } from '../constants/index';
import CurrentUser from "../models/CurrentUser";
import Utilities from './Utilities';

const keyAliasMap = {
  t_version: 'v',
  t_gid: 'tid',
  u_id: 'uid',
  u_service_id: 'serid',
  u_session_id: 'sesid',
  u_timezone: 'tz',
  e_entity: 'ee',
  e_action: 'ea',
  p_type: 'pt',
  p_name: 'pn',
  p_referer_loc: 'ref',
  device_id: 'did',
  device_type: 'dt',
  device_platform: 'dp',
  device_resolution: 'dr',
  device_model: 'dm',
  device_os: 'dos',
  device_language: 'dl',
  device_width: 'dw',
  device_height: 'dh',
  user_agent: 'ua',
  e_data_json: 'ed'
};

const staticData = {
  t_version: 2,
  t_gid: DeviceInfo.getUniqueId(),
  u_service_id: 1,
  u_session_id: 'placeholder_u_session_id',
  u_timezone:  Utilities.getUTCTimeZone(), 
  device_id: DeviceInfo.getUniqueId(),
  device_model: DeviceInfo.getModel(),
  device_platform: DeviceInfo.getSystemVersion(),
  device_os: Platform.OS,
  device_language: Utilities.getLanguageCode(),
  device_width: Dimensions.get('window').width,
  device_height: Dimensions.get('window').height,
  device_type: 'mobile_app',
  user_agent: userAgent,
  mobile_app_version: DeviceInfo.getVersion()
};


let userAgent = null;
async function getStaticData(){ 
  if( !staticData['user_agent']) {
    try{
       //@Ashutosh @Akshay gives error WKWebView is invalidated. debug 
      userAgent = await DeviceInfo.getUserAgent();
      staticData['user_agent'] = userAgent ;
    }catch (e){};
  }
  return staticData ;
}

const mandatoryKeys = ['e_entity', 'e_action', 'p_type'];

const makeCompactData = params => {
  let compactData = {};
  for(var key in params){
    if (params.hasOwnProperty(key)) {
      let keyName = keyAliasMap[key] ? keyAliasMap[key] : key;
      compactData[keyName] = typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key];
    }
  }
  return compactData;
};

export default async (data) => {

  // Extend outer data with staticData
  const staticData = await getStaticData();
  let pixelData = assignIn({}, staticData, data);
  // Add user context (if any) else bail out
  let currentUserId = CurrentUser.getUserId();
  if(!currentUserId) return;
  pixelData.u_id = currentUserId;

  // Validate and bail out on fail
  for(var mi = 0; mi < mandatoryKeys.length; mi++){
    if(!pixelData[mandatoryKeys[mi]]){
      console.log(`PixelCall validation failed. Mandatory key ${mandatoryKeys[mi]} missing.`);
      return;
    }
  }
  for(var key in pixelData){
    if (pixelData.hasOwnProperty(key) && pixelData[key] == undefined || pixelData[key] == null ) {
      console.log(`PixelCall validation failed. Invalid value of ${mandatoryKeys[mi]}.`);
      return;
    }
  }

  // Compact data
  let compactData = makeCompactData(pixelData);

  // Fire the fetch call
  fetch(`${TRACKER_ENDPOINT}?${qs.stringify(compactData)}`, {
    headers: {
      'User-Agent': DeviceInfo.getUserAgent()
    }
  }).then((response) => console.log(`PixelCall to URL: ${TRACKER_ENDPOINT} completed with data: `, compactData))
    .catch((error) => console.log(`PixelCall fetch error: `, error));
}
