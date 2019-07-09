import React, { Component } from 'react';
import {View, Text, Image, TouchableOpacity, Animated} from "react-native";

import inlineStyles from "./styles";


class ClapBubble extends Component {

  constructor(props){
    super(props);
    this.state={
      yPosition: new Animated.Value(0),
      animatedyPosition: new Animated.ValueXY({x:0, y:0})
    }
  }

  componentDidMount(){
    Animated.timing(this.state.yPosition,
      {
        toValue: -100,
        duration: 1000
      }).start();
    Animated.timing(this.state.animatedyPosition,
      {
        toValue: {x: 0, y: -100},
        duration: 1000
      }).start();
  }


  render(){

    let animateInterpolate = this.state.animatedyPosition.y.interpolate({
      inputRange: [-100, -75, -50, -30, 0],
      outputRange: [1, 0.75, 0.5, 0.3, 0]
    })

    let animatedStyle= {
      transform: [{
        translateY: this.state.yPosition
      }],
      opacity: animateInterpolate
    }
    return (
      <Animated.View
        style={[inlineStyles.clappedBubble, animatedStyle]}
        pointerEvents="auto"
      >
        <Text style={inlineStyles.btnText}>BTN</Text>
      </Animated.View>
    )
  }

}

export default ClapBubble;