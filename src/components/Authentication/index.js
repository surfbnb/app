import React, { Component } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import FormData from 'form-data';
import AsyncStorage from '@react-native-community/async-storage';
import PepoApi from '../../services/PepoApi';

import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';
import { API_ROOT } from './../../constants';
import styles from './styles';
import PepoIcon from '../../assets/pepo_logo.png';
const formData = new FormData();

class Authentication extends Component {
  constructor() {
    super();
    this.state = {
      fullname: null,
      username: null,
      password: null,
      signup: false,
      error: null
    };
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    }
  }

  signin() {
    if (!this.state.username || !this.state.password) {
      this.setState({ error: 'All fields are mandatory' });
      return;
    }
    if (this.state.signup && !this.state.fullname) {
      this.setState({ error: 'All fields are mandatory' });
      return;
    }
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
    this.state.signup && formData.append('fullname', this.state.fullname);

    let authApi = new PepoApi(this.state.signup ? '/signup' : '/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    });

    let userSaltApi = new PepoApi('/users/current-user-salt', {
      method: 'GET',
      credentials: 'include'
    });

    authApi
      .fetch(this.props.navigation.navigate)
      .then((res) => {
        console.log('Signin responseData:', res);
        if (res.success && res.data) {
          let userData = res.data && res.data[res.data.result_type];

          if (!userData) {
            Alert.alert('User not found');
            return;
          }

          userSaltApi.fetch(this.props.navigation.navigate).then(async (res) => {
            if (res.success && res.data) {
              let userSalt = res.data && res.data.current_user_salt && res.data.current_user_salt.recovery_pin_salt;

              if (!userSalt) {
                Alert.alert('User salt not found');
                return;
              }

              this.saveItem(
                'user',
                JSON.stringify({
                  user_details: userData,
                  user_pin_salt: userSalt
                })
              );
              this.props.navigation.navigate('HomeScreen');
            } else {
              this.setState({ error: res.msg });
            }
          });
        } else {
          this.setState({ error: res.msg });
        }
      })
      .catch((err) => {
        this.setState({ error: res.msg });
        console.warn(err);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={PepoIcon} style={styles.imageDimensions} />
        <View style={styles.form}>
          {this.state.signup && (
            <TextInput
              editable={true}
              onChangeText={(fullname) => this.setState({ fullname, error: null })}
              ref="fullname"
              returnKeyType="next"
              value={this.state.fullname}
              style={Theme.TextInput.textInputStyle}
              placeholder="Full Name"
            />
          )}

          <TextInput
            editable={true}
            onChangeText={(username) => this.setState({ username, error: null })}
            ref="username"
            returnKeyType="next"
            value={this.state.username}
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
                text="Login"
                onPress={this.signin.bind(this)}
              />
              <TouchableOpacity onPress={() => this.setState({ signup: true, error: null })}>
                <Text style={styles.label}>Don't have an account?</Text>
                <Text style={styles.link}>Create an account</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
          {this.state.signup && (
            <React.Fragment>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPrimary]}
                TextStyles={[Theme.Button.btnPrimaryText]}
                text="Signup"
                onPress={this.signin.bind(this)}
              />
              <TouchableOpacity onPress={() => this.setState({ signup: false, error: null })}>
                <Text style={styles.label}>Already have an account?</Text>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      </View>
    );
  }
}

export default Authentication;
