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
import multipleClickHandler from '../../services/MultipleClickHandler';

import styles from './styles';

const FOOTER_TAB_WIDTH = 50,
      ANIMATION_DURATION = 500,
      ITEM_MARGIN  = 40;


export default class VideoLength extends PureComponent{
  constructor(props){
    super(props);
    this.translateX = new Animated.Value(0);
    this.currentVal = AppConfig.videoRecorderConstants.videoLengths['30'];
  }

  onPress30 = () =>{
    this.showSecondsOnScreen(AppConfig.videoRecorderConstants.videoLengths['30'],0); // 0 ==> inorder to reset position
    this.currentVal = AppConfig.videoRecorderConstants.videoLengths['30'];
  }

  onPress90 = () =>{
    let translationPosition = -(FOOTER_TAB_WIDTH+ITEM_MARGIN); ////width + marginRight
    this.showSecondsOnScreen(AppConfig.videoRecorderConstants.videoLengths['90'],translationPosition);
    this.currentVal = AppConfig.videoRecorderConstants.videoLengths['90'];
  }

  showSecondsOnScreen = ( seconds , translationPosition ) =>{
    if(this.currentVal == seconds ){ return; }
    this.props.setVideoLength(seconds,true);
    this.slideTab(translationPosition);
  }

  slideTab = ( slidevalue ) =>{
    Animated.timing(this.translateX,
    {
      toValue : slidevalue,
      duration : ANIMATION_DURATION,
      useNativeDriver:true
    }).start();

  }

  render(){
    return (
      <Animated.View
        style={[styles.videolengthContainer,{transform : [{translateX:this.translateX}]}]}>
        <TouchableOpacity
          style={styles.videolengthItems}
          onPress={multipleClickHandler(() => {this.onPress30()})}
        >
          <Text>30 sec</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.videolengthItems}
          onPress={multipleClickHandler(() => {this.onPress90()})}
        >
          <Text>90 sec</Text>
        </TouchableOpacity>
      </Animated.View>
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