import PepoApi from './PepoApi';

import { Share, Platform } from 'react-native';
import DataContract from '../constants/DataContract';

class ShareVideo {
  constructor(entityId, url) {
    this.entityId = entityId;
    this.url = url;
  }

  perform() {
    return new Promise((resolve, reject) => {
      new PepoApi(this.url).get().then((res) => {
        console.log(res, 'videos/:video_id/share in then');
        this.shareTray(res);
      });
    });
  }

  getShareObject(res) {
    let shareObject = {};
    let shareData = res.data['share'];
    shareObject['message'] = shareData.message ? shareData.message : '';
    shareObject['title'] = shareData.title ? shareData.title : '';
    shareObject['subject'] = shareData.subject ? shareData.subject : '';
    return shareObject;
  }

  shareTray(res) {
    try {
      Share.share(this.getShareObject(res)).then((result) => {
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log('shareTray:result.activityType', result.activityType);
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed          
        }
      });
    } catch (error) {}
  }
}

export default ShareVideo;
