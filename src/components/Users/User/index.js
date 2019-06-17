import React from 'react';
import { View, Text, Image } from 'react-native';

import styles from './styles';
import isEmpty from 'lodash/isEmpty';

export default Users = React.memo((props) => {
  if (!isEmpty(props.user)) {
    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <View style={styles.txtWrapper}>
            <Image style={styles.imageStyleSkipFont}></Image>
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
