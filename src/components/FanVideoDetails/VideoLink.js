import React, { Component } from 'react';
import { TextInput, Image, Text } from 'react-native';

import styles from './styles';
import Theme from '../../theme/styles';
import twitterDisconnectIcon from '../../assets/drawer-twitter-icon.png';
import defaultLinkIcon from '../../assets/default_link_icon.png';
import URL from 'url';

const SOCIAL_ICONS = {
  TWITTER: twitterDisconnectIcon,
  DEFAULT: defaultLinkIcon
};

const WHITELISTED_DOMAINS = {
  TWITTER: 'twitter.com'
};

class VideoLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue,
      error: null,
      socialIcon: SOCIAL_ICONS.DEFAULT
    };
  }

  onChangeValue = (value) => {
    this.setState(
      {
        value,
        error: ''
      },
      () => {
        if (!this.validLink()) return;
        this.setSocialIcon();
        this.props.onChangeLink(value);
      }
    );
  };

  setSocialIcon = () => {
    let url = URL.parse(this.state.value);
    for (let domainName in WHITELISTED_DOMAINS) {
      if (url['hostname'].includes(WHITELISTED_DOMAINS[domainName])) {
        // to check other way of checking invalid url
        this.setState({
          socialIcon: SOCIAL_ICONS[domainName]
        });
      }
    }
  };

  validLink = () => {
    let url = URL.parse(this.state.value);
    if (!url['hostname']) {
      this.setState({
        error: 'Invalid link'
      });
      return false;
    }
    return true;
  };

  render() {
    return (
      <React.Fragment>
        <Image style={{ height: 26, width: 26 }} source={this.state.socialIcon} />
        <TextInput
          style={{ color: '#4a90e2', flex: 1, marginLeft: 5 }}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          returnKeyType="done"
          returnKeyLabel="Done"
          placeholder="Add link"
          onChangeText={this.onChangeValue}
          value={this.state.value}
        />
        <Text style={Theme.Errors.errorText}>{this.state.error}</Text>
      </React.Fragment>
    );
  }
}

export default VideoLink;
