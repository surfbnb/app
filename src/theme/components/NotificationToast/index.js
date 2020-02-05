import React, { Component } from 'react';
import { Text, Animated, TouchableOpacity, Image, View } from 'react-native';
import EventEmitter from 'eventemitter3/index';

import Colors from '../../styles/Colors';
import styles from './styles';
import modalCross from '../../../assets/modal-cross-icon.png';
import toastSuccess from '../../../assets/toast_success.png';
import toastError from '../../../assets/toast_error.png';
import pepoIcon from '../../../assets/pepo-tx-icon.png';

const toastEventEmitter = new EventEmitter();
const duration = 500;

export class NotificationToastComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      config: {}
    };
    this.defaultConfig = {
      text: '',
      showClose: true,
      icon: null,
      imageUri: null,
      onImageClickDelegate: null
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
    if(!config || !config.text) return;
    this.setState({
      config: { ...this.defaultConfig, ...config }
    });
    this.setState({ showToast: true }, () => {
      Animated.timing(this.animateOpacityValue, {
        toValue: 1,
        duration,
        useNativeDriver: true
      }).start(() => {
        this.hideToast(delay);
      });
    });
  }

  hideToast = (delay = 3000) => {
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
          {this.state.config.icon && (
            <View
              style={{
                position: 'absolute',
                left: 15,
                width: 30,
                height: 30,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
            >
              {this.state.config.icon == 'success' && (
                <Image source={toastSuccess} style={{ width: 30, height: 30 }}></Image>
              )}
              {this.state.config.icon == 'error' && (
                <Image source={toastError} style={{ width: 30, height: 30 }}></Image>
              )}
               {this.state.config.icon == 'pepo' && (
                <Image source={pepoIcon} style={{ width: 30, height: 30 }}></Image>
              )}
            </View>
          )}
          <Text
            numberOfLines={2}
            style={[
              styles.toastBoxInsideText,
              {
                color: Colors.black,
                paddingLeft: this.state.config.imageUri || this.state.config.icon ? 45 : 0,
                paddingRight: 20
              }
            ]}
          >
            {this.state.config.text}
          </Text>
          {this.state.config.showClose && (
            <TouchableOpacity
              onPress={() => {
                this.hideToast(0);
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

export default {
  show: (config, delay) => {
    toastEventEmitter.emit('showToast', config, delay);
  },
  hide: () => {
    toastEventEmitter.emit('hideToast');
  }
};
