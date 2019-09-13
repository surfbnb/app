import React, { PureComponent } from 'react';
import { View, Text, TextInput } from 'react-native';

import Theme from '../../../theme/styles';

const MAX_LENGTH = 500;

class CustomTextInput extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white' }}>
        <TextInput
          style={[Theme.TextInput.textInputStyle, this.props.textInputStyles]}
          onSelectionChange={this.props.locationGetter}
          onChangeText={(value) => {
            this.props.onChangeText(value);
          }}
          multiline={true}
          autoFocus={this.props.autoFocus}
          value={this.props.value}
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
