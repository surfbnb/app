import React from 'react';
import { View, Text, Linking, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { NavigationEvents } from 'react-navigation';
import { withNavigation } from 'react-navigation';
import Colors from '../../../theme/styles/Colors';
import inlineStyle from './styles';
import pricer from '../../../services/Pricer';
import reduxGetter from '../../../services/ReduxGetters';
import ProfilePicture from '../../ProfilePicture';
import PixelCall from '../../../services/PixelCall';
import LinearGradient from 'react-native-linear-gradient';
import multipleClickHandler from '../../../services/MultipleClickHandler';
import Pricer from '../../../services/Pricer';
import InAppBrowser from '../../../services/InAppBrowser';
import Utilities from '../../../services/Utilities';
import infoIcon from '../../../assets/information_icon.png';

const mapStateToProps = (state, ownProps) => {
  return {
    userName: reduxGetter.getUserName(ownProps.userId, state),
    name: reduxGetter.getName(ownProps.userId, state),
    bio: reduxGetter.getBio(ownProps.userId, state),
    link: reduxGetter.getLink(reduxGetter.getUserLinkId(ownProps.userId, state), state),
    supporters: reduxGetter.getUserSupporters(ownProps.userId, state),
    supporting: reduxGetter.getUsersSupporting(ownProps.userId, state),
    btAmount: reduxGetter.getUsersBt(ownProps.userId, state),
    approvedCreater: reduxGetter.isCreatorApproved(ownProps.userId, state)
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

  onDidFocus = (payload) => {
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

  goToSupporting = () => {
    this.props.navigation.push('SupportingListScreen', { userId: this.props.userId });
  };

  goToSupporters = () => {
    this.props.navigation.push('SupportersListScreen', { userId: this.props.userId });
  };

  dividerLine = () => {
    return (
      <LinearGradient
        colors={['#ffdbf9', '#ffdbf9', '#ff5566']}
        locations={[0, 0.35, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ height: 1.5, flex: 0.25, alignSelf: 'center', transform: [{ rotate: '90deg' }] }}
      ></LinearGradient>
    );
  };

  render() {
    return (
      <View style={{ alignItems: 'center', paddingTop: 30 }}>
        <NavigationEvents onDidFocus={this.onDidFocus} />
        {this.props.header}
        <ProfilePicture
          userId={this.props.userId}
          style={[inlineStyle.profileImageSkipFont, { width: 80, height: 80, borderRadius: 40 }]}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <Text style={inlineStyle.userName}>{this.props.userName}</Text>
          {this.props.editButton}
        </View>
        <View style={inlineStyle.numericInfoWrapper}>
          <TouchableOpacity
            onPress={multipleClickHandler(() => {
              this.goToSupporting();
            })}
            style={[inlineStyle.numericInnerWrapper]}
            disabled={this.props.supporting === 0}
          >
            <Text style={[inlineStyle.numericInfoText, inlineStyle.numericInfoTextBold]}>
              {Pricer.toDisplayAmount(this.props.supporting)}
            </Text>
            <Text style={inlineStyle.numericInfoText}>Supporting</Text>
          </TouchableOpacity>
          {this.dividerLine()}
          <TouchableOpacity
            onPress={multipleClickHandler(() => {
              this.goToSupporters();
            })}
            style={[inlineStyle.numericInnerWrapper]}
            disabled={this.props.supporters === 0}
          >
            <Text style={[inlineStyle.numericInfoText, inlineStyle.numericInfoTextBold]}>
              {Pricer.toDisplayAmount(this.props.supporters)}
            </Text>
            <Text style={inlineStyle.numericInfoText}>Supporters</Text>
          </TouchableOpacity>
          {this.dividerLine()}
          <View style={[inlineStyle.numericInnerWrapper]} style={[inlineStyle.numericInnerWrapper]}>
            <Text style={[inlineStyle.numericInfoText, inlineStyle.numericInfoTextBold]}>
              ${Pricer.toDisplayAmount(this.btToFiat(this.props.btAmount))}
            </Text>
            <Text style={inlineStyle.numericInfoText}>Raised</Text>
          </View>
        </View>
        {!!this.props.bio && <Text style={inlineStyle.bioSection}>{this.props.bio}</Text>}
        {!!this.props.link && (
          <Text
            style={[{ color: Colors.summerSky, textAlign: 'center', marginTop: 10 }]}
            onPress={() => {
              InAppBrowser.openBrowser(this.props.link);
            }}
          >
            {this.props.link}
          </Text>
        )}
        {this.props.approvedCreater === 0  && this.props.isOwnProfile && (
          <View  style={{ backgroundColor: '#ff5566', textAlign: 'center', width: '100%', paddingVertical: 10, marginTop: 10, marginBottom:-16, alignItems: 'center', justifyContent: 'center' }}>
            <View style= {{flexDirection: 'row'}}>
            <Image source={infoIcon} style={{height:20, width:20}}/>
            <Text
              style={[{ color: Colors.white, textAlign: 'center', marginLeft: 4 }]}           
            >
              Your profile is in review
            </Text>
            </View>
          </View>
        )}      
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(UserInfo));
