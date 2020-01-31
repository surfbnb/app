import React, { Component } from 'react';
import { View, StatusBar, Platform } from 'react-native';
import { connect } from 'react-redux';
import deepGet from 'lodash/get';
import appVariables from '../../services/AppVariables';
import TopStatus from './TopStatus';
import VideoList from './VideoList';
import Pricer from '../../services/Pricer';
import CurrentUser from '../../models/CurrentUser';
import VideoLoadingFlyer from '../CommonComponents/VideoLoadingFlyer';
import videoUploaderComponent from '../../services/CameraWorkerEventEmitter';
import NavigationEmitter from '../../helpers/TabNavigationEvent';
import appConfig from '../../constants/AppConfig';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import {navigateTo} from "../../helpers/navigateTo";
import { LoadingModal } from '../../theme/components/LoadingModalCover';
import Colors from "../../theme/styles/Colors";
import utilities from "../../services/Utilities";
import reduxGetter from '../../services/ReduxGetters';
import {LoginPopoverActions} from "../LoginPopover";
import {LoggedOutCustomTabClickEvent} from "../../helpers/Emitters";
import NavigationService from "../../services/NavigationService";
import DataContract from "../../constants/DataContract";

const mapStateToProps = (state) => {
  return {
    userId: CurrentUser.getUserId()
  };
};

class HomeScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null,
      headerBackTitle: null
    };
  };

  constructor(props) {
    super(props);
    navigateTo.setTopLevelNavigation(this.props.navigation);
    this.state = {
      videoUploaderVisible: false
    };
    this.listRef = null;
    this.isActiveScreen = false;
    this.shouldPullToRefesh = false;
    this.showAutomaticPopup = false;
    this.coachShown = false;
  }

  componentDidMount = () => {
    videoUploaderComponent.on('show', this.showVideoUploader);
    videoUploaderComponent.on('hide', this.hideVideoUploader);

    LoggedOutCustomTabClickEvent.on('pressed', this.loggedOutCustomTabClick );

    NavigationEmitter.on('onRefresh', (screen) => {
      if (screen.screenName == appConfig.tabConfig.tab1.childStack) {
        this.refresh(true, 0);
      }
    });
    this.showCoachScreen();
    navigateTo.navigationDecision();
    CurrentUser.getEvent().on("onUserLogout" , ()=> {
      this.onLogout();
    });
    CurrentUser.getEvent().on("onBeforeUserLogout" , ()=> {
      LoadingModal.show("Disconnecting...");
    });
    CurrentUser.getEvent().on("onUserLogoutFailed" , ()=> {
      LoadingModal.hide();
    });
    CurrentUser.getEvent().on("onUserLogoutComplete" , ()=> {
      this.refresh(true);
      LoadingModal.hide();
    });

    this.willFocusSubscription = this.props.navigation.addListener('willFocus', (payload) => {
        this.isActiveScreen = true ;
    });

    this.willBlurSubscription = this.props.navigation.addListener('willBlur', (payload) => {
      this.isActiveScreen =  false ;
    });
  };


  shouldShowLoginPopover = () => {
    return ! (  appVariables.isActionSheetVisible ||
                appVariables.isShareTrayVisible ||
                ( NavigationService.findCurrentRoute() === 'InAppBrowserComponent')
             );
  };

  showLoginAutomatically = () => {
    if (CurrentUser.isActiveUser() || this.showAutomaticPopup) {
      return;
    }
    this.showAutomaticPopup = true;
    this.loginPopupTimeOut = setTimeout(()=> {
      this.shouldShowLoginPopover() && LoginPopoverActions.show();
    }, appConfig.loginPopoverShowTime);
  };

  showLogoutPopup = () => {
    !this.coachShown && this.showLoginAutomatically();
  };


  loggedOutCustomTabClick = () => {
    clearTimeout(this.loginPopupTimeOut);
  };


  showCoachScreen = () => {
    if (this.props.userId) {
      utilities.saveItem(`show-coach-screen`, true);
    } else {
      utilities.getItem('show-coach-screen').then((data) => {
        if (data !== 'true'){
          this.coachShown = true;
          utilities.saveItem(`show-coach-screen`, true);
          this.props.navigation.push('CouchMarks' , {handleGotItClick: this.showLoginAutomatically} );
        } else {
          // do nothing
        }
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.userId != prevProps.userId || this.props.navigation.state.refresh) {
      this.refresh(true, 300);
    }
  }

  componentWillUnmount = () => {
    videoUploaderComponent.removeListener('show');
    videoUploaderComponent.removeListener('hide');
    LoggedOutCustomTabClickEvent.removeListener('pressed');
    NavigationEmitter.removeListener('onRefresh');
    CurrentUser.getEvent().removeListener("onBeforeUserLogout");
    CurrentUser.getEvent().removeListener("onUserLogout");
    CurrentUser.getEvent().removeListener("onUserLogoutFailed");
    CurrentUser.getEvent().removeListener("onUserLogoutComplete");
    clearTimeout(this.loginPopupTimeOut);
    this.willFocusSubscription && this.willFocusSubscription.remove();
    this.willBlurSubscription && this.willBlurSubscription.remove();
  };

  shouldPlay = () => {
    return this.isActiveScreen;
  };

  showVideoUploader = () => {
    this.setState({
      videoUploaderVisible: true
    });
  };

  hideVideoUploader = () => {
    this.setState({
      videoUploaderVisible: false
    });
  };

  refresh = (isRefesh, timeOut) => {
    timeOut = timeOut || 0;
    let activeIndex = deepGet(this.listRef, 'flatListHocRef.state.activeIndex');
    const flatListHocRef = deepGet(this, 'listRef.flatListHocRef'),
      flatlistProps = deepGet(this, 'listRef.flatListHocRef.props'),
      flatListRef = deepGet(this, 'listRef.flatListHocRef.flatlistRef'),
      list = flatlistProps && flatlistProps.list;
    if (list && list.length > 0) {
      flatListRef && flatListRef.scrollToIndex({ index: 0 });
      Platform.OS == 'android' && flatListHocRef.forceSetActiveIndex(0);
    }

    if (Platform.OS == 'android'){
      setTimeout(() => {
        if (isRefesh) {
          flatlistProps.refresh();
        }
      }, timeOut);
    } else {
      this.shouldPullToRefesh = isRefesh;
      this.onScrollMovementEnd(activeIndex);
    }
  };

  onScrollMovementEnd = (currentIndex) => {
    if (currentIndex === 0 && this.shouldPullToRefesh) {
      const  flatlistProps = deepGet(this, 'listRef.flatListHocRef.props');
      setTimeout(() => {
        this.shouldPullToRefesh = false;
        flatlistProps.refresh();
      }, 0);
    }
  };

  onLogout = () => {
    const updateFlatList = deepGet(this, 'listRef.flatListHocRef.props.updateFlatList'),
          flatListHocRef = deepGet(this, 'listRef.flatListHocRef');
      flatListHocRef.forceSetActiveIndex(0);
      updateFlatList && updateFlatList([]);
  }


  getUploadingText = () => {
    let videoType = reduxGetter.getRecordedVideoType();
    if (videoType === 'post'){
      return "Uploading Video";
    } else if (videoType === DataContract.knownEntityTypes.reply){
      return "Posting reply";
    }
  };

  beforeRefresh = () => {
    Pricer.getBalance();
  };

  onRefresh = (res) => {
    const flatListHocRef = deepGet(this, 'listRef.flatListHocRef'),
      flatlistProps = deepGet(this, 'listRef.flatListHocRef.props'),
      list = flatlistProps && flatlistProps.list;
    if (list && list.length > 0) {
      Platform.OS == 'android' && flatListHocRef.forceSetActiveIndex(0);
    }
    flatListHocRef.refreshDone();
    this.showLogoutPopup();
  };

  render() {
    return (
      <View style={{ backgroundColor: Colors.black}}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <TopStatus />
        {this.props.userId && this.state.videoUploaderVisible && (
          <VideoLoadingFlyer
            componentHeight={46}
            componentWidth={46}
            sliderWidth={170}
            containerStyle={{
              ...ifIphoneX(
                {
                  top: 60
                },
                {
                  top: 30
                }
              ),
              left: 10
            }}
            displayText={this.getUploadingText()}
            extendDirection="right"
            extend={true}
            id={2}
          />
        )}

        <VideoList
          ref={(ref) => {
            this.listRef = ref;
          }}
          fetchUrl={DataContract.feed.homeApi}
          beforeRefresh={this.beforeRefresh}
          onRefresh={this.onRefresh}
          shouldPlay={this.shouldPlay}
          onScrollEnd ={(currentIndex) => {
            this.onScrollMovementEnd(currentIndex);
          }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps)(HomeScreen);
