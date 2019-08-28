import React, { Component } from 'react';
import { TextInput, Image } from 'react-native';

import styles from './styles';
import AppConfig from '../../constants/AppConfig';
import { getSocialIcon } from '../../helpers/helpers';

class VideoLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue,
      socialIcon: AppConfig.videoLinkConfig.VIDEO.SOCIAL_ICONS.DEFAULT
    };
  }

  onChangeValue = (value) => {
    this.setState(
      {
        value
      },
      () => {
        this.setSocialIcon();
        this.props.onChangeLink(value);
      }
    );
  };

  setSocialIcon = () => {
    this.setState({
      socialIcon: getSocialIcon(this.state.value, 'VIDEO')
    });
  };

  render() {
    return (
      <React.Fragment>
        <Image style={{ height: 26, width: 26 }} source={this.state.socialIcon} />
        <TextInput
          style={styles.linkText}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          returnKeyType="done"
          returnKeyLabel="Done"
          placeholder="Add link"
          onChangeText={this.onChangeValue}
          value={this.state.value}
        />
      </React.Fragment>
    );
  }
}

export default VideoLink;
