import React, { Component } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback , SafeAreaView , Dimensions, Animated} from 'react-native';
import ActivityList from '../ActivitiesComponents/ActivityList';
import CurrentUser from '../../models/CurrentUser';
import styles from "./styles";


const ALL = 0 ; 
const YOU = 1;

class Activities extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null,
      headerBackTitle: null
    };
  };

  constructor(props) {
    super(props);
    this.state = {      
      activeIndex: ALL,
      animatedMargin: new Animated.Value(0)
    };
  }

  flScrolled = (scrollEvent) => {
    let nativeEvent = scrollEvent.nativeEvent;
    Animated.timing(this.state.animatedMargin, { toValue: nativeEvent.contentOffset.x / 2, duration: 0.1 }).start();
    if (Dimensions.get('window').width == nativeEvent.contentOffset.x) {
      this.setState({ activeIndex: YOU });
      this.activityList.scrollToIndex({ index: YOU });
    } else if (nativeEvent.contentOffset.x == 0) {
      this.setState({ activeIndex: ALL });
      this.activityList.scrollToIndex({ index: ALL });
    }
  };

  toggleScreen = () => {    
    let newActiveIndex =  1 - this.state.activeIndex;
    this.setState({ activeIndex : newActiveIndex });
    this.activityList.scrollToIndex({ index: newActiveIndex });
 }

 _keyExtractor = (item, index) => `id_${item}` ;

  _renderItem = ({item, index}) => { 
    if (index == ALL) {
      return ( <ActivityList fetchUrl={'/activities'} style={{width: Dimensions.get('window').width}} />   );
    } else if (index == YOU) {
      return (  <ActivityList fetchUrl={`/users/${CurrentUser.getUserId()}/activities`} style={{width: Dimensions.get('window').width}} />  );
    }
  };



  render() {
    return( 
      
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback onPress={this.toggleScreen}>
              <View
                style={[
                  styles.button,
                  { borderRightColor: 'rgba(72, 72, 72, 0.1)', borderRightWidth: 1 },
                  this.state.activeIndex == ALL ? {  color: '#ef5869' } : {}
                ]}
              >
                <Text style={[this.state.activeIndex == ALL && { color: '#ef5869'} ]}>You might like</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.toggleScreen}>
              <View
                style={[
                  styles.button,
                  { borderLeftColor: 'rgba(72, 72, 72, 0.1)', borderLeftWidth: 1 },
                  this.state.activeIndex == YOU ? { color: '#ef5869'} : {}
                ]}
              >
                <Text style={[this.state.activeIndex == YOU && { color: '#ef5869'} ]}> Activity </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Animated.View style={[styles.bottomSliderStyle, { marginLeft: this.state.animatedMargin }]}></Animated.View>
          <FlatList
            ref={(list) => (this.activityList = list)}
            style={{ width: '100%', flex: 1, flexDirection: 'row' }}
            horizontal={true}
            pagingEnabled={true}
            data={[0, 1]}
            viewabilityConfig={{ itemVisiblePercentThreshold: 90 }}            
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            onScroll={this.flScrolled}     
          />
        </View>
      </SafeAreaView>

    )}
}

export default Activities;
