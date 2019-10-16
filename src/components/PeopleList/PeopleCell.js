import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
// import { withNavigation } from 'react-navigation';
// import CurrentUser from '../../../models/CurrentUser';
import styles from './styles';
// import reduxGetter from '../../../services/ReduxGetters';
// import utilities from "../../../services/Utilities";
import multipleClickHandler from '../../services/MultipleClickHandler';
import ProfilePicture from '../ProfilePicture';
import reduxGetter from "../../services/ReduxGetters";
import CurrentUser from '../../models/CurrentUser';
// import PepoIcon from '../../../assets/pepo-tx-icon.png';
// import { connect } from 'react-redux';
// import Pricer from "../../../services/Pricer"
import { withNavigation } from 'react-navigation';


const userClick = function(userId, navigation) {
  if( userId == CurrentUser.getUserId() ){
    navigation.navigate('ProfileScreen');
  }else{
    navigation.push('UsersProfileScreen', { userId: userId });
  }
};

const PeopleCell = (props) => {
  let name = reduxGetter.getName(props.userId);
  let username = reduxGetter.getUserName(props.userId);
   return <TouchableOpacity
      onPress={multipleClickHandler(() => {
        userClick(props.userId, props.navigation);
      })}
    >
      <View style={styles.txtWrapper}>
        <ProfilePicture userId={props.userId} />
        <View style={{flex:1,flexDirection:'column'}}>
          <Text numberOfLines={1} style={styles.item}>
            {name.length > 40 ? `${name.substring(0, 40)}...` : name}
          </Text>
          <Text style={styles.username}>{`@${username}`}</Text>
        </View>

        {/* <View style={[styles.numericInnerWrapper]}>*/}
        {/*  <Image source={PepoIcon} style={styles.imageIconSkipFont} />*/}
        {/*  <Text style={styles.numericInfoText}>{Pricer.toDisplayAmount(props.amount)}</Text>*/}
        {/*</View>*/}
      </View>
    </TouchableOpacity>


};

export default withNavigation(PeopleCell);