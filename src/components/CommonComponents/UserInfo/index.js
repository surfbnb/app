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
          TouchableStyles={[Theme.Button.btnPinkSecondary, { paddingVertical: 8, paddingHorizontal: 20 }]}
          TextStyles={[Theme.Button.btnPinkSecondaryText]}
          text="Edit Profile"
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
      <View style={{ margin: 20, alignItems: 'center' }}>
        <NavigationEvents
            onDidFocus={this.onDidFocus}
        />
        <View style={inlineStyle.infoHeaderWrapper}>
          <ProfilePicture userId={this.props.userId} style={inlineStyle.profileImageSkipFont} />

          <Text style={inlineStyle.userName}>{this.props.userName}</Text>
        </View>
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

        <View style={inlineStyle.numericInfoWrapper}>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={inlineStyle.numericInfo}>{this.props.supporting || 0}</Text>
            <Text style={inlineStyle.numericInfoText}>Supporting</Text>
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={inlineStyle.numericInfo}>{this.props.supporters || 0}</Text>
            <Text style={inlineStyle.numericInfoText}>Supporters</Text>
          </View>
          <View style={{ marginHorizontal: 10 }}>
            <Text style={inlineStyle.numericInfo}>${this.btToFiat(this.props.btAmount) || 0}</Text>
            <Text style={inlineStyle.numericInfoText}>Raised</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(UserInfo);
