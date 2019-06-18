import React from 'react';
import { View, Text, Image } from 'react-native';

import styles from './styles';
import isEmpty from 'lodash/isEmpty';
import default_user_icon from '../../../assets/default_user_icon.png';

export default Users = React.memo((props) => {
  if (!isEmpty(props.user)) {
    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <View style={styles.txtWrapper}>
            <Image style={styles.imageStyleSkipFont} source={default_user_icon}></Image>
            <Text numberOfLines={1} style={styles.item}>
              {props.user.first_name} {props.user.last_name}
            </Text>
          </View>
          {/*<View style={styles.btnWrapper}>*/}
          {/*<TouchableButton*/}
          {/*TouchableStyles={[Theme.Button.btnSecondary, styles.expressBtn]}*/}
          {/*TextStyles={[Theme.Button.btnSecondaryText]}*/}
          {/*text="Express"*/}
          {/*onPress={() => {}}*/}
          {/*/>*/}
          {/*<TouchableButton*/}
          {/*TouchableStyles={[Theme.Button.btnSecondary, styles.sendBtn]}*/}
          {/*TextStyles={[Theme.Button.btnSecondaryText]}*/}
          {/*text="Send"*/}
          {/*onPress={() => {}}*/}
          {/*/>*/}
          {/*</View>*/}
        </View>
      </View>
    );
  } else {
    return <View></View>;
  }
});
