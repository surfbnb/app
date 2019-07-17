import React, { Component } from 'react';
import  {View,Text , ActivityIndicator} from "react-native";
import BalanceHeader from '../Profile/BalanceHeader';
import LogoutComponent from '../LogoutLink';
import UserInfo from "../CommonComponents/UserInfo";
import CurrentUser from "../../models/CurrentUser";

import EmptyCoverImage from './EmptyCoverImage'
import ProfileEdit from "./ProfileEdit";
import CoverImage from '../CommonComponents/CoverImage'
import reduxGetter from "../../services/ReduxGetters";
import Colors from '../../theme/styles/Colors'
import timeStamp from "../../helpers/timestampHandling";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {Toast} from "native-base";
import PepoApi from "../../services/PepoApi";

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
    this.coverImageId = 1123 //reduxGetter.getUserCoverImageId(this.userId,this.state);
    this.videoId = 123//reduxGetter.getUserCoverVideoId( this.userId,this.state );
    this.state = {
      isEdit : false,
      loading: true
    };
    this.fetchUser();
  }

  fetchUser = () => {
    return new PepoApi(`/users/${this.userId}/profile`)
      .get()
      .then((res) =>{
        console.log("profile" ,res);
        if( !res ||  !res.success ){
          Toast.show({
            text: ostErrors.getErrorMessage( res ),
            buttonText: 'OK'
          });
        }
      })
      .catch((error) =>{
        Toast.show({
          text: ostErrors.getErrorMessage( error ),
          buttonText: 'OK'
        });
      })
      .finally(()=>{
        this.setState({ loading : false });
      })
  };

  isLoading(){
    if( this.state.loading ){
      return ( <ActivityIndicator /> );
    }
  };

  hideUserInfo = (isEditValue) => {
    this.setState({
      isEdit : isEditValue
    });
  };

  hideProfileEdit = (res) =>{
    this.setState({
      isEdit : false
    });
  };

  uploadVideo = () => {
    //Mayur Your control block
  };

  render() {
    return (
      <KeyboardAwareScrollView enableOnAndroid={true} style={{padding:20,flex:1}}>
        {this.isLoading()}
        <BalanceHeader  />
        {this.coverImageId &&(
          <React.Fragment>
            <View style={{borderWidth:1,borderRadius:5,marginTop:20,marginBottom: 10,borderColor:Colors.dark}}>
              <CoverImage height={0.50} isProfile={true} 
                          coverImageId={this.coverImageId} 
                          uploadVideo={this.uploadVideo}
                          videoId={this.videoId} />          
            </View>
            <Text style={{textAlign: 'right'}}>{timeStamp.fromNow( reduxGetter.getVideoTimeStamp(this.videoId) )}</Text>
          </React.Fragment> 
        )}
        {!this.coverImageId &&(
          <EmptyCoverImage uploadVideo={this.uploadVideo}/>
        )}
        {!this.state.isEdit &&(
          <UserInfo userId={this.userId} hideUserInfo={this.hideUserInfo}  />
        )}
        {this.state.isEdit &&(
          <ProfileEdit userId={this.userId} hideProfileEdit={this.hideProfileEdit} />
        )}
      </KeyboardAwareScrollView>
    );
  }
}

export default ProfileScreen;
