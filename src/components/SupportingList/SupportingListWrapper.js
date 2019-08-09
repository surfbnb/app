import React, { PureComponent } from 'react';
import SupportingList from './index';
import BackArrow from "../CommonComponents/BackArrow";
import Colors from "../../theme/styles/Colors";

class SupportingWrapper extends PureComponent {
  
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

export default SupportingWrapper;
