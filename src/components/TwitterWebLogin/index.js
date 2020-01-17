import React from 'react';
import { Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import qs from 'qs';

import DeviceInfo from 'react-native-device-info';
import {TwitterAuthEmitter} from '../../helpers/Emitters';
import TwitterOAuth from '../../services/ExternalLogin/TwitterOAuth';
import { SafeAreaView } from 'react-navigation';
import { TWITTER_AUTH_CALLBACK_ROUTE } from '../../constants';

export class TwitterWebLogin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show: false,
            url: ''
        }
    }

    componentDidMount(){
        TwitterAuthEmitter.on('requestTokenCallbackReceived', ()=>{
            this.hideWebview();
        })
        TwitterAuthEmitter.on('showTwitterWebview', ()=> this.signIn())
    }

    componentWillUnmount(){
        TwitterAuthEmitter.removeListener('requestTokenCallbackReceived');
        TwitterAuthEmitter.removeListener('showTwitterWebview');
    }

    showWebview = ( url )=> {
        this.setState({
            show: true,
            url: url
        })
    }

    hideWebview = ()=> {
        this.setState({
            show: false,
            url: 'url'
        })
    }
    
    signIn = async ()=> {
        let url = await TwitterOAuth.getWebviewUrl();
        this.showWebview( url );
    }

    handleNavigationStateChange = ( navState ) => {
        let url = navState.url;
        if( url.includes(TWITTER_AUTH_CALLBACK_ROUTE)){
            let params = url.split('?');
            let paramsObj = qs.parse(params[1]);
            this.hideWebview();
            TwitterOAuth.handleRequestTokenSuccess(paramsObj);
        }
    }

    getModalView = ()=> {
        return  (
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
                onNavigationStateChange = {(navState)=>{
                    this.handleNavigationStateChange( navState );
                }}
            />
        )
    }

    render(){
        return (
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.show}
              onRequestClose={() => {
                this.hideWebview();
              }}>
              <SafeAreaView style={{flex: 1, marginTop: 40}} >
                {this.getModalView()}
              </SafeAreaView>
            </Modal>
        )
    }
}

export default {
    signIn : () => {
        TwitterAuthEmitter.emit('showTwitterWebview');
    }
  };