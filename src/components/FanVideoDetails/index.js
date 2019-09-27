import React, { Component } from 'react';
import { Image, ImageBackground, TouchableOpacity, Platform, View, Text, Keyboard } from 'react-native';
import deepGet from 'lodash/get';
import utilities from '../../services/Utilities';
import CurrentUser from '../../models/CurrentUser';
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
import multipleClickHandler from '../../services/MultipleClickHandler';
import { getBottomSpace } from 'react-native-iphone-x-helper';

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
      headerTitleStyle: {
        fontFamily: 'AvenirNext-Medium'
      },
      headerLeft: (
        <TouchableOpacity
          onPress={multipleClickHandler(() => {
            FanVideoDetails.saveToRedux(navigation);
            navigation.goBack();
          })}
        >
          <BackArrow forcePaddingLeft={true} />
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
        paddingBottom: 10
      },
      error: null
    };
  }
  _keyboardShown = (e) => {
    let keyboardHeight = deepGet(e, 'endCoordinates.height') || 350;
    this.setState({
      viewStyle: {
        paddingBottom: keyboardHeight - (15 + getBottomSpace([true]))
      }
    });
  };

  _keyboardHidden = () => {
    this.setState({
      viewStyle: {
        paddingBottom: 10
      }
    });
  };

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
  }

  componentDidMount() {
    this.props.navigation.setParams({
      videoDesc: this.props.recordedVideo.video_desc,
      videoLink: this.props.recordedVideo.video_link
    });
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  enableStartUploadFlag = () => {
   // if (!this.validLink()) return;
   utilities.saveItem(`${CurrentUser.getUserId()}-accepted-camera-t-n-c`, true);
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
      videoLink: link,
      error: ''
    });
    //Done for the value to be accessible in static navigationOptions
    this.props.navigation.setParams({
      videoLink: link
    });
  };

  setError = (error) => {
    this.setState({
      error
    });
  };

  validLink = () => {
    if (!this.state.videoLink) return true;
    //synced with backend
    if (
      !this.state.videoLink.match(
        /^(http(s)?:\/\/)([a-zA-Z0-9-_@:%+~#=]{1,256}\.)+[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=*]*)$/i
      )
    ) {
      this.setState(
        {
          error: 'Invalid link'
        },
        () => {
          this.setError(this.state.error);
        }
      );
      return false;
    }
    return true;
  };

  render() {
    let imageUrl = this.props.recordedVideo.cover_image;
    return (
      <View
        style={[styles.container, this.state.viewStyle]}
        onKeyboardWillShow={(frames) => this.openedKeyboard(frames)}
        onKeyboardDidShow={(frames) => Platform.OS !== 'ios' && this.openedKeyboard(frames)}
        onKeyboardWillHide={(frames) => this.closedKeyboard(frames)}
        onKeyboardDidHide={(frames) => Platform.OS !== 'ios' && this.closedKeyboard(frames)}
        keyboardShouldPersistTaps="always"
        enableOnAndroid
        eyboardOpeningTime={0}
      >
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
          <View style={[styles.videoDescriptionItem, { alignItems: 'center', paddingVertical: 5 }]}>
            <VideoLink initialValue={this.props.recordedVideo.video_link} onChangeLink={this.onChangeLink} />
          </View>
        </View>
        <View>
          <Text style={[Theme.Errors.errorText, { alignSelf: 'center', marginBottom: 10 }]}>{this.state.error}</Text>
          <LinearGradient
            colors={['#ff7499', '#ff5566']}
            locations={[0, 1]}
            style={{ borderRadius: 3, marginHorizontal: 20, marginBottom: 20 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableButton
              TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
              TextStyles={[Theme.Button.btnPinkText]}
              style={{marginBottom: 20}}
              text="SHARE"
              onPress={multipleClickHandler(() => {
                this.enableStartUploadFlag();
              })}
            />
          </LinearGradient>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(FanVideoDetails);
