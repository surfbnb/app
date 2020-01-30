
import React, { PureComponent } from 'react';
import { View } from 'react-native';
import Common from '../../theme/styles/Common';
import DataContract from '../../constants/DataContract';
import Colors from "../../theme/styles/Colors";
import MembersList from "./list";

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
      }
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
