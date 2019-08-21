import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import TagsInput from '../CommonComponents/TagsInput';
import styles from './styles';

class VideoDescription extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>VideoDescription</Text>
      </View>
    );
  }
}

export default VideoDescription;
