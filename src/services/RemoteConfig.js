import firebase from 'react-native-firebase';
import assignIn from "lodash/assignIn";
import DefaultConstants from '../constants/RemoteConfigDefaults';

class RemoteConfig {

    constructor() {

        // Enable dev mode gets remote config more frequently
        __DEV__ && firebase.config().enableDeveloperMode();

        // Set default values
        firebase.config().setDefaults(DefaultConstants);

        // Get constant keys of defaults
        this.constantsKeys = Object.keys(DefaultConstants);

        // Set initial config from defaults, but also fetch from SDK
        this.cachedConfig = assignIn({}, DefaultConstants);
        this.firebaseConfigFetch();
    }

    firebaseConfigGetValues(){

        return firebase.config().getValues(this.constantsKeys)
            .then((objects) => {
                Object.keys(objects).forEach((key) => {
                    this.cachedConfig[key] = objects[key].val();
                });
            })
            .catch(console.log);
    }

    firebaseConfigFetch(){
        firebase.config().fetch()
            .then(() => {
                console.log('Activating remote fetched data...');
                return firebase.config().activateFetched();
            })
            .then((activated) => {
                if (!activated) console.log('Fetched data not activated!');
                return this.firebaseConfigGetValues();
            })
            .catch(console.log);
    }

    getValue( key ){
        return this.cachedConfig[key];
    }
}

export default new RemoteConfig();
