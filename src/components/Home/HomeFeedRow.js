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
        return deepGet(  Store.getState() , `video_entities.id_${videoId}.resolutions.original.url`) || "";
    }

    get videoImgUrl(){
        let videoId = deepGet( Store.getState() ,  `home_feed_entities.id_${this.props.feedId}.payload.video_id` ) ,
            posterImageId = deepGet( Store.getState() ,  `video_entities.id_${videoId}.poster_image_id` )
        ;
        return deepGet(  Store.getState() , `image_entities.id_${posterImageId}.resolutions.750w.url`) || "";
    }

    render() {
        console.log("render HomeFeedRow");
        return (
            <View>
                {this.props.doRender && 
                    <VideoWrapper   isActive={ this.props.isActive }
                                    videoUrl={ this.videoUrl }
                                    videoImgUrl={this.videoImgUrl} /> 
                 }             
                <BottomStatus feedId={ this.props.feedId }/>            
            </View>                                  
        )
    }

}


export default HomeFeedRow; 