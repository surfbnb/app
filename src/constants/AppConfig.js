import pepo_icon from '../assets/pepo-white-icon.png';
import balance_header_pepo_icon from '../assets/balance_header_pepo_icon.png';
import twitterDisconnectIcon from '../assets/drawer-twitter-icon.png';
import defaultLinkIcon from '../assets/default_link_icon.png';

const PROFILE_TX_SEND_SUCCESS = 'PROFILE_TX_SEND_SUCCESS',
  PROFILE_TX_RECEIVE_SUCCESS = 'PROFILE_TX_RECEIVE_SUCCESS',
  VIDEO_TX_SEND_SUCCESS = 'VIDEO_TX_SEND_SUCCESS',
  VIDEO_TX_RECEIVE_SUCCESS = 'VIDEO_TX_RECEIVE_SUCCESS',
  VIDEO_ADD = 'VIDEO_ADD',
  CONTRIBUTION_THANKS = 'CONTRIBUTION_THANKS',
  SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION',
  PROFILE_TX_SEND_FAILURE = 'PROFILE_TX_SEND_FAILURE',
  VIDEO_TX_SEND_FAILURE = 'VIDEO_TX_SEND_FAILURE';

export default {
  userStatusMap: {
    activated: 'activated',
    activating: 'activating'
  },

  topUpEntityStatusMap : {
    success: "success", 
    pending:"pending",
    error: "error"
  },

  ruleTypeMap: {
    directTransfer: 'direct transfer',
    pricer: 'pricer'
  },

  metaProperties: {
    type: 'user_to_user',
    name: 'profile'
  },

  executeTransactionPrivacyType: {
    public: 'PUBLIC',
    private: 'PRIVATE'
  },

  transactionStatus: {
    done: 'DONE'
  },

  tokenSymbols: {
    pepo: {
      image1: pepo_icon,
      image2: balance_header_pepo_icon
    }
  },

  giphySizes: {
    search: 'preview_gif',
    activity: 'downsized'
  },

  maxBtAllowedInSingleTransfer: 10,

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
  },

  cameraConstants: {
    RATIO: '16:9',
    VIDEO_QUALITY: '720p',
    VIDEO_WIDTH: 720,
    VIDEO_HEIGHT: 1280
  },

  compressionConstants: {
    COMPRESSION_SIZE: '720X1280',
    CRF: '28',
    PRESET: 'superfast',
    PIX_FMT: 'yuv420p'
  },

  cameraCropConstants: {
    WIDTH: 480,
    HEIGHT: 480
  },

  videoConstant: {
    videoWidth: '576w',
    videoImageWidth: 'original'
  },

  profileImageConstants: {
    imageWidth: '144w'
  },

  userVideos: {
    userScreenCoverImageWidth: '288w'
  },

  cameraHeightRatio: 0.6,

  notificationConstants: {
    profileTxSendKind: PROFILE_TX_SEND_SUCCESS,
    profileTxReceiveKind: PROFILE_TX_RECEIVE_SUCCESS,
    videoTxSendKind: VIDEO_TX_SEND_SUCCESS,
    videoTxReceiveKind: VIDEO_TX_RECEIVE_SUCCESS,
    videoAddKind: VIDEO_ADD,
    AppreciationKind: CONTRIBUTION_THANKS,
    systemNotification: SYSTEM_NOTIFICATION,
    showCoinComponentArray: [
      PROFILE_TX_SEND_SUCCESS,
      PROFILE_TX_RECEIVE_SUCCESS,
      VIDEO_TX_SEND_SUCCESS,
      VIDEO_TX_RECEIVE_SUCCESS,
      PROFILE_TX_SEND_FAILURE,
      VIDEO_TX_SEND_FAILURE
    ],
    whitelistedNotificationKinds: [
      PROFILE_TX_SEND_SUCCESS,
      PROFILE_TX_RECEIVE_SUCCESS,
      VIDEO_TX_SEND_SUCCESS,
      VIDEO_TX_RECEIVE_SUCCESS,
      VIDEO_ADD,
      CONTRIBUTION_THANKS,
      SYSTEM_NOTIFICATION,
      PROFILE_TX_SEND_FAILURE,
      VIDEO_TX_SEND_FAILURE
    ]
  },

  tabConfig: {
    tab1: {
      rootStack: 'Home',
      childStack: 'HomeScreen',
      navigationIndex: 0
    },
    tab2: {
      rootStack: 'Search',
      childStack: 'SearchScreen',
      navigationIndex: 1
    },
    tab3: {
      rootStack: 'CaptureVideo',
      childStack: 'CaptureVideo',
      navigationIndex: null
    },
    tab4: {
      rootStack: 'Notification',
      childStack: 'NotificationScreen',
      navigationIndex: 2
    },
    tab5: {
      rootStack: 'Profile',
      childStack: 'ProfileScreen',
      navigationIndex: 3
    }
  },

  videoLinkConfig: {
    HOME_FEED: {
      SOCIAL_ICONS: {
        TWITTER: twitterDisconnectIcon,
        DEFAULT: defaultLinkIcon
      }
    },
    VIDEO: {
      SOCIAL_ICONS: {
        TWITTER: twitterDisconnectIcon,
        DEFAULT: defaultLinkIcon
      }
    },
    WHITELISTED_DOMAINS: {
      TWITTER: 'twitter.com'
    }
  },

  paymentFlowMessages : {
    transactionSuccess: "Payment is taking time will update soon.",
    transactionPending: "Payment processing will take some time please wait." ,
    sendingPepo: "Sending Pepos please wait"
  }
};
