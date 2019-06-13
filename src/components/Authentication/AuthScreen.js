import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import PepoApi from '../../services/PepoApi';

// components
import TouchableButton from '../../theme/components/TouchableButton';
import FormInput from '../../theme/components/FormInput';
import deepGet from 'lodash/get';
import Theme from '../../theme/styles';
import styles from './styles';
import PepoIcon from '../../assets/pepo_logo.png';
import InitWalletSdk from '../../services/InitWalletSdk';
import LoadingModal from '../LoadingModal';
import ErrorMessages from '../../constants/ErrorMessages';
import { showModal, hideModal } from '../../actions';

const userStatusMap = {
  activated: 'activated'
};

const signUpLoginTestMap = {
  signup: 'Signing up...',
  signin: 'Login in...'
};

let userStatus = '';

class AuthScreen extends Component {
  constructor(props) {
    super(props);
    this.defaults = {
      general_error: null,
      last_name_error: null,
      first_name_error: null,
      password_error: null,
      user_name_error: null,
      server_errors: {},
      clearErrors: true,
      errorMsg: ''
    };
    this.state = {
      first_name: null,
      last_name: null,
      user_name: null,
      password: null,
      signup: false,
      isLoginIn: false,
      server_errors: {},
      clearErrors: false,
      userNameFocus: true,
      firstNameFocus: false,
      lastNameFocus : false,
      passwordFocus : false,
      ...this.defaults
    };
  }

  async saveItem(item, selectedValue) {
    try {
      await AsyncStorage.removeItem(item);
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.warn('AsyncStorage error: ' + error.message);
    }
  }

  validateLoginInput() {
    let isValid = true;
    if (!this.state.user_name) {
      this.setState({ user_name_error: ErrorMessages.user_name });
      isValid = false;
    }

    if (!this.state.password) {
      this.setState({
        password_error: ErrorMessages.password
      });
      isValid = false;
    }

    return isValid;
  }

  validateSignInInput() {
    let isValid = true;

    if (!this.validateLoginInput()) {
      isValid = false;
    }

    if (!this.state.first_name) {
      this.setState({
        first_name_error: ErrorMessages.first_name
      });
      isValid = false;
    }

    if (!this.state.last_name) {
      this.setState({
        last_name_error: ErrorMessages.last_name
      });
      isValid = false;
    }

    return isValid;
  }

  isValidInputs() {
    if (this.state.signup) {
      return this.validateSignInInput();
    } else {
      return this.validateLoginInput();
    }
  }

  clearError() {
    this.setState(this.defaults);
  }

  signin() {
    this.clearError();

    if (!this.isValidInputs()) {
      this.setState({ clearErrors: false });
      return;
    }

    this.props.dispatch(showModal(this.state.signup ? signUpLoginTestMap.signup : signUpLoginTestMap.signin));

    let authApi = new PepoApi(this.state.signup ? '/auth/sign-up' : '/auth/login');
    let userSaltApi = new PepoApi('/users/recovery-info');

    authApi
      .setNavigate(this.props.navigation.navigate)
      .post(JSON.stringify(this.state))
      .then((res) => {
        if (res.success && res.data) {
          let resultType = deepGet(res, 'data.result_type'),
            userData = deepGet(res, 'data.' + resultType);

          if (!userData) {
            this.props.dispatch(hideModal());
            this.setState({
              general_error: ErrorMessages.user_not_found
            });
            return;
          }

          userSaltApi
            .setNavigate(this.props.navigation.navigate)
            .get()
            .then(async (res) => {
              if (res.success && res.data) {
                let resultType = deepGet(res, 'data.result_type'),
                  userSalt = deepGet(res, `data.${resultType}.scrypt_salt`);

                if (!userSalt) {
                  this.props.dispatch(hideModal());
                  this.setState({
                    general_error: ErrorMessages.user_not_found
                  });
                  return;
                }

                this.saveItem(
                  'user',
                  JSON.stringify({
                    user_details: userData,
                    user_pin_salt: userSalt
                  })
                ).then(() => {
                  userStatus = (userData && userData['ost_status']) || '';
                  InitWalletSdk.initializeDevice(this);
                });
              } else {
                this.props.dispatch(hideModal());
                this.onServerError(res);
              }
            });
        } else {
          this.props.dispatch(hideModal());
          this.onServerError(res);
        }
      })
      .catch((err) => {
        this.props.dispatch(hideModal());
        this.onServerError(err);
      });
  }

  setupDeviceComplete(ostWorkflowContext, ostContextEntity) {
    console.log('setup devices complete ostWorkflowContext', ostWorkflowContext);
    console.log('setup devices complete ostContextEntity ', ostContextEntity);
    this.props.dispatch(hideModal());
    if (userStatus.toLowerCase() === userStatusMap.activated) {
      this.props.navigation.navigate('HomeScreen');
    } else {
      this.props.navigation.navigate('SetPinScreen');
    }
  }

  setupDeviceFailed(ostWorkflowContext, ostError) {
    console.log('setup devices complete ostWorkflowContext', ostWorkflowContext);
    console.log('setup devices complete ostError ', ostError);
    const errorMessage =
      (ostError && ostError.getApiErrorMessage()) || ostError.getErrorMessage() || ErrorMessages.general_error;
    this.props.dispatch(hideModal());
    this.setState({ general_error: errorMessage });
  }

  onServerError(res) {
    let stateObj = { server_errors: res, clearErrors: false };
    const errorData = deepGet(res, 'err.error_data'),
      errorMsg = deepGet(res, 'err.msg') || ErrorMessages.general_error;
    if (!(errorData && errorData.length)) {
      stateObj['general_error'] = errorMsg;
    }
    this.setState(stateObj);
  }

  ServerErrorHandler(field) {
    console.log('In ServerErrorHandler', field);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 25 }} />
        <View style={styles.form}>
          <Image source={PepoIcon} style={styles.imgPepoLogoSkipFont} />
          {this.state.signup && (
            <React.Fragment>
              <FormInput
                editable={true}
                onChangeText={(first_name) => this.setState({ first_name, error: null, first_name_error: null })}
                fieldName="first_name"
                textContentType="none"
                value={this.state.first_name}
                style={[Theme.TextInput.textInputStyle, this.state.first_name_error ? Theme.Errors.errorBorder : {}]}
                placeholder="First Name"
                returnKeyType="next"
                returnKeyLabel="next"
                placeholderTextColor="#ababab"
                errorMsg={this.state.first_name_error}
                serverErrors={this.state.server_errors}
                clearErrors={this.state.clearErrors}
                onSubmitEditing={() => { this.setState({
                  lastNameFocus: true,
                  firstNameFocus: false
                }) }}
                isFocus={this.state.firstNameFocus}
                blurOnSubmit={false}
                errorHandler={(fieldName) => {
                  this.ServerErrorHandler(fieldName);
                }}
              />

              <FormInput
                editable={true}
                onChangeText={(last_name) => this.setState({ last_name, error: null, last_name_error: null })}
                fieldName="last_name"
                textContentType="none"
                value={this.state.last_name}
                style={[Theme.TextInput.textInputStyle, this.state.last_name_error ? Theme.Errors.errorBorder : {}]}
                placeholder="Last Name"
                returnKeyType="next"
                returnKeyLabel="Next"
                placeholderTextColor="#ababab"
                errorMsg={this.state.last_name_error}
                serverErrors={this.state.server_errors}
                clearErrors={this.state.clearErrors}
                onSubmitEditing={() => { this.setState({
                  userNameFocus: true,
                  lastNameFocus: false
                }) }}
                isFocus={this.state.lastNameFocus}
                blurOnSubmit={false}
                errorHandler={(fieldName) => {
                  this.ServerErrorHandler(fieldName);
                }}
              />
            </React.Fragment>
          )}

          <FormInput
            editable={true}
            onChangeText={(user_name) => this.setState({ user_name, error: null, user_name_error: null })}
            fieldName="user_name"
            value={this.state.user_name}
            style={[Theme.TextInput.textInputStyle, this.state.user_name_error ? Theme.Errors.errorBorder : {}]}
            placeholder="Username"
            textContentType="none"
            returnKeyType="next"
            returnKeyLabel="next"
            autoFocus={true}
            placeholderTextColor="#ababab"
            errorMsg={this.state.user_name_error}
            clearErrors={this.state.clearErrors}
            serverErrors={this.state.server_errors}
            onSubmitEditing={() => { this.setState({
              passwordFocus: true,
              userNameFocus: false
            }) }}
            isFocus={this.state.userNameFocus}
            blurOnSubmit={false}
            errorHandler={(fieldName) => {
              this.ServerErrorHandler(fieldName);
            }}
          />

          <FormInput
            editable={true}
            onChangeText={(password) => this.setState({ password, error: null, password_error: null })}
            placeholder="Password"
            fieldName="password"
            returnKeyType="next"
            secureTextEntry={true}
            style={[Theme.TextInput.textInputStyle, this.state.password_error ? Theme.Errors.errorBorder : {}]}
            value={this.state.password}
            returnKeyType="done"
            returnKeyLabel="done"
            errorMsg={this.state.password_error}
            serverErrors={this.state.server_errors}
            clearErrors={this.state.clearErrors}
            onSubmitEditing={() => { this.setState({
              passwordFocus: false
            }) }}
            isFocus={this.state.passwordFocus}
            blurOnSubmit={true}
            errorHandler={(fieldName) => {
              this.ServerErrorHandler(fieldName);
            }}
            placeholderTextColor="#ababab"
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
          <Text style={Theme.Errors.errorText}>{this.state.general_error}</Text>
        </View>
        <LoadingModal />
        <View style={styles.bottomBtnAndTxt}>
          {!this.state.signup && (
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  signup: true,
                  error: null,
                  firstNameFocus: true,
                  userNameFocus: false,
                  ...this.defaults
                })
              }
            >
              <Text style={styles.label}>Don't have an account?</Text>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
          )}
          {this.state.signup && (
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  signup: false,
                  error: null,
                  isFocus: true,
                  firstNameFocus: false,
                  userNameFocus: true,
                  ...this.defaults
                })
              }
            >
              <Text style={styles.label}>Already have an account?</Text>
              <Text style={styles.link}>Log In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

export default AuthScreen;
