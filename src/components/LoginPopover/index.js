import React from 'react';
import { connect } from 'react-redux';
import { View, Modal, Text, Image, TouchableHighlight, Dimensions } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import Store from '../../store';
import { showLoginPopover, hideLoginPopover } from '../../actions';
import TwitterAuthService from '../../services/TwitterAuthService';
import loggedOutLogo from "../../assets/logged-out-logo.png";
import twitterBird from "../../assets/twitter-bird.png";
import modalCross from "../../assets/modal-cross-icon.png";

const mapStateToProps = ({ login_popover }) => ({
  show: login_popover.show
});

class loginPopover extends React.Component {
  constructor(props) {
    super(props);
  }

  onSignUp = ()=>{
    TwitterAuthService.signUp();
  };

  render() {
    return (
      <View>
        {this.props.show && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.show}
            coverScreen={false}
            hasBackdrop={true}
          >
            <View style={inlineStyles.container}>
              <TouchableHighlight
                onPress={() => {
                  Store.dispatch(hideLoginPopover());
                }}
                style={{
                  position: 'absolute',
                  top: 15, right:15
                }}
              >
                <Image source={modalCross} style={{width: 19.5, height: 19}} />
              </TouchableHighlight>
              <Image source={loggedOutLogo} style={{width: 261, height: 70, marginBottom: 20}} />
                <Text style={inlineStyles.desc}>Pepo is a place to discover and support your favorite creators.</Text>
                <Text style={inlineStyles.desc}>Please create a account to continue</Text>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnSoftBlue,
                  {
                    marginTop: 30,
                    flexDirection: 'row',
                    height: 55,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '80%'
                  }
                ]}
                TextStyles={[Theme.Button.btnPinkText, {fontSize: 18}]}
                text="Connect with Twitter"
                onPress={this.onSignUp}
                source={twitterBird}
                imgDimension={{width: 28, height: 22.5, marginRight: 8}}
              />

            </View>
          </Modal>
        )}
      </View>
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
