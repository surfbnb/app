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
import Heart from "../../../assets/heart.png"

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
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(this.state.xPosition, {
        toValue,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(this.state.opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true
      })
    ]).start(() => {
      setTimeout(() => {
        this.props.animationComplete(this.props.count);
      }, 500);
    });
  }
  render() {
    const RotateData = this.state.opacity.interpolate({
      inputRange: [0, 1],
      outputRange: ['-45deg', '0deg'],
    });
    let animationStyle = {
      transform: [{ translateY: this.state.yPosition }, {translateX: this.state.xPosition}, { rotate: RotateData }],
      opacity: this.state.opacity
    };
    return (
      <Animated.View style={[animationStyle, styles.clapbubble]}>
        <Text style={styles.clapText}>+ {this.props.count}</Text>
        {/*<Image source={Heart}></Image>*/}
      </Animated.View>
    );
  }
}
const styles = StyleSheet.create({
  clapbubble: {
    elevation: 4,
    backgroundColor:Colors.primary ,
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
