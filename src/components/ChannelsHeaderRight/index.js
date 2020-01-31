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


class ChannelsHeaderRight extends PureComponent{
  constructor(props){
    super(props);
    this.sharingActionSheetButtons  = ['Invite via Link', 'Invite via QR Code' ,'Cancel'];
    if(this.checkIfMember()){
      this.mute_notifications_index = 0
      this.leave_channel_index = 1
      this.report_channel_index =2
      this.more_cancel_index = 3
      this.moreActionSheetButtons     = [this.getMuteText() ,'Leave Channel', 'Report Channel', 'Cancel'];
      }else{
      this.mute_notifications_index = 0
      this.report_channel_index =1
      this.more_cancel_index = 2
      this.moreActionSheetButtons     = [this.getMuteText() , 'Report Channel', 'Cancel'];
    }
  }
  shareViaLink = () =>{
    let shareChannel = new ShareVideo(DataContract.share.getChannelShareApi(this.props.channelId));
    shareChannel.perform();
  }

  showQrCodeScreen = (options) => {
    this.props.navigation.navigate(
      'QrCode',
      {
        url:options.url,
        descText:options.text,
        backgroundColor : options.backgroundColor,
        color : options.color,
        size : options.size
      }
        );
  }

  shareViaQrCode = () =>{
    new PepoApi(DataContract.share.getChannelShareApi(this.props.channelId))
      .get()
      .then((response)=>{
        if(response && response.success){
          this.qrCodeGeneratorUrl = deepGet(response,"data.share.url");
          ActionSheet.hide();
          let options = {
            url : this.qrCodeGeneratorUrl,
            text : `Scan the QR code to join\n Ethdenver 2020`,
            backgroundColor:"#ff5566",
            color:"#ffffff",
            size:130
          }
          this.showQrCodeScreen(options);
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
    // status = 0 muted
    // status = 1 unmuted
    if(status == 1){
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
      .post()
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
      .post()
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


  checkIfMember = () =>{
    let isMember = reduxGetters.isCurrentUserMemberOfChannel(this.props.channelId);
    return isMember;
  }

  leaveChannel = () => {
    new PepoApi(DataContract.channels.getLeaveChannelApi(this.props.channelId))
      .post()
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
      cancelButtonIndex : this.more_cancel_index,
      destructiveButtonIndex : this.report_channel_index
    },(buttonIndex)=>{
      if(buttonIndex == this.mute_notifications_index){
        if(this.checkMuteStatus()){
          this.showUnMuteChannelAlert();
        }else{

          this.showMuteChannelAlert();
        }
      }
      else if(buttonIndex == this.leave_channel_index){
        if(this.checkIfMember()) {
          this.showLeaveChannelAlert();
        }
      }
      else if(buttonIndex == this.report_channel_index){
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