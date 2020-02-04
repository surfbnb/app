import React, { PureComponent } from 'react';
import { Image, Alert, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';

import { ActionSheet } from 'native-base';
import inlineStyles from './styles';
import Toast from '../../theme/components/NotificationToast';
import UserProfileOptions from '../../assets/user_profile_options.png';
import PepoApi from '../../services/PepoApi';
import ReduxGetters from '../../services/ReduxGetters';
import {fetchUser} from "../../helpers/helpers";
import { withNavigation } from "react-navigation";
import ShareOptions from '../CommonComponents/ShareOptions';


const ACTION_SHEET_CANCEL_INDEX = 3;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 2;
const ACTION_SHEET_REPORT_INDEX = 1;
const ACTION_SHEET_BLOCK_UNBLOCK_INDEX = 2;
const MUTE_UNMUTE_INDEX = 0;

const mapStateToProps = (state, ownProps) => {
    return {
        canBlockUser: ReduxGetters.canBlockUser(ownProps.userId , state)
    };
};

class UserProfileActionSheet extends PureComponent {

    constructor(props) {
        super(props);
        this.actionSheetButtons = [ this.getMuteUnmuteText() ,'Report', 'Block' ,'Cancel'];
        this.sharingActionSheetButtons = ['Share via Link', 'Share via QR Code' ,'Pay via QR code', 'Cancel'];
    }

    reportUser = () => {
        new PepoApi('/report')
            .post({report_entity_kind: 'user', report_entity_id: this.props.userId })
            .then((response) => {
                if (response && response.success){
                    Toast.show({text:'User reported successfully!', icon: 'success' });
                } else {
                    Toast.show({text: `Unable to report user right now.`, icon: 'error' });
                }
            })
            .catch((err) => {
                Toast.show({text: `Unable to report user right now.`, icon: 'error' });
            });
    };

    getMuteUnmuteText = () => {
        let name = ReduxGetters.getName(this.props.userId);
        if (this.canMute()){
            return `Mute ${name}`;
        } else if (this.canUnmute()) {
            return `Unmute ${name}`;
        }
        return '';
    };


    muteUnmuteUser = () => {
        let apiEndpoint = '',
          successMessage,
          errorMessage;
        if (this.canMute() ){
            apiEndpoint = `/users/${this.props.userId}/mute`;
            successMessage = 'User muted successfully!';
            errorMessage = 'User mute failed!';
        } else if (this.canUnmute()){
            apiEndpoint = `/users/${this.props.userId}/unmute`;
            successMessage = 'User unmuted successfully!';
            errorMessage = 'User unmute failed!';
        } else {
            return;
        }

        new PepoApi(apiEndpoint)
          .post()
          .then((response) => {
              if (response && response.success){
                  Toast.show({text:successMessage, icon: 'success' });
                  fetchUser(this.props.userId);
              } else {
                  Toast.show({text:errorMessage, icon: 'error' });
              }
          })
          .catch((err) => {
              Toast.show({text:errorMessage, icon: 'error' });
              console.log('Action failed!', err);
          });
    };

    canMute = () => {
        return ReduxGetters.canMuteUser(this.props.userId) === true;
    }

    canUnmute = () => {
        return ReduxGetters.canMuteUser(this.props.userId) === false;
    }

    showMuteUnmuteAlert = () => {

        let message = '';
        if (this.canMute()){
            message =  'By confirming this you will mute ' + ReduxGetters.getName(this.props.userId);
        } else if (this.canUnmute()){
            message =  'By confirming this you will unmute ' + ReduxGetters.getName(this.props.userId);
        } else {
            return;
        }

        Alert.alert(
          '',
          message,
          [
              {text: 'Confirm', onPress: () =>  this.muteUnmuteUser() },
              {
                  text: 'Cancel',
                  style: 'cancel'
              }

          ],
          {cancelable: true},
        );

    };

    blockUser = () => {
        const oThis = this;
        new PepoApi(`/users/${this.props.userId}/block`)
        .post()
        .then((response) => {
            if (response && response.success){
                oThis.onBlockUnblockSuccessToast(true);
                oThis.onBlockUnBlockSuccess(true);
            }else{
                oThis.onBlockUnblockErrorToast(true);
            }
        })
        .catch((err) => {
            oThis.onBlockUnblockErrorToast(true);
        });
    }

    unBlockUser = () => {
        const oThis =this;
        new PepoApi(`/users/${this.props.userId}/unblock`)
        .post()
        .then((response) => {
            if (response && response.success){
                oThis.onBlockUnblockSuccessToast();
                oThis.onBlockUnBlockSuccess();
            }else{
                oThis.onBlockUnblockErrorToast();
            }
        })
        .catch((err) => {
            oThis.onBlockUnblockErrorToast();
        });
    }

    onBlockUnblockSuccessToast = ( isBlocked ) =>  {
        const text = isBlocked ? "blocked" : "unblocked" ;
        Toast.show({text: `User ${text} successfully`, icon: 'success' });
    }

    onBlockUnblockErrorToast = ( isBlockedAction ) =>{
        const text = isBlockedAction ? "block" : "unblock" ;
        Toast.show({text: `Unable to ${text} user right now.`, icon: 'error' });
    }

    onBlockUnBlockSuccess = ( isBlockedAction ) => {
        this.props.userActionEvents && this.props.userActionEvents.emit("onBlockUnblockAction" ,  { action : isBlockedAction ? "block": "unblock"});
    }

    showReportAlert = () =>{
        Alert.alert(
            '',
            'Report user for inappropriate content or abuse?',
            [
                {text: 'Report', onPress: () =>  this.reportUser() },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ],
            {cancelable: true},
        );
    }

    showBlockAlert = () =>{
        Alert.alert(
            '',
            'Block user for inappropriate content or abuse?',
            [
                {text: 'Block', onPress: () =>  this.blockUser() },
                {
                    text: 'Cancel',
                    style: 'cancel'
                }
            ],
            {cancelable: true},
        );
    }

    showActionSheet = () => {
        let actionOptions  = [...this.actionSheetButtons] ,
            blockAction = this.showBlockAlert;
        if(!this.props.canBlockUser){
            actionOptions[ACTION_SHEET_BLOCK_UNBLOCK_INDEX]  = 'Unblock'; //Mutate via code later.
            blockAction =  this.unBlockUser;
        }
        actionOptions[MUTE_UNMUTE_INDEX] = this.getMuteUnmuteText();
        ActionSheet.show(
            {
                options: actionOptions,
                cancelButtonIndex: ACTION_SHEET_CANCEL_INDEX,
                destructiveButtonIndex: ACTION_SHEET_DESCTRUCTIVE_INDEX,
                title: "Select user action"
            },
            (buttonIndex) => {
                if (buttonIndex == ACTION_SHEET_REPORT_INDEX) {
                   this.showReportAlert();
                }else if( buttonIndex ==  ACTION_SHEET_BLOCK_UNBLOCK_INDEX ){
                    blockAction();
                } else if (buttonIndex == MUTE_UNMUTE_INDEX){
                    this.showMuteUnmuteAlert();
                }
            }
        );
    }

    render() {
        return (
          <React.Fragment>
            <ShareOptions entityId={this.props.userId} entityKind={'user'}/>
            <TouchableWithoutFeedback onPress={this.showActionSheet}>
                <View style={inlineStyles.reportIconWrapper}>
                    <Image source={UserProfileOptions} style={inlineStyles.userProfileOptionSkipFont}></Image>
                </View>
            </TouchableWithoutFeedback>
          </React.Fragment>
        );
    }

}


export default connect(mapStateToProps)(withNavigation(UserProfileActionSheet));
