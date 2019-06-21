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
  }
};
