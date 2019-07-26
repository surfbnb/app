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
      header: null,
      headerBackTitle: null
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

  _keyExtractor = (item, index) => `id_${item}` ;

  render() {  
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback onPress={this.toggleScreen}>
              <View
                style={[
                  styles.button, {borderRightColor: 'rgba(72, 72, 72, 0.1)', borderRightWidth: 1},
                  this.state.activeIndex == SUPPORTING_INDEX ? { borderBottomColor: '#ef5869', borderBottomWidth: 1, marginBottom: -11, color: '#ef5869', borderRightColor: 'transparent' } : {}
                ]}
              >
                <Text style={[this.state.activeIndex == SUPPORTING_INDEX && {color: '#ef5869'} ]}>Supporting </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.toggleScreen}>
              <View
                style={[
                  styles.button, {borderLeftColor: 'rgba(72, 72, 72, 0.1)', borderLeftWidth: 1},
                  this.state.activeIndex == SUPPORTER_INDEX ? { borderBottomColor: '#ef5869', borderBottomWidth: 1, marginBottom: -11, color: '#ef5869', borderLeftColor: 'transparent' } : {}
                ]}
              >
                <Text style={[this.state.activeIndex == SUPPORTER_INDEX && { color: '#ef5869'} ]}>Supporters</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <FlatList
            ref={(list) => (this.userFlatList = list)}
            style={{ width: '100%', flex: 1, flexDirection: 'row' }}
            horizontal={true}
            pagingEnabled={true}
            data={[0, 1]}
            viewabilityConfig={{itemVisiblePercentThreshold: 70}}
            onViewableItemsChanged={this.toggleScreen}
            keyExtractor={this._keyExtractor}
            renderItem={({ item, index }) => this.showInnerComponent(index)}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default Users;
