import React, { Component } from 'react';
import { Animated, View, ActivityIndicator } from 'react-native';

export default class GracefulImage extends Component {
  constructor(props) {
    super(props);
    this.setRandomColor();
  }

  state = {
    opacity: new Animated.Value(0),
    showLoader: true
  };

  onLoadStart = () => {
    this.setState({
      opacity: new Animated.Value(0)
    });
  };

  onLoad = () => {
    this.setState({
      showLoader: false
    });
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  setRandomColor() {
    let color = this.props.imageBackgroundColor;
    if (Array.isArray(color)) {
      this.color = color[Math.floor(Math.random() * color.length)];
    }
    this.color = color;
  }

  render() {
    return (
      <View style={[{ ...this.props.imageStyle }, { backgroundColor: this.color }]}>
        {this.state.showLoader && this.props.showActivityIndicator && (
          <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
        )}
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
      </View>
    );
  }
}
