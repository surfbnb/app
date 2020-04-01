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
    this.state = {
      showSeconds:false,
      videoMaxLength : AppConfig.videoRecorderConstants.videoLengths['30']
    }
    this.translateX = new Animated.Value(0);
      this.currentVal = AppConfig.videoRecorderConstants.videoLengths['30'];
    this.fadeValue = new Animated.Value(1);
    // this.videoMaxLength = AppConfig.videoRecorderConstants.videoLengths['30'];
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

  setVideoLength = ( secondsValue , showSeconds ) =>{
    this.setCurrentVideoMaxLength( secondsValue );
    this.animateSeconds();
    this.setState({
      showSeconds : showSeconds
    })
  }

  getCurrentVideomaxLength = () => {
    return this.state.videoMaxLength;
  }

  setCurrentVideoMaxLength = ( val ) =>{
    if (!val) return;
    this.setState({
      videoMaxLength : val
    })
  }

  animateSeconds = () =>{
    Animated.sequence([
      Animated.timing(this.fadeValue, {
        toValue: 1,
        easing:Easing.linear,
        duration:10,
        useNativeDriver: true
      }),
      Animated.timing(this.fadeValue, {
        toValue: 0,
        easing:Easing.linear,
        duration: 3000,
        useNativeDriver: true
      })
    ]).start()
  }

  showSecondsOnScreen = ( seconds , translationPosition ) =>{
    if(this.currentVal == seconds ){ return; }
    this.setVideoLength(seconds,true);
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

  showSecondsMarkup =()=>{
    return(
      <Animated.View style={[styles.secondsAnimatedComponent,{opacity:this.fadeValue}]}>
        <Text style={styles.secondsAnimatedText}>{ this.getCurrentVideomaxLength() } </Text>
      </Animated.View>
    )
  }

  render(){
    return (
      <React.Fragment>
        <Animated.View
          style={[styles.videolengthContainer,{transform : [{translateX:this.translateX}]}]}>
          <TouchableOpacity
            style={styles.videolengthItems}
            onPress={multipleClickHandler(() => {this.onPress30()})}
          >
            <Text style={styles.videolengthItemText}>30 sec</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.videolengthItems}
            onPress={multipleClickHandler(() => {this.onPress90()})}
          >
            <Text style={styles.videolengthItemText}>90 sec</Text>
          </TouchableOpacity>
        </Animated.View>
        {this.state.showSeconds &&(
          this.showSecondsMarkup()
        )}
      </React.Fragment>
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