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
import ReduxGetters from "../../../services/ReduxGetters";
import {fetchUser} from "../../../helpers/helpers";

const  ACTION_SHEET_CANCEL_INDEX = 2;
const  ACTION_SHEET_DESCTRUCTIVE_INDEX = 1;
const  ACTION_SHEET_REPORT_INDEX = 1;
const MUTE_UNMUTE_INDEX = 0;


const  ACTION_SHEET_LOGGED_OUT_CANCEL_INDEX = 1;
const  ACTION_SHEET_LOGGED_OUT_DESCTRUCTIVE_INDEX = 0;
const  ACTION_SHEET_LOGGED_OUT_REPORT_INDEX = 0;


const mapStateToProps = (state , ownProps) => {
    return {
        currentUserId: CurrentUser.getUserId()
    }
};



class ReportVideo extends PureComponent {

    constructor(props){
      super(props);
    };


    getActionSheetButtons = ()=>{
      return [ this.getMuteUnmuteText(), 'Report', 'Cancel'];
    }

  getActionSheetLoggedOutButtons = () => {
    return [ 'Report', 'Cancel'];
  }


  getMuteUnmuteText = () => {

    let name = ReduxGetters.getName(this.props.userId);
    if (this.canMute()){
      return `See less videos from ${name}`;
    } else if (this.canUnmute()) {
      return `See more videos from ${name}`;
    }
    return '';

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
    };

  showAlert () {
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


  muteUnmuteUser = () => {
    let apiEndpoint = '';
    if (this.canMute() ){
      apiEndpoint = `/users/${this.props.userId}/mute`;
    } else if (this.canUnmute()){
      apiEndpoint = `/users/${this.props.userId}/unmute`;
    } else {
      return;
    }

    new PepoApi(apiEndpoint)
      .post()
      .then((response) => {
        if (response && response.success){
          Toast.show({text:'Confirmed!', icon: 'success' });
          fetchUser(this.props.userId);
        } else {
          Toast.show({text:'failed!', icon: 'error' });
        }
      })
      .catch((err) => {
        Toast.show({text:'failed!', icon: 'error' });
        console.log('Action failed!', err);
      });
  };

  canMute = () => {
    return ReduxGetters.canMuteUser(this.props.userId) === true;
  };

  canUnmute = () => {
    return ReduxGetters.canMuteUser(this.props.userId) === false;
  };

  showMuteUnmuteAlert = () => {

    let message = '';
    if (this.canMute()){
      message =  'By confirming this you will see less videos from ' + ReduxGetters.getName(this.props.userId);
    } else if (this.canUnmute()){
      message =  'By confirming this you will see more videos from ' + ReduxGetters.getName(this.props.userId);
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

    showActionSheet = () => {
      if (CurrentUser.getUserId()){
        ActionSheet.show(
          {
            options: this.getActionSheetButtons(),
            cancelButtonIndex: ACTION_SHEET_CANCEL_INDEX,
            destructiveButtonIndex: ACTION_SHEET_DESCTRUCTIVE_INDEX,
            title: 'Actions'
          },
          (buttonIndex) => {
            if (buttonIndex == ACTION_SHEET_REPORT_INDEX) {
              // This will take to VideoRecorder component
              this.showAlert();
            } else if (buttonIndex == MUTE_UNMUTE_INDEX){
              this.showMuteUnmuteAlert();
            }
          }
        );

      } else {
        ActionSheet.show(
          {
            options: this.getActionSheetLoggedOutButtons(),
            cancelButtonIndex: ACTION_SHEET_LOGGED_OUT_CANCEL_INDEX,
            destructiveButtonIndex: ACTION_SHEET_LOGGED_OUT_DESCTRUCTIVE_INDEX,
            title: 'Actions'
          },
          (buttonIndex) => {
            if (buttonIndex == ACTION_SHEET_LOGGED_OUT_REPORT_INDEX) {
              // This will take to VideoRecorder component
              this.showAlert();
            }
            }
            )

      }


    };

    isVisible = () => {
        return this.props.userId != this.props.currentUserId;
    };

    render(){
        return  this.isVisible() && (<TouchableOpacity pointerEvents={'auto'} style={inlineStyles.txElem}
                                  style={{marginBottom: 20, height: 24, width: 50, alignItems: 'center', justifyContent: 'center'}}
                                  onPress={multipleClickHandler(() => this.showActionSheet())} >
            <Image style={{ height: 12, width: 30 }} source={report_icon} />
        </TouchableOpacity>)
    }

};

export default connect(mapStateToProps)(ReportVideo);
