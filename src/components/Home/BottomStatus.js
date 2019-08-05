import React, { PureComponent } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

import inlineStyles from './styles';
import { withNavigation } from 'react-navigation';
import CurrentUser from '../../models/CurrentUser';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import pricer from '../../services/Pricer';
import reduxGetter from '../../services/ReduxGetters';

import supportersIcon from '../../assets/supporters-icon-1.png';
import multipleClickHandler from '../../services/MultipleClickHandler';

const mapStateToProps = (state, ownProps) => {
  return {
    userName: reduxGetter.getUserName(ownProps.userId, state),
    name: reduxGetter.getName(ownProps.userId, state),
    bio: reduxGetter.getBio(ownProps.userId, state),
    //Temp Code 
    videoSize: reduxGetter.getVideoSize(ownProps.videoId, state ),
    videoSizeR: reduxGetter.getVideoSize(ownProps.videoId, state , "576w"),
    videoImageSize : reduxGetter.getImageSize(ownProps.videoId, state ),
    videoImageSizeR : reduxGetter.getImageSize(ownProps.videoId, state , "576w"),
    //Temp code 
    supporters: reduxGetter.getVideoSupporters( ownProps.videoId ),
    totalBt: reduxGetter.getVideoBt(ownProps.videoId , state ),
  };
};

class BottomStatus extends PureComponent {
  constructor(props) {
    super(props);
  }

  navigateToUserProfile = (e) => {
    if (CurrentUser.checkActiveUser()) {
      if (this.props.userId == CurrentUser.getUserId()) {
        this.props.navigation.navigate('Profile');
      } else {
        this.props.navigation.push('UsersProfileScreen', { userId: this.props.userId });
      }
    }
  };

  btToFiat(btAmount) {
    const priceOracle = pricer.getPriceOracle();
    btAmount = priceOracle.fromDecimal( btAmount )
    return (priceOracle && priceOracle.btToFiat(btAmount, 2)) || 0;
  }

  render() {
    console.log('Bottom status rerender');
    return (
      <TouchableWithoutFeedback
        onPress={multipleClickHandler(() => this.navigateToUserProfile())}
        pointerEvents={'auto'}
        style={inlineStyles.bottomBg}
      >
        <View style={{ flex: 1, paddingVertical: 12 }}>
          <Text style={[inlineStyles.handle]}
                ellipsizeMode={'tail'}
                numberOfLines={1}
          >
            {`@${this.props.userName}`}
            {/* TODO remove //Temp Start*/}
            { }V-{this.props.videoSize}:{this.props.videoSizeR}  I-{this.props.videoImageSize}
            {/* TODO remove //Temp End*/}
          </Text>
          {this.props.bio ? (
            <Text
              style={[{ fontSize: 14, flexWrap: 'wrap' }, inlineStyles.bottomBgTxt]}
              ellipsizeMode={'tail'}
              numberOfLines={3}
            >
              {this.props.bio}
            </Text>
          ) : (
            <Text />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(BottomStatus));