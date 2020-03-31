import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
  Easing,
  Animated,
  Text,
  ScrollView
} from 'react-native';
import AppConfig from '../../constants/AppConfig';

import styles from './styles';

export default class VideoLength extends PureComponent{
  constructor(props){
    super(props);
    this.currentVal = AppConfig.videoRecorderConstants.videoLengths['30'];
  }

  onPress30 = () =>{
    this.showSecondsOnScreen(AppConfig.videoRecorderConstants.videoLengths['30']);
  }

  onPress90 = () =>{
    this.showSecondsOnScreen(AppConfig.videoRecorderConstants.videoLengths['90']);
  }

  showSecondsOnScreen = ( seconds ) =>{
    if(this.currentVal == seconds ){ return; }
    this.props.setVideoLength(seconds,true);
  }

  render(){
    return (
      <View
        style={styles.videolengthContainer}>
        <TouchableOpacity
          style={styles.videolengthItems}
          onLayout={(event)=>{
            var {x, y, width, height} = event.nativeEvent.layout;
            console.log("x,",x,":width,",width);
          }}
          onPress={this.onPress30} // TODO: Shraddha implement multiclickhandler
        >
          <Text>30 sec </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.videolengthItems}
          onLayout={(event)=>{
            var {x, y, width, height} = event.nativeEvent.layout;
            console.log(" 90 secs x,",x,":width,",width);
          }}
          onPress={this.onPress90} // TODO: Shraddha implement multiclickhandler
        >
          <Text>90 sec </Text>
        </TouchableOpacity>
      </View>
    )

  }
}

/**
 * TODO @Shraddha 
 * Fade in fade out animation complete 
 * Slide animation 
 * Try to bring Fade in markup inside
 * Object loop Buttons creation 
 **/