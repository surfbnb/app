import React, { PureComponent } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import deepGet from 'lodash/get';

import inlineStyles from './styles';
import { withNavigation } from 'react-navigation';
import tx_icon from '../../assets/tx_icon.png';
import pepo_tx_icon from '../../assets/pepo-tx-icon.png';
import currentUserModel from '../../models/CurrentUser';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import supportersIcon from "../../assets/supporters-icon.png";
import Pricer from '../../services/Pricer';
import PriceOracle from '../../services/PriceOracle';

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

  excequteTransaction = (e) =>{
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
          <View>
            <TouchableOpacity style={inlineStyles.pepoElemBtn} pointerEvents={'auto'}>
              <Image style={{ height: 19, width: 19 }} source={pepo_tx_icon} />
            </TouchableOpacity>
          </View>
          {this.props.totalBt && (
            <Text style={inlineStyles.pepoTxCount}>{PriceOracle.fromDecimal(this.props.totalBt, getDecimal())}</Text>
          )}
          <TouchableOpacity pointerEvents={'auto'} onPress={this.navigateToTransaction} style={inlineStyles.txElem}>
            <Image style={{ height: 57, width: 57 }} source={tx_icon} />
          </TouchableOpacity>
        </View>

        <TouchableWithoutFeedback onPress={this.navigateToUserProfile} pointerEvents={'auto'}>
          <View style={inlineStyles.bottomBg}>
            <View style={{ flex: 0.7, flexWrap: 'wrap' }}>
              <Text style={[{ marginBottom: 5 }, inlineStyles.bottomBgTxt]}>{`@${this.props.userName}`}</Text>
              {this.props.bio && (
                <Text style={[{ paddingRight: 20, fontSize: 13 }, inlineStyles.bottomBgTxt]}>{this.props.bio}</Text>
              )}
            </View>
            <View style={{flex: 0.3}}>
            {this.props.totalBt && 
              <Text style={[{marginBottom: 5}, inlineStyles.bottomBgTxt]}>${`${ PriceOracle.fromDecimal( this.props.totalBt , getDecimal())} Raised`}</Text> }
            {this.props.supporters && <Text style={inlineStyles.bottomBgTxt}>
              <Image source={supportersIcon} style={{width: 9, height: 8, marginRight: 3}} />
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
