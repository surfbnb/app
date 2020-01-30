
import React, { PureComponent } from 'react';
import { View, Text} from 'react-native';
import Common from '../../theme/styles/Common';
import ChannelTagsList from '../ChannelTagsList';
import VideoCollections from '../VideoCollections';
import DataContract from '../../constants/DataContract';
import deepGet from "lodash/get";
import ChannelCell from '../ChannelCell';
import Colors from "../../theme/styles/Colors";
import MembersList from "./list";
import BackArrow from '../CommonComponents/BackArrow';

class MembersScreen extends PureComponent {

  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      title: 'Members',
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
      headerBackImage: <BackArrow/>
    };
  };


  constructor(props){
    super(props);
    this.channelId = this.props.navigation.getParam('channelId');
  }

  render(){
    return (
      <View style={[Common.viewContainer]}>  
        <MembersList channelId={this.channelId}  fetchUrl={DataContract.channels.getChannelsMemberApi(this.channelId)} />
      </View>
    )
  }

}

export default MembersScreen;
