import React, { Component } from 'react';
import { Text, SafeAreaView } from 'react-native';

import styles from './styles';
import Colors from '../../theme/styles/Colors';
import BackArrow from '../CommonComponents/BackArrow';
import InvitesList from './InvitesList';
import CurrentUser from '../../models/CurrentUser';

class Invites extends Component {
  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      headerTitle: 'Invites and Earnings',
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
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
        <Text style={styles.header}>Accepted Invites</Text>
        <InvitesList
          fetchUrl={`/users/invites`}
          onRefresh={this.onRefresh}
          noResultsFound={this.state.noResultsFound}
        />
      </SafeAreaView>
    );
  }
}

export default Invites;
