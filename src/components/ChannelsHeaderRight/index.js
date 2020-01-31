import React, {PureComponent} from "react";
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import deepGet from 'lodash/get';
import { withNavigation } from "react-navigation";
import Toast from '../../theme/components/NotificationToast';

import GreyShareIcon from '../../assets/grey_share_icon.png';
import MoreOptionsIcon from '../../assets/user_profile_options.png';
import inlineStyles from './style';
import ShareVideo from '../../services/shareVideo';
import DataContract from '../../constants/DataContract';
import { ActionSheet } from 'native-base';
import PepoApi from '../../services/PepoApi';
import reduxGetters from '../../services/ReduxGetters';

const INVITE_VIA_LINK_INDEX     = 0;
const INVITE_VIA_QRCODE_INDEX   = 1;
const SHARE_CANCEL_INDEX        = 2;
const MUTE_NOTIFICATIONS_INDEX  = 0;
const LEAVE_CHANNEL_INDEX       = 1;
const REPORT_CHANNEL_INDEX      = 2;
const MORE_CANCEL_INDEX         = 3;

class ChannelsHeaderRight extends PureComponent{
  constructor(props){
    super(props);
    this.sharingActionSheetButtons  = ['Invite via Link', 'Invite via QR Code' ,'Cancel'];
    this.moreActionSheetButtons     = [this.getMuteText(), this.memberShipText() , 'Report Channel', 'Cancel'];

  }
  shareViaLink = () =>{
    let shareVideo = new ShareVideo(DataContract.share.getChannelShareApi(this.props.channelId));
    shareVideo.perform();
  }

  showQrCodeScreen = () => {
    this.props.navigation.navigate('QrCode',{url:this.qrCodeGeneratorUrl});
  }

  shareViaQrCode = () =>{
    new PepoApi(DataContract.share.getChannelShareApi(this.props.channelId))
      .get()
      .then((response)=>{
        if(response && response.success){
          this.qrCodeGeneratorUrl = deepGet(response,"data.share.url");
          ActionSheet.hide();
          this.showQrCodeScreen();
        }
      });
  }
  showSharingOptions = () => {
    let sharingActionOptions = [...this.sharingActionSheetButtons];
    ActionSheet.show({
        options : sharingActionOptions,
        cancelButtonIndex :SHARE_CANCEL_INDEX,
    },
      (buttonIndex)=>{
        if (buttonIndex == INVITE_VIA_LINK_INDEX) {
          this.shareViaLink();
        }else if( buttonIndex ==  INVITE_VIA_QRCODE_INDEX ){
          this.shareViaQrCode();
        }
      }

    )
  }

  checkMuteStatus = () => {
    let status = reduxGetters.currentUserNotificationStatus(this.props.channelId);
    // status = 0 unmuted
    // status = 1 muted
    if(status == 0){
      return false;
    }else{
      return true;
    }
  }

  getMuteText = () =>{
    if(this.checkMuteStatus()){
      return `Unmute Notifications`;
    }else{
      return `Mute Notifications`;
    }
  }

  muteNotifications = () =>{
    new PepoApi(DataContract.channels.getMuteApi(this.props.channelId))
      .get()
      .then((response)=>{
        if(response && response.success){
          ActionSheet.hide();
          Toast.show({text:'Channel muted successfully!', icon: 'success' });
        }else{
          Toast.show({text: `Unable to mute channel right now.`, icon: 'error' });
        }
      })
      .catch((error)=>{
        Toast.show({text:'Unable to mute channel right now.', icon: 'error' });
      })
  }

  unMuteNotifications = () =>{
    new PepoApi(DataContract.channels.getUnmuteApi(this.props.channelId))
      .get()
      .then((response)=>{
        if(response && response.success){
          ActionSheet.hide();
          Toast.show({text:'Channel unmuted successfully!', icon: 'success' });
        }else{
          Toast.show({text: `Unable to unmute channel right now.`, icon: 'error' });
        }
      })
      .catch((error)=>{
        Toast.show({text: `Unable to unmute channel right now.`, icon: 'error' });
      })
  }



  reportChannel = () => {
    let params = {
      report_entity_kind: DataContract.knownEntityTypes.channel,
      report_entity_id  : this.props.channelId
    }
    new PepoApi(DataContract.channels.getReportChannelApi())
      .post(params)
      .then((response)=>{
        if(response && response.success){
          ActionSheet.hide();
          Toast.show({text:'Channel reported successfully!', icon: 'success' });
        }else{
          Toast.show({text: `Unable to report channel right now.`, icon: 'error' });
        }
      })
      .catch((error)=>{
        Toast.show({text: `Unable to report channel right now.`, icon: 'error' });
      });
  }

  memberShipText = () =>{
    if(this.checkIfMember()){
      return `Leave Channel`;
    }
    else{
      return `Join Channel`;
    }
  }

  checkIfMember = () =>{
    let isMember = reduxGetters.isCurrentUserMemberOfChannel(this.props.channelId);
    console.log("reduxGetters.isCurrentUserMemberOfChannel(this.props.channelId)",reduxGetters.isCurrentUserMemberOfChannel(this.props.channelId));
    return isMember;
  }

  leaveChannel = () => {
    new PepoApi(DataContract.channels.getLeaveChannelApi(this.props.channelId))
      .get()
      .then((response)=>{
        if(response && response.success){
          ActionSheet.hide();
          Toast.show({text:'Channel left successfully!', icon: 'success' });
        }else{
          Toast.show({text: `Unable to leave channel right now.`, icon: 'error' });

        }
      })
      .catch((error)=>{
        Toast.show({text: `Unable to leave channel right now.`, icon: 'error' });
      })
  }

  joinChannel = () =>{
    new PepoApi(DataContract.channels.getJoinChannelApi(this.props.channelId))
      .post()
      .then((response)=>{
        if(response && response.success){
          ActionSheet.hide();
          Toast.show({text:'Channel joined successfully!', icon: 'success' });
        }else{
          Toast.show({text: `Unable to join channel right now.`, icon: 'error' });
        }
      })
      .catch((error)=>{
        Toast.show({text: `Unable to leave channel right now.`, icon: 'error' });
      });
  }

  showReportAlert = () =>{
    Alert.alert(
      '',
      'Report channel for inappropriate content or abuse?',
      [
        {text: 'Report', onPress: () =>  this.reportChannel() },
        {
          text: 'Cancel'
        }
      ],
      {cancelable: true},
    );
  }
  showLeaveChannelAlert = () =>{
    Alert.alert(
      '',
      'Leave channel for inappropriate content or abuse?',
      [
        {text: 'Leave', onPress: () =>  this.leaveChannel() },
        {
          text: 'Cancel'
        }
      ],
      {cancelable: true},
    );
  }
  showJoinChannelAlert = () =>{
    Alert.alert(
      '',
      'Join channel ?',
      [
        {text: 'Join', onPress: () =>  this.joinChannel() },
        {
          text: 'Cancel'
        }
      ],
      {cancelable: true},
    );
  }
  showMuteChannelAlert = () => {
    Alert.alert(
      '',
      'Mute channel ?',
      [
        {text: 'Mute', onPress: () =>  this.muteNotifications() },
        {
          text: 'Cancel'
        }
      ],
      {cancelable: true},
    );
  }
  showUnMuteChannelAlert = () => {
    Alert.alert(
      '',
      'UnMute channel ?',
      [
        {text: 'UnMute', onPress: () =>  this.unMuteNotifications() },
        {
          text: 'Cancel'
        }
      ],
      {cancelable: true},
    );
  }

  showMoreOptions = () =>{
    let moreActionSheetOptions = [...this.moreActionSheetButtons];
    ActionSheet.show({
      options :moreActionSheetOptions,
      cancelButtonIndex : MORE_CANCEL_INDEX,
      destructiveButtonIndex : REPORT_CHANNEL_INDEX
    },(buttonIndex)=>{
      if(buttonIndex == MUTE_NOTIFICATIONS_INDEX){
        if(this.checkMuteStatus()){
          this.showUnMuteChannelAlert();
        }else{

          this.showMuteChannelAlert();
        }
      }
      else if(buttonIndex == LEAVE_CHANNEL_INDEX){
        if(this.checkIfMember()){
          this.showLeaveChannelAlert();
        }else{
          this.showJoinChannelAlert();
        }
      }
      else if(buttonIndex == REPORT_CHANNEL_INDEX){
        this.showReportAlert();
      }
    })
  }
  render(){
    return(
      <React.Fragment>
        <TouchableOpacity
          style={inlineStyles.wrapperShare}
          onPress={() => {
            this.showSharingOptions();
          }}>
          <Image style={inlineStyles.shareIconSkipFont} source={GreyShareIcon}/>
        </TouchableOpacity>

        <TouchableOpacity
          style={inlineStyles.wrapperMore}
          onPress={() => {
            this.showMoreOptions();
          }}>
          <Image style={inlineStyles.moreOptionsSkipFont} source={MoreOptionsIcon}/>
        </TouchableOpacity>
      </React.Fragment>
    )
  }
}

export default withNavigation(ChannelsHeaderRight);