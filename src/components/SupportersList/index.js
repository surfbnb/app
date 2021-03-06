import React, { PureComponent } from 'react';
import SupportersList from './SupportersListComponent';
import BackArrow from "../CommonComponents/BackArrow";
import Colors from "../../theme/styles/Colors";

class SupportersListScreen extends PureComponent {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Supporters',
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
    this.fetchUrl = `/users/${this.userId}/contribution-by`;
  }

  render() {
    return (
        <SupportersList fetchUrl={this.fetchUrl} userId={this.userId}/>
    );
  }
}

export default SupportersListScreen;
