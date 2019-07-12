import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated
} from "react-native";

import Colors from "../../../theme/styles/Colors"
import Heart from "../../../assets/heartImage.png"

const animDuration = 1000
export default class ClapBubble extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      yPosition: new Animated.Value(20),
      xPosition: new Animated.Value(0),
      opacity: new Animated.Value(1),
      count: 0,
      claps: []
    };
  }

  componentDidMount() {
    let random = Math.random();
    let toValue = random*100*(random >= 0.5 ? -1 : 1);
    Animated.parallel([
      Animated.timing(this.state.yPosition, {
        toValue: -150,
        duration: animDuration,
        useNativeDriver: true
      }),
      Animated.timing(this.state.xPosition, {
        toValue,
        duration: animDuration,
        useNativeDriver: true
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: animDuration,
        useNativeDriver: true
      })
    ]).start(() => {
      setTimeout(() => {
        this.props.animationComplete(this.props.count);
      }, animDuration);
    });
  }
  render() {
    const RotateData = this.state.opacity.interpolate({
      inputRange: [0,0.8, 1],
      outputRange: ['-90deg','-90deg', '0deg'],
    });
    let animationStyle = {
      transform: [{ translateY: this.state.yPosition }, {translateX: this.state.xPosition}, { rotate: RotateData }],
      opacity: this.state.opacity
    };
    return (
      <Animated.View style={[animationStyle, styles.clapbubble]}>
        {/*<Text style={styles.clapText}>+ {this.props.count}</Text>*/}
        <Image style={{height: 40,width: 40,}} source={Heart}></Image>
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  clapbubble: {
    elevation: 4,
    // backgroundColor:Colors.primary ,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex:-1
  },
  clapText: {
    color: "white",
    fontSize: 20
  }
});
