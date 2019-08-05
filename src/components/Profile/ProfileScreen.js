import React, { PureComponent } from 'react';
import { ActivityIndicator, Platform, AppState } from 'react-native';
import { connect } from 'react-redux';

import BalanceHeader from '../Profile/BalanceHeader';
import LogoutComponent from '../LogoutLink';
import UserInfo from '../CommonComponents/UserInfo';
import CurrentUser from '../../models/CurrentUser';

import EmptyCoverImage from './EmptyCoverImage';
import ProfileEdit from './ProfileEdit';
import UserProfileCoverImage from './UserProfileCoverImage';
import reduxGetter from '../../services/ReduxGetters';
import UpdateTimeStamp from '../CommonComponents/UpdateTimeStamp';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Toast } from 'native-base';
import PepoApi from '../../services/PepoApi';
import CameraPermissionsApi from '../../services/CameraPermissionsApi';
import AllowAccessModal from '../Profile/AllowAccessModal';
import CameraIcon from '../../assets/camera_icon.png';

const mapStateToProps = (state, ownProps) => {
  return { userId: CurrentUser.getUserId() };
};

class ProfileScreen extends PureComponent {
  static navigationOptions = (options) => {
    const name = options.navigation.getParam('headerTitle') || reduxGetter.getName(CurrentUser.getUserId());
    return {
      headerBackTitle: null,
      headerTitle: name,
      headerRight: <LogoutComponent {...options} />
    };
  };

  constructor(props) {
    super(props);
    //TODO Shraddha : remove hardcoded values once tested on ios
    this.coverImageId = reduxGetter.getUserCoverImageId(this.props.userId, this.state);
    this.videoId = reduxGetter.getUserCoverVideoId(this.props.userId, this.state);
    this.state = {
      isEdit: false,
      loading: true,
      showAccessModal: false
    };
    this.fetchUser();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId != prevProps.userId) {
      this.props.navigation.setParams({ headerTitle: reduxGetter.getName(CurrentUser.getUserId()) });
      this.setState({
        isEdit: false
      });
    }
  }

  fetchUser = () => {
    return new PepoApi(`/users/${this.props.userId}/profile`)
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
    CameraPermissionsApi.requestPermission('camera').then((result) => {
      const cameraResult = result;
      CameraPermissionsApi.requestPermission('microphone').then((result) => {
        const microphoneResult = result;
        if (cameraResult == 'authorized' && microphoneResult == 'authorized') {
          this.props.navigation.push('CaptureVideo');
        }
        //if do not ask again is selected in android then 'restricted' is returned and permission dialog does not appear again
        else if (
          cameraResult == 'restricted' ||
          microphoneResult == 'restricted' ||
          (Platform.OS == 'ios' && (cameraResult == 'denied' || microphoneResult == 'denied'))
        ) {
          this.setState({
            showAccessModal: true
          });
        }
      });
    });
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} style={{ padding: 20, flex: 1 }}>
        {this.isLoading()}
        <BalanceHeader />
        <React.Fragment>
          <UserProfileCoverImage userId={this.props.userId} uploadVideo={this.uploadVideo} />
          <UpdateTimeStamp userId={this.props.userId} />
        </React.Fragment>

        {!this.coverImageId && <EmptyCoverImage uploadVideo={this.uploadVideo} userId={this.props.userId} />}

        {!this.state.isEdit && <UserInfo userId={this.props.userId} isEdit={true} hideUserInfo={this.hideUserInfo} />}
        {this.state.isEdit && <ProfileEdit userId={this.props.userId} hideProfileEdit={this.hideProfileEdit} />}
        <AllowAccessModal
          onClose={() => {
            this.setState({
              showAccessModal: false
            });
          }}
          modalVisibility={this.state.showAccessModal}
          headerText="Camera"
          accessText="Enable Camera Access"
          accessTextDesc="Allow access to your camera and microphone to take video "
          imageSrc={CameraIcon}
        />
      </KeyboardAwareScrollView>
    );
  }
}

export default connect(mapStateToProps)(ProfileScreen);
