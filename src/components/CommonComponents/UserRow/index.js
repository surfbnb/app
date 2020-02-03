import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import reduxGetter from '../../../services/ReduxGetters';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import styles from './styles';
import ProfilePicture from '../../ProfilePicture';
import multipleClickHandler from '../../../services/MultipleClickHandler';
import CurrentUser from '../../../models/CurrentUser';

const userClick = function(userId, navigation) {
  if( userId == CurrentUser.getUserId() ){
    navigation.navigate('ProfileScreen');
  }else{
    navigation.push('UsersProfileScreen', { userId: userId });
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    name: reduxGetter.getName(ownProps.userId, state) || "",
    userName: reduxGetter.getUserName(ownProps.userId, state)  ||"" 
  };
}

const UserRow = (props) => {
  {
    return (
      <TouchableOpacity
        onPress={multipleClickHandler(() => {
          userClick(props.userId, props.navigation);
        })}
        activeOpacity={0.8}
      >
        <View style={styles.txtWrapper}>
          <ProfilePicture userId={props.userId} />
          {props.children}
        </View>
      </TouchableOpacity>
    );
  }
};

export default connect(mapStateToProps)(withNavigation(UserRow));
