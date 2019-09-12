import DeviceInfo from 'react-native-device-info';

const BundleConstants = {
  'com.pepo.staging': {
    API_ROOT: 'https://stagingpepo.com/api/v1',
    PLATFORM_API_ENDPOINT: 'https://api.stagingost.com/testnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/devp101_pixel.png',
    TOKEN_ID: '1185',
    TWITTER_CONSUMER_KEY: 'NEo4gEXzdQZaoTsqzpZvepfKb',
    TWITTER_CONSUMER_SECRET: 'iM5UMt4px8rwoqEoRV9gJGrJGtEoMUxOYkaWXSges7t4bk564t',
    SESSION_KEY_EXPIRY_TIME: 60 * 60 * 2,
    SPENDING_LIMIT: '1000000000000000000000'
  },
  'com.pepo.sandbox': {
    API_ROOT: 'https://sandboxpepo.com/api/v1',
    PLATFORM_API_ENDPOINT: 'https://api.ost.com/testnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/ps501_pixel.png',
    TOKEN_ID: '1506',
    TWITTER_CONSUMER_KEY: 'qqc45NF23dhKRuNbfsdnHGEkI',
    TWITTER_CONSUMER_SECRET: 'vgDWrMorXdvDOaMSkniRvjQqij4GUwIadWSg9kQnfEmjTDIPs0'
  },
  'com.pepo.production': {
    API_ROOT: 'https://sandboxpepo.com/api/v1',
    PLATFORM_API_ENDPOINT: 'https://api.ost.com/testnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/ps501_pixel.png',
    TOKEN_ID: '1506',
    TWITTER_CONSUMER_KEY: 'qqc45NF23dhKRuNbfsdnHGEkI',
    TWITTER_CONSUMER_SECRET: 'vgDWrMorXdvDOaMSkniRvjQqij4GUwIadWSg9kQnfEmjTDIPs0'
  }
};

console.log(`Exporting constants for Bundle ID ${DeviceInfo.getBundleId()}`);

export const API_ROOT = BundleConstants[DeviceInfo.getBundleId()].API_ROOT;
export const PLATFORM_API_ENDPOINT = BundleConstants[DeviceInfo.getBundleId()].PLATFORM_API_ENDPOINT;
export const TRACKER_ENDPOINT = BundleConstants[DeviceInfo.getBundleId()].TRACKER_ENDPOINT;
export const TOKEN_ID = BundleConstants[DeviceInfo.getBundleId()].TOKEN_ID;
export const SESSION_KEY_EXPIRY_TIME = BundleConstants[DeviceInfo.getBundleId()].SESSION_KEY_EXPIRY_TIME || 60 * 60 * 24 * 365;
export const SPENDING_LIMIT = BundleConstants[DeviceInfo.getBundleId()].SPENDING_LIMIT || '1000000000000000000000';
export const TWITTER_CONSUMER_KEY = BundleConstants[DeviceInfo.getBundleId()].TWITTER_CONSUMER_KEY;
export const TWITTER_CONSUMER_SECRET = BundleConstants[DeviceInfo.getBundleId()].TWITTER_CONSUMER_SECRET;
