import React, { Component } from 'react';
import { TextInput } from 'react-native';

import styles from './styles';

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
        <TextInput
          style={styles.linkText}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          returnKeyType="done"
          returnKeyLabel="Done"
          placeholder="Add a link to send viewers to."
          onChangeText={this.onChangeValue}
          value={this.state.value}
          autoCapitalize={'none'}
        />
      </React.Fragment>
    );
  }
}

export default VideoLink;
