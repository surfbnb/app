import React, { PureComponent } from 'react';
import {TouchableOpacity, Image, Alert} from "react-native";
import { connect } from 'react-redux';
import inlineStyles from './styles';
import multipleClickHandler from "../../../services/MultipleClickHandler";

import report_icon from '../../../assets/report_video.png';
import CurrentUser from "../../../models/CurrentUser";
import PepoApi from "../../../services/PepoApi";
import Toast from "../../../theme/components/NotificationToast";
import {ActionSheet} from "native-base";

const mapStateToProps = (state , ownProps) => {
    return {
        currentUserId: CurrentUser.getUserId()
    }
};


const ACTION_SHEET_BUTTONS = ['Report', 'Cancel'];
const ACTION_SHEET_CANCEL_INDEX = 1;
const ACTION_SHEET_DESCTRUCTIVE_INDEX = 0;
const ACTION_SHEET_REPORT_INDEX = 0;

class ReportVideo extends PureComponent {

    constructor(props){
        super(props);
    };



    reportVideo = () => {
        new PepoApi('/report')
            .post({report_entity_kind: this.props.reportKind, report_entity_id: this.props.reportEntityId })
            .then((response) => {
                if (response && response.success){
                    Toast.show({text:'Video reported successfully!', icon: 'success' });
                } else {
                    Toast.show({text:'Video reported failed!', icon: 'error' });

                }
            })
            .catch((err) => {
                Toast.show({text:'Video reported failed!', icon: 'error' });
                console.log('Report video failed', err);

            });
    }

    showAlert(){
        Alert.alert(
            '',
            'Report video for inappropriate content or abuse?',
            [
                {text: 'Report', onPress: () =>  this.reportVideo() },
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
                title: 'Report video'
            },
            (buttonIndex) => {
                if (buttonIndex == ACTION_SHEET_REPORT_INDEX) {
                    // This will take to VideoRecorder component
                    this.showAlert();
                }
            }
        );
    }

    isVisible = () => {
        return this.props.userId != this.props.currentUserId;
    };

    render(){
        return  this.isVisible() && (<TouchableOpacity pointerEvents={'auto'} style={inlineStyles.txElem}
                                  style={{marginBottom: 20, height: 20, width: 30, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={multipleClickHandler(() => this.showActionSheet())} >
            <Image style={{ height: 12, width: 30 }} source={report_icon} />
        </TouchableOpacity>)
    }

};

export default connect(mapStateToProps)(ReportVideo);
