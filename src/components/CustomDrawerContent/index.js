import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Text, View } from 'react-native';
import CurrentUser from '../../models/CurrentUser';
import reduxGetter from '../../services/ReduxGetters';
import PepoApi from '../../services/PepoApi';
import Colors from '../../theme/styles/Colors';

function twitterDisconnect() {
  new PepoApi('/auth/twitter-disconnect')
    .post()
    .catch((error) => {
      alert('Twitter Disconnect failed', error);
    })
    .then((res) => {
      console.log('Twitter disconnect', res);
      if (res && res.success) {
        CurrentUser.logout();
      } else {
        alert('Twitter Disconnect failed', res);
      }
    });
}

export default CustomDrawerContent = (props) => (
  <ScrollView style={styles.container}>
    <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
      <View
        style={{
          paddingVertical: 11,
          borderBottomColor: Colors.seaMist,
          borderBottomWidth: 1
        }}
      >
        <Text style={styles.headerText}>{reduxGetter.getName(CurrentUser.getUserId())}</Text>
      </View>
      {/* <TouchableOpacity onPress={twitterDisconnect}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: Colors.seaMist,
            borderBottomWidth: 1,
            paddingVertical: 20
          }}
        >
          <View style={styles.itemIcon}></View>
          <Text style={styles.item}>Twitter Disconnect</Text>
        </View>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={CurrentUser.logout.bind(CurrentUser)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: Colors.seaMist,
            borderBottomWidth: 1,
            paddingVertical: 20
          }}
        >
          <View style={styles.itemIcon}></View>
          <Text style={styles.item}>Logout</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.seaMist
  },
  headerText: {
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center'
  },
  item: {
    fontSize: 17
  },
  itemIcon: {
    backgroundColor: Colors.primary,
    opacity: 0.5,
    borderRadius: 15,
    width: 30,
    height: 30,
    marginHorizontal: 10
  }
});
