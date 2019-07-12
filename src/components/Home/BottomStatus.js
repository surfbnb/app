import React, { PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import deepGet from 'lodash/get';

import inlineStyles from './styles';
import { withNavigation } from 'react-navigation';
import tx_icon from '../../assets/tx_icon.png';
import currentUserModel from '../../models/CurrentUser';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import supportersIcon from "../../assets/supporters-icon-1.png";
import Pricer from '../../services/Pricer';
import PriceOracle from '../../services/PriceOracle';
import PepoButton from "./PepoButton";

const getDecimal = () => deepGet(Pricer, 'token.decimals');

class BottomStatus extends PureComponent {
  constructor(props) {
    super(props);
  }

  navigateToTransaction = (e) => {
    if (currentUserModel.checkActiveUser() && currentUserModel.isUserActivated(true)) {
      this.props.navigation.push('TransactionScreen');
    }
  };

  excequteTransaction = ( btAmount ) =>{
    if (currentUserModel.checkActiveUser() && currentUserModel.isUserActivated(true)) {
      Alert.alert('', 'Execute transactions');
    }
  }

  navigateToUserProfile = (e) => {
    Alert.alert('', 'Navigate to Userprofile page once profile page implemented');
  };

  render() {
    console.log('Bottom status rerender');
    return (
      <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
        <View style={inlineStyles.touchablesBtns}>
          <PepoButton totalBt={PriceOracle.fromDecimal(this.props.totalBt, getDecimal())} 
                      excequteTransaction={this.excequteTransaction} />
          <TouchableOpacity pointerEvents={'auto'} onPress={this.navigateToTransaction} style={inlineStyles.txElem}>
            <Image style={{ height: 57, width: 57 }} source={tx_icon} />
          </TouchableOpacity>
        </View>

        <TouchableWithoutFeedback onPress={this.navigateToUserProfile} pointerEvents={'auto'}>
          <View style={inlineStyles.bottomBg}>
            <View style={{ flex: 0.7}}>
              <Text style={[{ marginBottom: 5 }, inlineStyles.bottomBgTxt]}>{`@${this.props.userName}`}</Text>
              {this.props.bio && (
                <Text style={[{ paddingRight: 20, fontSize: 13, flexWrap: 'wrap' }, inlineStyles.bottomBgTxt]} ellipsizeMode={'tail'} numberOfLines={3}>{this.props.bio}</Text>
              )}
            </View>
            <View style={{flex: 0.3}}>
            {
              this.props.totalBt &&
              <View style={{marginBottom: 5, flexDirection: 'row', alignItems: 'center' }} ellipsizeMode={'tail'} numberOfLines={1}>
                <Text style={[{width: 12, textAlign: 'center', marginRight: 3}, inlineStyles.bottomBgTxt]}>$</Text>
                <Text style={[inlineStyles.bottomBgTxt, {flex: 1}]} ellipsizeMode={'tail'} numberOfLines={1}>{`${ PriceOracle.fromDecimal( this.props.totalBt , getDecimal())}K Raised`}</Text>
              </View>
            }
            {
              this.props.supporters &&
              <View style={[inlineStyles.bottomBgTxt, {flexDirection: 'row', alignItems: 'center'}]} >
                <Image source={supportersIcon} style={{width: 12, height: 10, marginRight: 3}} />
                <Text style={[inlineStyles.bottomBgTxt, {flex: 1}]} ellipsizeMode={'tail'} numberOfLines={1}>{`${this.props.supporters}K Supporters`}</Text>
              </View>}
          </View>
          </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default withNavigation(BottomStatus);
