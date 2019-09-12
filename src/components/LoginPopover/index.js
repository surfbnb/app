import React from 'react';
import { connect } from 'react-redux';
import { View, Modal, Text, Image, TouchableOpacity, TouchableWithoutFeedback, WebView } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import Store from '../../store';
import { showLoginPopover, hideLoginPopover } from '../../actions';
import TwitterAuthService from '../../services/TwitterAuthService';
import loggedOutLogo from '../../assets/logged-out-logo.png';
import twitterBird from '../../assets/twitter-bird.png';
import modalCross from '../../assets/modal-cross-icon.png';

const mapStateToProps = ({ login_popover }) => ({
  show: login_popover.show
});

const btnPreText = 'Connect with Twitter';
const btnPostText = 'Connecting...';

class loginPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableLoginBtn: false,
      btnText: btnPreText
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.show && this.props.show !== prevProps.show) {
      this.setState({ disableLoginBtn: false, btnText: btnPreText });
    }
  }

  onSignUp = () => {
    this.setState({ disableLoginBtn: true, btnText: btnPostText });
    TwitterAuthService.signUp();
    //cannot hide popover here
  };

  render() {
    console.log('disableLoginBtn', this.state.disableLoginBtn);
    return (
      <React.Fragment>
        {this.props.show && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.show}
            coverScreen={false}
            hasBackdrop={true}
            onRequestClose={() => console.log('onRequestClose')}
          >
            <TouchableWithoutFeedback
              onPressIn={() => {
                Store.dispatch(hideLoginPopover());
              }}
            >
              <View style={inlineStyles.parent}>
                <TouchableWithoutFeedback>
                  <View style={inlineStyles.container}>
                    <TouchableOpacity
                      onPress={() => {
                        Store.dispatch(hideLoginPopover());
                      }}
                      style={inlineStyles.crossBtnPos}
                    >
                      <Image source={modalCross} style={{ width: 19.5, height: 19 }} />
                    </TouchableOpacity>
                    <Image source={loggedOutLogo} style={{ width: 261, height: 70, marginBottom: 20 }} />
                    <Text style={[inlineStyles.desc, {marginBottom: 10}]}>
                      Pepo is a place to discover & support creators.
                    </Text>
                    <Text style={[inlineStyles.desc, {fontFamily: 'AvenirNext-Regular'}]}>Pepo is currently Invite only, connect with Twitter to know if your account is whitelisted!</Text>
                    <TouchableButton
                      TouchableStyles={[
                        Theme.Button.btnSoftBlue, inlineStyles.twtBtn,
                        this.state.disableLoginBtn ? Theme.Button.disabled : null
                      ]}
                      TextStyles={[Theme.Button.btnPinkText, { fontSize: 18 }]}
                      text={this.state.btnText}
                      onPress={this.onSignUp}
                      source={twitterBird}
                      imgDimension={{ width: 28, height: 22.5, marginRight: 8 }}
                      disabled={this.state.disableLoginBtn}
                    />
                    <View style={{paddingTop: 15}}>
                      <Text style={inlineStyles.tos}>By signing up, you confirm that you agree to our Terms of use and have read and agree to our Privacy Policy</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export const LoginPopover = connect(mapStateToProps)(loginPopover);
export const LoginPopoverActions = {
  show: () => {
    Store.dispatch(showLoginPopover());
  },
  hide: () => {
    Store.dispatch(hideLoginPopover());
  }
};
