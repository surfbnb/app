import React, { Component } from 'react';
import { View } from 'react-native';

import styles from './styles';
import VideoDescription from './VideoDescription';

class FanVideoDetails extends Component {
  constructor(props) {
    super(props);
    this.initialValue = '';
  }
  render() {
    return (
      <View style={{ padding: 20, flex: 1, backgroundColor: '#ffffff' }}>
        <View>
          {/* <Image source={this} /> */}
          <VideoDescription
            horizontal={this.props.horizontal}
            initialValue={this.initialValue}
            onChangeTextDelegate={this.onChangeTextDelegate}
            placeholderText="Bio"
            submitEvent={this.submitEvent}
          />
        </View>
      </View>
    );
  }
}

export default FanVideoDetails;
