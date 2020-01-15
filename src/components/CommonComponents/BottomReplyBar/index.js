import React, { PureComponent } from 'react';
import { View , Text , Image , TouchableWithoutFeedback} from 'react-native';
import { withNavigation } from 'react-navigation';
import inlineStyles from './styles';
import cameraIconWhite from '../../../assets/reply-video-white.png';

import {navigateToCamera, replyPreValidationAndMessage} from "../../../helpers/cameraHelper";
import multipleClickHandler from '../../../services/MultipleClickHandler';

class BottomReplyBar extends PureComponent {

        constructor(props){
            super(props);
        }

        replyVideo =( ) => {
            if(!this.props.videoId || !this.props.userId) return;
            if( replyPreValidationAndMessage( this.props.videoId ,  this.props.userId) )  {
                navigateToCamera( this.props.videoId ,  this.props.userId ,  this.props.navigation ) ;
            }
        }

        render(){
            return(
              <TouchableWithoutFeedback  onPress={multipleClickHandler(() =>this.replyVideo())} style={inlineStyles.wrapper}>
                 <View style={inlineStyles.innerWrapper}>
                    <Image source={cameraIconWhite} style={inlineStyles.replyIconSkipFont}></Image>
                    <Text style={inlineStyles.text}>Add a reply...</Text>
                 </View>
              </TouchableWithoutFeedback>
            );

        }

}

export default withNavigation( BottomReplyBar )
