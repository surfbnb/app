import React, { PureComponent } from 'react';
import { Linking } from 'react-native';
import  deepGet from "lodash/get";
import CurrentUser from '../models/CurrentUser';
import {connect} from "react-redux";
import PepoApi from "./PepoApi";
import {navigateTo} from "../helpers/navigateTo";

class UniversalLinksManager extends PureComponent {

    constructor(props) {
        super(props);
        this._processURL = this._processURL.bind(this);
        this._handleOpenURL = this._handleOpenURL.bind(this);
    }

    componentDidMount() {

        // getInitialURL when app is closed and is being launched by universal link
        Linking.getInitialURL().then((url) => {
            url && this._processURL(url);
        });

        // addEventListener on 'url' when app is in background and launched by universal link
        Linking.addEventListener('url', this._handleOpenURL);
    }

    componentWillUnmount() {
        Linking.removeEventListener('url', this._handleOpenURL);
    }

    _handleOpenURL(event) {
        this._processURL(event.url);
    }

    _processURL(url) {
        //TODO @preshita , get this reviwed from @Akshay
        new PepoApi(`/fetch-goto?url=${url}`)
            .get()
            .then((res) => {
                const resultType = deepGet(res, "data.result_type"),
                        goTo = deepGet( res , `data.${resultType}`)
                ;
                navigateTo.setGoTo(goTo);
                if(CurrentUser.isActiveUser()) {
                    navigateTo.navigationDecision();
                }
            })
            .catch((error) => {});
    }

    render() {
        return null;
    }

}

const mapStateToProps = () => {
    return { currentUserId: CurrentUser.getUserId() };
};

export default connect(mapStateToProps)(UniversalLinksManager);
