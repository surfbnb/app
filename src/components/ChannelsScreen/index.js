
import React, { PureComponent } from 'react';
import { View, FlatList, Text} from 'react-native';
import Common from '../../theme/styles/Common';
import ChannelTagsList from '../ChannelTagsList';
import VideoCollections from '../VideoCollections';
import DataContract from '../../constants/DataContract';
import deepGet from "lodash/get";
import ChannelCell from '../ChannelCell';
import Colors from "../../theme/styles/Colors"
import Description from '../CommonComponents/Description';

class ChannelsScreen extends PureComponent {

    static navigationOptions = (options) => {
        const name = options.navigation.getParam('headerTitle') ,
        channelId =  options.navigation.getParam('channelId')
        ;
        return {
          headerBackTitle: null,
          title: name || 'Channel',
          headerTitleStyle: {
            fontFamily: 'AvenirNext-Medium'
          },
          headerStyle: {
            backgroundColor: Colors.white,
            borderBottomWidth: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowOpacity: 0.1,
            shadowRadius: 3
          },
          headerRight: <View><Text>options</Text></View>
        };
      };

    constructor(props){
        super(props);
        //TODO Ashutosh remove this fallback
        this.channelId =  this.props.navigation.getParam('channelId') || 5678;
        this.videoListRef = null;
        this.selectedTagId = 0;
        this.fetchChannel();
    }

    componentDidMount(){

    }

    componentWillUnMount(){
        
    }

    fetchChannel(){
        //@Ashutosh TODO 
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

    setVideoListRef = (ref) => {
        this.videoListRef = ref;
    }

    applyVideoListTagFilter(){
        this.setVideoListRef && this.setVideoListRef.forcedRefresh();
    }

    getAboutSection = () => {
        return (
            <Description/>
        )
    }

    listHeaderComponent = () => {
        return (
            <View style={{flex: 1, height: 500}}>
                <ChannelCell/>
                {this.getAboutSection()}
                <View style={{padding: 10}}>
                    <ChannelTagsList onTagClicked = {( item )=> this.onTagClicked( item )} channelId = '120'/>
                </View>
            </View>
        )
    }

    beforeRefresh = () => {
        this.fetchChannel();
    }

    render(){
        //@Ashutosh TODO check deleted Channel
        return (
            <View style={[Common.viewContainer]}>
                <VideoCollections getFetchUrl={this.getFetchUrl}
                    getFetchParams={this.getFetchParams}
                    listHeaderComponent={this.listHeaderComponent()}
                    ref={this.setVideoListRef}
                    beforeRefresh={this.beforeRefresh}
                />
            </View>
        )
    }

}

export default ChannelsScreen;
