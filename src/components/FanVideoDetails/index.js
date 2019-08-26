import React, { Component } from 'react';
import { Image, ImageBackground, TouchableOpacity, Platform, Dimensions, View } from 'react-native';

import styles from './styles';
import VideoDescription from './VideoDescription';
import BackArrow from '../CommonComponents/BackArrow';
import Colors from '../../theme/styles/Colors';
import playIcon from '../../assets/play_icon.png';
import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';
import LinearGradient from 'react-native-linear-gradient';
import VideoLink from './VideoLink';
import reduxGetter from '../../services/ReduxGetters';
import { connect } from 'react-redux';
import Store from '../../store';
import { upsertRecordedVideo } from '../../actions';
import { Header, SafeAreaView } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getStatusBarHeight, getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import multipleClickHandler from '../../services/MultipleClickHandler';

const safeAreaHeight = getStatusBarHeight() + getBottomSpace([true]);

const mapStateToProps = (state, ownProps) => {
  return {
    recordedVideo: reduxGetter.getRecordedVideo()
  };
};

class FanVideoDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Post',
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerLeft: (
        <TouchableOpacity
          style={{ paddingLeft: 20 }}
          onPress={multipleClickHandler(() => {
            FanVideoDetails.saveToRedux(navigation);
            navigation.goBack();
          })}
        >
          <BackArrow />
        </TouchableOpacity>
      )
    };
  };

  static saveToRedux = (navigation) => {
    let desc = navigation.state.params.videoDesc,
      link = navigation.state.params.videoLink;
    Store.dispatch(upsertRecordedVideo({ video_desc: desc, video_link: link }));
  };

  constructor(props) {
    super(props);
    this.state = {
      videoDesc: '',
      videoLink: '',
      viewStyle: {
        justifyContent: 'space-between',
        marginBottom: 20,
        height: Dimensions.get('window').height - safeAreaHeight
      },
    }
  }
  openedKeyboard(frames) {
    let deviceHeight = frames.endCoordinates.screenY;
    this.setState({
      viewStyle: {
        justifyContent: 'space-between',
        ...isIphoneX({
          height: Dimensions.get('window').height + safeAreaHeight + Header.HEIGHT - deviceHeight
        }, {
          height: Dimensions.get('window').height - safeAreaHeight + Header.HEIGHT - deviceHeight
        })
      }
    });
  }

  closedKeyboard(frames) {
    this.setState({
      viewStyle: { justifyContent: 'space-between', height: Dimensions.get('window').height - safeAreaHeight }
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      videoDesc: this.props.recordedVideo.video_desc,
      videoLink: this.props.recordedVideo.video_link
    });
  }

  enableStartUploadFlag = () => {
    Store.dispatch(
      upsertRecordedVideo({ video_desc: this.state.videoDesc, video_link: this.state.videoLink, do_upload: true })
    );
    this.props.navigation.navigate('HomeScreen');
  };

  onChangeDesc = (desc) => {
    this.setState({
      videoDesc: desc
    });
    //Done for the value to be accessible in static navigationOptions
    this.props.navigation.setParams({
      videoDesc: desc
    });
  };

  onChangeLink = (link) => {
    this.setState({
      videoLink: link
    });
    //Done for the value to be accessible in static navigationOptions
    this.props.navigation.setParams({
      videoLink: link
    });
  };

  render() {
    let imageUrl = this.props.recordedVideo.cover_image;
    return (
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.container, this.state.viewStyle]}
        onKeyboardWillShow={(frames) => this.openedKeyboard(frames)}
        onKeyboardDidShow={(frames) => Platform.OS !== 'ios' && this.openedKeyboard(frames)}
        onKeyboardWillHide={(frames) => this.closedKeyboard(frames)}
        onKeyboardDidHide={(frames) => Platform.OS !== 'ios' && this.closedKeyboard(frames)}
        keyboardShouldPersistTaps="always"
      >
        <SafeAreaView forceInset={{ top: 'always' }} style={[this.state.viewStyle]}>
          <View>
            <View style={[styles.videoDescriptionItem]}>
              <TouchableOpacity
                onPress={multipleClickHandler(() => {
                  FanVideoDetails.saveToRedux(this.props.navigation);
                  this.props.navigation.goBack();
                })}
                style={{ height: 100 }}
              >
                <ImageBackground style={styles.posterImageSkipFont} source={{ uri: imageUrl }}>
                  <Image style={styles.playIconSkipFont} source={playIcon} />
                </ImageBackground>
              </TouchableOpacity>
              <VideoDescription initialValue={this.props.recordedVideo.video_desc} onChangeDesc={this.onChangeDesc} />
            </View>
            <View style={[styles.videoDescriptionItem,{ alignItems: 'center', paddingVertical: 5 }]}>
              <VideoLink initialValue={this.props.recordedVideo.video_link} onChangeLink={this.onChangeLink} />
            </View>
          </View>
          <LinearGradient
            colors={['#ff7499', '#ff5566']}
            locations={[0, 1]}
            style={{ borderRadius: 3, marginHorizontal: 20 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableButton
              TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
              TextStyles={[Theme.Button.btnPinkText]}
              text="SHARE"
              onPress={multipleClickHandler(() => {
                this.enableStartUploadFlag();
              })}
            />
          </LinearGradient>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    );
  }
}

export default connect(mapStateToProps)(FanVideoDetails);
