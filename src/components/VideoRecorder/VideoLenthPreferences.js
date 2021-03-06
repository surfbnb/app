import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  Easing,
  Animated,
  Text
} from 'react-native';
import AppConfig from '../../constants/AppConfig';
import multipleClickHandler from '../../services/MultipleClickHandler';

import styles from './styles';

const FOOTER_TAB_WIDTH = 50,
      ANIMATION_DURATION = 500,
      ITEM_MARGIN  = 40,
      FADE_IN_DURATION = 200,
      FADE_OUT_DURATION = 200,
      DELAY_DURATION = 800;


export default class VideoLenthPreferences extends PureComponent{
  constructor(props){
    super(props);
    this.state = {
      showSeconds:false,
      videoMaxLength : this.props.getInitialPref()
    }
    if(this.props.getInitialPref() === 30){
      this.translateX = new Animated.Value(0);
    }else{
      this.translateX = new Animated.Value(-(FOOTER_TAB_WIDTH+ITEM_MARGIN));
    }

    this.fadeValue = new Animated.Value(1);
  }

  onPress30 = () =>{
    this.showSecondsOnScreen(AppConfig.videoRecorderConstants.videoLenthPreferences['30'],0); // 0 ==> inorder to reset position
    this.setCurrentVideoMaxLength(AppConfig.videoRecorderConstants.videoLenthPreferences['30'])
  }

  onPress90 = () =>{
    let translationPosition = -(FOOTER_TAB_WIDTH+ITEM_MARGIN); ////width + marginRight
    this.showSecondsOnScreen(AppConfig.videoRecorderConstants.videoLenthPreferences['90'],translationPosition);
    this.setCurrentVideoMaxLength(AppConfig.videoRecorderConstants.videoLenthPreferences['90'])
  }

  setVideoLength = ( secondsValue , showSeconds ) =>{
    this.setCurrentVideoMaxLength( secondsValue );
    this.animateSeconds();
    this.setState({
      showSeconds : showSeconds
    })
  }

  getCurrentVideoMaxLength = () => {
    return this.state.videoMaxLength;
  }

  setCurrentVideoMaxLength = ( val ) =>{
    if (!val) return;
    this.props.onChange && this.props.onChange(val);
    this.setState({
      videoMaxLength : val
    })
  }

  animateSeconds = () =>{
    Animated.sequence([
      Animated.timing(this.fadeValue, {
        toValue: 1,
        easing:Easing.fadeIn,
        duration:FADE_IN_DURATION,
        useNativeDriver: true
      }),
      Animated.delay(DELAY_DURATION),
      Animated.timing(this.fadeValue, {
        toValue: 0,
        easing:Easing.fadeOut,
        duration: FADE_OUT_DURATION,
        useNativeDriver: true
      })
    ]).start()
  }

  showSecondsOnScreen = ( seconds , translationPosition ) =>{
    if(this.getCurrentVideoMaxLength() == seconds ){ return; }
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
        <Text style={styles.secondsAnimatedText}>{ this.getCurrentVideoMaxLength() } </Text>
      </Animated.View>
    )
  }

  getSecondsStyle = (seconds) =>{
    if(this.getCurrentVideoMaxLength() === seconds){
      return styles.boldText;
    }
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
            <Text style={[styles.videolengthItemText,this.getSecondsStyle(30)]}>30 sec</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.videolengthItems}
            onPress={multipleClickHandler(() => {this.onPress90()})}
          >
            <Text style={[styles.videolengthItemText,this.getSecondsStyle(90)]}>90 sec</Text>
          </TouchableOpacity>
        </Animated.View>
        {this.state.showSeconds &&(
          this.showSecondsMarkup()
        )}
      </React.Fragment>
    )
  }
}

VideoLenthPreferences.defaultProps = {
  getInitialPref : () => {
    return AppConfig.videoRecorderConstants.videoLenthPreferences['30'];
  }
}