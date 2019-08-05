import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, Button, Animated, Text } from 'react-native';
import tickIcon from '../../../assets/tick_icon.png';

class InfoSlider extends Component {
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
  }

  render() {
    return (
      <View style={{ flexDirection: 'row', position: 'absolute', top: 50, left: 20, zIndex: 1 }}>   
        <TouchableWithoutFeedback onPress={this.showInfo}>
          <Image style={{ height: this.props.componentHeight, width: this.props.componentWidth }} source={tickIcon}></Image>
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            {
              height: this.props.componentWidth,
              left: -(this.props.componentWidth / 2),
              zIndex: -1,
              backgroundColor: 'white',
              borderTopRightRadius: 50,
              borderBottomRightRadius: 50,
              justifyContent: 'center'
              //alignItems: 'center'
            },
            { width: this.state.animatedWidth }
          ]}
        >
          <View style={{flexDirection: 'row'}}>
          <Text style={{ paddingLeft: (this.props.componentWidth / 2 ) + 4 }}>Uploading Video</Text> 
          <TouchableWithoutFeedback onPress={this.hideInfo}>
          <Text style={{marginLeft:10}}>X</Text>
          </TouchableWithoutFeedback>        
          </View>  
        </Animated.View>
      </View>
    );
  }
}

export default InfoSlider;
