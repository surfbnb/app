import React, { PureComponent } from 'react';
import { View, TouchableWithoutFeedback, Animated, Text } from 'react-native';

import EventEmitter from 'eventemitter3';

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
      this.opacity = this.state.animatedWidth.interpolate({
        inputRange: [0, this.props.sliderWidth - 20, this.props.sliderWidth],
        outputRange: [0, 0.05, 0.6],
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
      Animated.timing(this.state.animatedWidth, { toValue: this.props.sliderWidth || 60, duration: 300 }).start(() => {
        this.setState({
          extensionVisible: true
        });
      });
      FlyerEventEmitter.emit('onToggleProfileFlyer', this.id);
    };

    hideFlyer = () => {
      Animated.timing(this.state.animatedWidth, { toValue: 0, duration: 300 }).start(() => {
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
            { flexDirection: 'row', position: 'absolute', zIndex: 1 },
            this.props.containerStyle || this.defaultStyles.containerStyle
          ]}
        >
          {this.props.extend ? (
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              {this.props.extendDirection == 'right' ? (
                <BaseComponent handlePress={this.handlePress} {...this.props} />
              ) : (
                <View />
              )}
              <Animated.View
                style={[
                  {
                    height: this.props.componentHeight,
                    zIndex: -1,
                    backgroundColor: 'white',
                    opacity: this.opacity,
                    justifyContent: 'center'
                  },
                  { width: this.state.animatedWidth },
                  this.props.extendDirection == 'left'
                    ? this.extensionStyles.extensionStyleLeft
                    : this.extensionStyles.extensionStyleRight
                ]}
              >
                <View style={{ flexDirection: 'row' }}>
                  {this.props.extendDirection == 'left' ? (
                    <TouchableWithoutFeedback onPress={this.hideFlyer}>
                      <Text style={{ marginLeft: 10 }}>X</Text>
                    </TouchableWithoutFeedback>
                  ) : (
                    <View />
                  )}
                  <Text
                    style={
                      this.props.extendDirection == 'left'
                        ? this.extensionStyles.displayTextStyleLeft
                        : this.extensionStyles.displayTextStyleRight
                    }
                  >
                    {this.props.displayText}
                  </Text>
                  <Text style={this.props.highlightedTextStyle}>{this.props.highlightedText}</Text>
                  {this.props.extendDirection == 'right' ? (
                    <TouchableWithoutFeedback onPress={this.hideFlyer}>
                      <Text style={{ marginLeft: 10 }}>X</Text>
                    </TouchableWithoutFeedback>
                  ) : (
                    <View />
                  )}
                </View>
              </Animated.View>
              {this.props.extendDirection == 'left' ? (
                <BaseComponent handlePress={this.handlePress} {...this.props} />
              ) : (
                <View />
              )}
            </View>
          ) : (
            <BaseComponent {...this.props} />
          )}
        </View>
      );
    }
  };
}

export default flyerHOC;
