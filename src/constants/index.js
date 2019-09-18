import DeviceInfo from 'react-native-device-info';
import BigNumber from 'bignumber.js';

const B18 = new BigNumber('10').exponentiatedBy('18');
const PProduction = new BigNumber('1000').multipliedBy(B18);

const PStaging = new BigNumber('10').multipliedBy(B18);

const PSandbox = new BigNumber('10').multipliedBy(B18);

const BundleConstants = {
  'com.pepo.staging': {
    API_ROOT: 'https://stagingpepo.com/api/v1',
    PLATFORM_API_ENDPOINT: 'https://api.stagingost.com/testnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/devp101_pixel.png',
    TOKEN_ID: '1185',
    TWITTER_CONSUMER_KEY: 'NEo4gEXzdQZaoTsqzpZvepfKb',
    TWITTER_CONSUMER_SECRET: 'iM5UMt4px8rwoqEoRV9gJGrJGtEoMUxOYkaWXSges7t4bk564t',
    SESSION_KEY_EXPIRY_TIME: 60 * 60 * 2, //2 hours
    SPENDING_LIMIT: PStaging.toString( 10 ),
    HIGH_SPEND_SESSION_KEY_EXPIRY_TIME: 0 // buffer 1 hr

  },
  'com.pepo.sandbox': {
    API_ROOT: 'https://sandboxpepo.com/api/v1',
    PLATFORM_API_ENDPOINT: 'https://api.ost.com/testnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/ps501_pixel.png',
    TOKEN_ID: '1506',
    TWITTER_CONSUMER_KEY: 'qqc45NF23dhKRuNbfsdnHGEkI',
    TWITTER_CONSUMER_SECRET: 'vgDWrMorXdvDOaMSkniRvjQqij4GUwIadWSg9kQnfEmjTDIPs0',
    SESSION_KEY_EXPIRY_TIME: 60 * 60 * 2, // 2 hours
    SPENDING_LIMIT: PSandbox.toString( 10 ),
    HIGH_SPEND_SESSION_KEY_EXPIRY_TIME: 0 // buffer 1 hr
  },
  'com.pepo.v2.production': {
    API_ROOT: 'https://pepo.com/api/v1',
    PLATFORM_API_ENDPOINT: 'https://api.ost.com/mainnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/pp1001_pixel.png',
    TOKEN_ID: '1009',
    TWITTER_CONSUMER_KEY: '53Q0hHEe4Hhartej9lFVWZX4C',
    TWITTER_CONSUMER_SECRET: 'L3jOhUfHr8drwrx8qT7GnvObFtPxTxZkFQbdCWGKawzo7l9avV',
    SESSION_KEY_EXPIRY_TIME: 2 * 7 * 24 * 60 * 60, //14 days
    SPENDING_LIMIT: PProduction.toString( 10 ),
    HIGH_SPEND_SESSION_KEY_EXPIRY_TIME: 1 * 60 * 60 // 1 hour + buffer from config 1 hr = 2 hr
  }
};

console.log(`Exporting constants for Bundle ID ${DeviceInfo.getBundleId()}`);

export const API_ROOT = BundleConstants[DeviceInfo.getBundleId()].API_ROOT;
export const PLATFORM_API_ENDPOINT = BundleConstants[DeviceInfo.getBundleId()].PLATFORM_API_ENDPOINT;
export const TRACKER_ENDPOINT = BundleConstants[DeviceInfo.getBundleId()].TRACKER_ENDPOINT;
export const TOKEN_ID = BundleConstants[DeviceInfo.getBundleId()].TOKEN_ID;
export const SESSION_KEY_EXPIRY_TIME = BundleConstants[DeviceInfo.getBundleId()].SESSION_KEY_EXPIRY_TIME || 60 * 60 * 24 * 365;
export const HIGH_SPEND_SESSION_KEY_EXPIRY_TIME = BundleConstants[DeviceInfo.getBundleId()].HIGH_SPEND_SESSION_KEY_EXPIRY_TIME || 0;
export const SPENDING_LIMIT = BundleConstants[DeviceInfo.getBundleId()].SPENDING_LIMIT || '1000000000000000000000';
export const TWITTER_CONSUMER_KEY = BundleConstants[DeviceInfo.getBundleId()].TWITTER_CONSUMER_KEY;
export const TWITTER_CONSUMER_SECRET = BundleConstants[DeviceInfo.getBundleId()].TWITTER_CONSUMER_SECRET;


export const IS_PRODUCTION = ( 'com.pepo.v2.production' === DeviceInfo.getBundleId() );
export const IS_SANDBOX = ('com.pepo.sandbox' === DeviceInfo.getBundleId() );
