import React, { Component } from 'react';
import { Text, TouchableOpacity, Image, Alert, TouchableWithoutFeedback, View } from 'react-native';
import { ActionSheet } from 'native-base';
import inlineStyles from './styles';
import Toast from '../../theme/components/NotificationToast';
import UserProfileOptions from '../../assets/user_profile_options.png';
import PepoApi from '../../services/PepoApi';



const ACTION_SHEET_BUTTONS = ['Report', 'Cancel'];
const ACTION_SHEET_CANCEL_INDEX = 1;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 0;
const ACTION_SHEET_REPORT_INDEX = 0



export default class ReportProfile extends Component {

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
                console.log('Report user failed', err);

            });
    }

    showAlert(){
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

    showActionSheet = () => {
        ActionSheet.show(
            {
                options: ACTION_SHEET_BUTTONS,
                cancelButtonIndex: ACTION_SHEET_CANCEL_INDEX,
                destructiveButtonIndex: ACTION_SHEET_DESCTRUCTIVE_INDEX,
                title: 'Report user'
            },
            (buttonIndex) => {
                if (buttonIndex == ACTION_SHEET_REPORT_INDEX) {
                    // This will take to VideoRecorder component
                   this.showAlert();
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
