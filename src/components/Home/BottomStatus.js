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
            <View style={{ flex: 0.7 }}>
              <Text style={[{ marginBottom: 5 }, inlineStyles.bottomBgTxt]}>{`@${this.props.userName}`}</Text>
              {this.props.bio && (
                <Text style={[{ paddingRight: 20, fontSize: 13, flexWrap: 'wrap', flex: 1 }, inlineStyles.bottomBgTxt]} ellipsizeMode={'tail'} numberOfLines={3}>{this.props.bio}</Text>
              )}
            </View>
            <View style={{flex: 0.3}}>
            {this.props.totalBt && 
              <Text style={[{marginBottom: 5}, inlineStyles.bottomBgTxt]}>${`${ PriceOracle.fromDecimal( this.props.totalBt , getDecimal())} Raised`}</Text> }
            {this.props.supporters && <Text style={inlineStyles.bottomBgTxt}>
              <Image source={supportersIcon} style={{width: 9, height: 9, marginRight: 3}} />
              {`${this.props.supporters} Supporters`}
              </Text>}
          </View>
          </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default withNavigation(BottomStatus);
