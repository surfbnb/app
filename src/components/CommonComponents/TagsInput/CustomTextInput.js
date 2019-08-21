import React, { PureComponent } from 'react';
import { View, Text, TextInput } from 'react-native';

import Theme from '../../../theme/styles';
import inlineStyles from './styles';

class CustomTextInput extends PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    setTimeout(() => {
      this.refs['customInput'].focus();
    }, 0);
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
          autoFocus={true}
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
          ref="customInput"
        />
        <Text style={inlineStyles.countStyle}>{this.props.count} /300</Text>
      </View>
    );
  }
}

export default CustomTextInput;
