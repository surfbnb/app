import React, { PureComponent } from 'react';
import { View , Text , Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import inlineStyles from './styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import cameraIconWhite from '../../../assets/reply-video-white.png';

import {navigateToCamera, replyPreValidationAndMessage} from "../../../helpers/cameraHelper";
import multipleClickHandler from '../../../services/MultipleClickHandler';

class BottomReplyBar extends PureComponent {

        constructor(props){
            super(props);
        }

        replyVideo =( ) => {
            if( replyPreValidationAndMessage( this.props.videoId ,  this.props.userId) )  {
                navigateToCamera( this.props.videoId ,  this.props.userId ,  this.props.navigation ) ;
            }       
        }

        render(){
            return(
                <View style={inlineStyles.wrapper}>
                    <TouchableWithoutFeedback  onPress={multipleClickHandler(() =>this.replyVideo())} >
                         <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Image source={cameraIconWhite} style={inlineStyles.replyIcon}></Image>
                            <Text style={inlineStyles.text}>Add a reply...</Text>
                         </View>                       
                    </TouchableWithoutFeedback>
                </View>    
            );

        }

}

export default withNavigation( BottomReplyBar )