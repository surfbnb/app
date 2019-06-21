import React, { Component } from 'react';
import { Image } from 'react-native';
import FeedList from '../FeedComponents/FeedList';
import BackArrow from '../../assets/back-arrow.png';

class UserFeedScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: navigation.getParam('headerText'),
      headerBackTitle: null,
      headerBackImage: (
        <View style={{ paddingRight: 30, paddingVertical: 30 }}>
          <Image source={BackArrow} style={{ width: 10, height: 18, paddingLeft: 8 }} />
        </View>
      )
    };
  };

  constructor(props) {
    super(props);
    const userId = this.props.navigation && this.props.navigation.getParam('userId');
    if (!userId) return;
    this.fetchUrl = `/users/${userId}/feeds`;
  }

  render() {
    return <FeedList style={{ backgroundColor: '#f6f6f6', flex: 1 }} fetchUrl={this.fetchUrl}></FeedList>;
  }
}

export default UserFeedScreen;
