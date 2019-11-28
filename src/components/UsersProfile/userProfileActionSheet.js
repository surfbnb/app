import React, { PureComponent } from 'react';
import { Image, Alert, TouchableWithoutFeedback, View } from 'react-native';
import { connect } from 'react-redux';

import { ActionSheet } from 'native-base';
import inlineStyles from './styles';
import Toast from '../../theme/components/NotificationToast';
import UserProfileOptions from '../../assets/user_profile_options.png';
import PepoApi from '../../services/PepoApi';
import ReduxGetters from '../../services/ReduxGetters';

const ACTION_SHEET_BUTTONS = ['Report', 'Block' ,'Cancel'];
const ACTION_SHEET_CANCEL_INDEX = 2;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 1;
const ACTION_SHEET_REPORT_INDEX = 0;
const ACTION_SHEET_BLOCK_UNBLOCK_INDEX = 1;


const mapStateToProps = (state, ownProps) => {
    return {
        canBlockUser: ReduxGetters.canBlockUser(ownProps.userId , state)
    };
};

class UserProfileActionSheet extends PureComponent {

    constructor(props) {
        super(props);
    }

    reportUser = () => {
        new PepoApi('/report')
            .post({report_entity_kind: 'user', report_entity_id: this.props.userId })
            .then((response) => {
                if (response && response.success){
                    Toast.show({text:'User reported successfully!', icon: 'success' });
                }
            })
            .catch((err) => {
                Toast.show({text: `Unable to report user right now.`, icon: 'error' });
            });
    }

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
        let actionOptions  = ACTION_SHEET_BUTTONS ,
            blockAction = this.showBlockAlert;
        if(!this.props.canBlockUser){
            actionOptions  = ['Report', 'Unblock' ,'Cancel'] ; //Mutate via code later.
            blockAction =  this.unBlockUser;
        }
        ActionSheet.show(
            {
                options: actionOptions,
                cancelButtonIndex: ACTION_SHEET_CANCEL_INDEX,
                destructiveButtonIndex: ACTION_SHEET_DESCTRUCTIVE_INDEX
            },
            (buttonIndex) => {
                if (buttonIndex == ACTION_SHEET_REPORT_INDEX) {
                   this.showReportAlert();
                }else if( buttonIndex ==  ACTION_SHEET_BLOCK_UNBLOCK_INDEX ){
                    blockAction();
                }
            }
        );
    }

    render() {
        return (<TouchableWithoutFeedback onPress={this.showActionSheet}>
         <View style={inlineStyles.reportIconWrapper}>
        <Image source={UserProfileOptions} style={inlineStyles.userProfileOptionSkipFont}   ></Image>
         </View>
        </TouchableWithoutFeedback>);
    }

}


export default connect(mapStateToProps)(UserProfileActionSheet);
