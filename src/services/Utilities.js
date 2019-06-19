import deepGet from 'lodash/get';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

export default {
  async saveItem(key, val) {
    try {
      if (typeof val == 'object') {
        val = JSON.stringify(val);
      } else {
        val = String(val);
      }
      await AsyncStorage.removeItem(key);
      await AsyncStorage.setItem(key, val);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    }
  },

  removeItem(key) {
    return AsyncStorage.removeItem(key);
  },

  getItem(key) {
    return AsyncStorage.getItem(key);
  },

  showAlert(title, message) {
    title = title || '';
    if (!message) return;
    setTimeout(() => {
      Alert.alert(title, message);
    }, 10);
  },

  getPriceOracleConfig(token, pricePoints) {
    const conversionFactor = deepGet(token, 'conversion_factor');
    const decimal = deepGet(token, 'decimals');
    const usdPricePoint = deepGet(pricePoints, 'price_point.OST.USD');
    return {
      conversionFactor: conversionFactor,
      usdPricePoint: usdPricePoint,
      decimal: decimal
    };
  }
};
