import React, { PureComponent } from 'react';
import {View } from "react-native";
import VideoWrapper from "./VideoWrapper";
import reduxGetter from "../../services/ReduxGetters";

import BottomStatus from "./BottomStatus"

class HomeFeedRow extends PureComponent {

    constructor(props){
        super(props);
    }

    get userId(){
        return reduxGetter.getHomeFeedUserId( this.props.feedId ); 
    }

    get videoId(){
       return reduxGetter.getHomeFeedVideoId( this.props.feedId );
    }

    get videoUrl ()  {
        return reduxGetter.getVideoUrl(this.videoId);
    }

    get videoImgUrl(){
        return reduxGetter.getVideoImgUrl( this.videoId );
    }

    get userName(){
        return reduxGetter.getUserName( this.userId );
    }

    get name(){
        return reduxGetter.getName( this.userId );
    }

    get bio(){
        return reduxGetter.getBio( this.userId );
    }

    get supporters(){
        return reduxGetter.getVideoSupporters( this.videoId );
    }

    get totalBt(){
        return reduxGetter.getVideoBt( this.videoId );
    }

    render() {
        console.log("render HomeFeedRow");
        return  (
            <View>
               { this.props.doRender && 
                    <VideoWrapper   isActive={ this.props.isActive }
                                    videoUrl={ this.videoUrl }
                                    videoImgUrl={this.videoImgUrl} />   }           
                <BottomStatus   feedId={ this.props.feedId }
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