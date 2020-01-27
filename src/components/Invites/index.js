import React, { Component } from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import Colors from '../../theme/styles/Colors';
import BackArrow from '../CommonComponents/BackArrow';
import InvitesList from './InvitesList';
import CommonStyle from "../../theme/styles/Common";

class Invites extends Component {
  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      headerTitle: 'Accepted Invites',
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
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
    this.state = {
      noResultsFound: false
    };
  }

  onRefresh = (result) => {
    let noResultsFound = result && result.length === 0;
    this.setState({
      noResultsFound
    });
  };

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={CommonStyle.viewContainer}>
        <InvitesList
          fetchUrl={`/invites`}
          onRefresh={this.onRefresh}
          noResultsFound={this.state.noResultsFound}
        />
      </SafeAreaView>
    );
  }
}

export default Invites;
