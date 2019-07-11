import React from 'react';
import { connect } from 'react-redux';
import { View, Modal, Text, Image, TouchableHighlight, Dimensions } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import Store from '../../store';
import { showLoginPopover, hideLoginPopover } from '../../actions';
import TwitterAuthService from '../../services/TwitterAuthService';

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
            animationType="slideUp"
            transparent={true}
            visible={this.props.show}
            coverScreen={false}
            hasBackdrop={true}
          >
            <View style={inlineStyles.backgroundStyle}>
              <TouchableHighlight
                onPress={() => {
                  Store.dispatch(hideLoginPopover());
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableHighlight>
              <TouchableButton
                TouchableStyles={[Theme.Button.btnPink, { marginTop: 10 }]}
                TextStyles={[Theme.Button.btnPinkText]}
                text="Connect with Twitter"
                onPress={this.onSignUp}
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
