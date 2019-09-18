import React, { PureComponent } from 'react';
import { View, Text, Image, Keyboard, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';

import BackArrow from '../CommonComponents/BackArrow';
import Colors from '../../theme/styles/Colors';
import inlineStyles from './styles';
import FormInput from '../../theme/components/FormInput';
import PepoApi from '../../services/PepoApi';
import Theme from '../../theme/styles';
import resendEmail from '../../assets/verify_email_resend.png';
import { ostErrors } from '../../services/OstErrors';
import Utilities from '../../services/Utilities';
import CurrentUser from '../../models/CurrentUser';

class EmailScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Email Address',
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerBackImage: <BackArrow />
    };
  };

  constructor(props) {
    super(props);
    this.initialValue = this.props.navigation.getParam('initialValue') || '';
    this.onChangeTextDelegate = this.props.navigation.getParam('onChangeTextDelegate');
    this.state = {
      email: this.initialValue,
      email_error: '',
      isSubmitting: false,
      isEditing: false,
      btnSubmitText: this.initialValue ? 'Resend Email' : 'Send Email',
      serverErrors: {},
      general_error: ''
    };
  }

  onSubmitEditing = (value) => {
    Keyboard.dismiss();

    if (!this.state.email) {
      this.setState({
        email_error: ostErrors.getUIErrorMessage('email_error')
      });
      return;
    }
    this.setState({
      isSubmitting: true,
      btnSubmitText: 'Sending...',
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
          btnSubmitText: this.state.email ? 'Resend Email' : 'Send Email'
        });
      });
  };

  onSuccess(res) {
    this.setState({
      isEditing: false
    });
  }

  onError(error) {
    this.setState({
      server_errors: error,
      general_error: ostErrors.getErrorMessage(error)
    });
  }

  onChangeText = (value) => {
    this.onChangeTextDelegate && this.onChangeTextDelegate(value.trim());
    this.setState({
      email: value,
      email_error: null,
      isEditing: true
    });
  };

  render() {
    return (
      <View style={inlineStyles.container}>
        <FormInput
          onChangeText={this.onChangeText}
          editable={true}
          fieldName="email"
          textContentType="emailAddress"
          style={[Theme.TextInput.textInputStyle]}
          placeholder="Email"
          returnKeyType="done"
          returnKeyLabel="Done"
          placeholderTextColor="#ababab"
          blurOnSubmit={false}
          value={this.state.email}
          serverErrors={this.state.server_errors}
          errorMsg={this.state.email_error}
          maxLength={320}
          onSubmitEditing={() => Keyboard.dismiss()}
          autoCapitalize={'none'}
          isFocus={false}
        />
        {this.state.email && !this.state.isEditing ? (
          <View style={inlineStyles.resend}>
            <View style={{ flexDirection: 'row', padding: 10, flexWrap: 'wrap' }}>
              <Image source={resendEmail} style={{ width: 50, height: 50 }} />
              <Text
                style={{ paddingLeft: 10, flex: 1 }}
              >{`We have sent an email on ${this.state.email}. Please go to your inbox and click on the  confirm button to confirm your email address.`}</Text>
            </View>
            <LinearGradient
              colors={['#ff7499', '#ff5566']}
              locations={[0, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 3, borderTopRadius: 0 }}
            >
              <TouchableOpacity
                style={[Theme.Button.btn, { borderWidth: 0 }]}
                disabled={this.state.isSubmitting}
                onPress={this.onSubmitEditing}
              >
                <Text style={[Theme.Button.btnPinkText, { textAlign: 'center' }]}>{this.state.btnSubmitText}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <LinearGradient
            colors={['#ff7499', '#ff5566']}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ marginTop: 25, borderRadius: 3 }}
          >
            <TouchableOpacity
              style={[Theme.Button.btn, { borderWidth: 0 }]}
              disabled={this.state.isSubmitting}
              onPress={this.onSubmitEditing}
            >
              <Text style={[Theme.Button.btnPinkText, { textAlign: 'center' }]}>{this.state.btnSubmitText}</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}

        <Text style={Theme.Errors.errorText}>{this.state.general_error}</Text>
      </View>
    );
  }
}

export default withNavigation(EmailScreen);
