import React, { Component } from 'react';
import { Image, TouchableOpacity, View, Text, SafeAreaView, ImageBackground } from 'react-native';
import styles from './styles';
import reduxGetters from "../../services/ReduxGetters";

class ChannelCell extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
  }

  render() {
    return <View style={styles.channelCellWrapper}>
      <ImageBackground source={ {uri: reduxGetters.getChannelBackgroundImage(this.props.channelId)} } style={{width: '100%', aspectRatio: 5/2}}>
        <View style={{padding: 12}}>
      <Text style={styles.header}> {reduxGetters.getChannelName(this.props.channelId)} </Text>
      <Text style={styles.channelDesc}>{reduxGetters.getChannelTagLine(this.props.channelId)}</Text>
      <View style={styles.bottomView}>
        <Text style={styles.memberText}>{reduxGetters.getChannelUserCount(this.props.channelId)} Members</Text>
        <Text style={styles.videoText}>{reduxGetters.getChannelVideoCount(this.props.channelId)} Videos</Text>
        <View style={styles.joinViewWrapper}>
          <View style={styles.joinView}><Text>Joined</Text></View>
        </View>
      </View>
        </View>
      </ImageBackground>
    </View>
  }
}

export default ChannelCell;

