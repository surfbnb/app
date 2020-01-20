import DeviceInfo from 'react-native-device-info';

const DefaultConstants = {
    'com.pepo.staging': {
        TWITTER_CONSUMER_KEY: 'NEo4gEXzdQZaoTsqzpZvepfKb',
        TWITTER_CONSUMER_SECRET: 'iM5UMt4px8rwoqEoRV9gJGrJGtEoMUxOYkaWXSges7t4bk564t',
        TWITTER_AUTH_CALLBACK_ROUTE: 'https://stagingpepo.com/webview/twitter/oauth',
        GOOGLE_ANDROID_CLIEND_ID: '82182934708-rgk37rbb4jojhb27cjbood88d014n8f8.apps.googleusercontent.com',
        GOOGLE_ANDROID_REDIRECT_URI: 'com.pepo.staging:/oauth2callback',
        GOOGLE_SCOPES: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'],
        GOOGLE_IOS_CLIEND_ID: '82182934708-nkbb3ta4piprjh9bpu8937b16aq3mik4.apps.googleusercontent.com',
        GOOGLE_IOS_REDIRECT_URI: 'com.googleusercontent.apps.82182934708-nkbb3ta4piprjh9bpu8937b16aq3mik4:/oauth2redirect/google',
        GITHUB_AUTH_CALLBACK_ROUTE: 'https://stagingpepo.com/webview/github/oauth',
        GITHUB_CLIENT_ID: '58a09b55ccbcd1f6909f',
        GITHUB_CLIENT_SECRET: '96bae48081191810aa8850456f9d279c672e0b42',
        GITHUB_SCOPES: 'read:user user:email'// Need to be space separated
    },
    'com.pepo.sandbox': {
        TWITTER_CONSUMER_KEY: 'qqc45NF23dhKRuNbfsdnHGEkI',
        TWITTER_CONSUMER_SECRET: 'vgDWrMorXdvDOaMSkniRvjQqij4GUwIadWSg9kQnfEmjTDIPs0',
        TWITTER_AUTH_CALLBACK_ROUTE: 'https://sandboxpepo.com/webview/twitter/oauth',
        GOOGLE_ANDROID_CLIEND_ID: ' 472490126275-6nevcgi2nco3edr914v3adlg0p75j0jf.apps.googleusercontent.com',
        GOOGLE_ANDROID_REDIRECT_URI: 'com.pepo.sandbox:/oauth2callback',
        GOOGLE_SCOPES: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'],
        GOOGLE_IOS_CLIEND_ID: '472490126275-fgeotv1ko90toqs6ktunm3qj5pim76od.apps.googleusercontent.com',
        GOOGLE_IOS_REDIRECT_URI: 'com.googleusercontent.apps.472490126275-fgeotv1ko90toqs6ktunm3qj5pim76od:/oauth2redirect/google',
        GITHUB_AUTH_CALLBACK_ROUTE: 'https://sandboxpepo.com/webview/github/oauth',
        GITHUB_CLIENT_ID: '8f136ce2ced93725d620',
        GITHUB_CLIENT_SECRET: 'ddf398e94411cd9fb0cc7e30e586f1e4d8199381',
        GITHUB_SCOPES: 'read:user user:email'// Need to be space separated
    },
    'com.pepo.v2.sandbox': {
        TWITTER_CONSUMER_KEY: 'qqc45NF23dhKRuNbfsdnHGEkI',
        TWITTER_CONSUMER_SECRET: 'vgDWrMorXdvDOaMSkniRvjQqij4GUwIadWSg9kQnfEmjTDIPs0',
        TWITTER_AUTH_CALLBACK_ROUTE: 'https://sandboxpepo.com/webview/twitter/oauth',
        GOOGLE_ANDROID_CLIEND_ID: ' 472490126275-6nevcgi2nco3edr914v3adlg0p75j0jf.apps.googleusercontent.com',
        GOOGLE_ANDROID_REDIRECT_URI: 'com.pepo.sandbox:/oauth2callback',
        GOOGLE_SCOPES: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'],
        GOOGLE_IOS_CLIEND_ID: '472490126275-fgeotv1ko90toqs6ktunm3qj5pim76od.apps.googleusercontent.com',
        GOOGLE_IOS_REDIRECT_URI: 'com.googleusercontent.apps.472490126275-fgeotv1ko90toqs6ktunm3qj5pim76od:/oauth2redirect/google',
        GITHUB_AUTH_CALLBACK_ROUTE: 'https://sandboxpepo.com/webview/github/oauth',
        GITHUB_CLIENT_ID: '8f136ce2ced93725d620',
        GITHUB_CLIENT_SECRET: 'ddf398e94411cd9fb0cc7e30e586f1e4d8199381',
        GITHUB_SCOPES: 'read:user user:email'// Need to be space separated
    },
    'com.pepo.v2.production': {
        TWITTER_CONSUMER_KEY: '53Q0hHEe4Hhartej9lFVWZX4C',
        TWITTER_CONSUMER_SECRET: 'L3jOhUfHr8drwrx8qT7GnvObFtPxTxZkFQbdCWGKawzo7l9avV',
        TWITTER_AUTH_CALLBACK_ROUTE: 'https://pepo.com/webview/twitter/oauth',
        GOOGLE_ANDROID_CLIEND_ID: '227946456206-285bio9jqr9elbhmp2gmsqg71stihkmc.apps.googleusercontent.com',
        GOOGLE_ANDROID_REDIRECT_URI: 'com.pepo.v2.production:/oauth2callback',
        GOOGLE_SCOPES: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile'],
        GOOGLE_IOS_CLIEND_ID: '227946456206-c442dvdcq38fmion2af60aa7edkb14eg.apps.googleusercontent.com',
        GOOGLE_IOS_REDIRECT_URI: 'com.googleusercontent.apps.227946456206-c442dvdcq38fmion2af60aa7edkb14eg:/oauth2redirect/google',
        GITHUB_AUTH_CALLBACK_ROUTE: 'https://pepo.com/webview/github/oauth',
        GITHUB_CLIENT_ID: '268fd72a5df6f45c51f5',
        GITHUB_CLIENT_SECRET: '0a51c76c60fa457ec252a611a1772c48e4744695',
        GITHUB_SCOPES: 'read:user user:email'// Need to be space separated
    }
};

export default DefaultConstants[DeviceInfo.getBundleId()];

