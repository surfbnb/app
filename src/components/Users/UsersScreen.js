import React, { Component } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, SafeAreaView, Dimensions, Animated } from 'react-native';
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
      activeIndex: SUPPORTING_INDEX,
      animatedMargin: new Animated.Value(0)
    };
  }

  toggleScreen = () => {
    let newActiveIndex = 1 - this.state.activeIndex;
    this.setState({ activeIndex: newActiveIndex });
    this.userFlatList.scrollToIndex({ index: newActiveIndex });
  };

  goToScreenSupporters = () => {    
    if (this.state.activeIndex == SUPPORTER_INDEX ) return;
    this.setState({ activeIndex: SUPPORTER_INDEX });
    this.userFlatList.scrollToIndex({ index: SUPPORTER_INDEX });
  }

  goToScreenSupporting = () => {    
    if (this.state.activeIndex == SUPPORTING_INDEX ) return;
    this.setState({ activeIndex: SUPPORTING_INDEX });
    this.userFlatList.scrollToIndex({ index: SUPPORTING_INDEX });

  }

  showInnerComponent = (index) => {
    if (index == SUPPORTING_INDEX) {
      return (
        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
          <SupportingList fetchUrl={'/users/contribution-to'} />
        </View>
      );
    } else if (index == SUPPORTER_INDEX) {
      return (
        <View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, marginBottom: 100 }}>
          <SupportersList fetchUrl={'/users/contribution-by'} />
        </View>
      );
    }
  };

  flScrolled = (scrollEvent) => {
    let nativeEvent = scrollEvent.nativeEvent;
    Animated.timing(this.state.animatedMargin, { toValue: nativeEvent.contentOffset.x / 2, duration: 0.1 }).start();
    if (Dimensions.get('window').width == nativeEvent.contentOffset.x) {
      this.setState({ activeIndex: SUPPORTER_INDEX });
      this.userFlatList.scrollToIndex({ index: SUPPORTER_INDEX });
    } else if (nativeEvent.contentOffset.x == 0) {
      this.setState({ activeIndex: SUPPORTING_INDEX });
      this.userFlatList.scrollToIndex({ index: SUPPORTING_INDEX });
    }
  };

  _keyExtractor = (item, index) => `id_${item}`;

  renderItem = (itemInfo) => {
    return this.showInnerComponent(itemInfo.index);
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.buttonContainer}>
            <TouchableWithoutFeedback onPress={this.goToScreenSupporting}>
              <View
                style={[
                  styles.button,
                  { borderRightColor: 'rgba(72, 72, 72, 0.1)', borderRightWidth: 1 },
                  this.state.activeIndex == SUPPORTING_INDEX ? { color: '#ef5869' } : {}
                ]}
              >
                <Text style={[this.state.activeIndex == SUPPORTING_INDEX && { color: '#ef5869' }]}> Supporting </Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.goToScreenSupporters}>
              <View
                style={[
                  styles.button,
                  { borderLeftColor: 'rgba(72, 72, 72, 0.1)', borderLeftWidth: 1 },
                  this.state.activeIndex == SUPPORTER_INDEX ? { color: '#ef5869' } : {}
                ]}
              >
                <Text style={[this.state.activeIndex == SUPPORTER_INDEX && { color: '#ef5869' }]}>Supporters</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <Animated.View style={[styles.bottomSliderStyle, { marginLeft: this.state.animatedMargin }]}></Animated.View>

          <FlatList
            ref={(list) => (this.userFlatList = list)}
            style={{ width: '100%', flex: 1, flexDirection: 'row' }}
            horizontal={true}
            pagingEnabled={true}
            data={[0, 1]}
            viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
            onViewableItemsChanged={this.toggleScreen}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
            onScroll={this.flScrolled}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default Users;
