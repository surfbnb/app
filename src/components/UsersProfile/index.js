import React, { Component } from 'react';
import { Text } from 'react-native';
import reduxGetter from '../../services/ReduxGetters';
import BackArrow from '../CommonComponents/BackArrow';

import UserInfo from '../../components/CommonComponents/UserInfo';
import CurrentUser from '../../models/CurrentUser';
import UserProfileFlatList from "../../components/CommonComponents/UserProfileFlatList";

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
    //TODO implement 
    if (CurrentUser.checkActiveUser() && CurrentUser.isUserActivated()) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.userId,
        requestAcknowledgeDelegate: this.fetchUser
      });
    }
  };

  _headerComponent(){
    return (
      <React.Fragment>
        <UserInfo userId={this.userId} />
        <Text style={{textAlign: 'center',
                      borderColor: 'rgb(218, 223, 220)',
                      borderWidth: 1,
                      color: '#2a293b',
                      fontSize: 18,
                      fontFamily: 'AvenirNext-Regular',
                      paddingVertical: 10,
                      marginTop: 30}}>Updates</Text>
      </React.Fragment>
    )
  }

  render() {
    return (
      <UserProfileFlatList listHeaderComponent = {this._headerComponent()}
                           userId={this.userId} 
      />
    );
  }
}
