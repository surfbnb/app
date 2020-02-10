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
import PepoApi from '../../services/PepoApi';
import DataContract from '../../constants/DataContract';
import Toast from "../../theme/components/NotificationToast";
import Utilities from '../../services/Utilities';

const mapStateToProps = ( state, ownProps ) => {
   return {
    backgroundImgUrl :  reduxGetters.getChannelBackgroundImage(ownProps.channelId, state) || '',
    channelName : reduxGetters.getChannelName(ownProps.channelId) || '',
    channelTagLine: reduxGetters.getChannelTagLine(ownProps.channelId) || '',
    channelUserCount: reduxGetters.getChannelUserCount(ownProps.channelId) || 0,
    channelVideoCount:  reduxGetters.getChannelVideoCount(ownProps.channelId) || 0,
    isChannelMember: reduxGetters.isCurrentUserMemberOfChannel(ownProps.channelId) || false
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
        <Text style={styles.joinedText}>Joined</Text>
      </View>
    } else {
      return Utilities.isChannelPage(this.props.navigation.state) ?
            <TouchableOpacity onPress={this.onJoinChannel}>
              <View style={styles.joinView}>
                <Image style={styles.joinIconSkipFont} source={ChannelJoin}/>
                <Text style={[styles.joinText]}>Join</Text>
              </View>
            </TouchableOpacity> : <React.Fragment/>
    }
  }

  onJoinChannel = () => {
    new PepoApi(DataContract.channels.getJoinChannelApi(this.props.channelId))
      .post()
      .then((response) => {
        if (response && response.success){
          // ****************************************************************************************************** //
             // Commenting out the below toast line as the requirement by UX is not to show the toast success message!
          // ****************************************************************************************************** //
          // Toast.show({text:'You have joined channel successfully!', icon: 'success' });
          this.props.onJoinSuccess && this.props.onJoinSuccess();
        } else {
            Toast.show({text:'Could not join community!', icon: 'error' });
        }
      })
      .catch((err) => {
        Toast.show({text:'Could not join community!', icon: 'error' });
        console.log('Join community failed', err);
      })
  }

  onMemberPress = () => {
    console.log('onMemberPress');
    this.props.navigation.push("MembersScreen", {channelId:this.props.channelId} )
  }

  onVideoClick =() => {
    if(this.props.onVideoClick){
     this.props.onVideoClick();
     return false;
    }
    this.props.navigation.push("ChannelsScreen", {channelId:this.props.channelId} );
  }

  render() {
    return <View style={[styles.channelCellWrapper, this.props.wrapperStyles]}>
            <ImageBackground source={ {uri: this.props.backgroundImgUrl} } style={styles.imageBg} resizeMode={'cover'}>
              <View style={styles.imageBgOpacity}>
                <View>
                  <Text style={styles.header}>{this.props.channelName}</Text>
                  <Text style={styles.channelDesc}>{this.props.channelTagLine}</Text>
                </View>
                <View style={styles.bottomView}>
                  <View style={styles.bottomViewLeft}>
                    <TouchableOpacity onPress={this.onMemberPress} style={styles.textContainer}>
                      <Text style={styles.memberText}>{`${this.props.channelUserCount} `}
                        <Text style={styles.fontRegular}>
                          Member{this.props.channelUserCount > 1 ? 's': null}
                        </Text>
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onVideoClick} style={styles.textContainer}>
                      <Text style={styles.memberText}>{`${this.props.channelVideoCount} `}
                        <Text style={styles.fontRegular}>
                          Video{this.props.channelVideoCount > 1 ? 's': null}
                        </Text>
                      </Text>
                    </TouchableOpacity>  
                  </View>
                  <View style={styles.bottomViewRight}>
                    {this.joined()}
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
  }
}

export default connect(mapStateToProps)(withNavigation(ChannelCell));
