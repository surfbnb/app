import React, { Component } from 'react';
import {Alert, StyleSheet, View, Text, TextInput, TouchableOpacity} from 'react-native';
import FormData from 'form-data';

import {apiRoot} from './../../constants';

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

    fetch(
      `${apiRoot}/${this.state.signup ? 'signup' : 'login'}`,
      {
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
         this.props.navigation.navigate('App');
        } else {
          Alert.alert('Error',responseData.msg);
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
      placeholder="Full Name"
      ref="fullname"
      returnKeyType="next"
      style={styles.inputText}
      value={this.state.fullname}
      />
    )}

  <TextInput
    editable={true}
    onChangeText={(username) => this.setState({ username })}
    placeholder="Username"
    ref="username"
    returnKeyType="next"
    style={styles.inputText}
    value={this.state.username}
    />

    <TextInput
    editable={true}
    onChangeText={(password) => this.setState({ password })}
    placeholder="Password"
    ref="password"
    returnKeyType="next"
    secureTextEntry={true}
    style={styles.inputText}
    value={this.state.password}
    />

    {!this.state.signup && (
    <React.Fragment>
    <TouchableOpacity style={styles.buttonWrapper} onPress={this.signin.bind(this)}>
    <Text style={styles.buttonText}> Log In </Text>
    </TouchableOpacity>
    <Text style={styles.buttonTextSm} onPress={() => this.setState({ signup: true })}>
      Sign Up
    </Text>
    </React.Fragment>
    )}

    {this.state.signup && (
    <React.Fragment>
    <TouchableOpacity style={styles.buttonWrapper} onPress={this.signin.bind(this)}>
    <Text style={styles.buttonText}> Sign Up </Text>
    </TouchableOpacity>
    <Text style={styles.buttonTextSm} onPress={() => this.setState({ signup: false })}>
      Log In
    </Text>
    </React.Fragment>
    )}
  </View>
    </View>
  );
  }
}

export default Authentication;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonTextSm: {
    fontSize: 12,
    padding: 8,
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 16,
    padding: 10,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold'
  },
  buttonWrapper: {
    backgroundColor:'#9accd7',
    marginBottom: 10,
    width: '100%',
    borderRadius: 10
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  scrollContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20
  },
  form: {
    width: 300
  },
  inputText: {
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10
  }
});