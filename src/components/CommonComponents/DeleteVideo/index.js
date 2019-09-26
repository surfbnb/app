import React, { Component } from 'react';
import { Text, TouchableOpacity, Image, Alert, TouchableWithoutFeedback, View } from 'react-native';
import { ActionSheet } from 'native-base';
import inlineStyles from './styles';
import Toast from '../../../theme/components/NotificationToast';
import UserProfileOptions from '../../../assets/user_profile_options.png';
import PepoApi from '../../../services/PepoApi';
import elipses from "../../../assets/elipses_video_in_profile.png";
import {ostErrors} from "../../../services/OstErrors";
const ACTION_SHEET_BUTTONS = ['Delete', 'Cancel'];
const ACTION_SHEET_CANCEL_INDEX = 1;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 0;
const ACTION_SHEET_DELETE_VIDEO = 0



export default class DeleteVideo extends Component {

    constructor(props) {
        super(props);
    }

    deleteUser = () => {
        if(!this.props.videoId) return;
        new PepoApi(`/videos/${this.props.videoId}/delete`)
            .post()
            .then((response) => {

                if (response && response.success){
                    this.props.removeVideo && this.props.removeVideo(this.props.videoId);
                    Toast.show({text:'Video deleted successfully!', icon: 'success'});
                } else {
                    Toast.show({text:ostErrors.getUIErrorMessage('delete_video_error'), icon: 'error'});

                }
            })
            .catch((err) => {
                Toast.show({text:ostErrors.getUIErrorMessage('delete_video_error'), icon: 'error'});
            });
    }

    showAlert(){
        Alert.alert(
            '',
            'Are you sure to delete video?',
            [
                {text: 'Delete', onPress: () =>  this.deleteUser() },
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
                title: 'Delete Video'
            },
            (buttonIndex) => {
                if (buttonIndex == ACTION_SHEET_DELETE_VIDEO) {
                    // This will take to VideoRecorder component
                    this.showAlert();
                }
            }
        );
    }

    render() {
        return (<TouchableWithoutFeedback onPress={this.showActionSheet}>
            <View style={inlineStyles.reportIconWrapper}>
                <Image style={{height: 3, width: 14}} source={elipses} />
            </View>
        </TouchableWithoutFeedback>);
    }

}
