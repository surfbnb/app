import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';

import styles from './styles';
import VideoIcon from '../../../assets/icon-video.png';
import flyerHOC from '../../CommonComponents/FlyerHOC';
import ProgressCircle from 'react-native-progress/CircleSnail';
import Colors from '../../../theme/styles/Colors';

class VideoLoadingFlyer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            width: 46,
            height: 46,
            backgroundColor: Colors.white,
            opacity: 0.9,
            borderRadius: 23,
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <ProgressCircle size={53} color={Colors.primary} duration={1000} direction="clockwise"></ProgressCircle>
        </View>
        <Image source={VideoIcon} style={{ width: 25, height: 15, position: 'absolute' }} />
      </View>
    );
  }
}

export default flyerHOC(VideoLoadingFlyer);
