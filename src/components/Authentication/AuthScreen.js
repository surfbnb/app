import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import PepoApi from '../../services/PepoApi';
import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';
import styles from './styles';
import PepoIcon from '../../assets/pepo_logo.png';
import InitWalletSdk from '../../services/InitWalletSdk';
import deepGet from 'lodash/get';
import CustomModal from '../CustomModal';

const userStatus = {
  activated: "activated"
};

const signUpLoginTestMap = {
  signup: 'Signing up...',
  signin: 'Login in...'
};

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: null,
      last_name: null,
      user_name: null,
      password: null,
      signup: false,
      error: null,
      isLoginIn: false
    };

    console.log(this.props, 'auth component');
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    }
  }

  signin() {
    if (!this.state.user_name || !this.state.password) {
      this.setState({ error: 'All fields are mandatory' });
      return;
    }

    if (this.state.signup && (!this.state.first_name || !this.state.last_name)) {
      this.setState({ error: 'All fields are mandatory' });
      return;
    }

    this.changeIsLogingState(true);

    let authApi = new PepoApi(this.state.signup ? '/auth/sign-up' : '/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    });

    let userSaltApi = new PepoApi('/users/recovery-info', {
      method: 'GET',
      credentials: 'include'
    });

    authApi
      .fetch(this.props.navigation.navigate)
      .then((res) => {
        console.log('Signin responseData:', res);
        if (res.success && res.data) {
          let resultType = deepGet(res, 'data.result_type'),
            userData = deepGet(res, 'data.' + resultType);

          if (!userData) {
            this.changeIsLogingState(false);
            Alert.alert('User not found');
            return;
          }

          userSaltApi.fetch(this.props.navigation.navigate).then(async (res) => {
            var oThis = this;
            console.log(res);
            if (res.success && res.data) {
              let resultType = deepGet(res, 'data.result_type'),
                userSalt = deepGet(res, `data.${resultType}.scrypt_salt`);

              if (!userSalt) {
                this.changeIsLogingState(false);
                Alert.alert('User salt not found');
                return;
              }

              this.saveItem(
                'user',
                JSON.stringify({
                  user_details: userData,
                  user_pin_salt: userSalt
                })
              ).then(() => {
                oThis.changeIsLogingState(false); //TODO remove
                InitWalletSdk.initializeDevice();

                const status = (userData && userData['status']) || '';

                if (status.toLowerCase() === userStatus.activated) {
                  oThis.props.navigation.navigate('HomeScreen');
                } else {
                  oThis.props.navigation.navigate('SetPinScreen');
                }
              });
            } else {
              this.changeIsLogingState(false);
              this.setState({ error: res.msg });
            }
          });
        } else {
          this.changeIsLogingState(false);
          this.setState({ error: res.msg });
        }
      })
      .catch((err) => {
        this.changeIsLogingState(false);
        this.setState({ error: res.msg });
      });
  }

  changeIsLogingState(isLoging) {
    this.setState({ isLoginIn: isLoging });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 25 }} />
        <View style={styles.form}>
          <Image source={PepoIcon} style={styles.imageDimensions} />
          {this.state.signup && (
            <React.Fragment>
              <TextInput
                editable={true}
                onChangeText={(first_name) => this.setState({ first_name, error: null })}
                ref="first_name"
                returnKeyType="next"
                value={this.state.first_name}
                style={Theme.TextInput.textInputStyle}
                placeholder="First Name"
              />
              <TextInput
                editable={true}
                onChangeText={(last_name) => this.setState({ last_name, error: null })}
                ref="last_name"
                returnKeyType="next"
                value={this.state.last_name}
                style={Theme.TextInput.textInputStyle}
                placeholder="Last Name"
              />
            </React.Fragment>
          )}

          <TextInput
            editable={true}
            onChangeText={(user_name) => this.setState({ user_name, error: null })}
            ref="user_name"
            returnKeyType="next"
            value={this.state.user_name}
            style={Theme.TextInput.textInputStyle}
            placeholder="Username"
          />
          <TextInput
            editable={true}
            onChangeText={(password) => this.setState({ password, error: null })}
            placeholder="Password"
            ref="password"
            returnKeyType="next"
            secureTextEntry={true}
            style={Theme.TextInput.textInputStyle}
            value={this.state.password}
          />
          <Text style={[styles.error]}>{this.state.error}</Text>
          {!this.state.signup && (
            <React.Fragment>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPrimary]}
                TextStyles={[Theme.Button.btnPrimaryText]}
                text="Log In"
                onPress={this.signin.bind(this)}
              />
            </React.Fragment>
          )}
          {this.state.signup && (
            <React.Fragment>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPrimary]}
                TextStyles={[Theme.Button.btnPrimaryText]}
                text="Create Account"
                onPress={this.signin.bind(this)}
              />
            </React.Fragment>
          )}
        </View>

        <View style={styles.bottomBtnAndTxt}>
          {!this.state.signup && (
            <TouchableOpacity onPress={() => this.setState({ signup: true, error: null })}>
              <Text style={styles.label}>Don't have an account?</Text>
              <Text style={styles.link}>Create an account</Text>
            </TouchableOpacity>
          )}
          {this.state.signup && (
            <TouchableOpacity onPress={() => this.setState({ signup: false, error: null })}>
              <Text style={styles.label}>Already have an account?</Text>
              <Text style={styles.link}>Log In</Text>
            </TouchableOpacity>
          )}
        </View>
        <CustomModal
          show={this.state.isLoginIn}
          loadingText={this.state.signup ? signUpLoginTestMap.signup : signUpLoginTestMap.signin}
        />
      </View>
    );
  }
}

export default AuthScreen;
