import React, { Component } from 'react';
import { TextInput, Image } from 'react-native';

import styles from './styles';
import twitterDisconnectIcon from '../../assets/drawer-twitter-icon.png';
import defaultLinkIcon from '../../assets/default_link_icon.png';

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
        this.props.setError(this.state.error);
        if (!this.validLink()) return;
        this.setSocialIcon();
        this.props.onChangeLink(value);
      }
    );
  };

  setSocialIcon = () => {
    let hostName = this.state.value.match(/^(?:https?:\/\/)?(?:[^@\/\n]+@)?([^:\/?\n]+)/im)[1];
    if (!hostName) return;
    for (let domainName in WHITELISTED_DOMAINS) {
      if (hostName.includes(WHITELISTED_DOMAINS[domainName])) {
        this.setState({
          socialIcon: SOCIAL_ICONS[domainName]
        });
      } else {
        this.setState({
          socialIcon: SOCIAL_ICONS.DEFAULT
        });
      }
    }
  };

  validLink = () => {
    //synced with backend
    if (
      !this.state.value.match(
        /^(http(s)?:\/\/)([a-zA-Z0-9-_@:%+~#=]{1,256}\.)+[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=*]*)$/i
      )
    ) {
      this.setState(
        {
          error: 'Invalid link'
        },
        () => {
          this.props.setError(this.state.error);
        }
      );
      return false;
    }
    return true;
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
