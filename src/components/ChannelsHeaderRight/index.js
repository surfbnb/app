import React, {PureComponent} from "react";
import { Image, TouchableOpacity, Alert } from 'react-native';
import { withNavigation } from "react-navigation";
import deepGet from 'lodash/get';

import Toast from '../../theme/components/NotificationToast';
import MoreOptionsIcon from '../../assets/user_profile_options.png';
import inlineStyles from './style';
import DataContract from '../../constants/DataContract';
import { ActionSheet } from 'native-base';
import PepoApi from '../../services/PepoApi';
import reduxGetters from '../../services/ReduxGetters';
import ShareOptions from "../CommonComponents/ShareOptions";


class ChannelsHeaderRight extends PureComponent{
  constructor(props){
    super(props);
  }

  getDefaultConfig = () => {
    return {
      memberConfig:{
        actionConfig:{
          0 : this.checkMuteStatus() ? "showUnMuteChannelAlert" : "showMuteChannelAlert",
          1 : "showLeaveChannelAlert",
          2 : "showReportAlert",
          3 : "cancel"
        },
        actionSheetConfig : {
          options : [this.getMuteOptionText(), "Leave Channel", "Report Channel", "Cancel"],
          cancelButtonIndex : 3,
          destructiveButtonIndex : 2
        }
      },
      nonMemberConfig :{
        actionConfig:{
          0 : "showReportAlert",
          1 : "cancel"
        },
        actionSheetConfig : {
          options : ["Report Channel","Cancel"],
          cancelButtonIndex : 1,
          destructiveButtonIndex : 0
        }
      }
    }
  }

  getConfig = () => {
    let isMember = reduxGetters.isCurrentUserMemberOfChannel(this.props.channelId);
    if(isMember){
      return this.getDefaultConfig().memberConfig;
    } else {
      return this.getDefaultConfig().nonMemberConfig;
    }
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

  getMuteOptionText = () =>{
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
    let config = this.getConfig();
    ActionSheet.show( config.actionSheetConfig, (buttonIndex)=>{
      const fnName = deepGet(config, `actionConfig[${buttonIndex}]`)
      if (fnName && this[fnName]) {
        this[fnName]();
      }
    })
  }
  render(){
    return(
      <React.Fragment>
        <ShareOptions entityId= {this.props.channelId} entityKind={'channel'}/>
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