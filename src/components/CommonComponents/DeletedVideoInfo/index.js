import React, {PureComponent} from 'react';
import {TouchableOpacity, View, Image, Text} from 'react-native';
import {withNavigation} from 'react-navigation';

import video_not_available from '../../../assets/video-not-available.png';
import historyBack from "../../../assets/user-video-history-back-icon.png";
import inlineStyles from './styles';

class DeletedVideoInfo extends PureComponent{
    constructor(props){
        super(props);
    }

    render(){
        return (<View style={inlineStyles.container}>
                    <TouchableOpacity onPressOut={()=>this.props.navigation.goBack()} style={inlineStyles.historyBackSkipFont}>
                    <Image style={{ width: 14.5, height: 22 }} source={historyBack} />
                    </TouchableOpacity>
                    <Image style={inlineStyles.imgSizeSkipFont} source={video_not_available} />
                    <Text style={inlineStyles.desc}>Looks like the Video you were looking for isn’t available and might have been deleted by the creator!</Text>
                </View>);
    }
}

export default withNavigation(DeletedVideoInfo);