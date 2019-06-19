import React from 'react';
import { View, Text, Image } from 'react-native';

import styles from './styles';
import isEmpty from 'lodash/isEmpty';
import default_user_icon from '../../../assets/default_user_icon.png';
import appConfig from "../../../constants/AppConfig";

const isActivated = function ( user ){
  let userStatus = user && user["ost_status"] || "";
  userStatus = userStatus.toLowerCase(); 
  return userStatus == appConfig.userStatusMap.activated;
}

export default Users = React.memo((props) => {
  if (!isEmpty(props.user) && isActivated( props.user ) ) {
    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <View style={styles.txtWrapper}>
            <Image style={styles.imageStyleSkipFont} source={default_user_icon}></Image>
            <Text numberOfLines={1} style={styles.item}>
              {props.user.first_name} {props.user.last_name}
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    return <View></View>;
  }
});
