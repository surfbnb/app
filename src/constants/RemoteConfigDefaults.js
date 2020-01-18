import DeviceInfo from 'react-native-device-info';

const DefaultConstants = {
    'com.pepo.staging': {
        TWITTER_CONSUMER_KEY: 'NEo4gEXzdQZaoTsqzpZvepfKb',
        TWITTER_CONSUMER_SECRET: 'iM5UMt4px8rwoqEoRV9gJGrJGtEoMUxOYkaWXSges7t4bk564t',
        TWITTER_AUTH_CALLBACK_ROUTE: 'https://stagingpepo.com/webview/twitter/oauth',
    },
    'com.pepo.sandbox': {
        TWITTER_CONSUMER_KEY: 'qqc45NF23dhKRuNbfsdnHGEkI',
        TWITTER_CONSUMER_SECRET: 'vgDWrMorXdvDOaMSkniRvjQqij4GUwIadWSg9kQnfEmjTDIPs0',
        TWITTER_AUTH_CALLBACK_ROUTE: 'https://sandboxpepo.com/webview/twitter/oauth'
    },
    'com.pepo.v2.sandbox': {
        TWITTER_CONSUMER_KEY: 'qqc45NF23dhKRuNbfsdnHGEkI',
        TWITTER_CONSUMER_SECRET: 'vgDWrMorXdvDOaMSkniRvjQqij4GUwIadWSg9kQnfEmjTDIPs0',
        TWITTER_AUTH_CALLBACK_ROUTE: 'https://sandboxpepo.com/webview/twitter/oauth',
    },
    'com.pepo.v2.production': {
        TWITTER_CONSUMER_KEY: '53Q0hHEe4Hhartej9lFVWZX4C',
        TWITTER_CONSUMER_SECRET: 'L3jOhUfHr8drwrx8qT7GnvObFtPxTxZkFQbdCWGKawzo7l9avV',
        TWITTER_AUTH_CALLBACK_ROUTE: 'https://pepo.com/webview/twitter/oauth'
    }
};

export default DefaultConstants[DeviceInfo.getBundleId()];

