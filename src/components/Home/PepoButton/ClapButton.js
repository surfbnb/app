import * as React from "react";
import {
  Animated,
  Easing,
  View,
  Vibration
} from "react-native";
import pepo_tx_img from "../../../assets/pepo_anim_btn.png"
import pepo_tx_img_disabled from "../../../assets/Pepo-tx-disabled.png"
import Colors from "../../../theme/styles/Colors"


const animDuration = 1000;
export default class ClapButton extends React.Component{

  constructor(props){
    super();
    this.state = {
      scaleValue : new Animated.Value(0),
    }
    this.timedClap = props.isClapping;
  }


  AnimateFunction(){
    return Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.scaleValue, {
          toValue: 1,
          duration: animDuration-1,
          easing:Easing.linear,
          useNativeDriver: true
        }),
        Animated.timing(this.state.scaleValue, {
          toValue: 0,
          duration: 1,
          useNativeDriver: true
        })
      ]),
      {
        iterations: -1
      }
    );
  }

  render(){
    if(this.props.isClapping){
      this.firstClap = this.props.isClapping;
      this.timedClap = this.props.isClapping;
      this.AnimateFunction().start();
      Vibration.vibrate([1,1]);
      setTimeout(()=>{
        this.timedClap = false
      },95)
    } else {
      this.AnimateFunction().stop();
    }

    let interpolatedRingOpacity = this.state.scaleValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0]
    });

    let interpolateRingScaleOut = this.state.scaleValue.interpolate({
      inputRange : [0, 0.3, 1],
      outputRange : [0, 1.2, 1.3]
    });

    return(
      <View>
        <Animated.Image
          id={this.props.id+"_animated_image1"}
          style={[{
            height: 50,
            width: 50,
            borderRadius :25,
            borderWidth : this.props.isSelected || this.props.isClapping? 3 : 0,
            borderColor: this.props.isSelected || this.props.isClapping?  Colors.primary : Colors.white,
            zIndex:100,
            ...this.timedClap ? {transform : [
              {
                scale : this.state.scaleValue.interpolate({
                  inputRange : [0,0.5, 1],
                  outputRange : [1,0.90, 1]
                })
              }
            ]} : {}
          }]}
          source={this.props.disabled ? pepo_tx_img_disabled : pepo_tx_img}
        />
        <Animated.View
          id={this.props.id+"_animated_image2"}
          style={[
            {
              height:50,
              width:50,
              position:'absolute',
              borderRadius : 25,
              borderWidth :  2,
              borderColor: Colors.primary,
              opacity: this.timedClap ? interpolatedRingOpacity : 0,
              transform : [
                {
                  scale : interpolateRingScaleOut
                }
              ],
            }
          ]}
        >

        </Animated.View>

      </View>
    )
  }
}
