import React, { PureComponent } from 'react';
import { Image, TouchableOpacity, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import deepGet from 'lodash/get';

import Toast from '../../theme/components/NotificationToast';
import MoreOptionsIcon from '../../assets/user_profile_options.png';
import inlineStyles from './style';
import DataContract from '../../constants/DataContract';
import { ActionSheet } from 'native-base';
import PepoApi from '../../services/PepoApi';
import reduxGetters from '../../services/ReduxGetters';
import ShareOptions from '../CommonComponents/ShareOptions';
import {ostErrors} from '../../services/OstErrors';
import AppConfig from '../../constants/AppConfig';


class ChannelsHeaderRight extends PureComponent {
  constructor(props) {
    super(props);
  }

  getConfig = () => {
    const optionsArray = [] ,  actionConfig ={} , actionSheetConfig ={ options: [] },
          isAdmin = reduxGetters.isCurrentUserAdminOfChannel(this.props.channelId) ,
          isMember = reduxGetters.isCurrentUserMemberOfChannel(this.props.channelId) ,
          canEdit = reduxGetters.isCurrentUserEditChannel(this.props.channelId) 
          ;

    if(canEdit){
      optionsArray.push({
        text: "Edit Community",
        action : "eidtChannel"
      })
    }
   
    if ( isMember ) {
      optionsArray.push({
        text: this.getMuteOptionText(),
        action : this.checkMuteStatus() ? 'showUnMuteChannelAlert' : 'showMuteChannelAlert'
      })
    } 

    if(isMember && !isAdmin){
      optionsArray.push({
        text: 'Leave Community',
        action : 'showLeaveChannelAlert'
      })
    }

    optionsArray.push({
      text: 'Report Community',
      action : 'showReportAlert'
    });

    optionsArray.push({
      text: 'Cancel',
      action : 'cancel'
    })

    for(let cnt = 0 ; cnt < optionsArray.length ; cnt++){
      actionConfig[cnt] = optionsArray[cnt]['action'];
      actionSheetConfig.options.push( optionsArray[cnt]['text']);
    }
    actionSheetConfig['cancelButtonIndex'] = optionsArray.length -1 ;
    actionSheetConfig['destructiveButtonIndex'] =  optionsArray.length -2 ;

    return{'actionConfig':actionConfig ,'actionSheetConfig': actionSheetConfig};
  };

  checkMuteStatus = () => {
    return !reduxGetters.currentUserNotificationStatus(this.props.channelId);
  };

  getMuteOptionText = () => {
    if (this.checkMuteStatus()) {
      return `Unmute Notifications`;
    } else {
      return `Mute Notifications`;
    }
  };

  muteNotifications = () => {
    new PepoApi(DataContract.channels.getMuteApi(this.props.channelId))
      .post()
      .then((response) => {
        this.onMuteNotification(response);
      })
      .catch((error) => {
        this.onMuteNotification(error);
      });
  };

  onMuteNotification(response) {
    if (response && response.success) {
      Toast.show({ text: 'Community notifications off!', icon: 'success' });
    } else {
      Toast.show({ text: ostErrors.getUIErrorMessage("channel_mute_failure"), icon: 'error' });
    }
  }

  unMuteNotifications = () => {
    new PepoApi(DataContract.channels.getUnmuteApi(this.props.channelId))
      .post()
      .then((response) => {
        this.onUnMuteNotification(response);
      })
      .catch((error) => {
        this.onUnMuteNotification(error);
      });
  };

  onUnMuteNotification(response) {
    if (response && response.success) {
      Toast.show({ text: 'Community notifications on!', icon: 'success' });
    } else {
      Toast.show({ text: ostErrors.getUIErrorMessage("channel_unmute_failure"), icon: 'error' });
    }
  }

  reportChannel = () => {
    let params = {
      report_entity_kind: DataContract.knownEntityTypes.channel,
      report_entity_id: this.props.channelId
    };
    new PepoApi(DataContract.channels.getReportChannelApi())
      .post(params)
      .then((response) => {
        this.onReportChannel(response);
      })
      .catch((error) => {
        this.onReportChannel(error);
      });
  };

  onReportChannel(response) {
    if (response && response.success) {
      Toast.show({ text: 'Community reported successfully!', icon: 'success' });
    } else {
      Toast.show({ text: ostErrors.getUIErrorMessage("report_channel_failure"), icon: 'error' });
    }
  }

  leaveChannel = () => {
    new PepoApi(DataContract.channels.getLeaveChannelApi(this.props.channelId))
      .post()
      .then((response) => {
        this.onLeaveChannel(response);
      })
      .catch((error) => {
        this.onLeaveChannel(error);
      });
  };

  onLeaveChannel(response) {
    if (response && response.success) {
      // ******************************************************************************************************* //
         // Commenting out the below toast line as the requirement by UX is not to show the toast success message! //
      // ******************************************************************************************************* //
      // Toast.show({ text: 'Community left successfully!', icon: 'success' }); //
    } else {
      Toast.show({ text:ostErrors.getUIErrorMessage("leave_channel_failure") , icon: 'error' });
    }
  }

  showReportAlert = () => {
    Alert.alert('', 'Report community for inappropriate content or abuse?',
      [{ text: 'Report', onPress: () => this.reportChannel() },
        { text: 'Cancel', style : 'cancel' }],
      { cancelable: true }
    );
  };

  showLeaveChannelAlert = () => {
    Alert.alert('', 'Leave community?',
      [{ text: 'Leave', onPress: () => this.leaveChannel() },
        { text: 'Cancel', style : 'cancel' }],
      { cancelable: true }
    );
  };

  showMuteChannelAlert = () => {
    Alert.alert('', 'Turn Community Notification Off',
      [{ text: 'Mute', onPress: () => this.muteNotifications() },
        { text: 'Cancel', style : 'cancel' }],
      { cancelable: true }
    );
  };

  showUnMuteChannelAlert = () => {
    Alert.alert('', 'Turn Community Notification On',
      [{ text: 'UnMute', onPress: () => this.unMuteNotifications() },
        { text: 'Cancel', style : 'cancel' }],
      { cancelable: true }
    );
  };

  showMoreOptions = () => {
    let config = this.getConfig();
    ActionSheet.show(config.actionSheetConfig, (buttonIndex) => {
      const fnName = deepGet(config, `actionConfig[${buttonIndex}]`);
      if (fnName && this[fnName]) {
        this[fnName]();
      }
    });
  };

  eidtChannel = () => {
    this.props.navigation.push('CreateCommunitiesScreen',{
      type : AppConfig.channelConstants.types.edit, 
      channelId : this.props.channelId
    });
  }

  render() {
    return !this.props.isDeleted && (
      <React.Fragment>
        <ShareOptions entityId={this.props.channelId} entityKind={'channel'}/>
        <TouchableOpacity
          style={inlineStyles.wrapperMore}
          onPress={() => {
            this.showMoreOptions();
          }}>
          <Image style={inlineStyles.moreOptionsSkipFont} source={MoreOptionsIcon} resizeMode={'contain'}/>
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

ChannelsHeaderRight.defaultProps ={
  isDeleted : false
}

export default withNavigation(ChannelsHeaderRight);