import { API_ROOT } from '../constants/index';
import AsyncStorage from '@react-native-community/async-storage';
import PepoApi from './PepoApi';

export default class Logout {
  constructor(navigate) {
    this.navigate = navigate;
  }

  perform() {
    let pepoApi = new PepoApi('/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
    pepoApi
    .fetch(this.navigate)
    .then(async (res) => {
      console.log('Signout res:', res);
      if (res.success) {
        await AsyncStorage.removeItem('user');
        this.navigate('AuthScreen');
      } else {
        Alert.alert('Error', res.msg);
      }
    })
    .catch((err) => {
      Alert.alert('Error', err.msg);
      console.warn(err);
    });
  }
}
