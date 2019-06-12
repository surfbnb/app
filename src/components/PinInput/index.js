import React, { Component } from 'react';
import { Text, View } from 'react-native';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import inlineStyles from './styles';

export default class PinInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pin: '',
      isFocus: true
    };
  }

  componentDidMount() {
    if (this.props.navigation) {
      this.focusListner = this.props.navigation.addListener('didFocus', (payload) => {
        this.setState({ pin: '' });
      });
    }
  }

  componentWillUnmount() {
    if (this.focusListner) {
      this.focusListner.remove();
    }
  }

  render() {
    return (
      <View style={inlineStyles.container}>
        <SmoothPinCodeInput
          codeLength={6}
          autoFocus={this.state.isFocus}
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
            backgroundColor: '#9accd7',
            fontSize: 30,
            color: '#9accd7'
          }}
          textStyleFocused={{}}
          value={this.state.pin}
          password
          mask="o"
          onFulfill={this.props.onPinChange}
          onTextChange={(pin) => this.setState({ pin })}
        />
      </View>
    );
  }
}

//TODO remove this comment
