import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import styles from './styles';
import Theme from "../../theme/styles";
import FormInput from "../../theme/components/FormInput";

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log('search screen');
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <FormInput
            editable={true}
            placeholder="Search People / Usernames"
            fieldName="search"
            style={[Theme.TextInput.textInputStyle, {borderWidth: 0, backgroundColor: 'rgba(204, 211, 205, 0.2)'}]}
            returnKeyType="done"
            returnKeyLabel="Done"
            blurOnSubmit={true}
            placeholderTextColor="rgba(42, 41, 59, 0.4)"
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default SearchScreen;
