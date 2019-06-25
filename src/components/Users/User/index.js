import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Toast } from 'native-base';
import currentUserModel from '../../../models/CurrentUser';
import styles from './styles';
import isEmpty from 'lodash/isEmpty';
import default_user_icon from '../../../assets/default_user_icon.png';
import appConfig from '../../../constants/AppConfig';
import Store from '../../../store';
import { ostErrors } from '../../../services/OstErrors';

const isActivated = function(user) {
  let userStatus = (user && user['ost_status']) || '';
  userStatus = userStatus.toLowerCase();
  return userStatus == appConfig.userStatusMap.activated;
};

const userClick = function(item, navigation) {
  let headerText = 'Transaction';
  if (item) {
    headerText = `${item.first_name} ${item.last_name}`;
  }
  if (!currentUserModel.isUserActivated()) {
    Toast.show({
      text: ostErrors.getUIErrorMessage('user_not_active'),
      buttonText: 'Okay'
    });
    return;
  }
  navigation.navigate('TransactionScreen', { transactionHeader: headerText, toUser: item });
};

const getUser = function(id) {
  return Store.getState().user_entities[`id_${id}`] || {};
};

const Users = (props) => {
  let user = getUser(props.id);

  if (!isEmpty(user) && isActivated(user)) {
    return (
      <TouchableOpacity
        onPress={() => {
          userClick(user, props.navigation);
        }}
      >
        <View style={styles.container}>
          <View style={styles.userContainer}>
            <View style={styles.txtWrapper}>
              <Image style={styles.imageStyleSkipFont} source={default_user_icon}></Image>
              <Text numberOfLines={1} style={styles.item}>
                {user.first_name} {user.last_name}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  } else {
    return <View></View>;
  }
};

export default withNavigation(Users);
