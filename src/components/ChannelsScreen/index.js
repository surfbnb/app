
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
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
import erroMsgStyle from "../CommonComponents/EmptySearchResult/style";
import {navigateTo} from "../../helpers/navigateTo";
import NotificationPermissionModal from '../NotificationPermissionModal';
import CurrentUser from '../../models/CurrentUser';

const mapStateToProps = (state) => {
    return {
      userId: CurrentUser.getUserId()
    };
  };

class ChannelsScreen extends PureComponent {

    static navigationOptions = (options) => {
        const channelId =  options.navigation.getParam('channelId'),
              name = options.navigation.getParam('headerTitle') || ReduxGetters.getChannelName(channelId),
              isDeleted = options.navigation.getParam('isDeleted') || false
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
          headerRight: <ChannelsHeaderRight channelId = {channelId} isDeleted={isDeleted}/>,
          headerBackImage: <BackArrow />
        };
      };

    constructor(props){
        super(props);
        navigateTo.setTopLevelNavigation(props.navigation);
        this.channelId = this.props.navigation.getParam('channelId');
        this.videoListRef = null;
        this.selectedTagId = 0;
        this.state = {
            isDeleted: false,
            permissionModalVisible:null
        }
    }

    componentDidMount() {
        if(this.channelId){
          this.didFocus = this.props.navigation.addListener('didFocus', (payload) => {
            this.props.navigation.setParams({ headerTitle:  ReduxGetters.getChannelName(this.channelId) });
          });
        }
    }

    componentWillUnmount(){
        this.didFocus &&  this.didFocus.remove && this.didFocus.remove();
    }

    getPermissions (){
        Utilities.getItem(`notification-permission-show-${this.props.userId}`).then((value)=> {
          let permissionButtonClicked = value === 'true';
          this.setState({permissionModalVisible: !permissionButtonClicked })
        });
      }

    onTagClicked = (item) => {
      this.selectedTag = item;
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

    onVideoClick = () => {
        this.videoListRef &&  this.videoListRef.scrollToIndex(0);
    }

    onJoinSuccess = () => {
        this.getPermissions();
    }

    listHeaderComponent = () => {
        return (
            <View style={{flex: 1}}>
                <ChannelCell wrapperStyles={{margin: 0, borderRadius: 0}} channelId={this.channelId} 
                                onVideoClick={this.onVideoClick} onJoinSuccess={this.onJoinSuccess}/>
                <Description channelId={this.channelId}/>
                <ChannelTagsList onTagClicked = {this.onTagClicked} channelId={this.channelId} selectedTag={this.selectedTag}/>
            </View>
        )
    }

    getNoResultData = () => {
        const tagName = deepGet( ReduxGetters.getHashTag(this.selectedTagId) , "text" , "");
        if(tagName){
            return {
                "noResultsMsg": `No videos for this tag.`,
                "isEmpty": true
            };
        }
        return {
            "noResultsMsg": `No videos in this community.`,
            "isEmpty": true
        };
    }

    getNoResultsCell = (item) => {
        return <EmptySearchResult noResultsData={item}>
                    <Text style={erroMsgStyle.msgStyle}>Create the first video!</Text>
               </EmptySearchResult>
    }

    fetchChannel = () => {
        fetchChannel(this.channelId, this.onChannelFetch);
    }

    onChannelFetch = ( res={} ) => {
        if(Utilities.isEntityDeleted(res)){
          this.setState({isDeleted: true});
          this.props.navigation.setParams({ isDeleted:true });
          return;
        }
        const resultType = deepGet(res,  DataContract.common.resultType),
              videoName = deepGet(res , `data.${resultType}.name` )
              ;   
        this.props.navigation.setParams({ headerTitle:videoName });
    };

    onPermissionModalDismiss = () => {
        this.setState({permissionModalVisible: false});
    }

    render(){
        if(this.state.isDeleted){
            return <DeletedChannelInfo/>
        }
        return (
            <View style={[Common.viewContainer]}>
                <NavigationEvents onDidFocus={this.onDidFocus} />
                <VideoCollections getFetchUrl={this.getFetchUrl}
                    getFetchParams={this.getFetchParams}
                    listHeaderComponent={this.listHeaderComponent}
                    onRef={this.setVideoListRef}
                    beforeRefresh={this.fetchChannel}
                    getNoResultsCell={this.getNoResultsCell}
                    getNoResultData={this.getNoResultData}
                    entityId={this.channelId}
                    entityType={DataContract.knownEntityTypes.channel}
                />
                {this.state.permissionModalVisible &&
                <NotificationPermissionModal userId={this.props.userId}
                                             onPermissionModalDismiss={this.onPermissionModalDismiss}/>}
            </View>
        )
    }

}

export default connect(mapStateToProps)(ChannelsScreen);
