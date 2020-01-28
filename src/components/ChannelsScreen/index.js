
import React, { PureComponent } from 'react';
import { View, Text, Alert} from 'react-native';
import Common from '../../theme/styles/Common';
import ChannelTagsList from '../ChannelTagsList';
import VideoCollections from '../VideoCollections';
import DataContract from '../../constants/DataContract';
import deepGet from "lodash/get";

class ChannelsScreen extends PureComponent {

    constructor(props){
        super(props);
        //TODO Ashutosh remove this fallback 
        this.channelId =  this.props.navigation.getParam('channelId') || 5678;
        this.videoListRef = null;
        this.selectedTagId = 0;
    }

    componentDidMount(){

    }

    componentWillUnMount(){
        
    }

    onTagClicked = (item) => {
        //TODO Ashutosh check this 
      this.selectedTagId = deepGet(item ,  "payload.id" , 0);
      this.applyVideoListTagFilter();
    }

    getFetchUrl = () => {
        return DataContract.channels.getVideoListApi(this.selectedTagId);
    }

    getFetchParams = () => {
        return  DataContract.channels.getVideoListParams()
    }

    listHeaderComponent = () => {
        //@Preshita add Cover and description scection here
        return <View style={{marginTop: 40}}>
                    <ChannelTagsList onTagClicked = {( item )=> this.onTagClicked( item )} channelId = {this.channelId}/>
                </View>
    }

    setVideoListRef = (ref) => {
        this.videoListRef = ref;
    }

    applyVideoListTagFilter(){
        this.setVideoListRef && this.setVideoListRef.forcedRefresh();
    }

    render(){
        return (
            <View style={[Common.viewContainer]}>
                <VideoCollections getFetchUrl={this.getFetchUrl}
                    getFetchParams={this.getFetchParams}
                    listHeaderComponent={this.listHeaderComponent()} 
                    ref={this.setVideoListRef}
                />
            </View>
        )
    }

}

export default ChannelsScreen;