import React from 'react';
import {SafeAreaView, Platform, KeyboardAvoidingView, BackHandler} from 'react-native';
import { WebView } from 'react-native-webview';

import DeviceInfo from 'react-native-device-info';
import CommonStyle from '../../theme/styles/Common';
import NavigationService from "../../services/NavigationService";

export default class Base extends React.PureComponent{

    constructor(props){
        super(props);
        this.url = props.url;

    }


    componentDidMount(){
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

  handleBackButtonClick = () => {
    clearTimeout(this.goBack);
    this.goBack = setTimeout(()=>{NavigationService.goBack()}, 300);
  };

  getModalView = ()=> {
        return  (
            <WebView
                source={{
                uri: this.url,
                headers: {
                'X-PEPO-DEVICE-OS': Platform.OS,
                'X-PEPO-DEVICE-OS-VERSION': String(DeviceInfo.getSystemVersion()),
                'X-PEPO-BUILD-NUMBER': String(DeviceInfo.getBuildNumber()),
                'X-PEPO-APP-VERSION': String(DeviceInfo.getVersion())
                }
                }}
                style={{ flex: 1 }}
                onLoadEnd = {(syntheticEvent)=>{
                    const { nativeEvent } = syntheticEvent;
                    this.props.handleOnLoadEnd( nativeEvent );
                }}
            />
        )
    }

    render(){
        return (
            <SafeAreaView style={CommonStyle.viewContainer}>
                <KeyboardAvoidingView behavior={Platform.OS == 'android' ?'padding' :''} style={{ flex: 1 }} keyboardVerticalOffset={30}>
                    {this.getModalView()}
                </KeyboardAvoidingView>
            </SafeAreaView>
              
        )
    }
}
