import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Easing,
  TouchableWithoutFeedback
} from "react-native";
import pepo_tx_img from "../../../assets/pepo_anim_btn.png"
import inlineStyles from '../styles'
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
    Animated.loop(
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
    ).start();
  }

  componentDidMount(){
    this.AnimateFunction();
  }

  render(){
    if(this.props.isClapping){
      this.timedClap = this.props.isClapping;
      setTimeout(()=>{
        this.timedClap = false
      },95)
    }
    let interpolateScaleIn = this.state.scaleValue.interpolate({
      inputRange : [0, 0.5, 1],
      outputRange : [1, 0.90, 1]
    });

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
          style={[{
            height: 60,
            width: 60,
            borderRadius : 30,
            borderWidth : 3,
            borderColor: Colors.primary,
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
          source={pepo_tx_img}
        />
        <Animated.View
          style={[
            {
              height:60,
              width:60,
              position:'absolute',
              borderRadius : 70,
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