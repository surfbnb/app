import React, {PureComponent} from 'react';
import {TouchableOpacity, Image, Alert} from "react-native";
import {connect} from 'react-redux';
import multipleClickHandler from "../../../services/MultipleClickHandler";
import report_icon from '../../../assets/report_video.png';
import CurrentUser from "../../../models/CurrentUser";
import PepoApi from "../../../services/PepoApi";
import Toast from "../../../theme/components/NotificationToast";
import {ActionSheet} from "native-base";
import ReduxGetters from "../../../services/ReduxGetters";
import {fetchUser} from "../../../helpers/helpers";
import DataContract from '../../../constants/DataContract';
import Utilities from '../../../services/Utilities';
import deepGet from "lodash/get"

import {testProps} from "../../../constants/AppiumAutomation";

const mapStateToProps = (state, ownProps) => {
  return {
    currentUserId: CurrentUser.getUserId()
  }
};

class ReportVideo extends PureComponent {
  
  constructor(props) {
    super(props);
  };

  getDefaultConfig() {
    return {
      loginVideoConfig: {
        actionConfig: {
          0: "showMuteUnmuteAlert",   //function name in component mapped to index in actionSheetConfig options array
          2: "showReportVideoAlert"   //function name in component mapped to index in actionSheetConfig options array
        },
        actionSheetConfig: {
          options: [this.getActionSheetMuteUnmuteText(), `Video Id: ${this.props.entityId}`, 'Report', 'Cancel'],
          cancelButtonIndex: 3,  //Cancel button index in options array
          destructiveButtonIndex: 2, //Red button index in options array
          title: 'Select user action'
        }
      },
      logoutVideoConfig: {
        actionConfig: {
          0: "showReportVideoAlert"  //function name in component mapped to index in actionSheetConfig options array
        },
        actionSheetConfig: {
          options: ['Report', 'Cancel'],
          cancelButtonIndex: 1, //Cancel button index in options array
          destructiveButtonIndex: 0,  //Red button index in options array
          title: 'Select user action'
        }
      },
      loginReplyConfig: {
        actionConfig: {
          0: "showMuteUnmuteAlert",   //function name in component mapped to index in actionSheetConfig options array
          1: "showReportVideoAlert"  //function name in component mapped to index in actionSheetConfig options array
        },
        actionSheetConfig: {
          options: [this.getActionSheetMuteUnmuteText(), 'Report', 'Cancel'],
          cancelButtonIndex: 2,  //Cancel button index in options array
          destructiveButtonIndex: 1, //Red button index in options array
          title: 'Select user action'
        }
      },
      logoutReplyConfig: {
        actionConfig: {
          0: "showReportVideoAlert"  //function name in component mapped to index in actionSheetConfig options array
        },
        actionSheetConfig: {
          options: ['Report', 'Cancel'],
          cancelButtonIndex: 1, //Cancel button index in options array
          destructiveButtonIndex: 0, //Red button index in options array
          title: 'Select user action'
        }
      }
    }
  }
  
  getActionSheetConfig() {
    if (CurrentUser.getUserId()) {
      //Login sheet config
      if (DataContract.knownEntityTypes.video == this.props.entityKind) {
        //Fan video sheetconfig
        return this.getDefaultConfig().loginVideoConfig;
      } else {
        //Reply video sheetconfig
        return this.getDefaultConfig().loginReplyConfig;
      }
    } else {
      //Logout sheet config
      if (DataContract.knownEntityTypes.video = this.props.entityKind) {
        //Fan video sheetconfig
        return this.getDefaultConfig().logoutVideoConfig;
      } else {
        //Reply video sheetconfig
        return this.getDefaultConfig().logoutReplyConfig;
      }
    }
  }
  
  canMute = () => {
    return !!ReduxGetters.canMuteUser(this.props.userId);
  };
  
  getActionSheetMuteUnmuteText = () => {
    return `${Utilities.capitalizeFirstLetter(this.getMuteUnMuteText())} ${this.getUserName()}`;
  };
  
  getUserName = () => {
    return ReduxGetters.getName(this.props.userId);
  }
  
  getMuteUnMuteText = () => {
    if (this.canMute()) {
      return "mute";
    } else {
      return `unmute`;
    }
  }
  
  showReportVideoAlert() {
    Alert.alert('', 'Report video for inappropriate content or abuse?',
      [{text: 'Report', onPress: () => this.reportVideo()},
        {text: 'Cancel', style: 'cancel'}],
      {cancelable: true});
  }
  
  reportVideo = () => {
    new PepoApi(DataContract.actionSheet.video.reportApi)
      .post({report_entity_kind: this.props.reportKind, report_entity_id: this.props.entityId})
      .then((response) => {
        this.onReportVideo(response);
      })
      .catch((err) => {
        this.onReportVideo(err);
      });
  };
  
  onReportVideo = (response) => {
    if (response && response.success) {
      Toast.show({text: 'Video reported successfully!', icon: 'success'});
    } else {
      Toast.show({text: 'Video reported failed!', icon: 'error'});
    }
  }
  
  showMuteUnmuteAlert = () => {
    let message = `By confirming this you will ${this.getMuteUnMuteText()} ` + ReduxGetters.getName(this.props.userId);
    Alert.alert('', message,
      [{text: 'Confirm', onPress: () => this.muteUnmuteUser()},
        {text: 'Cancel', style: 'cancel'}
      ],
      {cancelable: true},
    );
  };
  
  muteUnmuteUser = () => {
    new PepoApi(DataContract.actionSheet.video.getMuteUnMuteApi(this.props.userId, this.canMute()))
      .post()
      .then((response) => {
        this.onMuteUnMute(response);
      })
      .catch((err) => {
        this.onMuteUnMute(err);
      });
  };
  
  onMuteUnMute = (response) => {
    if (response && response.success) {
      Toast.show({text: `User ${this.getMuteUnMuteText().toLowerCase()}d successfully!`, icon: 'success'});
      fetchUser(this.props.userId);
    } else {
      Toast.show({text: `User ${this.getMuteUnMuteText().toLowerCase()}d failed!`, icon: 'error'});
    }
  }
  
  showActionSheet = () => {
    const config = this.getActionSheetConfig();
    ActionSheet.show(
      config.actionSheetConfig,
      (buttonIndex) => {
        const fnName = deepGet(config, `actionConfig[${buttonIndex}]`)
        if (fnName && this[fnName]) {
          this[fnName]();
        }
      }
    );
  };
  
  isVisible = () => {
    return this.props.userId != this.props.currentUserId;
  };
  
  render() {
    return this.isVisible() && (
      <React.Fragment>
        <TouchableOpacity pointerEvents={'auto'}
                          style={{
                            height: 24,
                            width: '20%',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: -14
                          }}
                          {...testProps('pepo-report-button')}
                          onPress={multipleClickHandler(() => this.showActionSheet())}>
          <Image style={{height: 12, width: 30}} source={report_icon}/>
        </TouchableOpacity>
      </React.Fragment>
    )
  }
  
};

export default connect(mapStateToProps)(ReportVideo);
