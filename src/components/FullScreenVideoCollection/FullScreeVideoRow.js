import React, { PureComponent } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { withNavigation } from 'react-navigation';
import VideoWrapper from '../Home/VideoWrapper';
import ShareIcon from "../CommonComponents/ShareIcon";
import ReportVideo from "../CommonComponents/ReportVideo";
import PepoApi from '../../services/PepoApi';
import TransactionPepoButton from '../Home/TransactionPepoButton';
import deepGet from 'lodash/get';
import CurrentUser from '../../models/CurrentUser';

import BottomStatus from '../Home/BottomStatus';
import VideoAmountStat from '../CommonComponents/VideoAmoutStat';
import ShareVideo from '../../services/shareVideo';
import inlineStyles from './newStyles';

import utilities from '../../services/Utilities';
import OptionsIcon from '../../assets/options_self_video.png';


class FullScreeVideoRow extends PureComponent {
    constructor(props) {
        super(props);
        this.userId = deepGet(this.props.payload, 'user_id');
        this.videoId = deepGet(this.props.payload, 'video_id');
    }

    refetchVideo = () => {
        new PepoApi(`/videos/${this.videoId}`)
            .get()
            .then((res) => {})
            .catch((error) => {});
    };



    shareVideo = () => {
        let shareVideo = new ShareVideo(this.videoId);
        shareVideo.perform();
    };

    navigateToUserProfile = (e) => {
        if (utilities.checkActiveUser()) {
            if (this.userId == CurrentUser.getUserId()) {
                this.props.navigation.navigate('ProfileScreen');
            } else {
                this.props.navigation.push('UsersProfileScreen', { userId: this.userId });
            }
        }
    };

  onDescriptionClick = ( tapEntity , tapText ) => {
    if (!tapEntity) {
      return;
    }

    if( tapEntity.kind === 'tags'){
      this.props.navigation.push('VideoTags', {
        "tagId": tapEntity.id
      });
    }

  }

    render() {
        return (
            <View style={inlineStyles.fullScreen}>
                <VideoWrapper
                    shouldPlay={this.props.shouldPlay}
                    userId={this.userId}
                    videoId={this.videoId}
                    doRender={this.props.doRender}
                    isActive={this.props.isActive}
                />

                {!!this.videoId && !!this.userId && (
                    <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                        <View style={inlineStyles.touchablesBtns}>

                            <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                <TransactionPepoButton
                                    resyncDataDelegate={this.refetchVideo}
                                    userId={this.userId}
                                    videoId={this.videoId}
                                />
                                <ShareIcon  userId={this.userId} videoId={this.videoId} />
                                <ReportVideo  userId={this.userId} videoId={this.videoId} />
                            </View>

                            <VideoAmountStat
                                videoId={this.videoId}
                                userId={this.userId}
                                onWrapperClick={this.navigateToUserProfile}
                            />
                        </View>

                        <BottomStatus
                            userId={this.userId}
                            videoId={this.videoId}
                            onWrapperClick={this.navigateToUserProfile}
                            onDescriptionClick={this.onDescriptionClick}
                        />
                    </View>
                )}
            </View>
        );
    }
}

export default withNavigation(FullScreeVideoRow);
