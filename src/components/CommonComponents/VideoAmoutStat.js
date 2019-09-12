import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import reduxGetter from '../../services/ReduxGetters';

import pricer from '../../services/Pricer';

import inlineStyles from '../Home/styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import multipleClickHandler from '../../services/MultipleClickHandler';


const mapStateToProps = (state, ownProps) => {  
  return {
    supporters: ownProps.pageName == 'feed' ? reduxGetter.getUserSupporters(ownProps.userId, state): reduxGetter.getVideoSupporters(ownProps.videoId, state),
    totalBt: reduxGetter.getVideoBt(ownProps.videoId, state)
  };
};

class VideoAmountStat extends PureComponent {
  constructor(props) {
    super(props);
  }

  btToFiat(btAmount) {
    const priceOracle = pricer.getPriceOracle();
    btAmount = priceOracle.fromDecimal(btAmount);
    return (priceOracle && priceOracle.btToFiat(btAmount, 2)) || 0;
  }

    onWrapperClick = (e) => {
        this.props.onWrapperClick && this.props.onWrapperClick();
    };

  render() {
    return (
        <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.onWrapperClick())} pointerEvents={'auto'}>
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
              {this.props.supporters || 0} <Text style={{ letterSpacing: 0.8, fontSize: 13 }}>FANS</Text>
            </Text>
          </View>
        }
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(mapStateToProps)(VideoAmountStat);
