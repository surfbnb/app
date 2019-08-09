import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import CurrentUser from '../../../models/CurrentUser';
import styles from './styles';
import reduxGetter from '../../../services/ReduxGetters';
import utilities from "../../../services/Utilities";
import multipleClickHandler from '../../../services/MultipleClickHandler';
import ProfilePicture from '../../ProfilePicture';
import PepoIcon from '../../../assets/pepo-tx-icon.png';
import { connect } from 'react-redux';
import Pricer from "../../../services/Pricer"

const userClick = function(userId, navigation) {
  if( userId == CurrentUser.getUserId() ){
    navigation.navigate('ProfileScreen');
  }else{
    navigation.push('UsersProfileScreen', { userId: userId });
  }
};


const mapStateToProps = (state, ownProps) => {
  return {
    name: reduxGetter.getName(ownProps.userId, state) ,
    isActivated : utilities.isUserActivated( reduxGetter.getUserActivationStatus(ownProps.userId) )
  };
}

const Users = (props) => {
    return props.isActivated && (
      <TouchableOpacity
        onPress={multipleClickHandler(() => {
          userClick(props.userId, props.navigation);
        })}
      >
        <View style={styles.txtWrapper}>
          <ProfilePicture userId={props.userId} />
          <Text numberOfLines={1} style={styles.item}>
            {props.name.length > 40 ? `${props.name.substring(0, 40)}...` : props.name}
          </Text>
          <View style={[styles.numericInnerWrapper]}>
              <Image source={PepoIcon} style={styles.imageIconSkipFont} />
              <Text style={styles.numericInfoText}>{Pricer.toDisplayAmount(props.amount)}</Text>
            </View>
        </View>
      </TouchableOpacity>
    )
};

export default connect(mapStateToProps)(withNavigation(Users)) ;

