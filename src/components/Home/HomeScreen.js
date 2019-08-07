import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import TopStatus from './TopStatus';
import VideoList from './VideoList';
import Pricer from '../../services/Pricer';
import CurrentUser from '../../models/CurrentUser';
import VideoLoadingFlyer from '../CommonComponents/VideoLoadingFlyer';
import { videoUploaderComponent } from '../../services/CameraWorker';

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
      toRefresh: false,
      videoUploaderVisible: false
    };
  }

  onRefresh = () => {
    this.setState({ toRefresh: false });
    Pricer.getBalance();
  };

  componentDidMount = () => {
    videoUploaderComponent.on('show', this.showVideoUploader);
    videoUploaderComponent.on('hide', this.hideVideoUploader);
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
    console.log(' this.props.navigation.state.refresh', this.props.navigation.getParam('refresh'));
    if (this.props.userId !== nextProps.userId || this.props.navigation.state.refresh) {
      this.state.toRefresh = true;
    }
  }

  render() {
    return (
      <View style={{ backgroundColor: '#000' }}>
        <StatusBar translucent={true} backgroundColor={'transparent'} />
        <TopStatus />
        {this.state.videoUploaderVisible && (
          <View style={{top: 40, zIndex: 1}}>
            <VideoLoadingFlyer
              componentHeight={46}
              componentWidth={46}
              sliderWidth={150}
              displayText="Uploading Video"
              extendDirection="right"
              extend={true}
              id={2}
            />
          </View>
         )}
        <VideoList toRefresh={this.state.toRefresh} fetchUrl={'/feeds'} onRefresh={this.onRefresh} />
      </View>
    );
  }
}

export default connect(mapStateToProps)(HomeScreen);