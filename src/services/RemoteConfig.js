import firebase from 'react-native-firebase';
import DefaultConstants from '../constants/RemoteConfigDefaults';

// Enable dev mode gets remote congig more frequently
if (__DEV__) {
    firebase.config().enableDeveloperMode();
}

// Set default values
firebase.config().setDefaults(DefaultConstants);

// Constant keys
let constantsKeys = Object.keys(DefaultConstants);
let remoteConfig = {};

firebase.config().getValues(constantsKeys)
    .then((objects) => {
        Object.keys(objects).forEach((key) => {
            remoteConfig[key] = objects[key].val();
        });
    })
    .catch(console.error);

// firebase.config().fetch()
//     .then(() => {
//         console.log('Activating remote fetched data...');
//         return firebase.config().activateFetched();
//     })
//     .then((activated) => {
//         if (!activated) console.log('Fetched data not activated');
//     })
//     .catch(console.log);

export default () => {
    return remoteConfig;
};
