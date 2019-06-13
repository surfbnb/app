import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar , Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import deepGet from 'lodash/get';
import deepClone from "lodash/cloneDeep";
import isEmpty from 'lodash/isEmpty';

import PepoApi from "../../services/PepoApi"; 
import LoadingModal from "../LoadingModal";
import Store from "../../store"; 
import utilities from "../../services/Utilities";
import errorMessages from "../../constants/ErrorMessages";
import styles from './styles';
import { hideModal , showModal} from '../../reducers';


export default class AuthLoading extends Component {
  constructor() {
    super();
    this.init();
  }

  // Fetch the token from storage then navigate to our appropriate place
  init = async () => {
    let currentUser = await AsyncStorage.getItem('user') || {};
   
    if( currentUser && typeof currentUser == "string"){
      currentUser = JSON.parse(currentUser) || {};
    }

    if( isEmpty(currentUser) ){
      this.props.navigation.navigate('AuthScreen');
      return ; 
    }

    //Store.dispatch(showModal('Loading...'));
    let pepoApi = new PepoApi("/users/current");
    pepoApi.get()
    .then((res)=>{
      const resultType = deepGet(res,  "data.result_type"); 
            resUser = deepGet(res,  `data.${resultType}`); 
      const loginUser = deepClone(currentUser ,  resUser  ); 
      utilities.saveItem("user", JSON.stringify( loginUser ));
      if( !utilities.isActiveUser( loginUser ) ){
        this.props.navigation.navigate('SetPinScreen');
      }else{
        this.props.navigation.navigate('HomeScreen');
      }
      //Store.dispatch(hideModal());
    })
    .catch( (error) => {
      //Store.dispatch(hideModal());
      Alert.alert("" , errorMessages.general_error);
    });
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
        {/* <LoadingModal /> */}
      </View>
    );
  }
}
