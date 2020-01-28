import React, { PureComponent } from 'react';
import { Image, TouchableOpacity, View, Text, SafeAreaView, ImageBackground, Dimensions } from 'react-native';
import styles from './styles';
import reduxGetters from "../../services/ReduxGetters";
import {connect} from "react-redux";

const mapStateToProps = ( state, ownProps ) => {
   return {
    backgroundImgUrl :  reduxGetters.getChannelBackgroundImage(ownProps.channelId, state),
     channelName : reduxGetters.getChannelName(ownProps.channelId),
     channelTagLine: reduxGetters.getChannelTagLine(ownProps.channelId),
     channelUserCount: reduxGetters.getChannelUserCount(ownProps.channelId),
     channelVideoCount:  reduxGetters.getChannelVideoCount(ownProps.channelId),
     isChannelMember: reduxGetters.isCurrentUserMemberOfChannel(ownProps.channelId)

  };
}

class ChannelCell extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {}

  joined(){
    if(this.props.isChannelMember){
      return <View style={styles.joinView}><Text style={styles.joinText}>Joined</Text></View>
    } else {
      return <React.Fragment/>
    }

  }

  render() {
    return <View style={styles.channelCellWrapper}>
      <ImageBackground source={ {uri: this.props.backgroundImgUrl} } style={{width: '100%', aspectRatio: 21/9}}  resizeMode={'cover'}>
        <View style={{flex: 1, padding: 12, justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <View>
            <Text style={styles.header}>{this.props.channelName} </Text>
            <Text style={styles.channelDesc}>{this.props.channelTagLine}</Text>
          </View>
          <View style={styles.bottomView}>
            <View style={{flexDirection: 'row', flex: 3}}>
              <Text style={styles.memberText}>{this.props.channelUserCount} Members</Text>
              <Text style={styles.videoText}>{this.props.channelVideoCount} Videos</Text>
            </View>
            <View style={styles.joinViewWrapper}>
              {this.joined()}
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  }
}

export default connect(mapStateToProps)(ChannelCell);
