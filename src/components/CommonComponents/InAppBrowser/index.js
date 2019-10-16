import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import { SafeAreaView } from 'react-navigation';
import {Image, TouchableOpacity, Text, View, Share, Platform, KeyboardAvoidingView} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import ProgressBar from 'react-native-progress/Bar';

import inlineStyles from './styles';
import crossIcon from '../../../assets/cross_icon.png';
import BackActive from '../../../assets/BackActive.png';
import ForwardActive from '../../../assets/ForwardActive.png';
import BrowserMenu from './BrowserMenu';
import {getHostName} from '../../../helpers/helpers';
import Colors from '../../../theme/styles/Colors';

export default class InAppBrowserComponent extends Component {
    static navigationOptions = (props) => {
        return {
          headerStyle: inlineStyles.headerStyles,
          headerLeft: <BrowserHeaderLeft {...props}/>,
          headerRight: <BrowserHeaderRight {...props}/>,
          headerTitle: <BrowserHeaderTitle {...props}/>
        };
      };

    constructor(props){
        super(props);
        this.url =  this.validateUrl(this.props.navigation.getParam('browserUrl'));
        this.props.navigation.setParams({
         reload: this.reload,
         share: this.share,
         goBack: this.goBack,
         url : getHostName(this.url)
        })
        this.webview = null;
        this.state = {
          loadingProgress: 0,
          canGoBack: false,
          canGoForward: false
        };
    }

    componentWillUnmount(){
      this.url = "about:blank"
    }

    validateUrl(url){
      if(!(url.startsWith('http://',0) || url.startsWith('https://',0))){
        url = 'http://'+url;
      }
      return url;
    }

    reload = ()=>{
      this.webview.reload();
    }

    goBack = ()=> {
      this.webview.goBack();
    }

    goForward = ()=> {
      this.webview.goForward();
    }

    share = async()=>{
      let content = {
        message: this.props.navigation.getParam('copyAndShareUrl'),
        title: this.props.navigation.getParam('title')
      };
      try {
        const result = await Share.share(content);
      } catch (error) {
        alert(error.message);
      }
    }

    setHeaderParams = ( title, url)=>{
      this.props.navigation.setParams({
        title: title,
        url: getHostName(url),
        copyAndShareUrl: url
      })
    }

    setNavigation = (nativeEvent)=>{
      this.setState({
        canGoBack: nativeEvent.canGoBack,
        canGoForward: nativeEvent.canGoForward
      })
    }

    render() {
        return (
          <SafeAreaView style={{flex: 1}}>
              <KeyboardAvoidingView behavior={Platform.OS == 'android' ?'padding' :''} style={{ flex: 1 }} keyboardVerticalOffset={30}>
                {this.state.loadingProgress != 1 &&
                  <ProgressBar progress={this.state.loadingProgress} width={null} height={3}
                      color={ Colors.pinkRed } useNativeDriver={ true} borderRadius = {0} borderWidth={0}/>}
                <WebView
                    style={{flex:1}}
                    useWebKit={true}
                    allowsInlineMediaPlayback={true}
                    ref={ref => (this.webview = ref)}
                    source={{
                        uri: this.url,
                        headers: {
                            'X-PEPO-DEVICE-OS': Platform.OS,
                            'X-PEPO-DEVICE-OS-VERSION': String(DeviceInfo.getSystemVersion()),
                            'X-PEPO-BUILD-NUMBER': String(DeviceInfo.getBuildNumber()),
                            'X-PEPO-APP-VERSION': String(DeviceInfo.getVersion())
                        }
                    }}
                    renderError={errorName => <View style={inlineStyles.webviewContent}><Text style={{fontSize: 20}}>Invalid Link</Text></View>}
                    onLoad={syntheticEvent => {
                      const { nativeEvent } = syntheticEvent;
                      this.setHeaderParams(nativeEvent.title, nativeEvent.url);
                      this.setNavigation(nativeEvent);
                    }}
                    onLoadProgress={({ nativeEvent }) => {
                      this.setState({
                        loadingProgress : nativeEvent.progress
                      })
                    }}
                />
                <BrowserFooter canGoBack={this.state.canGoBack} canGoForward={this.state.canGoForward}
                                goBack={this.goBack} goForward={this.goForward}/>
              </KeyboardAvoidingView>
           </SafeAreaView>
        );
    }
}

const BrowserHeaderLeft = (props)=>{
  return (
    <TouchableOpacity
    onPress={() => {
      props.navigation.goBack(null);
    }}
    style={inlineStyles.iconWrapper}
  >
    <Image style={inlineStyles.crossIconSkipFont} source={crossIcon}></Image>
  </TouchableOpacity>
  )
}

const BrowserHeaderRight = (props)=>{
  const url =  props.navigation.getParam('copyAndShareUrl');
  const reloadDelegate =  props.navigation.getParam('reload');
  const shareDelegate =  props.navigation.getParam('share');
  return (
    <BrowserMenu url={url} share={shareDelegate} reload={reloadDelegate}/>
  )
}

const BrowserHeaderTitle = (props)=>{
  return (
    <View>
      <Text numberOfLines={1} style={inlineStyles.headerText}>{props.navigation.getParam('title')}</Text>
      <Text style={inlineStyles.headerSubText}>{props.navigation.getParam('url')}</Text>
    </View>
  )
}

const BrowserFooter = (props)=>{
  return (
    <View style={[inlineStyles.footerStyles]}>
      <TouchableOpacity onPress={props.goBack} style={inlineStyles.navigateWrapper}>
        <Image style={[inlineStyles.navigateSkipFont,!props.canGoBack ? {tintColor: Colors.lightGrey} : '']} source={BackActive}></Image>
     </TouchableOpacity>
     <TouchableOpacity onPress={props.goForward} style={inlineStyles.navigateWrapper}>
        <Image style={[inlineStyles.navigateSkipFont,!props.canGoForward ? {tintColor: Colors.lightGrey} : '']} source={ForwardActive}></Image>
     </TouchableOpacity>
    </View>
  )
}
