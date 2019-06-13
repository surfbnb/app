import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar , Alert} from 'react-native';
import utilities from "../../services/Utilities";
import errorMessages from "../../constants/ErrorMessages";
import styles from './styles';
import currentUserModal from "../../models/CurrentUser";


export default class AuthLoading extends Component {
  constructor() {
    super();
    this.init();
  }

  // Fetch the token from storage then navigate to our appropriate place
  init = async () => {
    currentUserModal.getUser()
    .then(( user) => {
      if( !user ){
        this.props.navigation.navigate('AuthScreen');
        return ; 
      }
      if(!utilities.isActiveUser( user )){
        this.props.navigation.navigate('SetPinScreen');
      }else{
        this.props.navigation.navigate('HomeScreen');
      }
    })
    .catch(() => {
      Alert.alert("" , errorMessages.general_error);
    });
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}
