
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
          headerRight: <View><Text>options</Text></View>,
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
        return  DataContract.channels.getVideoListParams()
    }

    setVideoListRef = (ref) => {
        this.videoListRef = ref;
    }

    applyVideoListTagFilter(){
        this.setVideoListRef && this.setVideoListRef.forcedRefresh();
    }

    listHeaderComponent = () => {
        return (
            <View style={{flex: 1}}>
                <ChannelCell wrapperStyles={{margin: 0, borderRadius: 0}} channelId={this.channelId}/>
                <Description channelId={this.channelId}/>
                <View style={{padding: 10}}>
                    <ChannelTagsList onTagClicked = {( item )=> this.onTagClicked( item )} channelId={this.channelId}/>
                </View>
            </View>
        )
    }

    getNoResultsCell = () => {
        const tagName = deepGet( ReduxGetters.getHashTag(this.selectedTagId) , "text");
        const noResultsData = {
            "noResultsMsg": `No videos tagged ${tagName}, Please try again later.`,
            "isEmpty": true
        };
        return <EmptySearchResult noResultsData={noResultsData} />
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
                <VideoCollections getFetchUrl={this.getFetchUrl}
                    getFetchParams={this.getFetchParams}
                    listHeaderComponent={this.listHeaderComponent()}
                    ref={this.setVideoListRef}
                    beforeRefresh={this.fetchChannel}
                    getNoResultsCell={this.getNoResultsCell}
                />
            </View>
        )
    }

}

export default ChannelsScreen;
