import React from 'react';
import { Modal, SafeAreaView, Text, View, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';

import DeviceInfo from 'react-native-device-info';
import CommonStyle from '../../theme/styles/Common';
import inlineStyles from './styles';
import {LoginPopoverActions} from "../LoginPopover";

export default class Base extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            show: false,
            url: ''
        }
    }

    showWebview = ( url )=> {
        this.setState({
            show: true,
            url: url
        })
    }

    hideWebview = ()=> {
      console.log('hideWebview');
      LoginPopoverActions.hide();
        this.setState({
            show: false,
            url: 'url'
        })
    }
    
    signIn = async ()=> {
        //implement in child
    }

    handleNavigationStateChange = ( navState ) => {
       //implement in child
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
                style={{ flex: 1, marginTop: 20 }}
                onNavigationStateChange = {(navState)=>{
                    this.handleNavigationStateChange( navState );
                }}
            />
        )
    }

    getHeader = () => {
        //implement in child
       return "";
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
                    <TouchableOpacity
                    onPress={() => {
                        this.hideWebview();
                    }}
                    style={inlineStyles.closeWrapper}
                    >
                        <Text style={inlineStyles.cancel}>Cancel</Text>
                    </TouchableOpacity>
                    <View style={inlineStyles.header}>
                        <Text>{this.getHeader()}</Text>
                    </View>
                        <SafeAreaView style={[CommonStyle.viewContainer]}>
                        {this.getModalView()}
                    </SafeAreaView>
                </Modal>
        )
    }
}
