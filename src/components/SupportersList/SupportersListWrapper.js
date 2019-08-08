import React, { PureComponent } from 'react';
import SupportersList from './index';
import BackArrow from "../CommonComponents/BackArrow";

class SupportersListWrapper extends PureComponent {
  
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Supporters',
      headerBackTitle: null,
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

export default SupportersListWrapper;
