import React, { PureComponent } from 'react';
import BackArrow from "../CommonComponents/BackArrow";
import Colors from "../../theme/styles/Colors";
import SupportingList from './SupportingListComponent';

class SupportingListScreen extends PureComponent {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Supporting',
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width:0, height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerTitleStyle: {
        fontFamily: 'AvenirNext-Medium'
      },
      headerBackImage: <BackArrow />
    };
  };

  constructor(props) {
    super(props);
    this.userId = this.props.navigation.getParam('userId') ;
    this.fetchUrl = `/users/${this.userId}/contribution-to`;
  }

  render() {
    return (
        <SupportingList fetchUrl={this.fetchUrl} userId ={this.userId} />
    );
  }
}

export default SupportingListScreen;
