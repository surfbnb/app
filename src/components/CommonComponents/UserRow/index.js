import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
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
    >
      <View style={styles.txtWrapper}>
      <ProfilePicture userId={props.userId} />
      <View style={{ flexDirection: 'column', flex: 1, paddingLeft: 15 }}>
          <Text style={styles.titleName} numberOfLines={1} ellipsizeMode={'tail'}>
            {props.name.length > 40 ? `${props.name.substring(0, 40)}...` : props.name}
          </Text>
          <Text style={styles.titleHandle} numberOfLines={1} ellipsizeMode={'tail'}>
            {props.userName.length > 40 ? `${props.userName.substring(0, 40)}...` : props.userName}
          </Text>
          {this.props.leftLabel}
        </View>
      </View>
      </TouchableOpacity>
    );
  }
};

UserRow.defaultProps = {
  leftLabel : null 
}

export default connect(mapStateToProps)(withNavigation(UserRow));
