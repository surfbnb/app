import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
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
    this.state = {
      videoUploaderVisible: false
    };
    this.listRef = null;
  }

  refresh = (timeOut) => {
    timeOut = timeOut || 0;
    const flatlistProps = deepGet(this, 'listRef.flatListHocRef.props');
    flatListRef = deepGet(this, 'listRef.flatListHocRef.flatlistRef');
    flatListRef && flatListRef.scrollToIndex({ index: 0 });
    setTimeout(() => {
      flatlistProps.refresh();
      Pricer.getBalance();
    }, timeOut);
  };

  componentDidMount = () => {
    videoUploaderComponent.on('show', this.showVideoUploader);
    videoUploaderComponent.on('hide', this.hideVideoUploader);
    NavigationEmitter.on('onRefresh', (screen) => {
      if (screen.screenName == appConfig.tabConfig.tab1.childStack) {
        this.refresh();
      }
    });
    Pricer.getBalance();
  };

  componentWillUnmount = () => {
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

  componentWillUpdate(nextProps) {
    if (this.props.userId !== nextProps.userId || this.props.navigation.state.refresh) {
      this.refresh(500);
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: '#000' }}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <TopStatus />
        {this.state.videoUploaderVisible && (
          <VideoLoadingFlyer
            componentHeight={46}
            componentWidth={46}
            sliderWidth={170}
            containerStyle={{ top: 50, left: 10 }}
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
          toRefresh={this.state.toRefresh}
          fetchUrl={'/feeds'}
          onRefresh={this.onRefresh}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps)(HomeScreen);
