import qs from 'qs';

import {TwitterAuthEmitter} from '../../helpers/Emitters';
import TwitterOAuth from '../../services/ExternalLogin/TwitterOAuth';
import RemoteConfig from '../../services/RemoteConfig';
import Base from './Base';

export class TwitterWebLogin extends Base{

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
    
    signIn = async ()=> {
        let url = await TwitterOAuth.getWebviewUrl();
        this.showWebview( url );
    }

    handleNavigationStateChange = ( navState ) => {
        let url = navState.url;
        if( url.includes(RemoteConfig.getValue('TWITTER_AUTH_CALLBACK_ROUTE'))){
            let params = url.split('?');
            let paramsObj = qs.parse(params[1]);
            this.hideWebview();
            TwitterOAuth.handleRequestTokenSuccess(paramsObj);
        }
    }

}

export default {
    signIn : () => {
        TwitterAuthEmitter.emit('showTwitterWebview');
    }
  };