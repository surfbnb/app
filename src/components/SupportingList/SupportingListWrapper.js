import React, { PureComponent } from 'react';
import SupportingList from './index';
import BackArrow from "../CommonComponents/BackArrow";

class SupportingWrapper extends PureComponent {
  
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Supporting',
      headerBackTitle: null,
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
