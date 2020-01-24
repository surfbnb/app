import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import inlineStyles from './styles';

export default class PinInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: ''
    };
  }

  componentDidMount() {
    this.focusListner = this.props.navigation.addListener('didFocus', (payload) => {
      this.resetPin();
      this.refs['pin_input'].focus();
    });
  }

  componentWillUnmount() {
    if (this.focusListner) {
      this.focusListner.remove();
    }
  }

  resetPin = () => {
    this.setState({ pin: '' });
  };

  render() {
    return (
      <View style={inlineStyles.container}>
        <SmoothPinCodeInput
          codeLength={6}
          autoFocus={true}
          ref="pin_input"
          cellSize={12}
          cellStyle={{
            borderColor: '#A9A9A9',
            backgroundColor: '#A9A9A9',
            borderRadius: 24,
            overflow: 'hidden'
          }}
          cellSpacing={30}
          cellStyleFocused={{
            borderColor: '#A9A9A9'
          }}
          textStyle={{
            fontSize: 30,
            color: '#ef5566',
            marginTop: Platform.OS == 'ios' ? -10 : -5,
            marginLeft: Platform.OS === 'ios' ? -1 : -2.5
          }}
          textStyleFocused={{}}
          value={this.state.pin}
          password={true}
          mask="●"
          maskDelay={0}
          onFulfill={(pin) => {
            this.props.onPinChange(pin, this.resetPin);
          }}
          onTextChange={(pin) => this.setState({ pin })}
        />
      </View>
    );
  }
}
