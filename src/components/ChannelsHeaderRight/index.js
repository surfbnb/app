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
import { fetchChannel } from '../../helpers/helpers';
import {ostErrors} from '../../services/OstErrors';


class ChannelsHeaderRight extends PureComponent {
  constructor(props) {
    super(props);
  }

  getDefaultConfig = () => {
    return {
      memberConfig: {
        actionConfig: {
          0: this.checkMuteStatus() ? 'showUnMuteChannelAlert' : 'showMuteChannelAlert',
          1: 'showLeaveChannelAlert',
          2: 'showReportAlert',
          3: 'cancel'
        },
        actionSheetConfig: {
          options: [this.getMuteOptionText(), 'Leave Channel', 'Report Channel', 'Cancel'],
          cancelButtonIndex: 3,
          destructiveButtonIndex: 2
        }
      },
      nonMemberConfig: {
        actionConfig: {
          0: 'showReportAlert',
          1: 'cancel'
        },
        actionSheetConfig: {
          options: ['Report Channel', 'Cancel'],
          cancelButtonIndex: 1,
          destructiveButtonIndex: 0
        }
      }
    };
  };

  getConfig = () => {
    let isMember = reduxGetters.isCurrentUserMemberOfChannel(this.props.channelId);
    if (isMember) {
      return this.getDefaultConfig().memberConfig;
    } else {
      return this.getDefaultConfig().nonMemberConfig;
    }
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
      Toast.show({ text: 'Channel muted successfully!', icon: 'success' });
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
      Toast.show({ text: 'Channel unmuted successfully!', icon: 'success' });
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
      Toast.show({ text: 'Channel reported successfully!', icon: 'success' });
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
      // Toast.show({ text: 'Channel left successfully!', icon: 'success' }); //
    } else {
      Toast.show({ text:ostErrors.getUIErrorMessage("leave_channel_failure") , icon: 'error' });
    }
  }

  showReportAlert = () => {
    Alert.alert('', 'Report channel for inappropriate content or abuse?',
      [{ text: 'Report', onPress: () => this.reportChannel() },
        { text: 'Cancel', style : 'cancel' }],
      { cancelable: true }
    );
  };

  showLeaveChannelAlert = () => {
    Alert.alert('', 'Leave channel for inappropriate content or abuse?',
      [{ text: 'Leave', onPress: () => this.leaveChannel() },
        { text: 'Cancel', style : 'cancel' }],
      { cancelable: true }
    );
  };

  showMuteChannelAlert = () => {
    Alert.alert('', 'Mute channel ?',
      [{ text: 'Mute', onPress: () => this.muteNotifications() },
        { text: 'Cancel', style : 'cancel' }],
      { cancelable: true }
    );
  };

  showUnMuteChannelAlert = () => {
    Alert.alert('', 'UnMute channel ?',
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

  render() {
    return (
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

export default withNavigation(ChannelsHeaderRight);