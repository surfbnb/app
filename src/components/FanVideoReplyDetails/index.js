import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
  ScrollView
} from 'react-native';
import deepGet from 'lodash/get';
import CurrentUser from '../../models/CurrentUser';
import styles from './styles';
import VideoDescription from '../FanVideoDetails/VideoDescription';
import BackArrow from '../CommonComponents/BackArrow';
import Colors from '../../theme/styles/Colors';
import playIcon from '../../assets/play_icon.png';
import TouchableButton from './TouchableButton';
import Theme from '../../theme/styles';
import LinearGradient from 'react-native-linear-gradient';
import VideoLink from '../FanVideoDetails/VideoLink';
import reduxGetter from '../../services/ReduxGetters';
import { connect } from 'react-redux';
import Store from '../../store';
import { upsertRecordedVideo } from '../../actions';
import multipleClickHandler from '../../services/MultipleClickHandler';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { StackActions } from 'react-navigation';
import PepoApi from "../../services/PepoApi";
import DataContract from "../../constants/DataContract";
import pricer from "../../services/Pricer";
import {ensureDeivceAndSession, ON_USER_CANCLLED_ERROR_MSG} from "../../helpers/TransactionHelper";
import Toast from "../../theme/components/NotificationToast";
import { WORKFLOW_CANCELLED_MSG } from '../../services/OstSdkErrors';
import AppConfig from '../../constants/AppConfig';

//TODO setParams dont use

const PROCESSING_TEXT = 'Processing...';

const mapStateToProps = (state, ownProps) => {
  return {
    recordedVideo: reduxGetter.getRecordedVideo()
  };
};

class FanVideoReplyDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Post',
      headerBackTitle: null,
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
            FanVideoReplyDetails.saveToRedux(navigation);
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
    this.videoDesc = props.recordedVideo.video_desc || '';
    this.videoLink = props.recordedVideo.video_link || '';
    if (! props.recordedVideo.video_type ){
      // It means
      this.replyObject = this.props.navigation.getParam('reply_obj');
      let videoType = this.props.navigation.getParam('video_type');
      Store.dispatch(upsertRecordedVideo({ reply_obj: this.replyObject, video_type: videoType }));
    } else {
      this.replyObject = props.recordedVideo.reply_obj;
    }

    this.state = {
      viewStyle: {
        paddingBottom: 10
      },
      error: null,
      linkError: null,
      descError : null,
      buttonText: null,
      isSuggestOpen: false
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
    this.setState({buttonText: this.setButtonText()});
  }

  setButtonText = () => {
    if (! this.checkIfReplyChargeable()){
      return 'Reply';
    }
    return null;
  };


  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  checkIfReplyChargeable = () => {
    let btAmount = this.getAmountToSend();
    return this.replyObject.isChargeble && btAmount != '0';
  };


  ensureSession = () => {
    return new Promise((resolve, reject)=> {
      let btAmount = this.getAmountToSend();
      const btInDecimal = pricer.getToDecimal(btAmount);
      if (! this.checkIfReplyChargeable()) {
        return resolve();
      }
      ensureDeivceAndSession(CurrentUser.getOstUserId(), btInDecimal, (device) => {
        this._deviceUnauthorizedCallback(device);
        reject();
      }, (errorMessage, success) => {
        if ( success ) {
          return resolve();
        } else {
          if (ON_USER_CANCLLED_ERROR_MSG !== errorMessage && WORKFLOW_CANCELLED_MSG !== errorMessage) {
            Toast.show({
              text: errorMessage,
              icon: 'error'
            });
          }
          return reject()
        }
      });
    });

    // check If session active
  };


  _deviceUnauthorizedCallback = (device) => {
    this.props.navigation.push('AuthDeviceDrawer', { device });
  };


  giveUploadConsent = () => {
    Store.dispatch(
      upsertRecordedVideo({ video_desc: this.videoDesc, video_link: this.videoLink, do_upload: true })
    );
    const popAction = StackActions.pop(1);
    this.props.navigation.dispatch(popAction);
    this.props.navigation.dispatch(popAction);
  };




  enableStartUploadFlag = () => {
    this.clearErrors();
    //todo @mayur button text change to validating or similar
    let buttonText = this.state.buttonText;
    this.setState({buttonText: PROCESSING_TEXT});
    this.validateData().then((res) => {
      let videoOwnerId = this.replyObject.replyReceiverUserId;
      if (videoOwnerId === CurrentUser.getUserId()){
        this.giveUploadConsent();
        return;
      }
      this.ensureSession().then(() => {
       this.giveUploadConsent();
      }).catch(()=> {
      });
      this.setState({buttonText: buttonText});
   }).catch((err)=>{
     // show error on UI.
     this.setState({buttonText: buttonText});
     this.showError(err);
   }) ;
  };


  showError = (err) => {
    if(!err.error_data) return;
    for (let error of err.error_data){
      switch (error.parameter) {
        case "link":
          this.setState({linkError: error.msg});
          break;
        case "video_description":
          this.setState({descError: error.msg});
          break;
      }
    }
    const status = deepGet(err , "code") || "";
    if(status.toLowerCase() == AppConfig.beKnownErrorCodeMaps.validateUploadError){
      this.setState({error: err.msg});
    }
  };


  clearErrors = () => {
    this.setState({
      linkError: null,
      descError: null,
      error: null
    });
  };


  validateData = () => {
    let params = {};
    //todo : @mayur put strings in data contract file
    params['video_description'] = this.videoDesc;
    params['link'] = this.videoLink;

    params['parent_kind'] = 'video';
    params['parent_id'] = this.replyObject.replyReceiverVideoId;

    return new Promise((resolve, reject) => {
      new PepoApi(DataContract.replies.validateReply)
        .post(params)
        .then((res)=>{
          if (res && res.success){
            return resolve(res);
          } else {
            return reject(res.err);
          }
        })
        .catch((err)=>{
          return reject(err);
        })
    });
  };

  onChangeDesc = (desc) => {
    this.videoDesc = desc;
    //Done for the value to be accessible in static navigationOptions
    this.props.navigation.setParams({
      videoDesc: desc
    });
  };

  onChangeLink = (link) => {
    this.videoLink = link;
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


  getAmountToSend  = () => {
   let amount = this.replyObject.amountToSendWithReply ;
    return pricer.getToBT(pricer.getFromDecimal(amount), 2);
  };


  pointerEventForInPageElement() {
    if ( this.state.isSuggestOpen ) {
      return "none";
    }
    return "auto";
  };

  onSuggestionsPanelClose = () => {
    this.setState({
      isSuggestOpen: false
    });
  };

  onSuggestionsPanelOpen = () => {
    this.setState({
      isSuggestOpen: true
    });
  };

  render() {
    let imageUrl = this.props.recordedVideo.cover_image;
    return (
      <ScrollView
        contentContainerStyle={[styles.container, this.state.viewStyle]}
        keyboardShouldPersistTaps={'handled'}
        enableOnAndroid
        bounces={false}
        keyboardOpeningTime={0}
      >
        <View>
          <View style={[styles.videoDescriptionItem]}>
            <TouchableOpacity
              onPress={multipleClickHandler(() => {
                FanVideoReplyDetails.saveToRedux(this.props.navigation);
                this.props.navigation.goBack();
              })}
              style={{ height: 100 }}
            >
              <ImageBackground style={styles.posterImageSkipFont} source={{ uri: imageUrl }}>
                <Image style={styles.playIconSkipFont} source={playIcon} />
              </ImageBackground>
            </TouchableOpacity>
            <VideoDescription 
              initialValue={this.props.recordedVideo.video_desc} 
              onChangeDesc={this.onChangeDesc} 
              onSuggestionsPanelOpen={this.onSuggestionsPanelOpen}
              onSuggestionsPanelClose={this.onSuggestionsPanelClose}
            />
          </View>

          <Text style={[Theme.Errors.errorText, { alignSelf: 'center' }]}>{this.state.descError }</Text>
          <View style={styles.videoLinkItem} pointerEvents={this.pointerEventForInPageElement()}>
            <Text style={{flex: 1}}>Link</Text>
            <VideoLink initialValue={this.props.recordedVideo.video_link} onChangeLink={this.onChangeLink} />
          </View>
          <Text style={[Theme.Errors.errorText, { alignSelf: 'center'}]}>{this.state.linkError }</Text>
        </View>
        <View style={{zIndex: -1}} pointerEvents={this.pointerEventForInPageElement()}>
          <Text style={[Theme.Errors.errorText, { alignSelf: 'center', marginBottom: 10 }]}>{this.state.error}</Text>
          <LinearGradient
            colors={['#ff7499', '#ff5566']}
            locations={[0, 1]}
            style={{ borderRadius: 3, marginHorizontal: 20, marginBottom: 50 }}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableButton
              TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
              TextStyles={[Theme.Button.btnPinkText]}
              style={{marginBottom: 20}}
              // if buttonText is passed, it has priority over textBeforeImage & textAfterImage.
              buttonText={this.state.buttonText}
              textBeforeImage='Reply | '
              textAfterImage={this.getAmountToSend()}
              onPress={multipleClickHandler(() => {
                this.enableStartUploadFlag();
              })}
            />
          </LinearGradient>
        </View>
      </ScrollView>
    );
  }
}

export default connect(mapStateToProps)(FanVideoReplyDetails);
