import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, Button, Animated, Text } from 'react-native';
import tickIcon from '../../../assets/tick_icon.png';

class RightInfoSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedWidth: new Animated.Value(0)
    };
  }

  showInfo = () => {
    Animated.timing(this.state.animatedWidth, { toValue: this.props.sliderWidth, duration: 300 }).start();
  };

  hideInfo = () => {
    Animated.timing(this.state.animatedWidth, { toValue: 0, duration: 300 }).start();
  };

  render() {
    return (
      <View style={{ flexDirection: 'row', position: 'absolute', top: 50, right: 20, zIndex: 1 }}>
        <Animated.View
          style={[
            {
              height: this.props.componentWidth,
              right: -(this.props.componentWidth / 2),
              zIndex: -1,
              backgroundColor: 'white',
              borderTopLeftRadius: 50,
              borderBottomLeftRadius: 50,
              justifyContent: 'center'
              //alignItems: 'center'
            },
            { width: this.state.animatedWidth }
          ]}
        >
          <View style={{ flexDirection: 'row' }}>
          <TouchableWithoutFeedback onPress={this.hideInfo}>
              <Text style={{ marginHorizontal: 10 }}>X</Text>
            </TouchableWithoutFeedback>

            <Text>Uploading Video</Text>            
          </View>
        </Animated.View>

        <TouchableWithoutFeedback onPress={this.showInfo}>
          <Image
            style={{ height: this.props.componentHeight, width: this.props.componentWidth }}
            source={tickIcon}
          ></Image>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default RightInfoSlider;
