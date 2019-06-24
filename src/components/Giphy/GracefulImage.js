import React, { Component } from 'react';
import { Animated, View, ActivityIndicator, Image } from 'react-native';

export default class GracefulImage extends Component {
  constructor(props) {
    super(props);
    this.color = '';
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
      duration: 3,
      useNativeDriver: true
    }).start();
  };

  setRandomColor() {
    let color = this.props.imageBackgroundColor;
    if (Array.isArray(color)) {
      this.color = color[Math.floor(Math.random() * color.length)];
    } else {
      this.color = color;
    }
  }

  render() {
    return (
      <View style={[{ ...this.props.imageWrapperStyle }, { backgroundColor: this.color }]}>
        {this.state.showLoader && this.props.showActivityIndicator && (
          <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
        )}
        <Image {...this.props} style={[this.props.style]} />
      </View>
    );
  }
}
