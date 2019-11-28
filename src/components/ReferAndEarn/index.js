import React, { Component } from 'react';
import { Image, Text, TouchableOpacity, View, Clipboard, Share, Platform, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import deepGet from 'lodash/get';

import styles from './styles';
import multipleClickHandler from '../../services/MultipleClickHandler';
import Colors from '../../theme/styles/Colors';
import Theme from '../../theme/styles';
import arrowRight from '../../assets/arrowRight.png';
import confetti from '../../assets/confetti.png';
import InAppBrowser from '../../services/InAppBrowser';
import BackArrow from '../CommonComponents/BackArrow';
import { ScrollView } from 'react-native-gesture-handler';
import PepoApi from '../../services/PepoApi';
import { WEB_ROOT } from '../../constants/index';
import CommonStyle from "../../theme/styles/Common";

class ReferAndEarn extends Component {
  static navigationOptions = (options) => {
    return {
      headerBackTitle: null,
      headerTitle: 'Invite',
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerTitleStyle: {
        fontFamily: 'AvenirNext-Medium'
      },
      headerBackImage: <BackArrow />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      inviteText: '50',
      inviteCode: '',
      inviteCodeText: 'Your Invite Code, Tap to Copy',
      pendingInvites: '50',
      inviteLimit: null,
      invitedUserCount: null,
      message: '',
      url: '',
      title: ''
    };
  }

  componentDidMount() {
    new PepoApi(`/invites/code`)
      .get()
      .then((res) => {
        this.onInit(res);
      })
      .catch((error) => {});
  }

  onInit(res) {
    let resultType = deepGet(res, 'data.result_type');
    this.setState(
      {
        inviteCode: deepGet(res, `data.${resultType}.code`),
        pendingInvites: deepGet(res, `data.${resultType}.pending_invites`),
        inviteLimit: deepGet(res, `data.${resultType}.invite_limit`),
        invitedUserCount: deepGet(res, `data.${resultType}.invited_user_count`),
        message: deepGet(res, `data.share.message`),
        title: deepGet(res, `data.share.title`),
        url: deepGet(res, `data.share.url`),
        subject: deepGet(res, `data.share.subject`)
      },
      () => {
        this.setInviteText();
      }
    );
  }

  setInviteText() {
    let inviteText = '';
    if (this.state.inviteLimit === -1) {
      inviteText = 'Unlimited';
    } else {
      inviteText = String(this.state.pendingInvites);
    }
    this.setState({
      inviteText
    });
  }

  onShare = async () => {
    let content = {
      message: this.state.message,
      title: this.state.title,
     // url: this.state.url,
      subject: this.state.subject
    };
    try {
      const result = await Share.share(content);
    } catch (error) {
      alert(error.message);
    }
  };

  _setContent() {
    Clipboard.setString(this.state.inviteCode);
    this.setState({
      inviteCodeText: 'Copied!'
    });
  }

  render() {
    return (
      <ScrollView style={CommonStyle.viewContainer}>
        {this.state.pendingInvites != 0 ? (
          <React.Fragment>
            <View style={[styles.wrapper, styles.topWrapper, { flex: 0.3 }]}>
              <ImageBackground source={confetti} resizeMode="contain" style={{ width: '100%', height: '100%' }}>
                <View style={{ padding: 25 }}>
                  <Text
                    style={[styles.heading, { textAlign: 'center' }]}
                  >{`You have ${this.state.inviteText} invites remaining`}</Text>
                  <Text style={styles.content}>
                    Invite your friends and you will get 5% commission on their earnings.
                  </Text>
                </View>
              </ImageBackground>
            </View>
            <View style={[styles.middleWrapper, { flex: 0.3 }]}>
              <TouchableOpacity
                onPress={multipleClickHandler(() => {
                  this._setContent();
                })}
                style={{ backgroundColor: '#fbfbfb', padding: 15 }}
              >
                <Text style={[styles.content, { marginBottom: 10 }]}>{this.state.inviteCodeText}</Text>
                <Text style={styles.inviteCode}>{this.state.inviteCode}</Text>
              </TouchableOpacity>
              <LinearGradient
                colors={['#ff7499', '#ff5566']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ marginTop: 25, borderRadius: 3 }}
              >
                <TouchableOpacity
                  onPress={multipleClickHandler(() => {
                    this.onShare();
                  })}
                  style={[Theme.Button.btn, { borderWidth: 0 }]}
                >
                  <Text style={[Theme.Button.btnPinkText, { textAlign: 'center' }]}>Share Invite Link</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </React.Fragment>
        ) : (
          <View style={[styles.wrapper, styles.topWrapper, { flex: 0.3, marginBottom: 25 }]}>
            <ImageBackground source={confetti} resizeMode="contain" style={{ width: '100%', height: '100%' }}>
              <View style={{ padding: 25 }}>
                <Text style={[styles.heading, { textAlign: 'center' }]}>
                  {`Amazing ${this.state.invitedUserCount} People Joined Pepo Via Your Link`}
                </Text>
                <Text style={styles.content}>
                  As your friends start earning you will get 5% of their earnings in Pepo Coins. Contact us if you need
                  more Invites.
                </Text>
              </View>
            </ImageBackground>
          </View>
        )}

        <View style={[styles.bottomWrapper, { flex: 0.4 }]}>
          <TouchableOpacity
            onPress={multipleClickHandler(() => {
              this.props.navigation.push('Invites');
            })}
            activeOpacity={0.2}
          >
            <View
              style={{
                position: 'relative',
                marginBottom: 10,
                borderTopColor: Colors.whisper,
                borderTopWidth: 1,
                paddingTop: 10
              }}
            >
              <Text style={styles.heading}>Invites</Text>
              <Text style={[styles.content, { textAlign: 'left' }]}>
                You will see a list of your referrals and commissions here.
              </Text>
              <Image style={styles.arrowImageSkipFont} source={arrowRight}></Image>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={multipleClickHandler(() => {
              InAppBrowser.openBrowser(
                  `${WEB_ROOT}/terms`
              );
            })}
            activeOpacity={0.2}
          >
            <View style={{ position: 'relative', borderTopColor: Colors.whisper, borderTopWidth: 1, paddingTop: 10 }}>
              <Text style={styles.heading}>Referral terms</Text>
              <Text style={[styles.content, { textAlign: 'left' }]}>
                Please see our Terms and Conditions
              </Text>
              <Image style={styles.arrowImageSkipFont} source={arrowRight}></Image>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

export default ReferAndEarn;
