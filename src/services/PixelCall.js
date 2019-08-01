import {Platform, Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import qs from 'qs';
import assignIn from 'lodash/assignIn';

import Store from '../store';

const userId = Store.getState().current_user.id;
const pixelRoot = 'https://px.pepo.com/devp101_pixel.png';

const keyAliasMap = {
  t_version: 'v',
  t_gid: 'tid',
  u_id: 'uid',
  u_service_id: 'serid',
  u_session_id: 'sesid',
  u_timezone: 'tz',
  e_timestamp: 'ts',
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
  t_version: 1.0,
  t_gid: 'placeholder_t_gid',
  u_service_id: 1,
  u_session_id: 'placeholder_u_session_id',
  u_timezone: DeviceInfo.getTimezone(),
  e_timestamp: Math.round((new Date).getTime()/1000),
  device_id: DeviceInfo.getUniqueID(),
  device_model: DeviceInfo.getModel(),
  device_platform: DeviceInfo.getSystemVersion(),
  device_os: Platform.OS,
  device_language: DeviceInfo.getDeviceLocale(),
  device_width: Dimensions.get('window').width,
  device_height: Dimensions.get('window').height,
  user_agent: DeviceInfo.getUserAgent()
};

if(userId){
  staticData.u_id = userId;
  staticData.e_data_json.user_id = userId;
}

const makeCompactData = params => {
  let compactData = {};
  for(var key in params){
    if (params.hasOwnProperty(key)) {
      compactData[keyAliasMap[key]] = typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key];
    }
  }
  return compactData;
};

export default (data) => {

  // Extend outer data with staticData
  let pixelData = assignIn({}, staticData, data);

  // Compact data
  let compactData = makeCompactData(pixelData);

  // Log
  let ts = (new Date).getTime();
  console.log(`PixelCall (${ts}) data: `, compactData);

  // Fire the fetch call
  fetch(`${pixelRoot}?${qs.stringify(compactData)}`)
      .then((response) => console.log(`PixelCall (${ts}) fetch request complete!`))
      .catch((error) => console.log(`PixelCall (${ts}) fetch error: `, error));
}
