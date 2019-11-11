import React, { PureComponent } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
  TouchableOpacity,
  StatusBar
} from "react-native";
import {SafeAreaView} from "react-navigation";

import plusIcon from '../../assets/user-video-capture-icon-selected.png';
import inlineStyles from './styles';
import crossIcon from '../../assets/cross_icon.png';
import VideoReplyList from "./list";
import VideoThumbnailItem from '../CommonComponents/VideoThumbnailItem';
import NavigationService from "../../services/NavigationService";
import utilities from "../../services/Utilities";


const navigateToCamera = (navigation) => {
  let activeTab = NavigationService.getActiveTab();
  let params = {
      videoTypeReply: true,
      videoId: navigation.getParam('videoId'),
      userId: navigation.getParam('userId'),
      amount: navigation.getParam('amount'),
      videoReplyCount: navigation.getParam('videoReplyCount')
  };
  utilities.handleVideoUploadModal(activeTab, navigation, params);
};


const HeaderLeft = (props) => {
    return (
      <TouchableOpacity
        onPress={() => {
          props.navigation.goBack();
        }}
        style={inlineStyles.iconWrapper}
      >
        <Image style={inlineStyles.iconSkipFont} source={crossIcon}></Image>
      </TouchableOpacity>
    );
  };
  
  const HeaderRight = (props) => {
    return (<TouchableOpacity onPress={()=> {
      navigateToCamera(props.navigation);
    }} style={inlineStyles.iconWrapper} >
        <Image style={[inlineStyles.iconSkipFont]} source={plusIcon} />
    </TouchableOpacity>)
  };
  
  const HeaderTitle = (props) => {
    return (
      <View>
        <Text numberOfLines={1} style={inlineStyles.headerText}>
        Replies to Frankie
        </Text>
        <Text style={inlineStyles.headerSubText}>Send a reply with Pepo5</Text>
      </View>
    );
  };

class VideoRepliesScreen extends PureComponent {
    static navigationOptions = (props) => {
        return {
          headerStyle: inlineStyles.headerStyles,
          headerLeft: <HeaderLeft {...props} />,
          headerRight: <HeaderRight {...props} />,
          headerTitle: <HeaderTitle {...props} />
        };
      };

    constructor(props){
      super(props);
        this.userId = props.navigation.getParam('userId');
        this.videoId = props.navigation.getParam('videoId');
        this.amount = props.navigation.getParam('amount');
        this.videoReplyCount = props.navigation.getParam('videoReplyCount');
        this.fetchUrl = props.navigation.getParam('fetchUrl');
        this.listHeaderComponent = props.navigation.getParam('listHeaderComponent');
        this.listHeaderSubComponent = props.navigation.getParam('listHeaderSubComponent');
    }

    componentDidMount(){

    }

    componentWillUnmount() {

    }

    render(){
        return (
          <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
            <StatusBar translucent={true} backgroundColor={'transparent'} />
             <VideoReplyList  userId={this.userId}  videoId={this.videoId} fetchUrl={this.fetchUrl}
                              videoReplyCount={this.videoReplyCount}
                              amount={this.amount}

             />
          </SafeAreaView>
        );
    }

}

export default VideoRepliesScreen;
