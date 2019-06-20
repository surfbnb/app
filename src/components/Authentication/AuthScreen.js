import React, { Component } from 'react';
import { Dimensions, TextInput, View, Text, TouchableOpacity, Image } from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// components
import TouchableButton from '../../theme/components/TouchableButton';
import FormInput from '../../theme/components/FormInput';
import deepGet from 'lodash/get';
import Theme from '../../theme/styles';
import styles from './styles';
import PepoIcon from '../../assets/pepo_logo.png';
import InitWalletSdk from '../../services/InitWalletSdk';
import LoadingModal from '../../theme/components/LoadingModal';
import Toast from '../../theme/components/Toast';
import { showModal, hideModal } from '../../actions';
import currentUserModal from '../../models/CurrentUser';
import { ostErrors } from '../../services/OstErrors';

const signUpLoginTestMap = {
  signup: 'Signing up...',
  signin: 'Logging in...'
};

const { State: TextInputState } = TextInput;

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
      current_formField: 0,
      first_name: null,
      last_name: null,
      user_name: null,
      password: null,
      signup: false,
      isLoginIn: false,
      server_errors: {},
      clearErrors: false,
      ...this.defaults
    };

    this.tabIndex = {
      firstName: 1,
      lastName: 2,
      userName: 3,
      password: 4
    };

    this.counter = 0;
  }

  validateLoginInput() {
    let isValid = true;
    if (!this.state.user_name) {
      this.setState({ user_name_error: ostErrors.getUIErrorMessage('user_name') });
      isValid = false;
    }

    if (!this.state.password || this.state.password.length < 1) {
      this.setState({
        password_error: ostErrors.getUIErrorMessage('password')
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
        first_name_error: ostErrors.getUIErrorMessage('first_name')
      });
      isValid = false;
    }

    if (!this.state.last_name) {
      this.setState({
        last_name_error: ostErrors.getUIErrorMessage('last_name')
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

  getParams() {
    let params = {};
    if (this.state.signup) {
      return {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        user_name: this.state.user_name,
        password: this.state.password
      };
    }
    return {
      user_name: this.state.user_name,
      password: this.state.password
    };
  }

  signin() {
    this.clearError();

    if (!this.isValidInputs()) {
      this.setState({ clearErrors: false });
      return;
    }

    this.props.dispatch(showModal(this.state.signup ? signUpLoginTestMap.signup : signUpLoginTestMap.signin));

    const methodName = this.state.signup ? 'signUp' : 'login';

    currentUserModal[methodName](this.getParams())
      .then((res) => {
        if (res.success && res.data) {
          let resultType = deepGet(res, 'data.result_type'),
            userData = deepGet(res, 'data.' + resultType);
          if (!userData) {
            this.props.dispatch(hideModal());
            this.setState({
              general_error: ostErrors.getUIErrorMessage('user_not_found')
            });
            return;
          }
          InitWalletSdk.initializeDevice(this);
        } else {
          this.onServerError(res);
        }
      })
      .catch((err) => {
        this.onServerError(err);
      });
  }

  setupDeviceComplete() {
    currentUserModal
      .initialize()
      .then((user) => {
        this.props.dispatch(hideModal());
        if (!currentUserModal.isActiveUser()) {
          this.props.navigation.navigate('SetPinScreen');
        } else {
          this.props.navigation.navigate('HomeScreen');
        }
      })
      .catch((error) => {
        this.props.dispatch(hideModal());
        this.setState({ general_error: ostErrors.getUIErrorMessage('user_not_found') });
      });
  }

  setupDeviceFailed(ostWorkflowContext, error) {
    this.props.dispatch(hideModal());
    this.setState({ general_error: ostErrors.getErrorMessage(error) });
  }

  onServerError(res) {
    this.props.dispatch(hideModal());
    let stateObj = { server_errors: res, clearErrors: false };
    const errorData = deepGet(res, 'err.error_data'),
      errorMsg = ostErrors.getErrorMessage(res);
    if (!(errorData && errorData.length)) {
      stateObj['general_error'] = errorMsg;
    }
    this.setState(stateObj);
  }

  serverErrorHandler(field) {
    console.log('In ServerErrorHandler', field);
  }

  onSubmitEditing(currentIndex) {
    this.setState({
      current_formField: currentIndex + 1
    });
  }

  render() {
    // const { shift } = this.state;
    return (
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <View style={{ height: Dimensions.get('window').height }}>
          <View style={styles.container}>
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
                    style={[
                      Theme.TextInput.textInputStyle,
                      this.state.first_name_error ? Theme.Errors.errorBorder : {}
                    ]}
                    placeholder="First Name"
                    returnKeyType="next"
                    returnKeyLabel="Next"
                    placeholderTextColor="#ababab"
                    errorMsg={this.state.first_name_error}
                    serverErrors={this.state.server_errors}
                    clearErrors={this.state.clearErrors}
                    onSubmitEditing={() => {
                      this.onSubmitEditing(this.tabIndex.firstName);
                    }}
                    isFocus={this.state.current_formField == this.tabIndex.firstName}
                    onFocus={() => {
                      this.state.current_formField = this.tabIndex.firstName;
                    }}
                    blurOnSubmit={false}
                    errorHandler={(fieldName) => {
                      this.serverErrorHandler(fieldName);
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
                    onSubmitEditing={() => {
                      this.onSubmitEditing(this.tabIndex.lastName);
                    }}
                    isFocus={this.state.current_formField == this.tabIndex.lastName}
                    onFocus={() => {
                      this.state.current_formField = this.tabIndex.lastName;
                    }}
                    blurOnSubmit={false}
                    errorHandler={(fieldName) => {
                      this.serverErrorHandler(fieldName);
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
                returnKeyLabel="Next"
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor="#ababab"
                errorMsg={this.state.user_name_error}
                clearErrors={this.state.clearErrors}
                serverErrors={this.state.server_errors}
                onSubmitEditing={() => {
                  this.onSubmitEditing(this.tabIndex.userName);
                }}
                isFocus={this.state.current_formField == this.tabIndex.userName}
                onFocus={() => {
                  this.setState({
                    current_formField: this.tabIndex.userName
                  });
                }}
                blurOnSubmit={false}
                errorHandler={(fieldName) => {
                  this.serverErrorHandler(fieldName);
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
                returnKeyLabel="Done"
                errorMsg={this.state.password_error}
                serverErrors={this.state.server_errors}
                clearErrors={this.state.clearErrors}
                onSubmitEditing={() => {
                  this.onSubmitEditing(this.tabIndex.password);
                }}
                isFocus={this.state.current_formField == this.tabIndex.password}
                onFocus={() => {
                  this.state.current_formField = this.tabIndex.password;
                }}
                blurOnSubmit={true}
                errorHandler={(fieldName) => {
                  this.serverErrorHandler(fieldName);
                }}
                placeholderTextColor="#ababab"
              />

              <Text style={[styles.error]}>{this.state.error}</Text>
              {!this.state.signup && (
                <React.Fragment>
                  <TouchableButton
                    TouchableStyles={[Theme.Button.btnPink]}
                    TextStyles={[Theme.Button.btnPinkText]}
                    text="Log In"
                    onPress={this.signin.bind(this)}
                  />
                </React.Fragment>
              )}
              {this.state.signup && (
                <React.Fragment>
                  <TouchableButton
                    TouchableStyles={[Theme.Button.btnPink]}
                    TextStyles={[Theme.Button.btnPinkText]}
                    text="Create Account"
                    onPress={this.signin.bind(this)}
                  />
                </React.Fragment>
              )}
              <Text style={Theme.Errors.errorText}>{this.state.general_error}</Text>
            </View>
            <LoadingModal />
            <Toast timeout={3000} />
          </View>
          <View style={styles.bottomBtnAndTxt}>
            {!this.state.signup && (
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    signup: true,
                    error: null,
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
      </KeyboardAwareScrollView>
    );
  }
}

export default AuthScreen;
