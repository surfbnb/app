import React, { Component } from 'react';
import { Image, View, Platform } from 'react-native';
import FeedList from '../FeedComponents/FeedList';
import BackArrow from '../../assets/back-arrow.png';

class UserFeedScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: navigation.getParam('headerText'),
      headerBackTitle: null,
      headerBackImage: (
        <View style={{ paddingRight: 30, paddingVertical: 30, paddingLeft: Platform.OS === 'ios' ? 20 : 0 }}>
          <Image source={BackArrow} style={{ width: 10, height: 18, paddingLeft: 8 }} />
        </View>
      )
    };
  };

  constructor(props) {
    super(props);
    this.userId = this.props.navigation && this.props.navigation.getParam('userId');
    if (!this.userId) return;
    this.fetchUrl = `/users/${this.userId}/feeds`;
  }

  render() {
    return (
      <FeedList
        userId={this.userId}
        style={{ backgroundColor: '#f6f6f6', flex: 1 }}
        navigation={this.props.navigation}
        fetchUrl={this.fetchUrl}
      ></FeedList>
    );
  }
}

export default UserFeedScreen;
