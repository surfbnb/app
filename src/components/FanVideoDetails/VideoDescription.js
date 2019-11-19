import React, { PureComponent } from 'react';
import {View, Text} from 'react-native';

import inlineStyles from './styles';
import TagsInput from '../CommonComponents/TagsInput';

class VideoDescription extends PureComponent {
  constructor(props) {
    super(props);
    this.value = this.props.initialValue;
  }

  onChangeValue = (value) => {
    this.props.onChangeDesc(value);
  };

  submitEvent = () => {};

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TagsInput
          horizontal={false}
          initialValue={this.value}
          onChangeVal={this.onChangeValue}
          placeholderText="Write something about  your video"
          submitEvent={this.submitEvent}
          textInputStyles={inlineStyles.videoDescription}
          dropdownStyle={inlineStyles.dropDownStyle}
          maxLength={110}
          autoFocus={false}
          mentions={["#" ,  "@"]}
        />
      </View>
    );
  }
}

export default VideoDescription;
