
import React, { PureComponent } from 'react';
import { View, FlatList, Text} from 'react-native';
import Common from '../../theme/styles/Common';
import ChannelTagsList from '../ChannelTagsList';
import VideoCollections from '../VideoCollections';
import DataContract from '../../constants/DataContract';
import deepGet from "lodash/get";
import ChannelCell from '../ChannelCell';
import Colors from "../../theme/styles/Colors"

class ChannelsScreen extends PureComponent {

    static navigationOptions = (options) => {
        const name = options.navigation.getParam('headerTitle');
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
        this.state = {
            list: null
        }
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

    getAboutSection = () => {
        return (
            <View style={{padding: 10}}>
                <Text>About</Text>
                <Text>
                Join the leading minds in the Web3 space for a weekend-long community gathering dedicated to playing with blockchains and #BUIDLing with PegaBufficorns! Event is free f…See More
                </Text>
            </View>
        )
    }

    listHeaderComponent = () => {
        return (
            <View style={{flex: 1, height: 500}}>
                <ChannelCell/>
                {this.getAboutSection()}
                <View style={{padding: 10}}>
                    <ChannelTagsList onTagClicked = {( item )=> this.onTagClicked( item )} channelId = {'120', '122'}/>
                </View>
            </View>
        )
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