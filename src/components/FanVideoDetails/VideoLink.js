import React, { Component } from 'react';
import { TextInput, Image } from 'react-native';

import styles from './styles';
import AppConfig from '../../constants/AppConfig';

class VideoLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue
    };
  }

  onChangeValue = (value) => {
    this.setState(
      {
        value
      },
      () => {
        this.props.onChangeLink(value);
      }
    );
  };

  render() {
    return (
      <React.Fragment>
        <Image style={{ height: 26, width: 26 }} source={AppConfig.videoLinkConfig.VIDEO.SOCIAL_ICONS.DEFAULT} />
        <TextInput
          style={styles.linkText}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          returnKeyType="done"
          returnKeyLabel="Done"
          placeholder="Add link"
          onChangeText={this.onChangeValue}
          value={this.state.value}
          autoCapitalize={'none'}
        />
      </React.Fragment>
    );
  }
}

export default VideoLink;
