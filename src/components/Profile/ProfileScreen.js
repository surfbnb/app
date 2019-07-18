import React, { Component } from 'react';
import  {View,ScrollView} from "react-native";
import BalanceHeader from '../Profile/BalanceHeader';
import LogoutComponent from '../LogoutLink';
import UserInfo from "../CommonComponents/UserInfo";
import CurrentUser from "../../models/CurrentUser";

import EmptyCoverImage from './EmptyCoverImage'
import ProfileEdit from "./ProfileEdit";
import CoverImage from '../CommonComponents/CoverImage'
import reduxGetter from "../../services/ReduxGetters";
import Colors from '../../theme/styles/Colors'

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    this.userId= CurrentUser.getUserId();
    //TODO Shraddha : remove hardcoded values once tested on ios
    this.coverImageId = reduxGetter.getUserCoverImageId(this.userId,this.state);
    this.videoId = reduxGetter.getUserCoverVideoId( this.userId,this.state );
    this.state = {
      isEdit : false
    }
  }

  hideUserInfo(isEditValue){
    this.setState({
      isEdit : isEditValue
    });
  }

  profileSaved(res){
    console.log('Success')
    this.setState({
      isEdit : false
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} style={{padding:20,flex:1}}>
        <BalanceHeader  />
        {/* {this.coverImageId &&( */}
          <View style={{borderWidth:1,borderRadius:5,marginTop:20,borderColor:Colors.dark}}>
            <CoverImage height={0.50} 
              isProfile={true} 
              userId={this.userId}/>
          </View>

        {/* )} */}


        {!this.coverImageId &&(
          <EmptyCoverImage navigation={this.props.navigation} />
        )}
        {!this.state.isEdit &&(
          <UserInfo userId={CurrentUser.getUserId()} hideUserInfo={this.hideUserInfo.bind(this)} profileSaved={this.profileSaved.bind(this)} />
        )}
        {this.state.isEdit &&(
          <ProfileEdit/>
        )}
      </KeyboardAwareScrollView>
    );
  }
}

export default ProfileScreen;
