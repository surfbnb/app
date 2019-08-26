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
  TWITTER: 'twitter'
};

class VideoLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue
    };
  }

  onChangeValue = (value) => {
    this.setState({
      value
    });
    this.props.onChangeLink(value);
  };

  getSocialIcon = () => {
    // let domain = this.state.value.split('/')[0];
    // for(let domainName in WHITELISTED_DOMAINS){
    //   if(domain.includes(WHITELISTED_DOMAINS[domainName])){

    //   }
    // }
    return SOCIAL_ICONS.DEFAULT;
  };

  render() {
    return (
      <React.Fragment>
        <Image style={{ height: 26, width: 26 }} source={this.getSocialIcon()} />
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
      </React.Fragment>
    );
  }
}

export default VideoLink;
