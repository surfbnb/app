import DeviceInfo from 'react-native-device-info';

const DefaultConstants = {
    'com.pepo.staging': {
        TWITTER_CONSUMER_KEY: 'NEo4gEXzdQZaoTsqzpZvepfKb',
        TWITTER_CONSUMER_SECRET: 'iM5UMt4px8rwoqEoRV9gJGrJGtEoMUxOYkaWXSges7t4bk564t',
        TWITTER_AUTH_CALLBACK_ROUTE: 'https://stagingpepo.com/webview/twitter/oauth',
        GOOGLE_ANDROID_CLIEND_ID: '82182934708-rgk37rbb4jojhb27cjbood88d014n8f8.apps.googleusercontent.com',
        GOOGLE_ANDROID_REDIRECT_URI: 'com.pepo.staging:/oauth2callback',
        GOOGLE_SCOPES: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/contacts.readonly'],
        GOOGLE_IOS_CLIEND_ID: '82182934708-nkbb3ta4piprjh9bpu8937b16aq3mik4.apps.googleusercontent.com',
        GOOGLE_IOS_REDIRECT_URI: 'com.googleusercontent.apps.82182934708-nkbb3ta4piprjh9bpu8937b16aq3mik4:/oauth2redirect/google',
        GOOGLE_SCOPES: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/contacts.readonly'],
        GITHUB_AUTH_CALLBACK_ROUTE: 'https://stagingpepo.com/webview/github/oauth',
        GITHUB_CLIENT_ID: '58a09b55ccbcd1f6909f',
        GITHUB_CLIENT_SECRET: '96bae48081191810aa8850456f9d279c672e0b42',
        GITHUB_SCOPES: 'read:user user:email'
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

