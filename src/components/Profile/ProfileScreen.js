import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
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

class ProfileScreen extends Component {
  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      headerTitle: 'Profile',
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

  uploadVideo = () => {
    this.props.navigation.push('CaptureVideo');
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

        {!this.state.isEdit && <UserInfo userId={this.userId} hideUserInfo={this.hideUserInfo} />}
        {this.state.isEdit && <ProfileEdit userId={this.userId} hideProfileEdit={this.hideProfileEdit} />}
      </KeyboardAwareScrollView>
    );
  }
}

export default ProfileScreen;
