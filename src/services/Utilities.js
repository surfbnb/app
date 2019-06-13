import deepGet from "lodash/get"; 
import appConfig from "../constants/AppConfig"; 
import AsyncStorage from '@react-native-community/async-storage'; 

export default {
  async saveItem(key, val) {
    try {
      if( typeof val == "object"){
        val = JSON.stringify( val );
      }
      await AsyncStorage.removeItem(key);
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    }
  },

  async getItem(key) {
    try {
      const user = await AsyncStorage.getItem(key);
      return user; 
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
      return null ;
    }
  },

  isActiveUser( user ){
    const userStatusMap = appConfig.userStatusMap ;
    let status = deepGet( user ,  'ost_status' ) || ""; 
    status = status.toLowerCase(); 
    return status == userStatusMap.activated || status == userStatusMap.activating ; 
  }
};
