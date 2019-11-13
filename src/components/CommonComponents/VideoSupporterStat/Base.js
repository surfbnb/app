import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { withNavigation } from 'react-navigation';

import pricer from '../../../services/Pricer';
import inlineStyles from '../../Home/styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import multipleClickHandler from '../../../services/MultipleClickHandler';
import Utilities from "../../../services/Utilities";
import CurrentUser from '../../../models/CurrentUser';

class VideoSupporterStat extends PureComponent {
  constructor(props) {
    super(props);
  }

  btToFiat(btAmount) {
    const priceOracle = pricer.getPriceOracle();
    btAmount = priceOracle.fromDecimal(btAmount);
    return (priceOracle && priceOracle.btToFiat(btAmount, 2)) || 0;
  }

  navigateToUserProfile = () => {
    if (Utilities.checkActiveUser()) {
        if (this.props.userId == CurrentUser.getUserId()) {
            this.props.navigation.navigate('ProfileScreen');
        } else {
            this.props.navigation.push('UsersProfileScreen', { userId: this.props.userId });
        }
    }
  };

  render() {
    return (
        <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.navigateToUserProfile())} pointerEvents={'auto'}>
      <View style={[inlineStyles.raisedSupported]}>
        {/*{*/}
        {/*<View*/}
        {/*ellipsizeMode={'tail'}*/}
        {/*numberOfLines={1}*/}
        {/*>*/}
        {/*<Text*/}
        {/*style={[inlineStyles.raisedSupportedTxt]}*/}
        {/*ellipsizeMode={'tail'}*/}
        {/*numberOfLines={1}*/}
        {/*>${`${ pricer.toDisplayAmount(this.btToFiat(this.props.totalBt))}`}{' '}<Text style={{letterSpacing: 0.8, fontFamily: 'AvenirNext-Regular', fontSize: 13}}>RAISED</Text></Text>*/}
        {/*</View>*/}
        {/*}*/}
        {
          <View ellipsizeMode={'tail'} numberOfLines={1}>
            <Text style={[inlineStyles.raisedSupportedTxt]} ellipsizeMode={'tail'} numberOfLines={1}>
              {this.props.supporters || 0} <Text style={{ letterSpacing: 1.0, fontSize: 13 }}>
                {Utilities.getSingularPluralText(this.props.supporters , "Supporter")}
              </Text>
            </Text>
          </View>
        }
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigation(VideoSupporterStat);
