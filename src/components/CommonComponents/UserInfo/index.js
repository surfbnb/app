import React from 'react';
import { View, Text, Linking, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import {withNavigation} from 'react-navigation';
import Colors from '../../../theme/styles/Colors';
import inlineStyle from './styles';
import pricer from '../../../services/Pricer';
import reduxGetter from '../../../services/ReduxGetters';
import ProfilePicture from '../../ProfilePicture';
import PixelCall from "../../../services/PixelCall";
import LinearGradient from "react-native-linear-gradient";


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

  //TODO @Mayur compute fetch url from inside
  GoToSupporting = () => {
    this.props.navigation.push('SupportingListWrapper',{ userId: this.props.userId});
  }


//TODO @Mayur compute fetch url from inside
  GoToSupporters = () => {
    this.props.navigation.push('SupportersListWrapper', {userId: this.props.userId});
  }

  render() {
    return (
      <View style={{alignItems: 'center', paddingTop: 30}}>

        <NavigationEvents
            onDidFocus={this.onDidFocus}
        />
        <View style={inlineStyle.infoHeaderWrapper}>
          <ProfilePicture userId={this.props.userId} style={[inlineStyle.profileImageSkipFont, {width: 80, height: 80, borderRadius: 40}]} />
          <View style={{position: 'absolute', right: 20}}>
            {this.props.header}
          </View>
        </View>
        <Text style={inlineStyle.userName}>@{this.props.userName}</Text>
        {this.props.editButton}
        {!!this.props.bio && <Text style={inlineStyle.bioSection}>{this.props.bio}</Text> }
        {!!this.props.link &&
          <Text
            style={[{ color: Colors.summerSky, textAlign: 'center', marginTop: 10 }]}
            onPress={() => {
              Linking.openURL(this.props.link);
            }}
          >
            {this.props.link}
          </Text>
        }

        <LinearGradient
          colors={['#ff7499', '#ff7499', '#ff5566']}
          locations={[0, 0.25, 1]}
          style={{ marginTop: 20, borderTopLeftRadius: 30, borderBottomRightRadius: 30}}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={inlineStyle.numericInfoWrapper}>
            <TouchableOpacity onPress={this.GoToSupporting} style={[inlineStyle.numericInnerWrapper, {borderLeftWidth: 0}]}>
              <Text style={inlineStyle.numericInfoText}>{this.props.supporting || 0}</Text>
              <Text style={inlineStyle.numericInfoText}>SUPPORTING</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.GoToSupporters} style={[inlineStyle.numericInnerWrapper]}>
              <Text style={inlineStyle.numericInfoText}>{this.props.supporters || 0}</Text>
              <Text style={inlineStyle.numericInfoText}>SUPPORTERS</Text>
            </TouchableOpacity>

            <View style={[inlineStyle.numericInnerWrapper]} style={[inlineStyle.numericInnerWrapper]}>
              <Text style={inlineStyle.numericInfoText}>${this.btToFiat(this.props.btAmount) || 0}</Text>
              <Text style={inlineStyle.numericInfoText}>RAISED</Text>
            </View>
          </View>
        </LinearGradient>

      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(UserInfo));
