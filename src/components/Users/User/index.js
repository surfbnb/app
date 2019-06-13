import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import styles from './styles';
// import TouchableButton from '../../../theme/components/TouchableButton';
// import Theme from '../../../theme/styles';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <View style={styles.txtWrapper}>
            <Image style={styles.imageStyle}></Image>
            <Text style={styles.item}>
              {this.props.user.first_name} {this.props.user.last_name}
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
  }
}

export default Users;
