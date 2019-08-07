import React, { Component } from 'react';
import { Text, TouchableOpacity, Image } from 'react-native';
import reduxGetter from '../../services/ReduxGetters';
import BackArrow from '../CommonComponents/BackArrow';

import UserInfo from '../../components/CommonComponents/UserInfo';
import CurrentUser from '../../models/CurrentUser';
import UserProfileFlatList from "../../components/CommonComponents/UserProfileFlatList";
import multipleClickHandler from "../../services/MultipleClickHandler";
import tx_icon from "../../assets/tx_icon.png";

import {fetchUser} from "../../helpers/helpers";

export default class UsersProfile extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: reduxGetter.getName(navigation.getParam('userId')),
      headerBackTitle: null,
      headerBackImage: <BackArrow />
    };
  };

  constructor(props) {
    super(props);
    this.userId = this.props.navigation.getParam('userId');
  }

  navigateToTransactionScreen = () => {
    if (CurrentUser.checkActiveUser() && CurrentUser.isUserActivated()) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.userId,
        requestAcknowledgeDelegate: this.fetchUser
      });
    }
  };

  fetchUser = () => {
    fetchUser( this.userId );
  }

  _headerComponent(){
    return (
        <UserInfo userId={this.userId} />
    )
  }

  _subHeader(){
    return ( <Text style={{textAlign: 'center', borderColor: 'rgb(218, 223, 220)', borderWidth: 1,color: '#2a293b',
                            fontSize: 18,
                            fontFamily: 'AvenirNext-Regular',
                            paddingVertical: 10,
                            marginTop: 30}}>Updates</Text> ) ; 
  }

  render() {
    return (
      <React.Fragment>
        <UserProfileFlatList listHeaderComponent = {this._headerComponent()}
                             listHeaderSubComponent={this._subHeader()}
                             userId={this.userId}
        />
        <TouchableOpacity
          pointerEvents={'auto'}
          onPress={multipleClickHandler(() => this.navigateToTransactionScreen())}
          style={{position: 'absolute', right: 20, bottom: 30}}
        >
          <Image style={{ height: 57, width: 57 }} source={tx_icon} />
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}
