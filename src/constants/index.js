import DeviceInfo from 'react-native-device-info';
import BigNumber from 'bignumber.js';

const B18 = new BigNumber('10').exponentiatedBy('18');
const DefaultSpendingLimitProduction = new BigNumber('100').multipliedBy(B18);
const DefaultSpendingLimitStaging = new BigNumber('100').multipliedBy(B18);
const DefaultSpendingLimitSandbox = new BigNumber('100').multipliedBy(B18);

const MaxSpendingLimitProduction = new BigNumber('1000').multipliedBy(B18);
const MaxSpendingLimitSandbox = new BigNumber('1000').multipliedBy(B18);
const MaxSpendingLimitStaging = new BigNumber('1000').multipliedBy(B18);

const BundleConstants = {
  'com.pepo.staging': {
    API_ROOT: 'https://stagingpepo.com/api/v1',
    WEB_ROOT: 'https://pepo:Pepo-Admin-20!9*@stagingpepo.com',
    PLATFORM_API_ENDPOINT: 'https://api.stagingost.com/testnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/devp101_pixel.png',
    TOKEN_ID: '1185',
    TWITTER_CONSUMER_KEY: 'NEo4gEXzdQZaoTsqzpZvepfKb',
    TWITTER_CONSUMER_SECRET: 'iM5UMt4px8rwoqEoRV9gJGrJGtEoMUxOYkaWXSges7t4bk564t',
    TWITTER_AUTH_CALLBACK_ROUTE: 'https://stagingpepo.com/webview/twitter/oauth',
    VIEW_END_POINT: 'https://ost:Ax23!sdQ*kN-201~96@view.stagingost.com/testnet/',
    DEFAULT_SPENDING_LIMIT: DefaultSpendingLimitStaging.toString( 10 ),
    MAX_SPENDING_LIMIT: MaxSpendingLimitStaging.toString( 10 ),
    DEFAULT_SESSION_KEY_EXPIRY_TIME: 60 * 60 * 1, //1 hour + buffer from config 1 hr = 2 hr
    MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME: 60 * 30, // buffer 1 hr + 20 mins
    HIGH_SPEND_SESSION_KEY_EXPIRY_TIME: 60 * 10 // buffer 1 hr + 10 mins
  },
  'com.pepo.sandbox': {
    API_ROOT: 'https://sandboxpepo.com/api/v1',
    WEB_ROOT: 'https://pepo:Pepo-Admin-20!9*@sandboxpepo.com',
    PLATFORM_API_ENDPOINT: 'https://api.ost.com/testnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/ps501_pixel.png',
    TOKEN_ID: '1506',
    TWITTER_CONSUMER_KEY: 'qqc45NF23dhKRuNbfsdnHGEkI',
    TWITTER_CONSUMER_SECRET: 'vgDWrMorXdvDOaMSkniRvjQqij4GUwIadWSg9kQnfEmjTDIPs0',
    TWITTER_AUTH_CALLBACK_ROUTE: 'https://sandboxpepo.com/webview/twitter/oauth',
    VIEW_END_POINT: 'https://view.ost.com/testnet/',
    DEFAULT_SPENDING_LIMIT: DefaultSpendingLimitSandbox.toString( 10 ),
    MAX_SPENDING_LIMIT: MaxSpendingLimitSandbox.toString( 10 ),
    DEFAULT_SESSION_KEY_EXPIRY_TIME: 60 * 60 * 24 * 365, //1 year
    MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME: 60 * 60 * 1, // 1 hour + buffer from config 1 hr = 2 hr
    HIGH_SPEND_SESSION_KEY_EXPIRY_TIME: 0 // buffer 1 hr
  },
  'com.pepo.v2.sandbox': {
    API_ROOT: 'https://sandboxpepo.com/api/v1',
    WEB_ROOT: 'https://pepo:Pepo-Admin-20!9*@sandboxpepo.com',
    PLATFORM_API_ENDPOINT: 'https://api.ost.com/testnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/ps501_pixel.png',
    TOKEN_ID: '1506',
    TWITTER_CONSUMER_KEY: 'qqc45NF23dhKRuNbfsdnHGEkI',
    TWITTER_CONSUMER_SECRET: 'vgDWrMorXdvDOaMSkniRvjQqij4GUwIadWSg9kQnfEmjTDIPs0',
    TWITTER_AUTH_CALLBACK_ROUTE: 'https://sandboxpepo.com/webview/twitter/oauth',
    VIEW_END_POINT: 'https://view.ost.com/testnet/',
    DEFAULT_SPENDING_LIMIT: DefaultSpendingLimitSandbox.toString( 10 ),
    MAX_SPENDING_LIMIT: MaxSpendingLimitSandbox.toString( 10 ),
    DEFAULT_SESSION_KEY_EXPIRY_TIME: 60 * 60 * 24 * 365, //1 year
    MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME: 60 * 60 * 1, // 1 hour + buffer from config 1 hr = 2 hr
    HIGH_SPEND_SESSION_KEY_EXPIRY_TIME: 0 // buffer 1 hr
  },
  'com.pepo.v2.production': {
    API_ROOT: 'https://pepo.com/api/v1',
    WEB_ROOT: 'https://pepo.com',
    PLATFORM_API_ENDPOINT: 'https://api.ost.com/mainnet/v2',
    TRACKER_ENDPOINT: 'https://px.pepo.com/pp1001_pixel.png',
    TOKEN_ID: '1009',
    TWITTER_CONSUMER_KEY: '53Q0hHEe4Hhartej9lFVWZX4C',
    TWITTER_CONSUMER_SECRET: 'L3jOhUfHr8drwrx8qT7GnvObFtPxTxZkFQbdCWGKawzo7l9avV',
    TWITTER_AUTH_CALLBACK_ROUTE: 'https://pepo.com/webview/twitter/oauth',
    VIEW_END_POINT: 'https://view.ost.com/mainnet/',
    DEFAULT_SPENDING_LIMIT: DefaultSpendingLimitProduction.toString( 10 ),
    MAX_SPENDING_LIMIT: MaxSpendingLimitProduction.toString( 10 ),
    DEFAULT_SESSION_KEY_EXPIRY_TIME: 60 * 60 * 24 * 365, //1 year
    MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME: 60 * 60 * 24 * 7 * 2, // 2 weeks
    HIGH_SPEND_SESSION_KEY_EXPIRY_TIME: 60 * 60 * 1 // 1 hour + buffer from config 1 hr = 2 hr
  }
};

console.log(`Exporting constants for Bundle ID ${DeviceInfo.getBundleId()}`);

export const API_ROOT = BundleConstants[DeviceInfo.getBundleId()].API_ROOT;
export const WEB_ROOT = BundleConstants[DeviceInfo.getBundleId()].WEB_ROOT;
export const PLATFORM_API_ENDPOINT = BundleConstants[DeviceInfo.getBundleId()].PLATFORM_API_ENDPOINT;
export const TRACKER_ENDPOINT = BundleConstants[DeviceInfo.getBundleId()].TRACKER_ENDPOINT;
export const TOKEN_ID = BundleConstants[DeviceInfo.getBundleId()].TOKEN_ID;
export const DEFAULT_SESSION_KEY_EXPIRY_TIME = BundleConstants[DeviceInfo.getBundleId()].DEFAULT_SESSION_KEY_EXPIRY_TIME || 60 * 60 * 24 * 365;
export const HIGH_SPEND_SESSION_KEY_EXPIRY_TIME = BundleConstants[DeviceInfo.getBundleId()].HIGH_SPEND_SESSION_KEY_EXPIRY_TIME || 0;
export const MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME = BundleConstants[DeviceInfo.getBundleId()].MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME || 0;
export const DEFAULT_SPENDING_LIMIT = BundleConstants[DeviceInfo.getBundleId()].DEFAULT_SPENDING_LIMIT || '1000000000000000000000';
export const MAX_SPENDING_LIMIT = BundleConstants[DeviceInfo.getBundleId()].MAX_SPENDING_LIMIT || '1000000000000000000000';
export const TWITTER_CONSUMER_KEY = BundleConstants[DeviceInfo.getBundleId()].TWITTER_CONSUMER_KEY;
export const TWITTER_CONSUMER_SECRET = BundleConstants[DeviceInfo.getBundleId()].TWITTER_CONSUMER_SECRET;
export const TWITTER_AUTH_CALLBACK_ROUTE = BundleConstants[DeviceInfo.getBundleId()].TWITTER_AUTH_CALLBACK_ROUTE;

export const VIEW_END_POINT = BundleConstants[DeviceInfo.getBundleId()].VIEW_END_POINT;

export const IS_PRODUCTION = ( 'com.pepo.v2.production' === DeviceInfo.getBundleId() );
export const IS_SANDBOX = ('com.pepo.sandbox' === DeviceInfo.getBundleId()) || ('com.pepo.v2.sandbox' === DeviceInfo.getBundleId());
export const IS_STAGING = ('com.pepo.staging' === DeviceInfo.getBundleId() );
