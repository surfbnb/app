import React, { Component } from 'react';
import { Image, TouchableOpacity, View, Text, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import styles from './styles';
import reduxGetters from "../../services/ReduxGetters";

const {height} = Dimensions.get('window');

class ChannelCell extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
  }

  joined(){
    if(reduxGetters.isCurrentUserMemberOfChannel(this.props.channelId)){
      return <View style={styles.joinView}><Text style={styles.joinText}>Joined</Text></View>
    } else {
      return <React.Fragment/>
    }

  }

  render() {
    return <View style={styles.channelCellWrapper}>
      <ImageBackground source={ {uri: reduxGetters.getChannelBackgroundImage(this.props.channelId)} } style={{width: '100%', aspectRatio: 21/9}}  resizeMode={'cover'}>
        <View style={{padding: 12}}>
      <Text style={styles.header}>{reduxGetters.getChannelName(this.props.channelId)} </Text>
      <Text style={styles.channelDesc}>{reduxGetters.getChannelTagLine(this.props.channelId)}</Text>
      <View style={styles.bottomView}>
        <Text style={styles.memberText}>{reduxGetters.getChannelUserCount(this.props.channelId)} Members</Text>
        <Text style={styles.videoText}>{reduxGetters.getChannelVideoCount(this.props.channelId)} Videos</Text>
        <View style={styles.joinViewWrapper}>
          {this.joined()}
        </View>
      </View>
        </View>
      </ImageBackground>
    </View>
  }
}

export default ChannelCell;

