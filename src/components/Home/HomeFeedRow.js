import React, { PureComponent } from 'react';
import {View } from "react-native";
import VideoWrapper from "./VideoWrapper";
import deepGet from "lodash/get";
import Store from '../../store';

import BottomStatus from "./BottomStatus"

class HomeFeedRow extends PureComponent {

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

    get userName(){
        let userId = deepGet( Store.getState() ,  `home_feed_entities.id_${this.props.feedId}.payload.user_id` ) ; 
        return deepGet( Store.getState() ,  `user_entities.id_${userId}.username` );
    }

    get name(){
        let userId = deepGet( Store.getState() ,  `home_feed_entities.id_${this.props.feedId}.payload.user_id` ) ; 
        return deepGet( Store.getState() ,  `user_entities.id_${userId}.name` );
    }

    get bio(){
        let userId = deepGet( Store.getState() ,  `home_feed_entities.id_${this.props.feedId}.payload.user_id` ) ; 
        return deepGet( Store.getState() ,  `user_profile_entities.id_${userId}.bio.text` );
    }

    get supporters(){
        let videoId = deepGet( Store.getState() ,  `home_feed_entities.id_${this.props.feedId}.payload.video_id` );
        return deepGet( Store.getState() ,  `video_stat_entities.id_${videoId}.total_contributed_by` );
    }

    get totalBt(){
        let videoId = deepGet( Store.getState() ,  `home_feed_entities.id_${this.props.feedId}.payload.video_id` );
        return deepGet( Store.getState() ,  `video_stat_entities.id_${videoId}.total_amount_raised_in_wei` );
    }

    render() {
        console.log("render HomeFeedRow" , this.userName , this.name , this.bio , this.supporters, this.totalBt);

        return  (
            <View>
               { this.props.doRender && 
                    <VideoWrapper   isActive={ this.props.isActive }
                                    videoUrl={ this.videoUrl }
                                    videoImgUrl={this.videoImgUrl} />   }           
                <BottomStatus feedId={ this.props.feedId }
                            userName={this.userName}
                            name={this.name}
                            bio={this.bio}  
                            supporters={this.supporters}
                            totalBt={this.totalBt}
                            />            
            </View>                                  
        )
    }

}


export default HomeFeedRow; 