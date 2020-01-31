
import React, { PureComponent } from 'react';
import { View, Text} from 'react-native';
import Common from '../../theme/styles/Common';
import ChannelTagsList from '../ChannelTagsList';
import VideoCollections from '../VideoCollections';
import DataContract from '../../constants/DataContract';
import deepGet from "lodash/get";
import ChannelCell from '../ChannelCell';
import Colors from "../../theme/styles/Colors";
import { fetchChannel } from '../../helpers/helpers';
import Utilities from "../../services/Utilities";
import DeletedChannelInfo from "../CommonComponents/DeletedEntity/DeletedChannelInfo";
import Description from '../CommonComponents/Description';
import EmptySearchResult from '../CommonComponents/EmptySearchResult';
import ReduxGetters from '../../services/ReduxGetters';
import BackArrow from '../CommonComponents/BackArrow';
import ChannelsHeaderRight from '../ChannelsHeaderRight';
import PixelCall from "../../services/PixelCall";
import {NavigationEvents} from "react-navigation";

class ChannelsScreen extends PureComponent {

    static navigationOptions = (options) => {
        const channelId =  options.navigation.getParam('channelId'),
            name = options.navigation.getParam('headerTitle') || ReduxGetters.getChannelName(channelId);
        ;
        return {
          headerBackTitle: null,
          title: name,
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
          headerRight: <ChannelsHeaderRight channelId = {channelId}/>,
          headerBackImage: <BackArrow />
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
        return  DataContract.channels.getVideoListParams(this.selectedTagId)
    }

    setVideoListRef = (ref) => {
        this.videoListRef = ref;
    }

    applyVideoListTagFilter = () => {
        this.videoListRef && this.videoListRef.forcedRefresh();
    }

    onDidFocus = (payload) => {
        PixelCall({
            e_entity: 'page',
            e_action: 'view',
            p_type: 'channel',
            p_name: this.channelId
        });
    };

    listHeaderComponent = () => {
        return (
            <View style={{flex: 1}}>
                <ChannelCell wrapperStyles={{margin: 0, borderRadius: 0}} channelId={this.channelId}/>
                <Description channelId={this.channelId}/>
                <ChannelTagsList onTagClicked = {this.onTagClicked} channelId={this.channelId}/>
            </View>
        )
    }

    getNoResultData = () => {
        const tagName = deepGet( ReduxGetters.getHashTag(this.selectedTagId) , "text" , "");
        return {
            "noResultsMsg": `No videos tagged ${tagName}, Please try again later.`,
            "isEmpty": true
        };
    }

    getNoResultsCell = () => {
        return <EmptySearchResult noResultsData={this.getNoResultData()} />
    }

    fetchChannel = () => {
        fetchChannel(this.channelId, this.onChannelFetch);
    }

    onChannelFetch = ( res ) => {
        if(Utilities.isEntityDeleted(res)){
          this.setState({isDeleted: true});
          return;
        }
        this.props.navigation.setParams({ headerTitle: ReduxGetters.getChannelName(this.channelId) });
    };

    render(){
        if(this.state.isDeleted){
            return <DeletedChannelInfo/>
        }
        return (
            <View style={[Common.viewContainer]}>
                <NavigationEvents onDidFocus={this.onDidFocus} />
                <VideoCollections getFetchUrl={this.getFetchUrl}
                    getFetchParams={this.getFetchParams}
                    listHeaderComponent={this.listHeaderComponent()}
                    onRef={this.setVideoListRef}
                    beforeRefresh={this.fetchChannel}
                    getNoResultsCell={this.getNoResultsCell}
                    noResultsData={this.getNoResultData()}
                    entityId={this.channelId}
                    entityType={DataContract.knownEntityTypes.channel}
                />
            </View>
        )
    }

}

export default ChannelsScreen;
