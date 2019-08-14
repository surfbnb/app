import React, { Component } from 'react';
import { Text, Animated, TouchableOpacity, Image } from 'react-native';
import EventEmitter from 'eventemitter3';

import Colors from '../../theme/styles/Colors';
import styles from './styles';
import modalCross from '../../assets/modal-cross-icon.png';

const toastEventEmitter = new EventEmitter();
const duration = 500;

export class NotificationToastComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      config: {
        message: 'This is a notification!',
        showClose: true,
        icon: null,
        imageUri: null,
        onImageClickDelegate: null
      }
    };
    this.animateOpacityValue = new Animated.Value(0);
  }

  componentDidMount() {
    toastEventEmitter.on('showToast', this.showToast.bind(this));
    toastEventEmitter.on('hideToast', this.hideToast.bind(this));
  }

  componentWillUnmount() {
    this.timerID && clearTimeout(this.timerID);
    toastEventEmitter.removeListener('showToast');
    toastEventEmitter.removeListener('hideToast');
  }

  showToast(config, delay) {
    if (config) {
      this.setState({
        config: { ...this.state.config, ...config }
      });
    }
    this.setState({ showToast: true }, () => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 1,
        duration,
        useNativeDriver: true
      }).start(delay && this.hideToast(delay));
    });
  }

  hideToast = (delay = 0) => {
    this.timerID = setTimeout(() => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 0,
        duration,
        useNativeDriver: true
      }).start(() => {
        this.setState({ showToast: false });
        clearTimeout(this.timerID);
      });
    }, delay);
  };

  render() {
    if (this.state.showToast) {
      return (
        <Animated.View
          style={[
            styles.animatedToastView,
            {
              opacity: this.animateOpacityValue,
              transform: [
                {
                  translateY: this.animateOpacityValue.interpolate({
                    inputRange: [0, 0.8],
                    outputRange: [0, 10],
                    extrapolate: 'clamp'
                  })
                }
              ]
            }
          ]}
        >
          {this.state.config.imageUri && (
            <TouchableOpacity
              onPress={this.state.config.onImageClickDelegate}
              style={{
                position: 'absolute',
                left: 10,
                width: 60,
                height: 60,
                alignItems: 'flex-start',
                justifyContent: 'center',
                zIndex: 1
              }}
            >
              <Image
                resizeMode="cover"
                source={{ uri: this.state.config.imageUri }}
                style={{ width: 40, height: 40 }}
              ></Image>
            </TouchableOpacity>
          )}
          <Text
            numberOfLines={2}
            style={[
              styles.toastBoxInsideText,
              { color: Colors.black, paddingLeft: this.state.config.imageUri ? 45 : 0, paddingRight: 15 }
            ]}
          >
            {this.state.config.message}
          </Text>
          {this.state.config.showClose && (
            <TouchableOpacity
              onPress={() => {
                this.hideToast();
              }}
              style={{
                position: 'absolute',
                right: 10,
                width: 40,
                height: 40,
                alignItems: 'flex-end',
                justifyContent: 'center'
              }}
            >
              <Image source={modalCross} style={{ width: 13, height: 12.6 }} />
            </TouchableOpacity>
          )}
        </Animated.View>
      );
    } else {
      return null;
    }
  }
}

export const NotificationToast = {
  showToast: (config, delay) => {
    toastEventEmitter.emit('showToast', config, delay);
  },
  hideToast: () => {
    toastEventEmitter.emit('hideToast');
  }
};
