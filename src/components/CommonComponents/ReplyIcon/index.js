import React, { PureComponent } from 'react';
import {TouchableOpacity , Image, View, Text} from "react-native";
import { connect } from 'react-redux';
import {withNavigation} from "react-navigation";
import reduxGetter from '../../../services/ReduxGetters';
import inlineStyles from './styles';
import multipleClickHandler from "../../../services/MultipleClickHandler";
import reply_video from '../../../assets/video-reply.png';
import Utilities from '../../../services/Utilities';
import NavigationService from "../../../services/NavigationService";
import utilities from "../../../services/Utilities";
import {getVideoReplyObject, replyPreValidationAndMessage} from "../../../helpers/cameraHelper";

const mapStateToProps = (state , ownProps) => {
  return {
    videoReplyCount : reduxGetter.getVideoReplyCount(ownProps.videoId, state)
  }
};

class ReplyIcon extends PureComponent {

   constructor(props){
     super(props);
    };

    replyVideo = ()=> {

      if(!Utilities.checkActiveUser()) return;

      if ( this.props.videoReplyCount > 0 ) {
        this.props.navigation.push('VideoReplies',
          {'videoId': this.props.videoId ,
            'userId': this.props.userId
          });
      } else if( replyPreValidationAndMessage(this.props.videoId , this.props.userId  ) ){
          let activeTab = NavigationService.getActiveTab();
          let params = getVideoReplyObject(this.props.videoId, this.props.userId);
          utilities.handleVideoUploadModal(activeTab, this.props.navigation, params);
      }

    };

    render(){
        return (
        <React.Fragment>
            <Text style={inlineStyles.videoReplyCount}>{this.props.videoReplyCount}</Text>
            <TouchableOpacity pointerEvents={'auto'}
                            style={inlineStyles.replyIconWrapper}
                            onPress={multipleClickHandler(() => this.replyVideo())} >
                <Image style={{ width: 38, height: 31.3 }} source={reply_video} />
            </TouchableOpacity>
        </React.Fragment>);
    }

};

export default connect(mapStateToProps)(withNavigation(ReplyIcon));
