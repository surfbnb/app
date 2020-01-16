import React from 'react';
import {View, Modal} from 'react-native';
import { WebView } from 'react-native-webview';

import DeviceInfo from 'react-native-device-info';
import {TwitterAuthEmitter} from '../../helpers/Emitters';
import TwitterOAuth from '../../services/ExternalLogin/TwitterOAuth';

export default class TwitterWebLogin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show: false,
            url: '',
            accessToken: null
        }
    }

    componentDidMount(){
        TwitterAuthEmitter.on('requestTokenCallbackReceived', ()=>{
            this.setState({
                show: false,
                url: ''
            })
        })
    }

    signIn = async ()=> {
        let url = await TwitterOAuth.getWebviewUrl();
        this.setState({
            show: true,
            url: url
        })
    }

    getModalView = ()=> {
        return  (
            <View style={{flex: 1}}>
                 <WebView
                    source={{
                    uri: this.state.url,
                    headers: {
                    'X-PEPO-DEVICE-OS': Platform.OS,
                    'X-PEPO-DEVICE-OS-VERSION': String(DeviceInfo.getSystemVersion()),
                    'X-PEPO-BUILD-NUMBER': String(DeviceInfo.getBuildNumber()),
                    'X-PEPO-APP-VERSION': String(DeviceInfo.getVersion())
                    }
                }}
                style={{ flex: 1 }}
                />
            </View>
        )
    }

    render(){
        return (
            <React.Fragment>
                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.show}
                coverScreen={false}
                hasBackdrop={false}
                >
                    {this.getModalView()}
                </Modal>
            </React.Fragment>
        )
    }
}
const TwitterWebLoginInstance = new TwitterWebLogin();
export const TwitterWebLoginActions = {
    signIn : function (){
       TwitterWebLoginInstance.signIn();
    }
}