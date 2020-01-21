import React from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import qs from 'qs';

import GitHubOAuth from '../../services/ExternalLogin/GitHubOAuth';
import RemoteConfig from '../../services/RemoteConfig';
import Base from './Base';
import { LoginPopoverActions } from '../LoginPopover';
import inlineStyles from './styles';

export default class GitHubWebLogin extends React.PureComponent{

    static navigationOptions = (props) => {
        return {
          headerStyle: inlineStyles.headerStyles,
          headerLeft: <HeaderLeft {...props} />,
          headerTitle: <HeaderTitle {...props} />
        };
      };

    constructor(props){
        super(props);   
        this.state = {
            url : null
        }
    }

    componentDidMount(){
        this.signIn();
    }

    signIn = async ()=> {
        let url = await GitHubOAuth.getWebviewUrl();
        this.setState({
            url
        })
    }

    handleOnLoadEnd = ( navState ) => {
        let url = navState.url;
        if( url.includes(`${RemoteConfig.getValue('GITHUB_AUTH_CALLBACK_ROUTE')}?`) ){
            let urlParts = url.split('?');
            let params = qs.parse(urlParts[1]);
            GitHubOAuth.handleRedirectSuccess(params);
            this.props.navigation.goBack(null);
        }
    }

    render() {
        return (this.state.url ? <Base url={this.state.url} handleOnLoadEnd={this.handleOnLoadEnd}/> : null);
    }
}

const HeaderLeft = (props) => {
    return (
       <TouchableOpacity
        onPress={() => {
            props.navigation.goBack(null);
            LoginPopoverActions.hide();
        }}
        style={{paddingLeft: 20}}
        >
            <Text style={inlineStyles.cancel}>Cancel</Text>
        </TouchableOpacity>
    );
  };

  const HeaderTitle = (props) => {
    return (
      <View>
        <Text numberOfLines={1} style={inlineStyles.headerText}>
          {props.navigation.getParam('title')}
        </Text>
      </View>
    );
  };
