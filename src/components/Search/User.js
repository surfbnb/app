import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import reduxGetter from '../../services/ReduxGetters';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import styles from './styles';
import ProfilePicture from '../../components/ProfilePicture';
import multipleClickHandler from '../../services/MultipleClickHandler';
import CurrentUser from '../../models/CurrentUser';

const userClick = function(userId, navigation) {
  if( userId == CurrentUser.getUserId() ){
    navigation.navigate('ProfileScreen');
  }else{
    navigation.push('UsersProfileScreen', { userId: userId });
  }
};

const mapStateToProps = (state, ownProps) => {
  return {
    name: reduxGetter.getName(ownProps.userId, state),
    userName: reduxGetter.getUserName(ownProps.userId, state)  
  };
}
const User = (props) => {
  {
    return (
      <TouchableOpacity
      onPress={multipleClickHandler(() => {
        userClick(props.userId, props.navigation);
      })}
    >
      <View style={styles.txtWrapper}>
      <ProfilePicture userId={props.userId} />
        <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 15 }}>
          <Text style={styles.titleName} numberOfLines={1} ellipsizeMode={'tail'}>
            {props.name}
          </Text>
          <Text style={styles.titleHandle} numberOfLines={1} ellipsizeMode={'tail'}>
            {props.userName}
          </Text>
        </View>
      </View>
      </TouchableOpacity>
    );
  }
};

export default connect(mapStateToProps)(withNavigation(User));
