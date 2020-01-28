
import React, { PureComponent } from 'react';
import { View, Text} from 'react-native';
import Common from '../../theme/styles/Common';
import ChannelTagsList from '../ChannelTagsList';
import VideoCollections from '../VideoCollections';
import DataContract from '../../constants/DataContract';
import deepGet from "lodash/get";
import ChannelCell from '../ChannelCell';
import Colors from "../../theme/styles/Colors"
import { fetchChannel } from '../../helpers/helpers';
import Utilities from "../../services/Utilities";
import DeletedChannelInfo from "../CommonComponents/DeletedEntity/DeletedChannelInfo";

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
        this.channelId = this.props.navigation.getParam('channelId');
        this.videoListRef = null;
        this.selectedTagId = 0;
        this.state = {
            isDeleted: false
        }
    }

    onTagClicked = (item) => {
      this.selectedTagId = deepGet(item ,  "id" , 0);
      this.applyVideoListTagFilter();
    }

    getFetchUrl = () => {
        return DataContract.channels.getVideoListApi(this.channelId);
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

    fetchChannel = () => {
        fetchChannel(this.channelId, this.onChannelFetch);
    }

    onChannelFetch = ( res ) => {
        if(Utilities.isEntityDeleted(res)){
          this.setState({isDeleted: true});
          return;
        }
    };

    render(){
        if(this.state.isDeleted){
            return <DeletedChannelInfo/>
        }
        return (
            <View style={[Common.viewContainer]}>
                <VideoCollections getFetchUrl={this.getFetchUrl}
                    getFetchParams={this.getFetchParams}
                    listHeaderComponent={this.listHeaderComponent()}
                    ref={this.setVideoListRef}
                    beforeRefresh={this.fetchChannel}
                />
            </View>
        )
    }

}

export default ChannelsScreen;