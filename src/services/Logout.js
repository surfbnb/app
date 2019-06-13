import AsyncStorage from '@react-native-community/async-storage';
import { Alert } from 'react-native';

import PepoApi from './PepoApi';
import Store from '../store';
import { logoutUser } from '../actions';

export default class Logout {
  constructor(navigate) {
    this.navigate = navigate;
  }

  async perform() {
    await AsyncStorage.removeItem('user');
    this.navigate('AuthScreen');
    Store.dispatch(logoutUser());
    return;

    // Todo logout server implementation
    new PepoApi('/users/logout')
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
