import React, { PureComponent } from 'react';
import {
  Image,
  TouchableOpacity,
  View,
  Text,
  ImageBackground
} from 'react-native';
import styles from './styles';
import reduxGetters from "../../services/ReduxGetters";
import {connect} from "react-redux";
import { withNavigation } from 'react-navigation';
import Checkmarks from '../../assets/Checkmarks.png';
import ChannelJoin from '../../assets/channel-join-icon.png';
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
      return <View style={styles.joinedView}>
        <Image style={styles.joinedIconSkipFont} source={Checkmarks}/>
        <Text style={styles.joinText}>Joined</Text>
      </View>
    } else {
      return <View style={styles.joinView}>
        <Image style={styles.joinIconSkipFont} source={ChannelJoin}/>
        <Text style={[styles.joinText, {fontFamily: 'AvenirNext-DemiBold', fontSize: 18}]}>Join</Text>
      </View>
    }
  }

  onChannelPress= () =>  {
    console.log('onChannelPress');
    this.props.navigation.push("ChannelsScreen", {channelId:this.props.channelId} )
  }

  onMemberPress = () => {
    console.log('onMemberPress');
    this.props.navigation.push("MembersScreen", {channelId:this.props.channelId} )
  }


  render() {
    return <TouchableOpacity onPress={this.onChannelPress} style={[styles.channelCellWrapper, this.props.wrapperStyles]}>
            <ImageBackground source={ {uri: this.props.backgroundImgUrl} } style={styles.imageBg} resizeMode={'cover'}>
              <View style={styles.imageBgOpacity}>
                <View>
                  <Text style={styles.header}>{this.props.channelName}</Text>
                  <Text style={styles.channelDesc}>{this.props.channelTagLine}</Text>
                </View>
                <View style={styles.bottomView}>
                  <View style={styles.bottomViewLeft}>
                    <TouchableOpacity onPress={this.onMemberPress} style={styles.memberText}>
                      <Text style={styles.memberText}>{this.props.channelUserCount} <Text style={styles.fontRegular}>Members</Text></Text>
                    </TouchableOpacity>
                    <Text style={styles.memberText}>{this.props.channelVideoCount} <Text style={styles.fontRegular}>Videos</Text></Text>
                  </View>
                  <View style={styles.bottomViewRight}>
                    {this.joined()}
                  </View>
                </View>
              </View>
            </ImageBackground>
    </TouchableOpacity>
  }
}

export default connect(mapStateToProps)(withNavigation(ChannelCell));
