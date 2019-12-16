import React, { PureComponent } from 'react';
import {TouchableOpacity, Image, Alert} from "react-native";
import { connect } from 'react-redux';
import inlineStyles from './styles';
import multipleClickHandler from "../../../services/MultipleClickHandler";
import appVariables from '../../../services/AppVariables';
import report_icon from '../../../assets/report_video.png';
import CurrentUser from "../../../models/CurrentUser";
import PepoApi from "../../../services/PepoApi";
import Toast from "../../../theme/components/NotificationToast";
import {ActionSheet} from "native-base";
import ReduxGetters from "../../../services/ReduxGetters";
import {fetchUser} from "../../../helpers/helpers";
//Vitals: To remove start
import Vitals from 'react-native-vitals';
import { LowMemoryEmitter } from '../../../helpers/Emitters';
//Vitals: To remove end

const  ACTION_SHEET_CANCEL_INDEX = 3;// revert to index 2
const  ACTION_SHEET_DESCTRUCTIVE_INDEX = 1;
const  ACTION_SHEET_REPORT_INDEX = 1;
//Vitals: To remove start
const  ACTION_SHEET_MEMORY_INDEX = 2;
//Vitals: To remove end
const MUTE_UNMUTE_INDEX = 0;


const  ACTION_SHEET_LOGGED_OUT_CANCEL_INDEX = 2;// revert to index 1
const  ACTION_SHEET_LOGGED_OUT_DESCTRUCTIVE_INDEX = 0;
const  ACTION_SHEET_LOGGED_OUT_REPORT_INDEX = 0;
//Vitals: To remove start
const  ACTION_SHEET_LOGGED_OUT_MEMORY_INDEX = 1;
//Vitals: To remove end


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
      return [ this.getMuteUnmuteText(), 'Report','Show memory stats', 'Cancel'];// remove memory option
    }

  getActionSheetLoggedOutButtons = () => {
    return [ 'Report', 'Show memory stats', 'Cancel'];// remove memory option
  }


  getMuteUnmuteText = () => {

    let name = ReduxGetters.getName(this.props.userId);
    if (this.canMute()){
      return `Mute ${name}`;
    } else if (this.canUnmute()) {
      return `Unmute ${name}`;
    }
    return '';

  };

  //Vitals: To remove start
  componentDidMount(){
    Vitals.addLowMemoryListener(memory => {
      var {
        appUsed,
        systemTotal,
        systemFree,
        systemUsed
      } = memory;
      LowMemoryEmitter.emit('memoryLow');
    })
  }

  componentWillUnmount(){
    Vitals.addLowMemoryListener = ()=> {};
  }
  //Vitals: To remove end


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

    //Vitals: To remove start    
    showMemoryStats = () => {
      Vitals.getMemory().then(memory => {
        var {
          appUsed,
          systemTotal,
          systemFree,
          systemUsed
        } = memory;
        Alert.alert("","Memory used- "+"appUsed: "+appUsed+
        " systemTotal: "+systemTotal+
        " systemFree: "+systemFree+
        " systemUsed: "+systemUsed);
        })
    }
    //Vitals: To remove end

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
        console.log('Action failed!', err, errorMessage);
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
            } else if (buttonIndex == ACTION_SHEET_MEMORY_INDEX){// remove memory option
              this.showMemoryStats();
            }else if (buttonIndex == MUTE_UNMUTE_INDEX){
              this.showMuteUnmuteAlert();
            }
          }
        );

      } else {

        appVariables.isActionSheetVisible = true;
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
            }else if (buttonIndex == ACTION_SHEET_LOGGED_OUT_MEMORY_INDEX){// remove memory option
              this.showMemoryStats();
            }
            appVariables.isActionSheetVisible = false;
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
