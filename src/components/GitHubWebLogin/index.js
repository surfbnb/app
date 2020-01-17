import React from 'react';
import { Modal } from 'react-native';
import { WebView } from 'react-native-webview';
import qs from 'qs';

import DeviceInfo from 'react-native-device-info';
import {GithubAuthEmitter} from '../../helpers/Emitters';
import GitHubOAuth from '../../services/ExternalLogin/GitHubOAuth';
import { SafeAreaView } from 'react-navigation';
import { GITHUB_AUTH_CALLBACK_ROUTE } from '../../constants';

export class GitHubWebLogin extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show: false,
            url: ''
        }
    }

    componentDidMount(){
        GithubAuthEmitter.on('showGithubWebview', ()=> this.signIn())
    }

    componentWillUnmount(){
        GithubAuthEmitter.removeListener('showTwitterWebview');
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
        let url = await GitHubOAuth.getWebviewUrl();
        console.log(url);
        this.showWebview( url );
    }

    handleNavigationStateChange = ( navState ) => {
        let url = navState.url;
        if( url.includes(`${GITHUB_AUTH_CALLBACK_ROUTE}?`) ){
            let urlParts = url.split('?');
            let params = qs.parse(urlParts[1]);
            this.hideWebview();
            GitHubOAuth.handleRedirectSuccess(params);
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
        GithubAuthEmitter.emit('showGithubWebview');
    }
  };
