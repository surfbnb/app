import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Easing,
  Animated
} from 'react-native';

import styles from './styles';
import multipleClickHandler from "../../services/MultipleClickHandler";
import AppConfig from '../../constants/AppConfig';

const ANIM_DURATION = 500;
const ANIM_FROM_VAL = 1;
const ANIM_TO_VAL = 1.8;

class RecordActionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scale: new Animated.Value(ANIM_FROM_VAL),
      styleAsDisabled: false
    };
  }

  styleAsDisabled = (action = true) => {
    this.setState({
      styleAsDisabled: action
    });
  };

  loopedAnimation = () => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.scale, {
          toValue: ANIM_TO_VAL,
          duration: ANIM_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(this.state.scale, {
          toValue: ANIM_FROM_VAL,
          duration: ANIM_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

  };

  stopAnimation = () => {
    Animated.spring(this.state.scale, {
      toValue: ANIM_FROM_VAL,
      duration: ANIM_DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
  };

  render() {

    let modColor = this.state.scale.interpolate({
      inputRange: [ANIM_FROM_VAL, ANIM_TO_VAL],
      outputRange: [0.5, 1],
      extrapolate: 'clamp',
    });

    let animationStyle = {
      opacity: modColor,
      transform: [{scale: this.state.scale}]
    };

    return <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <TouchableOpacity
        disabled={this.props.disabled}
        onPressIn={multipleClickHandler(this.props.onPressIn) }
        onPressOut={this.props.onPressOut}
        onPress={this.props.onPress}
        onLongPress={this.props.onLongPress}
        delayLongPress={AppConfig.videoRecorderConstants.longPressDelay}
        activeOpacity={0.9}
      >
        <View style={[ {position: 'relative'},  {opacity: (this.props.disabled || this.state.styleAsDisabled) ? 0.5 : 1} ]}>
          <Animated.View style={[styles.outerCircle, animationStyle]} />
          {this.props.children}
        </View>
      </TouchableOpacity>
    </View>
  }

}

export default RecordActionButton;
