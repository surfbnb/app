import React, { Component } from 'react';
import UserList from './UserList';
import { View, Text, FlatList, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import styles from './styles';
import SupportingList from '../SupportingList';
import SupportersList from '../SupportersList';

const SUPPORTING_INDEX = 0;
const SUPPORTER_INDEX = 1;

class Users extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null
    };
  };
  constructor(props) {
    super(props);
    this.props.navigation.tab = 'Users';
    this.state = {      
      activeIndex: SUPPORTING_INDEX
    };
  }


  toggleScreen = () => {
    let newActiveIndex =  1 - this.state.activeIndex;
    this.setState({ activeIndex : newActiveIndex });
    this.userFlatList.scrollToIndex({ index: newActiveIndex });
 }

  showInnerComponent = (index) => {
    if (index == SUPPORTING_INDEX) {
      return (        
        <SupportingList fetchUrl={'/users/contribution-to'} />      
      );
    } else if (index == SUPPORTER_INDEX) {
      return (
        <SupportersList fetchUrl={'/users/contribution-by'} />
      );
    }
  };

  render() {  
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback onPress={this.toggleScreen}>
              <View
                style={[
                  styles.button,
                  this.state.activeIndex == SUPPORTING_INDEX ? { borderBottomColor: 'red', borderBottomWidth: 2 } : {}
                ]}
              >
                <Text style={{ alignSelf: 'center' }}>Supporting </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.toggleScreen}>
              <View
                style={[
                  styles.button,
                  this.state.activeIndex == SUPPORTER_INDEX ? { borderBottomColor: 'red', borderBottomWidth: 2 } : {}
                ]}
              >
                <Text style={{ textAlign: 'center' }}> Supporters </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <FlatList
            ref={(list) => (this.userFlatList = list)}
            style={{ width: '100%', flex: 1, flexDirection: 'row' }}
            horizontal={true}
            pagingEnabled={true}
            data={[0, 0]}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 70
            }}
            onViewableItemsChanged={this.toggleScreen}
            renderItem={({ item, index }) => this.showInnerComponent(index)}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default Users;
