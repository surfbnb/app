import React, { Component } from 'react';
import { View, Text } from 'react-native';

import styles from './styles';
import TouchableButton from '../../../theme/components/TouchableButton';
import Theme from '../../../theme/styles';

class Users extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  render() {
    return (
      <View styel={styles.container}>
        <Text style={styles.item}>
          {this.props.user.first_name} {this.props.user.last_name}
        </Text>
        <View>
          <TouchableButton
            TouchableStyles={[Theme.Button.btnSecondary]}
            TextStyles={[Theme.Button.btnSecondaryText]}
            text="Express"
            onPress={() => {}}
          />
          <TouchableButton
            TouchableStyles={[Theme.Button.btnSecondary]}
            TextStyles={[Theme.Button.btnSecondaryText]}
            text="Send"
            onPress={() => {}}
          />
        </View>
      </View>
    );
  }
}

export default Users;
