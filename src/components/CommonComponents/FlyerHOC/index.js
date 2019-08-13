import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback, Animated, Text, Image } from 'react-native';
import EventEmitter from 'eventemitter3';
import { WalletBalanceFlyerEventEmitter } from '../../WalletBalanceFlyer';

import styles from './styles';

import modalCross from '../../../assets/modal-cross-icon.png';

export const FlyerEventEmitter = new EventEmitter();

function flyerHOC(BaseComponent) {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.id = this.props.id;
      this.state = {
        animatedWidth: new Animated.Value(0),
        extensionVisible: false
      };
      this.contentOpacity = this.state.animatedWidth.interpolate({
        inputRange: [0, this.props.sliderWidth - 20, this.props.sliderWidth],
        outputRange: [0, 0.1, 1],
        extrapolate: 'clamp'
      });
      this.defaultStyles = {
        containerStyle: { left: 10 }
      };
      this.extensionStyles = {
        extensionStyleLeft: {
          right: -this.props.componentWidth / 2,
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50
        },
        displayTextStyleLeft: { paddingLeft: 10 },
        extensionStyleRight: {
          left: -this.props.componentWidth / 2,
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50
        },
        displayTextStyleRight: { marginLeft: 30 }
      };
    }

    componentDidMount() {
      FlyerEventEmitter.on('onToggleProfileFlyer', this.handleToggle.bind(this));
      FlyerEventEmitter.on('onShowProfileFlyer', this.handleShow.bind(this));
      FlyerEventEmitter.on('onHideProfileFlyer', this.handleHide.bind(this));
      FlyerEventEmitter.emit('onShowProfileFlyer', { id: 1 });
    }

    handleToggle = (id) => {
      if (id != this.id) {
        this.hideFlyer();
      }
    };

    handleShow = ({ id }) => {
      if (id == this.id) {
        this.showFlyer();
      }
    };

    handleHide = ({ id }) => {
      if (id == this.id) {
        this.hideFlyer();
      }
    };

    componentWillUnmount() {
      FlyerEventEmitter.removeListener('onToggleProfileFlyer');
      FlyerEventEmitter.removeListener('onShowProfileFlyer');
      FlyerEventEmitter.removeListener('onHideProfileFlyer');
    }

    showFlyer = () => {
      Animated.timing(this.state.animatedWidth, {
        toValue: this.props.sliderWidth || 60,
        duration: 300
      }).start(() => {
        this.setState({
          extensionVisible: true
        });
      });
      FlyerEventEmitter.emit('onToggleProfileFlyer', this.id);
      WalletBalanceFlyerEventEmitter.emit('onHideBalanceFlyer');
    };

    hideFlyer = () => {
      Animated.timing(this.state.animatedWidth, {
        toValue: 0,
        duration: 300
      }).start(() => {
        this.setState({
          extensionVisible: false
        });
      });
    };

    handlePress = () => {
      if (this.state.extensionVisible) {
        this.hideFlyer();
      } else {
        this.showFlyer();
      }
    };

    render() {
      return (
        <View
          style={[
            styles.container,
            { width: this.state.componentWidth, height: this.props.componentHeight },
            this.props.containerStyle || this.defaultStyles.containerStyle
          ]}
          pointerEvents="box-none"
        >
          <TouchableWithoutFeedback onPress={this.handlePress}>
            {this.props.extend ? (
              <View style={styles.extensionWrapper}>
                {this.props.extendDirection === 'right' ? <BaseComponent {...this.props} /> : <View />}
                <Animated.View
                  style={[
                    styles.extension,
                    { width: this.state.animatedWidth, height: this.props.componentHeight },
                    this.props.extendDirection === 'left'
                      ? this.extensionStyles.extensionStyleLeft
                      : this.extensionStyles.extensionStyleRight
                  ]}
                >
                  <View style={{ flexDirection: 'row' }}>
                    {this.props.extendDirection === 'left' ? (
                      <TouchableWithoutFeedback
                        onPress={this.hideFlyer}
                        style={{ alignItems: 'center', width: 19.5, height: 19 }}
                      >
                        <Animated.View
                          style={[styles.crossIcon, { opacity: this.contentOpacity, alignSelf: 'center' }]}
                        >
                          <Image style={{ width: 12.6, height: 12.6 }} source={modalCross} />
                        </Animated.View>
                      </TouchableWithoutFeedback>
                    ) : (
                      <View />
                    )}
                    <Animated.Text
                      style={[
                        styles.text,
                        { opacity: this.contentOpacity },
                        this.props.extendDirection === 'left'
                          ? this.extensionStyles.displayTextStyleLeft
                          : this.extensionStyles.displayTextStyleRight
                      ]}
                    >
                      {this.props.displayText}
                    </Animated.Text>
                    <Text style={this.props.highlightedTextStyle}>{this.props.highlightedText}</Text>
                    {this.props.extendDirection === 'right' ? (
                      <TouchableWithoutFeedback
                        onPress={this.hideFlyer}
                        style={{ alignItems: 'center', width: 19.5, height: 19 }}
                      >
                        <Animated.View
                          style={[styles.crossIcon, { opacity: this.contentOpacity, alignSelf: 'center' }]}
                        >
                          <Image style={{ width: 12.6, height: 12.6 }} source={modalCross} />
                        </Animated.View>
                      </TouchableWithoutFeedback>
                    ) : (
                      <View />
                    )}
                  </View>
                </Animated.View>
                {this.props.extendDirection === 'left' ? <BaseComponent {...this.props} /> : <View />}
              </View>
            ) : (
              <BaseComponent {...this.props} />
            )}
          </TouchableWithoutFeedback>
        </View>
      );
    }
  };
}

export default flyerHOC;
