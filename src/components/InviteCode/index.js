import React from 'react';
import { View, Text, TouchableWithoutFeedback, BackHandler, Keyboard } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import deepGet from 'lodash/get';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import FormInput from '../../theme/components/FormInput';
import LinearGradient from 'react-native-linear-gradient';
import TwitterAuth from '../../services/ExternalLogin/TwitterAuth';
import CurrentUser from '../../models/CurrentUser';
import Utilities from '../../services/Utilities';
import { ostErrors } from '../../services/OstErrors';
import Colors from '../../theme/styles/Colors';
import { navigateTo } from '../../helpers/navigateTo';

const bottomSpace = getBottomSpace([true]),
  extraPadding = 10,
  safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

//TODO @preshita this.state.isSubmitting block android hardware back and close modal if submitting invite code in process.

class InviteCodeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inviteCode: null,
      isSubmitting: false,
      general_error: null,
      server_errors: {},
      invite_code_error: '',
      submitText: 'Enter',
      bottomPadding: safeAreaBottomSpace
    };
    this.payload = this.props.navigation.getParam('payload');
  }

  _keyboardShown(e) {
    let bottomPaddingValue = deepGet(e, 'endCoordinates.height') || 350;

    if (this.state.bottomPadding == bottomPaddingValue) {
      return;
    }

    this.setState({
      bottomPadding: bottomPaddingValue
    });
  }

  _keyboardHidden(e) {
    if (this.state.bottomPadding == safeAreaBottomSpace) {
      return;
    }
    this.setState({
      bottomPadding: safeAreaBottomSpace
    });
  }

  componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnMount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    if (this.isSubmitting) {
      return true;
    }
  };

  onInviteCodeSubmit = () => {
    if (!this.state.inviteCode) {
      //TODO @preshita the validation should happen by FormInput itself but if not do it manually
      this.setState({
        invite_code_error: ostErrors.getUIErrorMessage('invite_code_error')
      });
      return;
    }

    this.setState({ isSubmitting: true, submitText: 'Processing...', invite_code_error: null });

    let twitterAccessToken = TwitterAuth.getCachedTwitterResponse();
    twitterAccessToken['invite_code'] = this.state.inviteCode;

    CurrentUser.twitterConnect(twitterAccessToken)
      .then((res) => {
        if (res && res.success) {
          this.onSuccess(res);
        } else {
          this.onError(res);
        }
      })
      .catch((error) => {
        this.onError(error);
      })
      .finally(() => {
        this.setState({ isSubmitting: false, submitText: 'Enter' });
      });
  };

  onSuccess(res) {
    if (this.handleGoTo(res)) {
      return;
    }
    this.props.navigation.goBack();
    navigateTo.navigationDecision();
  }

  onError(error) {
    if (this.handleGoTo(error)) {
      return;
    }
  }

  handleGoTo(res) {
    //On success goto can ge hanled by the generic utility
    if (navigateTo.handleGoTo(res, this.props.navigation)) {
      this.props.navigation.goBack();
      return true;
    }
    //TODO @preshita
    //Is error and error for invite code , show inline errors, honor backend error. You should pass the response to  FormInput it will manage the display error. Check AuthScreen for refrences , how to manage feild specific error and general error
    //If access token error , show error below send button. Auto close after 2 second.--> ??
    if (res && deepGet(res, 'err.error_data')) {
      this.setState({
        server_errors: res,
        general_error: ostErrors.getErrorMessage(res)
      });
      return false;
    }
    return false;
    //Dont forget to return true or false ,if handleGoTo has taken a decision return true or false
  }

  //@TODO @preshita use this function on close modal and android hardware back
  closeModal = () => {
    if (!this.state.isSubmitting) {
      this.props.navigation.goBack();
    }
  };

  onChangeText = (inviteCode) => {
    this.setState({
      inviteCode,
      invite_code_error: null
    });
  };

  render() {
    return (
      <TouchableWithoutFeedback onPressIn={this.closeModal}>
        <View style={inlineStyles.parent}>
          <TouchableWithoutFeedback>
            <View style={[inlineStyles.container, { paddingBottom: this.state.bottomPadding }]}>
              <Text style={[inlineStyles.desc, { marginBottom: 10, fontSize: 18 }]}>
                Looks like your account is not whitelisted
              </Text>
              <Text style={[inlineStyles.desc, { fontFamily: 'AvenirNext-Regular' }]}>
                To activite your account you can either join via a invite link enter a referal code below.
              </Text>
              <FormInput
                onChangeText={this.onChangeText}
                value={this.state.inviteCode}
                fieldName="invite_code"
                style={[Theme.TextInput.textInputStyle, { width: '100%', marginTop: 20, marginBottom: 10 }]}
                placeholderTextColor={Colors.darkGray}
                errorMsg={this.state.invite_code_error}
                serverErrors={this.state.server_errors}
                maxLength={6}
                autoCapitalize={'none'}
              />
              <LinearGradient
                colors={['#ff7499', '#ff7499', '#ff5566']}
                locations={[0, 0.35, 1]}
                style={{ borderRadius: 3, marginHorizontal: 20, borderWidth: 0, width: '100%', marginTop: 10 }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <TouchableButton
                  TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
                  TextStyles={[Theme.Button.btnPinkText, { fontSize: 18 }]}
                  text={this.state.submitText}
                  onPress={this.onInviteCodeSubmit}
                  disabled={this.state.isSubmitting}
                />
              </LinearGradient>
              <Text style={Theme.Errors.errorText}>{this.state.general_error}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default InviteCodeScreen;
