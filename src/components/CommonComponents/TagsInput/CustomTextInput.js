import React, { PureComponent } from 'react';
import { View, Text, TextInput, Platform } from 'react-native';

import Theme from '../../../theme/styles';

const MAX_LENGTH = 500;
const IS_ANDROID = Platform.OS === 'android';

class CustomTextInput extends PureComponent {
  constructor(props) {
    super(props);
    this.textInputRef = null;
    this.textVal = "";
    this.needsOnChangeText = false;
  }

  setTextInputRef = (textInputRef) => {
    this.textInputRef = textInputRef;
    if ( this.props.value ) {
        this.setInputText( this.props.value );
    }
  };

  setInputText = ( text ) => {
    if ( this.textInputRef ) {
        this.textInputRef.setNativeProps({
            "text": text
        });
        this.textVal = text;
    }
  };

  onChangeText = (text) => {
    this.textVal = text;
    if ( IS_ANDROID ) {
      this.needsOnChangeText = true;
    } else {
      // Only for iOS
      this.triggerOnTextChange(text);
    }
  }

  onSelectionChange = (...args) => {
    this.props.locationGetter(...args);
    if ( this.needsOnChangeText ) { 
      this.triggerOnTextChange(this.textVal);
    }
  }

  triggerOnTextChange  = (text) => {
    this.props.onChangeText(text);
    this.needsOnChangeText = false;
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <TextInput
          ref={this.setTextInputRef}
          style={[Theme.TextInput.textInputStyle, this.props.textInputStyles]}
          onSelectionChange={this.onSelectionChange}
          onChangeText={this.onChangeText}
          multiline={true}
          autoFocus={this.props.autoFocus}
          placeholder={this.props.placeholderText}
          multiline={true}
          numberOfLines={3}
          returnKeyType="done"
          returnKeyLabel="Done"
          blurOnSubmit={true}
          onSubmitEditing={() => {
            this.props.submitEvent();
          }}
          maxLength={this.props.maxLength || MAX_LENGTH}
        />
      </View>
    );
  }
}

export default CustomTextInput;
