import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated, Easing, Platform } from 'react-native';

import CoverImage from '../CommonComponents/CoverImage';
import Colors from '../../theme/styles/Colors';
import { connect } from 'react-redux';
import reduxGetter from '../../services/ReduxGetters';
import { withNavigation } from 'react-navigation';
import pepoTxIcon from '../../assets/pepo-white-icon.png';

const mapStateToProps = (state, ownProps) => {
  return {
    videoInProcessing: reduxGetter.getVideoProcessingStatus(state)
  };
};

class UserProfileCoverImage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rotate: new Animated.Value(0),
      scale: new Animated.Value(0.1)
    };
  }

  animatewa() {
    Animated.sequence([
      Animated.delay(800),
      Animated.timing(this.state.rotate, {
        toValue: 1,
        easing: Easing.elastic(1.5),
        useNativeDriver: true
      }),
      Animated.loop(
        Animated.timing(this.state.scale, {
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      )
    ]).start();
  }

  componentDidMount() {
    this.animatewa();
  }

  render() {
    const rotateData = this.state.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-135deg']
    });
    const scaleData = this.state.scale.interpolate({
      inputRange: [0.11, 0.5, 1],
      outputRange: [1, Platform.OS == 'ios' ? 1.15 : 1.3, 1]
    });
    let animationStyle = {
      transform: [{ scale: scaleData }, { rotate: rotateData }]
    };
    return (
      <View style={styles.container}>
        <View style={{ position: 'relative' }}>
          <CoverImage
            height={0.5}
            wrapperStyle={{
              borderWidth: 1,
              borderRadius: 5,
              overflow: 'hidden',
              borderColor: Colors.dark
            }}
            userId={this.props.userId}
          />
          {this.props.videoInProcessing ? (
            <View
              style={{
                position: 'absolute',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                overflow: 'hidden'
              }}
            >
              <Animated.Image
                style={[
                  animationStyle,
                  {
                    width: 40,
                    height: 40,
                    marginBottom: 20,
                    marginTop: -20
                    // top: '50%', left: '50%', marginLeft: -20,
                  }
                ]}
                source={this.state.showLoadingImage ? pepoTxIcon : pepoTxIcon}
              />
              <Text style={styles.loadingMessage}>Updating Video...</Text>
            </View>
          ) : (
            <View />
          )}
        </View>
        {!this.props.videoInProcessing ? (
          <TouchableOpacity
            disabled={this.props.videoInProcessing}
            onPress={this.props.uploadVideo}
            style={styles.updateVideo}
          >
            <Text style={{ color: Colors.white }}>Update Video</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: Dimensions.get('screen').height * 0.5,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 5
  },
  updateVideo: {
    position: 'absolute',
    bottom: -1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  loadingMessage: {
    fontSize: 18,
    color: 'white',
    fontWeight: '500'
  }
});

export default connect(mapStateToProps)(withNavigation(UserProfileCoverImage));
