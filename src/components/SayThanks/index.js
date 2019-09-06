import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
  BackHandler,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback
} from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import reduxGetter from '../../services/ReduxGetters';
import deepGet from 'lodash/get';
import inlineStyles from './Style';
import modalCross from '../../assets/modal-cross-icon.png';
import sendMessageIcon from '../../assets/send-message-icon.png';
import ProfilePicture from '../ProfilePicture';
import FormInput from '../../theme/components/FormInput';
import PepoApi from '../../services/PepoApi';
import Theme from '../../theme/styles';

const bottomSpace = getBottomSpace([true]),
  extraPadding = 10,
  safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

class SayThanks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeDisabled: false,
      thanksMessage: '',
      server_errors: {},
      thanksError: '',
      posting: false,
      bottomPadding: safeAreaBottomSpace,
      focus: false
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.setState({
      focus: true
    });
  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  _keyboardShown(e) {
    let bottomPaddingValue = deepGet(e, 'endCoordinates.height') || 350;
    bottomPaddingValue -= 50;
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

  closeModal() {
    this.setState({ thanksMessage: '' }, () => {
      this.props.navigation.goBack();
    });
  }

  handleBackButtonClick = () => {
    if (this.state.closeDisabled) {
      return true;
    }
  };

  changeMessage = (val) => {
    this.setState({ thanksMessage: val });
  };

  sendMessage = () => {
    this.setState({ server_errors: {}, thanksError: '' });
    if (this.state.thanksMessage.trim().length == 0) {
      this.setState({ thanksError: 'Message can not be empty' });
      return;
    }
    this.setState({ posting: true });
    return new PepoApi(`/users/thank-you`)
      .post({ notification_id: this.props.navigation.getParam('notificationId'), text: this.state.thanksMessage })
      .then((res) => {
        this.setState({ posting: false });
        if (res && res.success) {
          this.closeModal();
          this.props.navigation.getParam('sendMessageSuccess')();
        } else {
          this.setState({ server_errors: res });
        }
      })
      .catch((error) => {
        this.setState({ posting: false });
      });
  };

  render() {
    return (
      <TouchableWithoutFeedback
        onPressOut={() => {
          if (!this.state.closeDisabled) {
            this.closeModal();
          }
        }}
      >
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <TouchableWithoutFeedback>
            <View style={[inlineStyles.container, { paddingBottom: this.state.bottomPadding }]}>
              <View style={inlineStyles.headerWrapper}>
                <View style={{ flexDirection: 'row' }}>
                  <ProfilePicture userId={this.props.navigation.getParam('userId')} />
                  <Text style={inlineStyles.modalHeader}>
                    {reduxGetter.getName(this.props.navigation.getParam('userId'))}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    this.closeModal();
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  disabled={this.state.closeDisabled}
                >
                  <Image source={modalCross} style={{ width: 17.5, height: 17 }} />
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                <View style={{ flex: 1 }}>
                  <FormInput
                    onChangeText={this.changeMessage}
                    placeholder="Thanks for supporting me!"
                    fieldName="sayThanksInput"
                    style={[Theme.TextInput.textInputStyle, { height: 50, color: '#2a293b', marginTop: 0 }]}
                    value={`${this.state.thanksMessage}`}
                    isFocus={this.state.focus}
                    serverErrors={this.state.server_errors}
                    errorMsg={this.state.thanksError}
                    placeholderTextColor="#ababab"
                  />
                </View>
                <TouchableOpacity onPress={this.sendMessage} style={{ alignSelf: 'flex-start' }}>
                  <Image
                    style={{ height: 40, width: 40, marginLeft: 8, marginTop: 5, transform: [{ rotate: '-45deg' }] }}
                    source={sendMessageIcon}
                  />
                </TouchableOpacity>
              </View>
              <View style={{ height: 15 }}>
                {this.state.posting && <ActivityIndicator size="small" color="#168dc1" />}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default SayThanks;
