import React, { Component } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback , SafeAreaView } from 'react-native';
import ActivityList from '../ActivitiesComponents/ActivityList';
import CurrentUser from '../../models/CurrentUser';
import styles from "./styles";


const ALL = 0 ; 
const YOU = 1;

class Activities extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null
    };
  };

  constructor(props) {
    super(props);
    this.state = {      
      activeIndex: ALL
    };
  }

  toggleScreen = () => {    
    let newActiveIndex =  1 - this.state.activeIndex;
    this.setState({ activeIndex : newActiveIndex });
    this.activityList.scrollToIndex({ index: newActiveIndex });
 }

 _keyExtractor = (item, index) => `id_${item}` ;

  _renderItem = ({item, index}) => { 
    if (index == ALL) {
      return ( <ActivityList fetchUrl={'/activities'} />   );
    } else if (index == YOU) {
      return (  <ActivityList fetchUrl={`/users/${CurrentUser.getUserId()}/activities`} />  );
    }
  };  

 onViewableItemsChanged = () => {
   console.log("onViewableItemsChanged========");
 }

  render() {
    return( 
      
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback onPress={this.toggleScreen}>
              <View
                style={[
                  styles.button,
                  this.state.activeIndex == ALL ? { borderBottomColor: 'red', borderBottomWidth: 2 } : {}
                ]}
              >
                <Text style={{ alignSelf: 'center' }}>You might like</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.toggleScreen}>
              <View
                style={[
                  styles.button,
                  this.state.activeIndex == YOU ? { borderBottomColor: 'red', borderBottomWidth: 2 } : {}
                ]}
              >
                <Text style={{ textAlign: 'center' }}> Activity </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <FlatList
            ref={(list) => (this.activityList = list)}
            style={{ width: '100%', flex: 1, flexDirection: 'row' }}
            horizontal={true}
            pagingEnabled={true}
            data={[0, 1]}
            viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}
            onViewableItemsChanged={this.onViewableItemsChanged}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}     
          />
        </View>
      </SafeAreaView>

    )}
}

export default Activities;
