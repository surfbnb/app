import qs from 'qs';

import {GithubAuthEmitter} from '../../helpers/Emitters';
import GitHubOAuth from '../../services/ExternalLogin/GitHubOAuth';
import RemoteConfig from '../../services/RemoteConfig';
import Base from './Base';

export class GitHubWebLogin extends Base{

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
        GithubAuthEmitter.removeListener('showGithubWebview');
    }
    
    signIn = async ()=> {
        let url = await GitHubOAuth.getWebviewUrl();
        console.log(url);
        this.showWebview( url );
    }

    handleNavigationStateChange = ( navState ) => {
        let url = navState.url;
        if( url.includes(`${RemoteConfig.getValue('GITHUB_AUTH_CALLBACK_ROUTE')}?`) ){
            let urlParts = url.split('?');
            let params = qs.parse(urlParts[1]);
            this.hideWebview();
            GitHubOAuth.handleRedirectSuccess(params);
        }
    }
}

export default {
    signIn : () => {
        GithubAuthEmitter.emit('showGithubWebview');
    }
  };
