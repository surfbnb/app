import React, { Component } from 'react';
import { Animated } from 'react-native';

export default class GracefulImage extends Component {
  state = {
    opacity: new Animated.Value(0)
  };

  onLoadStart = () => {
    this.setState({
      opacity: new Animated.Value(0)
    });
  };

  onLoad = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  render() {
    return (
      <Animated.Image
        onLoad={this.onLoad}
        onLoadStart={this.onLoadStart}
        {...this.props}
        style={[
          {
            opacity: this.state.opacity,
            transform: [
              {
                scale: this.state.opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.85, 1]
                })
              }
            ]
          },
          this.props.style
        ]}
      />
    );
  }
}
