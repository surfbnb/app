import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Toast } from 'native-base';
import CurrentUser from '../../../models/CurrentUser';
import styles from './styles';
import isEmpty from 'lodash/isEmpty';
import default_user_icon from '../../../assets/default_user_icon.png';
import appConfig from '../../../constants/AppConfig';
import Store from '../../../store';
import { ostErrors } from '../../../services/OstErrors';
import reduxGetter from '../../../services/ReduxGetters';
import FastImage from 'react-native-fast-image';
import Colors from '../../../theme/styles/Colors';
import multipleClickHandler from '../../../services/MultipleClickHandler';
import ProfilePicture from '../../ProfilePicture';

const isActivated = function(user) {
  let userStatus = (user && user['ost_status']) || '';
  userStatus = userStatus.toLowerCase();
  return userStatus == appConfig.userStatusMap.activated;
};

const userClick = function(item, navigation) {
  navigation.push('UsersProfileScreen', { userId: item.id });
};

const getUser = function(id) {
  return Store.getState().user_entities[`id_${id}`] || {};
};


const Users = (props) => {
  let user = getUser(props.id);
  if (!isEmpty(user) && isActivated(user)) {
    return (
      <TouchableOpacity
        onPress={multipleClickHandler(() => {
          userClick(user, props.navigation);
        })}
      >
        <View style={styles.txtWrapper}>
          <ProfilePicture userId={props.id} />
          <Text numberOfLines={1} style={styles.item}>
            {user.name.length > 40 ? `${user.name.substring(0, 40)}...` : user.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    return <React.Fragment></React.Fragment>;
  }
};

export default withNavigation(Users);
