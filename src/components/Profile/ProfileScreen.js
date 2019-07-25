import React, { Component } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import BalanceHeader from '../Profile/BalanceHeader';
import LogoutComponent from '../LogoutLink';
import UserInfo from '../CommonComponents/UserInfo';
import CurrentUser from '../../models/CurrentUser';

import EmptyCoverImage from './EmptyCoverImage';
import ProfileEdit from './ProfileEdit';
import CoverImage from '../CommonComponents/CoverImage';
import reduxGetter from '../../services/ReduxGetters';
import Colors from '../../theme/styles/Colors';
import UpdateTimeStamp from '../CommonComponents/UpdateTimeStamp';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Toast } from 'native-base';
import PepoApi from '../../services/PepoApi';
import CameraPermissionsApi from '../../services/CameraPermissionsApi';

class ProfileScreen extends Component {
  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      headerTitle: reduxGetter.getName( CurrentUser.getUserId() ),
      headerRight: <LogoutComponent {...options} />
    };
  };

  constructor(props) {
    super(props);
    this.userId = CurrentUser.getUserId();
    //TODO Shraddha : remove hardcoded values once tested on ios
    this.coverImageId = reduxGetter.getUserCoverImageId(this.userId, this.state);
    this.videoId = reduxGetter.getUserCoverVideoId(this.userId, this.state);
    this.state = {
      isEdit: false,
      loading: true
    };
    this.fetchUser();
  }

  fetchUser = () => {
    return new PepoApi(`/users/${this.userId}/profile`)
      .get()
      .then((res) => {
        console.log('profile', res);
        if (!res || !res.success) {
          Toast.show({
            text: ostErrors.getErrorMessage(res),
            buttonText: 'OK'
          });
        }
      })
      .catch((error) => {
        Toast.show({
          text: ostErrors.getErrorMessage(error),
          buttonText: 'OK'
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  isLoading() {
    if (this.state.loading) {
      return <ActivityIndicator />;
    }
  }

  hideUserInfo = (isEditValue) => {
    this.setState({
      isEdit: isEditValue
    });
  };

  hideProfileEdit = (res) => {
    this.setState({
      isEdit: false
    });
  };

  uploadVideo = async () => {
    const cameraResponse = await CameraPermissionsApi.checkPermission('camera');
    const microphoneResponse = await CameraPermissionsApi.checkPermission('microphone');
    if (Platform.OS == 'android') {
      //can ask permissions multiple times on android
      CameraPermissionsApi.requestPermission('camera').then((result) => {
        const cameraResult = result;
        CameraPermissionsApi.requestPermission('microphone').then((result) => {
          const microphoneResult = result;
          //if do not ask again is selected then 'restricted' is returned and permission dialog does not appear again
          if (
            (cameraResult == 'authorized' || cameraResult == 'restricted') &&
            (microphoneResult == 'authorized' || microphoneResult == 'restricted')
          ) {
            this.props.navigation.push('CaptureVideo');
          }
        });
      });
    } else if (Platform.OS == 'ios') {
      if (cameraResponse == 'undetermined') {
        //can ask only once in ios i.e first time
        CameraPermissionsApi.requestPermission('camera').then((result) => {
          const cameraResult = result;
          CameraPermissionsApi.requestPermission('microphone').then((result) => {
            const microphoneResult = result;
            if (cameraResult == 'authorized' && microphoneResult == 'authorized') {
              this.props.navigation.push('CaptureVideo');
            }
          });
        });
      } else {
        //redirect inside irrespective of response as enable access modal is handled inside the screen
        this.props.navigation.push('CaptureVideo');
      }
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} style={{ padding: 20, flex: 1 }}>
        {this.isLoading()}
        <BalanceHeader />
        <React.Fragment>
          <CoverImage
            height={0.5}
            isProfile={true}
            wrapperStyle={{
              borderWidth: 1,
              borderRadius: 5,
              marginTop: 20,
              marginBottom: 10,
              borderColor: Colors.dark
            }}
            userId={this.userId}
            uploadVideo={this.uploadVideo}
          />
          <UpdateTimeStamp userId={this.userId} />
        </React.Fragment>

        {!this.coverImageId && <EmptyCoverImage uploadVideo={this.uploadVideo} userId={this.userId} />}

        {!this.state.isEdit && <UserInfo userId={this.userId} isEdit={true} hideUserInfo={this.hideUserInfo} />}
        {this.state.isEdit && <ProfileEdit userId={this.userId} hideProfileEdit={this.hideProfileEdit} />}
      </KeyboardAwareScrollView>
    );
  }
}

export default ProfileScreen;
