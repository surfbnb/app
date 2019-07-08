import React, { PureComponent } from 'react';
import { View, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';

export default class GracefulImage extends PureComponent {
  constructor(props) {
    super(props);
    this.color = '';
    this.setRandomColor();
  }

  state = {
    showLoader: true
  };

  onLoad = () => {
    this.setState({
      showLoader: false
    });
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
      <React.Fragment>
        {this.state.showLoader && this.props.showActivityIndicator && (
          <ActivityIndicator style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
        )}
        <FastImage
          {...this.props}
          onLoad={this.onLoad}
          style={[{ ...this.props.style }, { backgroundColor: this.color }]}
        />
      </React.Fragment>
    );
  }
}
