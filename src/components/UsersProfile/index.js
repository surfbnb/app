import React, { Component } from 'react';
import { Text, TouchableOpacity, Image, View } from 'react-native';

import reduxGetter from '../../services/ReduxGetters';
import BackArrow from '../CommonComponents/BackArrow';

import UserInfo from '../../components/CommonComponents/UserInfo';
import CurrentUser from '../../models/CurrentUser';
import UserProfileFlatList from '../../components/CommonComponents/UserProfileFlatList';
import multipleClickHandler from '../../services/MultipleClickHandler';
import p_tx_img from '../../assets/p_tx_icon.png';
import user_not_exist from '../../assets/user-not-exist.png';


import { fetchUser } from '../../helpers/helpers';
import utilities from '../../services/Utilities';
import inlineStyles from './styles';
import UserProfileActionSheet from './userProfileActionSheet';
import CommonStyle from "../../theme/styles/Common";

import EventEmitter from "eventemitter3";
const userActionEvents = new EventEmitter();

export default class UsersProfile extends Component {
  static navigationOptions = ({ navigation }) => {
    const name = navigation.getParam('headerTitle') || reduxGetter.getName(navigation.getParam('userId'));
    return {
      title: name,
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: '#ffffff',
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerTitleStyle: {
        fontFamily: 'AvenirNext-Medium'
      },
      headerBackImage: <BackArrow />,
      headerRight: <UserProfileActionSheet userId={navigation.getParam('userId')} userActionEvents={userActionEvents}  />
    };
  };

  constructor(props) {
    super(props);
    this.userId = this.props.navigation.getParam('userId');
    this.state = {
      isDeleted : reduxGetter.isUserInactive(this.userId)
    }
    this.listRef = null;
  }

  componentDidMount(){
    userActionEvents.on("onBlockUnblockAction" ,  ( params ) => {
      this.listRef && this.listRef.refresh();
    });
  }

  componentWillUnmount(){
    this.onUserResponse = () => {};
    userActionEvents.removeListener('onBlockUnblockAction');
  }

  navigateToTransactionScreen = () => {
    if (utilities.checkActiveUser() && CurrentUser.isUserActivated()) {
      this.props.navigation.push('TransactionScreen', {
        toUserId: this.userId,
        requestAcknowledgeDelegate: this.fetchUser
      });
    }
  };

  fetchUser = () => {
    fetchUser(this.userId , this.onUserResponse );
  };

  onUserResponse = ( res ) => {
    if(utilities.isEntityDeleted(res)){
      this.setState({isDeleted: true});
      return
    }
    let userName = "";

    const data = res.data
      , users = data.users
      , user = users[this.userId]
    ;

    userName = user["name"];
    this.props.navigation.setParams({ headerTitle:  userName});
  }

  _headerComponent() {
    return <UserInfo userId={this.userId}  />;
  }

  render() {
    if(this.state.isDeleted){
      return (
          <View style={inlineStyles.container}>
            <Image style={inlineStyles.imgSizeSkipFont} source={user_not_exist} />
            <Text style={inlineStyles.desc}>The user you were looking for does not exist!</Text>
         </View>
      )
    }else{
      return (
        <View style={CommonStyle.viewContainer}>
          <UserProfileFlatList
            listHeaderComponent={this._headerComponent()}
            onUserFetch={this.onUserResponse}
            userId={this.userId}
            onRef={(elem) => this.listRef = elem}
          />
          <TouchableOpacity
            pointerEvents={'auto'}
            onPress={multipleClickHandler(() => this.navigateToTransactionScreen())}
            style={{ position: 'absolute', right: 20, bottom: 30 }}
          >
            <Image style={{ height: 57, width: 57 }} source={p_tx_img} />
          </TouchableOpacity>
        </View>
      );
    }
  }

}
