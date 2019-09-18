import React from 'react';
import { View, Text, TouchableWithoutFeedback, Image, Keyboard } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import deepGet from 'lodash/get';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import FormInput from '../../theme/components/FormInput';
import LinearGradient from 'react-native-linear-gradient';
import confirmEmail from '../../assets/confirm-your-email-icon.png';
import PepoApi from '../../services/PepoApi';
import { ostErrors } from '../../services/OstErrors';
import Colors from '../../theme/styles/Colors';
import CurrentUser from '../../models/CurrentUser';
import { navigateTo } from '../../helpers/navigateTo';
import Utilities from '../../services/Utilities';

const bottomSpace = getBottomSpace([true]),
  extraPadding = 10,
  safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

class AddEmailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      isSubmitting: false,
      btnSubmitText: 'Sign Up',
      emailSent: false,
      email_error: '',
      general_error: null,
      server_errors: {},
      bottomPadding: safeAreaBottomSpace
    };
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
    Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
    Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));

    Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
    Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
  }

  componentWillUnmount() {
    Keyboard.removeListener('keyboardWillShow');
    Keyboard.removeListener('keyboardWillHide');
    Keyboard.removeListener('keyboardDidShow');
    Keyboard.removeListener('keyboardDidHide');
    this.onEmailSubmit = () => {};
    this.onSuccess = () => {};
    this.onError = () => {};
    this.onChangeText = () => {};
  }

  onEmailSubmit = () => {
    if (!this.state.email) {
      this.setState({
        email_error: ostErrors.getUIErrorMessage('email_error')
      });
      return;
    }

    this.setState({
      isSubmitting: true,
      btnSubmitText: 'Processing...',
      email_error: null,
      general_error: null
    });

    new PepoApi(`/users/${CurrentUser.getUserId()}/save-email`)
      .post({ email: this.state.email })
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
        this.setState({
          isSubmitting: false,
          btnSubmitText: 'Sign Up'
        });
      });
  };

  onSuccess(res) {
    //TODO show success screen
    this.setState({
      emailSent: true
    });
  }

  onError(error) {
    this.setState({
      server_errors: error,
      general_error: ostErrors.getErrorMessage(error)
    });
  }

  closeModal = () => {
    if (!this.state.isSubmitting) {
      this.props.navigation.goBack(null);
      navigateTo.navigationDecision();
    }
    return true;
  };

  onChangeText = (email) => {
    this.setState({
      email,
      email_error: null
    });
  };

  emailSignUp = () => {
    return (
      <React.Fragment>
        <Text style={[inlineStyles.desc, { marginBottom: 10, fontSize: 18 }]}>
          Please enter email address to continue
        </Text>
        <Text style={[inlineStyles.desc, { fontFamily: 'AvenirNext-Regular' }]}>
          We will only send you important email related to you account activity and transaction.
        </Text>
        <FormInput
          onChangeText={this.onChangeText}
          value={this.state.email}
          errorMsg={this.state.email_error}
          placeholder="email@gmail.com"
          fieldName="email"
          style={[Theme.TextInput.textInputStyle, { width: '100%', marginTop: 20, marginBottom: 10 }]}
          placeholderTextColor={Colors.darkGray}
          autoCapitalize={'none'}
          serverErrors={this.state.server_errors}
          returnKeyType="done"
          returnKeyLabel="Done"
          onSubmitEditing={this.onEmailSubmit}
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
            text={this.state.btnSubmitText}
            onPress={this.onEmailSubmit}
            disabled={this.state.isSubmitting}
          />
        </LinearGradient>
        <Text style={Theme.Errors.errorText}>{this.state.general_error}</Text>
      </React.Fragment>
    );
  };

  confirmEmail = () => {
    return (
      <React.Fragment>
        <Image source={confirmEmail} style={{ width: 72, height: 72, marginBottom: 25 }} />
        <Text style={[inlineStyles.desc, { marginBottom: 10, fontSize: 18 }]}>Please Confirm Your Email</Text>
        <Text style={[inlineStyles.desc, { marginBottom: 20, fontFamily: 'AvenirNext-Regular' }]}>
          We have sent a email on prineel@ost.com, Please go to your inbox and click on the confrim button to continue.
        </Text>
        <LinearGradient
          colors={['#ff7499', '#ff7499', '#ff5566']}
          locations={[0, 0.35, 1]}
          style={{ borderRadius: 3, marginHorizontal: 20, borderWidth: 0, width: '100%' }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableButton
            TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
            TextStyles={[Theme.Button.btnPinkText, { fontSize: 18 }]}
            text={'OK'}
            onPress={this.closeModal}
          />
        </LinearGradient>
      </React.Fragment>
    );
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.closeModal}>
        <View style={inlineStyles.parent}>
          <TouchableWithoutFeedback>
            <View style={[inlineStyles.container, { paddingBottom: this.state.bottomPadding }]}>
              {!this.state.emailSent ? this.emailSignUp() : this.confirmEmail()}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default AddEmailScreen;
