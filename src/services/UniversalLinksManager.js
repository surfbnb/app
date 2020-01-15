import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import  deepGet from "lodash/get";
import {connect} from "react-redux";
import firebase from 'react-native-firebase';
import qs from 'qs';

import CurrentUser from '../models/CurrentUser';
import PepoApi from "./PepoApi";
import {navigateTo} from "../helpers/navigateTo";
import TwitterOAuth from '../services/ExternalLogin/TwitterOAuth';
import {TwitterAuthEmitter} from '../helpers/Emitters';

class UniversalLinksManager extends PureComponent {

    constructor(props) {
        super(props);
        this._processURL = this._processURL.bind(this);
        this._handleOpenURL = this._handleOpenURL.bind(this);
    }

    componentDidMount() {

        // getInitialURL when app is closed and is being launched by universal link
        Linking.getInitialURL().then((url) => {
            console.log('Linking.getInitialURL() ::', url);
            url && this._processURL(url);
        });

        // getInitialLink when app is closed and is being launched by dynamic link
        firebase.links()
            .getInitialLink()
            .then((url) => {
                console.log('firebase.links().getInitialLink() ::', url);
                url && this._processURL(url);
            });

        // addEventListener on 'url' when app is in background and launched by universal link
        Linking.addEventListener('url', (e) => {
            console.log('Linking :: event :: url ::', e.url);
            this._handleOpenURL(e);
        });

        // onLink on 'url' when app is in background and launched by dynamic link
        this.removeOnLink = firebase.links().onLink((url) => {
            console.log('firebase.links() :: onLink() ::', url);
            this._processURL(url);
        });
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this._handleOpenURL);
        this.removeOnLink();
    }

    _handleOpenURL(event) {
        this._processURL(event.url);
    }

    _processTwitterURL( url ) {
        let params = url.split('?');
        let paramsObj = qs.parse(params[1]);
        TwitterAuthEmitter.emit('requestTokenCallbackReceived');
        TwitterOAuth.handleRequestTokenSuccess(paramsObj);
    }

    _processURL(url) {
        if(url.includes('twitterkit-')){ //callback starting with twitterkit- is registered in twitter app
            this._processTwitterURL( url );
        } else {
            new PepoApi(`/fetch-goto`)
                .get({url})
                .then((res) => {
                    const resultType = deepGet(res, "data.result_type"),
                            goTo = deepGet( res , `data.${resultType}`)
                    ;
                    if(goTo){
                        navigateTo.setGoTo(goTo);
                        CurrentUser.getSyncState() &&  navigateTo.shouldNavigate();
                    }     
                })
                .catch((error) => {});
        }
    }

    render() {
        return null;
    }

}

const mapStateToProps = () => {
    return { currentUserId: CurrentUser.getUserId() };
};

export default connect(mapStateToProps)(UniversalLinksManager);
