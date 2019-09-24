import React, {PureComponent} from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

import inlineStyles from './styles';
import AuthDeviceDrawerData from './AuthDeviceDrawerData';
import TouchableButton from '../../theme/components/TouchableButton';
import pepoIcon from '../../assets/pepo-tx-icon.png';
import fingerprintIcon from '../../assets/fingerprint.png';
import infoIcon from '../../assets/toast_error.png';
import Theme from "../../theme/styles";
import modalCross from '../../assets/modal-cross-icon.png';


// null : treat it as created state



export default class AuthDeviceDrawer extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.onCloseGoTo = null;
  }

  componentWillUnmount() {
    if ( this.onCloseGoTo ) {
      this.props.navigation.navigate(this.onCloseGoTo);
    }
    // Reset it again.
    this.onCloseGoTo = null;
  }

  closeModal = () => {
      this.props.navigation.goBack();
  };

  getRedirectScreen = ( screenName ) => {
    switch ( screenName ) {
      case "GO_TO_WALLET_SETTINGS"   : return "WalletSettingScreen";
      default: return "WalletSettingScreen";
    }
  }

  getIcon = ( icon ) => {
    switch ( icon ){
      case "pepo" : return pepoIcon;
      case "fingerprint": return fingerprintIcon;
      case "info" : return infoIcon;
    }
  }

  onActionBtnPressed = () => {
    let device = this._getDevice();
    let redirectScreen = this.getRedirectScreen(AuthDeviceDrawerData[device.status].cta.ctaAction);
    if ( redirectScreen ) {
      this.onCloseGoTo = redirectScreen;
    }
    this.closeModal();
  };

  _getDevice() {
    let device = this.props.navigation.getParam('device');
    if ( !device ) {
      // Return with status CREATED;
      return {
        status: "CREATED"
      };
    }
    return device;
  }

  _getViewConfig() {
    let device = this._getDevice();
    return AuthDeviceDrawerData[device.status];
  }

  _renderIcon() {
    let config = this._getViewConfig();
    if ( !config.icon ) {
      return null;
    }
    return(<Image style = {inlineStyles.imageDimensionSkipFont} source={this.getIcon(config.icon)}></Image>);
  }

  _renderHeader() {
    let config = this._getViewConfig();
    if ( !config.header ) {
      return null;
    }
    return(<Text style={inlineStyles.headerText}> {config.header}</Text>);
  }

  _renderDescription() {
    let config = this._getViewConfig();
    if ( !config.desc ) {
      return null;
    }
    return(<Text style={inlineStyles.desc}> {config.desc}</Text>);
  }

  _renderCTA() {
    let config = this._getViewConfig();
    if ( !config.cta || !config.cta.ctaText ) {
      return null;
    }

    return(
      <TouchableButton
        TouchableStyles={[Theme.Button.btnPink,{ minWidth: '100%',borderColor: 'none', borderWidth: 0}]}
        TextStyles={[Theme.Button.btnPinkText, { fontSize: 15 }]}
        text={config.cta.ctaText}
        onPress={this.onActionBtnPressed}
      />
    );
  }

  render(){
    let config = this._getViewConfig();
    return(
      <TouchableWithoutFeedback onPressIn={this.closeModal}>
        <View style = {inlineStyles.parent}>

          <TouchableWithoutFeedback>
            <View style={[inlineStyles.popupContainer, { paddingBottom: 0 }]} >
              <TouchableOpacity
                onPress={() => {
                  this.closeModal();
                }}
                style={inlineStyles.crossIconWrapper}
              >
                <Image source={modalCross} style={inlineStyles.crossIconSkipFont} />
              </TouchableOpacity>

              <View style={inlineStyles.contentWrapper}>
                {this._renderIcon()}
                {this._renderHeader()}
                {this._renderDescription()}
                {this._renderCTA()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}
