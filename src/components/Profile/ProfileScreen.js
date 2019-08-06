import React, { PureComponent } from 'react';
import {View ,  ActivityIndicator, Platform, AppState } from 'react-native';
import { connect } from 'react-redux';

import BalanceHeader from '../Profile/BalanceHeader';
import LogoutComponent from '../LogoutLink';
import UserInfo from '../CommonComponents/UserInfo';
import CurrentUser from '../../models/CurrentUser';

// import EmptyCoverImage from './EmptyCoverImage';
import ProfileEdit from './ProfileEdit';
// import UserProfileCoverImage from './UserProfileCoverImage';
import reduxGetter from '../../services/ReduxGetters';
// import UpdateTimeStamp from '../CommonComponents/UpdateTimeStamp';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Toast } from 'native-base';
import PepoApi from '../../services/PepoApi';
import CameraPermissionsApi from '../../services/CameraPermissionsApi';
import AllowAccessModal from '../Profile/AllowAccessModal';
import CameraIcon from '../../assets/camera_icon.png';

import UserProfileFlatList from "../CommonComponents/UserProfileFlatList"

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
    this.fetchUser();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId != prevProps.userId) {
      this.props.navigation.setParams({ headerTitle: reduxGetter.getName(CurrentUser.getUserId()) });
      //TODO Stack pop. 
    }
  }

  fetchUser = () => {
    return new PepoApi(`/users/${this.props.userId}/profile`)
      .get()
      .then((res) => {
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
      .finally(() => {});
  };

  isLoading() {
    if (this.state.loading) {
      return <ActivityIndicator />;
    }
  }
  
  
  onPullToRefresh = () => {
    this.fetchUser(); 
  } 


  _headerComponent(){
    return (
      <View>
        <BalanceHeader />
        <UserInfo userId={this.props.userId} isEdit={true}/>
      </View>
    )
  }

  render() {
    return (
      <UserProfileFlatList beforeRefresh = {this.onPullToRefresh}
                           listHeaderComponent = {this._headerComponent()}
                           userId={this.props.userId} 
      />
    );
  }
}

export default connect(mapStateToProps)(ProfileScreen);
