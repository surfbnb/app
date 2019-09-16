import React, { Component } from 'react';
import { View, StatusBar, Platform, AppState } from 'react-native';
import { connect } from 'react-redux';
import deepGet from 'lodash/get';

import TopStatus from './TopStatus';
import VideoList from './VideoList';
import Pricer from '../../services/Pricer';
import CurrentUser from '../../models/CurrentUser';
import VideoLoadingFlyer from '../CommonComponents/VideoLoadingFlyer';
import videoUploaderComponent from '../../services/CameraWorkerEventEmitter';
import NavigationEmitter from '../../helpers/TabNavigationEvent';
import appConfig from '../../constants/AppConfig';
import { ifIphoneX } from 'react-native-iphone-x-helper';

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
    console.log('HomeScreen constructor');
    super(props);
    this.state = {
      videoUploaderVisible: false
    };
    this.listRef = null;
  }

  componentDidMount = () => {
    AppState.addEventListener('change', this._handleAppStateChange);
    videoUploaderComponent.on('show', this.showVideoUploader);
    videoUploaderComponent.on('hide', this.hideVideoUploader);
    NavigationEmitter.on('onRefresh', (screen) => {
      if (screen.screenName == appConfig.tabConfig.tab1.childStack) {
        this.refresh(true, 0);
      }
    });

  };

  componentWillUpdate(nextProps) {
    if (this.props.userId !== nextProps.userId || this.props.navigation.state.refresh) {
      this.refresh(true, 300);
    }
  }

  componentWillUnmount = () => {    
    AppState.removeEventListener('change', this._handleAppStateChange);
    videoUploaderComponent.removeListener('show');
    videoUploaderComponent.removeListener('hide');
    NavigationEmitter.removeListener('onRefresh');
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
    const flatListHocRef = deepGet(this, 'listRef.flatListHocRef'),
      flatlistProps = deepGet(this, 'listRef.flatListHocRef.props'),
      flatListRef = deepGet(this, 'listRef.flatListHocRef.flatlistRef'),
      list = flatlistProps && flatlistProps.list;
    if (list && list.length > 0) {
      flatListRef && flatListRef.scrollToIndex({ index: 0 });
      Platform.OS == 'android' && flatListHocRef.forceSetActiveIndex(0);
    }
    setTimeout(() => {
      if (isRefesh) {
        flatlistProps.refresh();
      }
    }, timeOut);
  };

  beforeRefresh = () => {
    Pricer.getBalance();
  };

  render() {
    return (
      <View style={{ backgroundColor: '#000' }}>
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
            displayText="Uploading Video"
            extendDirection="right"
            extend={true}
            id={2}
          />
        )}

        <VideoList
          ref={(ref) => {
            this.listRef = ref;
          }}
          fetchUrl={'/feeds'}
          beforeRefresh={this.beforeRefresh}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps)(HomeScreen);
