import React, { PureComponent } from 'react';
import { View , Text , Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import inlineStyles from './styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import cameraIconWhite from '../../../assets/reply_video_icon.png';  

import {navigateToCamera} from "../../../helpers/cameraHelper";
import multipleClickHandler from '../../../services/MultipleClickHandler';

class BottomReplyBar extends PureComponent {

        constructor(props){
            super(props);
        }

        replyVideo =( ) => {
            navigateToCamera( this.props.videoId ,  this.props.userId ,  this.props.navigation )
        }

        render(){
            return(
                <View style={inlineStyles.wrapper}>
                    <TouchableWithoutFeedback  onPress={multipleClickHandler(() =>this.replyVideo())} >
                         <View style={{justifyContent:"center"}}>
                            <Image source={cameraIconWhite} style={inlineStyles.replyIcon}></Image>
                            <Text style={inlineStyles.text}>Add a reply...</Text>
                         </View>                       
                    </TouchableWithoutFeedback>
                </View>    
            );

        }

}

export default withNavigation( BottomReplyBar )