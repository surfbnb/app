import React from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
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
import profileLink from '../../../assets/profile_link.png';
import twitterLink from '../../../assets/twitter_link.png';
import Utilities from '../../../services/Utilities';
import AppConfig from '../../../constants/AppConfig';


const regex = /(^|\s)(#\w+)/g;

const mapStateToProps = (state, ownProps) => {
  return {
    userName: reduxGetter.getUserName(ownProps.userId, state),
    name: reduxGetter.getName(ownProps.userId, state),
    bio: reduxGetter.getBio(ownProps.userId, state),
    link: reduxGetter.getLink(reduxGetter.getUserLinkId(ownProps.userId, state), state),
    supporters: reduxGetter.getUserSupporters(ownProps.userId, state),
    supporting: reduxGetter.getUsersSupporting(ownProps.userId, state),
    btAmount: reduxGetter.getUsersBt(ownProps.userId, state),
    approvedCreater: reduxGetter.isCreatorApproved(ownProps.userId, state),
    twitterHandle : reduxGetter.getUserTwitterHandle(ownProps.userId, state),
    twitterHandleLink : reduxGetter.getUserTwitterHandleLink(ownProps.userId, state),
  };
};

class UserInfo extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  toBt( val ){
    const priceOracle =  pricer.getPriceOracle() ;
    val = priceOracle.fromDecimal( val )  ;
    return priceOracle.toBt( val );
  }

  btToFiat(btAmount) {
    const priceOracle = pricer.getPriceOracle();
    if (!priceOracle) return 0;
    btAmount = priceOracle.fromDecimal(btAmount);
    return priceOracle.btToFiat(btAmount, 2);
  }

  onDidFocus = (payload) => {
    PixelCall({
      e_entity: 'page',
      e_action: 'view',
      p_type: 'user_profile',
      p_name: this.props.userId
    });
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

  onTagPressed = (tag) => {
    let entity = reduxGetter.getBioIncudes(this.props.userId, tag);
    if (!entity) {
      return;
    }

    if(entity.kind === 'tags'){
      this.props.navigation.push('VideoTags', {
        "tagId": entity.id
      });
    }
  };

  isValidBioTag(userId, tappedText) {
    let entity = reduxGetter.getBioIncudes(userId, tappedText);
    return !!entity;
  }


  render() {

    let processingString = this.props.bio;
    let hasTagArray = processingString.match(regex) || [];

    return (
      <View style={{ alignItems: 'center', paddingTop: 30}}>
        <NavigationEvents onDidFocus={this.onDidFocus} />
        {this.props.header}
        <ProfilePicture size={AppConfig.profileImageConstants.originalImageWidth}
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
              {Pricer.displayAmountWithKFomatter(this.props.supporting)}
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
              {Pricer.displayAmountWithKFomatter(this.props.supporters)}
            </Text>
            <Text style={inlineStyle.numericInfoText}>{Utilities.getSingularPluralText(this.props.supporters , "Supporter")}</Text>
          </TouchableOpacity>
          {this.dividerLine()}
          <View style={[inlineStyle.numericInnerWrapper]} style={[inlineStyle.numericInnerWrapper]}>
            <Text style={[inlineStyle.numericInfoText, inlineStyle.numericInfoTextBold]}>
              {Pricer.displayAmountWithKFomatter(this.toBt(this.props.btAmount))}
            </Text>
            <Text style={inlineStyle.numericInfoText}>Received</Text>
          </View>
        </View>
        {!!this.props.bio && <Text style={inlineStyle.bioSectionWrapper}>

          {(hasTagArray.map((hashTag) => {

            let tagLocation = processingString.search(hashTag);
            let prevText = processingString.slice(0, tagLocation);

            processingString = processingString.slice(tagLocation + hashTag.length);

            let formattedHashTag = hashTag.replace(regex, "$2");

            if (this.isValidBioTag(this.props.userId, formattedHashTag)) {

              // let tagText = hashTag.replace("#", "");
              return (
                <Text key={formattedHashTag}>
                  {prevText}
                  <Text style={[{fontFamily: 'AvenirNext-DemiBold'}]}
                        numberOfLines={1}
                        onPress={() => {
                          this.onTagPressed(formattedHashTag)
                        }}>
                    {/*<Text style={{fontStyle: 'italic'}}>#</Text>*/}
                    {hashTag}
                  </Text>
                </Text>

              );
            } else {
              return (
                <Text key={hashTag}>
                  {prevText + hashTag}
                </Text>
              )
            }
          }))
          }
          <Text>{processingString}</Text>

        </Text>
        }

        {!!this.props.link && (
          <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center', marginHorizontal: 20, marginTop: 10}}>
            <Text ellipsizeMode={'tail'} numberOfLines={1}>
              <Image source={profileLink} style={{height:8.25,width:17.25}}/>{'  '}
              <Text
                style={[{ color: 'rgba(42, 41, 59, 0.7)', marginLeft:5}]}
                onPress={() => {
                  InAppBrowser.openBrowser(this.props.link);
                }}
              >
                {this.props.link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')}
              </Text>
            </Text>
          </View>
        )}
        {!!this.props.twitterHandleLink && !!this.props.twitterHandle && (
          <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center', marginTop: 10}}>
            <Image style={{height:14,width:17}} source={twitterLink}/>
            <Text
              style={[{marginLeft:5, color: Colors.summerSky}]}
              onPress={() => {Linking.openURL(this.props.twitterHandleLink);}}>{this.props.twitterHandle}
            </Text>
          </View>
        )}

        {/*</View>*/}
        {this.props.videoInReviewHeader || <View style={{height:15}} />}
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(UserInfo));
