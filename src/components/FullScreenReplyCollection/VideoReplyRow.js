import React, { PureComponent } from 'react';
import { View } from 'react-native';
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
import inlineStyles from './styles';

import utilities from '../../services/Utilities';


class VideoReplyRow extends PureComponent {
    constructor(props) {
        super(props);
        this.userId = deepGet(this.props.payload, 'user_id');
        this.replyId = deepGet(this.props.payload, 'video_id');
    }

    refetchVideoReply = () => {
        new PepoApi(`/replies/${this.replyId}`)
            .get()
            .then((res) => {})
            .catch((error) => {});
    };

    //TODO  @preshita move to bottom status 
    navigateToUserProfile = (e) => {
        if (utilities.checkActiveUser()) {
            if (this.userId == CurrentUser.getUserId()) {
                this.props.navigation.navigate('ProfileScreen');
            } else {
                this.props.navigation.push('UsersProfileScreen', { userId: this.userId });
            }
        }
    };

    //TODO  @preshita move to bottom status
  onDescriptionClick = ( tapEntity  ) => {
    if (!tapEntity) {
      return;
    }

    if( tapEntity.kind === 'tags'){
      this.props.navigation.push('VideoTags', {
        "tagId": tapEntity.id
      });
    }

  }

  //Required from Backend , we need video  stats entity 

    render() {
        return (
            <View style={inlineStyles.fullScreen}>
                <VideoWrapper
                    shouldPlay={this.props.shouldPlay}
                    userId={this.userId}
                    videoId={this.replyId}
                    doRender={this.props.doRender}
                    isActive={this.props.isActive}
                />

                {!!this.replyId && !!this.userId && (
                    <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                        <View style={inlineStyles.touchablesBtns}>

                            <View style={{ minWidth: '20%', alignItems: 'center', alignSelf: 'flex-end' }}>
                                <TransactionPepoButton
                                    resyncDataDelegate={this.refetchVideoReply}
                                    userId={this.userId}
                                    videoId={this.replyId}
                                />
                                <ShareIcon  userId={this.userId} videoId={this.replyId} />
                                <ReportVideo  userId={this.userId} videoId={this.replyId} />
                            </View>

                            <VideoAmountStat
                                videoId={this.replyId}
                                userId={this.userId}
                                onWrapperClick={this.navigateToUserProfile}
                            />
                        </View>

                        <BottomStatus
                            userId={this.userId}
                            videoId={this.replyId}
                            onWrapperClick={this.navigateToUserProfile}
                            onDescriptionClick={this.onDescriptionClick}
                        />
                    </View>
                )}
            </View>
        );
    }
}

export default withNavigation(VideoReplyRow);
