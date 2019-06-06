import React, { Component } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity } from 'react-native';
import FormData from 'form-data';
import AsyncStorage from '@react-native-community/async-storage';

import TouchableButton from '../../theme/components/TouchableButton';
import Theme from "../../theme/styles"
import { API_ROOT } from './../../constants';
import styles from './styles';

const formData = new FormData();

class Authentication extends Component {
  constructor() {
    super();
    this.state = {
      fullname: null,
      username: null,
      password: null,
      signup: false
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
      Alert.alert('All fields are mandatory');
      return;
    }
    if (this.state.signup && !this.state.fullname) {
      Alert.alert('All fields are mandatory');
      return;
    }
    formData.append('username', this.state.username);
    formData.append('password', this.state.password);
    this.state.signup && formData.append('fullname', this.state.fullname);

    fetch(`${API_ROOT}/${this.state.signup ? 'signup' : 'login'}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('Signin responseData:', responseData);
        if (responseData.success && responseData.data) {
          this.saveItem('user', JSON.stringify(responseData.data[responseData.data.result_type]));
          this.props.navigation.navigate('Home');
        } else {
          Alert.alert('Error', responseData.msg);
        }
      })
      .catch(console.warn)
      .done();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login Screen</Text>
        <View style={styles.form}>
          {this.state.signup && (
            <TextInput
            editable={true}
            onChangeText={(fullname) => this.setState({ fullname })}
            ref="fullname"
            returnKeyType="next"
            value={this.state.fullname}
            style={Theme.TextInput.textInputStyle}
            placeholder="Full Name"
          />
          )}

          <TextInput
            editable={true}
            onChangeText={(username) => this.setState({ username })}
            ref="username"
            returnKeyType="next"
            value={this.state.username}
            style={Theme.TextInput.textInputStyle}
            placeholder="Username"
          />

        
          <TextInput
            editable={true}
            onChangeText={(password) => this.setState({ password })}
            placeholder="Password"
            ref="password"
            returnKeyType="next"
            secureTextEntry={true}
            style={Theme.TextInput.textInputStyle}
            value={this.state.password}
          />

          {!this.state.signup && (
            <React.Fragment>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPrimary]}
                TextStyles={[Theme.Button.btnPrimaryText]}
                text="Login"
                onPress={this.signin.bind(this)}
              />
              <TouchableOpacity onPress={() => this.setState({ signup: true })}>
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
              <TouchableOpacity onPress={() => this.setState({ signup: false })}>
                <Text style={styles.label}>Have an account?</Text>
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
