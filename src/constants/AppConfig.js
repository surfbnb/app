import pepo_icon from '../assets/pepo_icon.png';
import balance_header_pepo_icon from '../assets/balance_header_pepo_icon.png';
export default {
  userStatusMap: {
    activated: 'activated',
    activating: 'activating'
  },

  ruleTypeMap: {
    directTransfer: 'direct transfer',
    pricer: 'pricer'
  },

  metaProperties: {
    type: 'user_to_user'
  },

  executeTransactionPrivacyType: {
    public: 'PUBLIC',
    private: 'PRIVATE'
  },

  transactionStatus: {
    published: 'PUBLISHED'
  },

  tokenSymbols: {
    pepo: {
      image1: pepo_icon,
      image2: balance_header_pepo_icon
    }
  },

  giphySizes: {
    search: 'preview_gif',
    feed: 'downsized'
  },

  fileUploadTypes: {
    video: 'videos',
    image: 'images'
  },

  storageKeys: {
    RAW_VIDEO: 'raw-video',
    COMPRESSED_VIDEO: 'compressed-video',
    S3_VIDEO: 's3-video',

    VIDEO_THUMBNAIL_IMAGE: 'video-thumbnail-image',
    S3_VIDEO_THUMBNAIL_IMAGE: 's3-video-thumbnail-image',

    PROFILE_RAW_IMAGE: 'profile-raw-image',
    PROFILE_CROPPED_IMAGE: 'profile-cropped-image',
    S3_PROFILE_IMAGE: 's3-profile-image',
    ENABLE_START_UPLOAD: 'enable-start-upload'
  }
};
