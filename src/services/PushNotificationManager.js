import React, { PureComponent } from 'react';
import {Platform} from "react-native";
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';
import { connect } from "react-redux";
import PepoApi from "./PepoApi";

class PushNotificationManager extends PureComponent {

    componentDidMount() {
        this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => this.sendToken(fcmToken));
    }

    componentWillUnmount() {
        this.onTokenRefreshListener();
    }

    getToken() {

        if (Object.keys(this.props.current_user).length === 0) {
            console.log('getToken :: current_user is not yet available');
            return;
        }

        firebase.messaging().getToken()
            .then(fcmToken => fcmToken && this.sendToken(fcmToken));
    }

    sendToken(token) {
        let payload = {
            device_id: DeviceInfo.getUniqueID(),
            device_kind: Platform.OS,
            device_token: token,
        };
        new PepoApi(`/users/${this.props.current_user.id}/device-token`)
            .post(payload)
            .then((responseData) => {
                console.log('sendToken :: Payload sent successfully', payload);
            })

    }

    render() {
        this.getToken();
        return <React.Fragment />;
    }
}

const mapStateToProps = ({ current_user }) => ({ current_user });

export default connect(mapStateToProps)(PushNotificationManager);
