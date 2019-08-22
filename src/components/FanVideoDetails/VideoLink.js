import React, { Component } from 'react';
import { TextInput, Image } from 'react-native';

import styles from './styles';
import twitterDisconnectIcon from '../../assets/drawer-twitter-icon.png';

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

  render() {
    return (
      <React.Fragment>
        <Image style={{ height: 24, width: 25.3 }} source={twitterDisconnectIcon} />
        <TextInput
          style={{ color: '#4a90e2', flex: 1, marginLeft: 10 }}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          returnKeyType="done"
          returnKeyLabel="Done"
          placeholder="Add link"
          onChangeText={this.onChangeValue}
        >
          {this.state.value}
        </TextInput>
      </React.Fragment>
    );
  }
}

export default VideoLink;
