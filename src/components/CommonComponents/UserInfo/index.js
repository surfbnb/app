import React from 'react';
import { View, Text, Linking } from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';

import Colors from '../../../theme/styles/Colors';
import TouchableButton from '../../../theme/components/TouchableButton';
import Theme from '../../../theme/styles';
import inlineStyle from './styles';
import pricer from '../../../services/Pricer';
import reduxGetter from '../../../services/ReduxGetters';
import ProfilePicture from '../../ProfilePicture';
import PixelCall from "../../../services/PixelCall";
import LinearGradient from "react-native-linear-gradient";
import BalanceHeader from "../../Profile/BalanceHeader";

const mapStateToProps = (state, ownProps) => {
  return {
    userName: reduxGetter.getUserName(ownProps.userId, state),
    name: reduxGetter.getName(ownProps.userId, state),
    bio: reduxGetter.getBio(ownProps.userId, state),
    link: reduxGetter.getLink(reduxGetter.getUserLinkId(ownProps.userId, state), state),
    supporters: reduxGetter.getUserSupporters(ownProps.userId, state),
    supporting: reduxGetter.getUsersSupporting(ownProps.userId, state),
    btAmount: reduxGetter.getUsersBt(ownProps.userId, state)
  };
};

class UserInfo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  btToFiat(btAmount) {
    const priceOracle = pricer.getPriceOracle();
    if (!priceOracle) return 0;
    btAmount = priceOracle.fromDecimal(btAmount);
    return priceOracle.btToFiat(btAmount, 2);
  }

  onEdit = () => {
    this.props.hideUserInfo(true);
    console.log('in userinfo');
    this.props.onEdit && this.props.onEdit();
  };

  editButton() {
    if (this.props.isEdit) {
      return (
        <TouchableButton
          onPress={this.onEdit}
          TouchableStyles={[Theme.Button.btnPinkSecondary, { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 50 }]}
          TextStyles={[Theme.Button.btnPinkSecondaryText]}
          text="Edit Your Profile"
        />
      );
    }
  }

  onDidFocus = payload => {
    let pixelParams = {
      e_entity: 'page',
      e_action: 'view',
      e_data_json: {
        profile_user_id: this.props.userId
      },
      p_type: 'user_profile'
    };
    PixelCall(pixelParams);
  };

  render() {
    return (
      <View style={{alignItems: 'center', backgroundColor: 'blue' }}>
        <NavigationEvents
            onDidFocus={this.onDidFocus}
        />
        <View style={inlineStyle.infoHeaderWrapper}>
          <ProfilePicture userId={this.props.userId} style={[inlineStyle.profileImageSkipFont, {alignSelf: 'center'}]} />
          {this.props.children}
        </View>
        <Text style={inlineStyle.userName}>@{this.props.userName}</Text>
        {this.editButton()}
        {this.props.bio ? <Text style={inlineStyle.bioSection}>{this.props.bio}</Text> : <View />}
        {this.props.link ? (
          <Text
            style={[{ color: Colors.summerSky, textAlign: 'center' }]}
            onPress={() => {
              Linking.openURL(this.props.link);
            }}
          >
            {this.props.link}
          </Text>
        ) : (
          <View />
        )}

        <LinearGradient
          colors={['#ff7499', '#ff7499', '#ff5566']}
          locations={[0, 0.25, 1]}
          style={{ marginTop: 30, borderTopLeftRadius: 30, borderBottomRightRadius: 30}}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={inlineStyle.numericInfoWrapper}>
            <View style={[inlineStyle.numericInnerWrapper, {borderLeftWidth: 0}]}>
              <Text style={inlineStyle.numericInfoText}>{this.props.supporting || 0}</Text>
              <Text style={inlineStyle.numericInfoText}>SUPPORTING</Text>
            </View>
            <View style={[inlineStyle.numericInnerWrapper]}>
              <Text style={inlineStyle.numericInfoText}>{this.props.supporters || 0}</Text>
              <Text style={inlineStyle.numericInfoText}>SUPPORTERS</Text>
            </View>
            <View style={[inlineStyle.numericInnerWrapper]}>
              <Text style={inlineStyle.numericInfoText}>${this.btToFiat(this.props.btAmount) || 0}</Text>
              <Text style={inlineStyle.numericInfoText}>RAISED</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default connect(mapStateToProps)(UserInfo);
