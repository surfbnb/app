import React from 'react';
import {Modal, Text, TouchableHighlight, View, Alert} from 'react-native';
import { WebView } from 'react-native-webview';

import DeviceInfo from 'react-native-device-info';
import {TwitterAuthEmitter} from '../../helpers/Emitters';
import TwitterOAuth from '../../services/ExternalLogin/TwitterOAuth';
import inlineStyles from './styles';
import { SafeAreaView } from 'react-navigation';

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
                Alert.alert('Modal has been closed.');
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