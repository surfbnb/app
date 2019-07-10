import React, { Component } from 'react';
import {View , Text} from "react-native";
import VideoWrapper from "./VideoWrapper";
import deepGet from "lodash/get";
import Store from '../../store';

import BottomStatus from "./BottomStatus"

class HomeFeedRow extends Component {

    constructor(props){
        super(props);
    }

    get videoUrl ()  {
        let videoId = deepGet( Store.getState() ,  `home_feed_entities.id_${this.props.feedId}.payload.video_id` ) ;
        console.log("video url" + videoId ,  deepGet(  Store.getState() , `video_entities.id_${videoId}.resolutions.original.url`) ); 
        return deepGet(  Store.getState() , `video_entities.id_${videoId}.resolutions.original.url`) || "";
    }

    render() {
        console.log("render HomeFeedRow");
        return (
            <View>
                <VideoWrapper isActive={ this.props.isActive }
                            doRender={ this.props.doRender } //TODO video only 
                            videoUrl={ this.videoUrl }
                            feedId={ this.props.feedId } />  
                <BottomStatus/>            
            </View>                                  
        )
    }

}


export default HomeFeedRow; 