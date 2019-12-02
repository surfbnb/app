import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  Keyboard,
  ScrollView,
  BackHandler
} from 'react-native';
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
import { StackActions } from 'react-navigation';
import PepoApi from "../../services/PepoApi";
import DataContract from "../../constants/DataContract";
import NumberInput from "../CommonComponents/NumberInput";
import NumberFormatter from "../../helpers/NumberFormatter";
import pricer from '../../services/Pricer';
import PepoPinkIcon from '../../assets/pepo-tx-icon.png';
import AppConfig from '../../constants/AppConfig'

//TODO setParams dont use

const mapStateToProps = (state, ownProps) => {
  return {
    balance : state.balance,
    recordedVideo: reduxGetter.getRecordedVideo()
  };
};

const DEFAUT_BT_VALUE = AppConfig.default_bt_amt;

class FanVideoDetails extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Details',
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
      link = navigation.state.params.videoLink,
      amount =  navigation.state.params.replyAmount;
    Store.dispatch(upsertRecordedVideo({ video_desc: desc, video_link: link, reply_amount:amount  }));
  };

  constructor(props) {
    super(props);
    this.videoDesc = this.props.recordedVideo.video_desc;
    this.videoLink = this.props.recordedVideo.video_link;
    this.replyAmount = this.props.recordedVideo.reply_amount ? this.props.recordedVideo.reply_amount : pricer.getToDecimal(DEFAUT_BT_VALUE);

    this.priceOracle = pricer.getPriceOracle();
    this.numberFormatter = new NumberFormatter();
    this.max =  props.balance;
    this.min = 0;
    this.state = {
      viewStyle: {
        paddingBottom: 10
      },
      error: null,
      amountError: null,
      linkError: null,
      descError : null,
      usdVal : this.weiToUSD(this.replyAmount),
      replyAmt : null,
      buttonText: 'Post',
      isSuggestOpen: false
    };

    if (! props.recordedVideo.video_type ) {
      let videoType = this.props.navigation.getParam('video_type');
      Store.dispatch(upsertRecordedVideo({ video_type: videoType }));
    }
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
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      videoDesc: this.props.recordedVideo.video_desc,
      videoLink: this.props.recordedVideo.video_link,
      replyAmount:  this.props.recordedVideo.reply_amount
    });

  }


  componentWillUnmount() {
    this.keyboardWillShowListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  handleBackButtonClick = () => {
    FanVideoDetails.saveToRedux(this.props.navigation);
    return false;
  };

  enableStartUploadFlag = () => {

      this.clearErrors();
      this.setState({buttonText: 'Posting...'});
      this.validateData().then((res) => {
        utilities.saveItem(`${CurrentUser.getUserId()}-accepted-camera-t-n-c`, true);
        Store.dispatch(
          upsertRecordedVideo({ video_desc: this.videoDesc,
        video_link: this.videoLink,
        reply_amount: this.replyAmount,
        do_upload: true })
        );
        this.props.navigation.dispatch(StackActions.popToTop());
        this.props.navigation.dispatch(StackActions.popToTop());
        this.setState({buttonText: 'Post'});
        this.props.navigation.navigate('HomeScreen');
      }).catch((err)=>{
        // show error on UI.
        this.setState({buttonText: 'Post'});
        this.showError(err);
      });
  };

  clearErrors = () => {
    this.setState({
      linkError: null,
      descError: null,
      amountError: null,
      error: null
    });
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
        case "per_reply_amount_in_wei":
          this.setState({amountError: error.msg});
          break;
      }
    }
  };

  validateData = () => {
    let params = {};
    params['video_description'] = this.videoDesc;
    params['link'] = this.videoLink;
    params['per_reply_amount_in_wei'] = this.replyAmount;
    return new Promise((resolve, reject) => {
      new PepoApi(DataContract.replies.validatePost)
        .post(params)
        .then((res)=>{
          if (res && res.success){
            return resolve(res);
          } else {
            return reject(res.err);
          }
        }).catch((err)=>{
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

  validLink = () => {
    if (!this.videoLink) return true;
    //synced with backend
    if (
      !this.videoLink.match(
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


  onErrorCallBack = ( errMsg ) =>{
    this.setState({
      amountError : errMsg
    })
  }

  replyAmountChange = ( value )=>{
    this.replyAmount = pricer.getToDecimal(value);
    if (isNaN(this.replyAmount)) this.replyAmount = "";

    let formattedUsdVal = this.weiToUSD( pricer.getToDecimal(value) );
    //Done for the value to be accessible in static navigationOptions
    this.props.navigation.setParams({
      replyAmount: this.replyAmount
    });
    this.setState({
      usdVal : formattedUsdVal,
      replyAmt : value
    });
  };
  weiToUSD = (value ) =>{
    let weiToBt =  pricer.getFromDecimal(value, 2),
      usdVal          = this.priceOracle.btToFiat(weiToBt),
      formattedUsdVal =  this.numberFormatter.getFormattedValue( usdVal );
    return formattedUsdVal;
  }

  pointerEventForInPageElement() {
    if ( this.state.isSuggestOpen ) {
      return "none";
    }
    return "auto";
  }

  onSuggestionsPanelClose = () => {
    this.setState({
      isSuggestOpen: false
    });
  }

  onSuggestionsPanelOpen = () => {
    this.setState({
      isSuggestOpen: true
    });
  }

  render() {
    let imageUrl = this.props.recordedVideo.cover_image,
    value = pricer.getFromDecimal(this.replyAmount, 2) ;
    return (
      <ScrollView
        contentContainerStyle={[styles.container, this.state.viewStyle]}
        keyboardShouldPersistTaps={ this.state.isSuggestOpen ? 'always': 'handled'}
        enableOnAndroid
        bounces={false}
        keyboardOpeningTime={0}
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
            <VideoDescription 
              initialValue={this.props.recordedVideo.video_desc} 
              onChangeDesc={this.onChangeDesc} 
              onSuggestionsPanelOpen={this.onSuggestionsPanelOpen}
              onSuggestionsPanelClose={this.onSuggestionsPanelClose}
            />
          </View>
          <Text style={[Theme.Errors.errorText, { alignSelf: 'center' }]}>{this.state.descError }</Text>
          <View style={styles.videoLinkItem} pointerEvents={this.pointerEventForInPageElement()}>
            <Text style={{width: 135}}>Link</Text>
            <VideoLink initialValue={this.props.recordedVideo.video_link} onChangeLink={this.onChangeLink} />
          </View>
          <Text style={[Theme.Errors.errorText, { alignSelf: 'center'}]}>{this.state.linkError }</Text>
          <View style={styles.videoAmountItem} pointerEvents={this.pointerEventForInPageElement()}>
            <Text style={{width: 130}}>Set Price for replies</Text>
            <Image source={PepoPinkIcon} style={{marginLeft:5,height:13,width:13, marginRight: 3}}/>
            <View style={styles.replyAmtWrapper}>
              <NumberInput
                value = {value}
                onChangeText = {this.replyAmountChange}
                style={{flexBasis: '50%', paddingRight: 6}}
                errorStyle={[styles.errorStyle]}
                numberOfLines={1} ellipsizeMode={'tail'}
              />
              <Text style={{flexBasis: '50%', textAlign: 'right', color: '#ff5566'}} numberOfLines={1} ellipsizeMode={'tail'}>
                ${this.state.usdVal}
              </Text>
            </View>
          </View>
          <Text style={[Theme.Errors.errorText, { alignSelf: 'center' }]}>{this.state.amountError }</Text>
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
              text={this.state.buttonText}
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

export default connect(mapStateToProps)(FanVideoDetails);
