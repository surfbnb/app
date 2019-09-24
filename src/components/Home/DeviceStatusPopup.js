import React, {PureComponent} from 'react';
import { View, Text, Image, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

import inlineStyles from './styles';
import DrawerElementStates from './DrawerElementStatesJson';
import TouchableButton from '../../theme/components/TouchableButton';
import pepo from '../../assets/pepo-tx-icon.png'
import Theme from "../../theme/styles";
import modalCross from '../../assets/modal-cross-icon.png';


// null : treat it as created state



export default class DeviceStatusPopup extends PureComponent {
  constructor(props){
    super(props);

  }
  closeModal = () => {

      this.props.navigation.goBack();

  };

  getRedirectScreen = ( screenName ) => {
      switch ( screenName ){

        case "GO_TO_WALLET_SETTINGS"   : return "WalletSettingScreen";

      }
  }

  getIcon = ( Icon ) => {
    switch ( Icon ){
      case "pepo" : return pepo;
    }
  }



  render(){
    let device = this.props.navigation.getParam('device');

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
                <Image style = {inlineStyles.imageDimensions} source={this.getIcon(DrawerElementStates[device.status].icon)}></Image>
                <Text style={inlineStyles.headerText}> {DrawerElementStates[device.status].header}</Text>
                <Text style={{ fontSize : 10 , paddingBottom : 15 }}> {DrawerElementStates[device.status].desc}</Text>
                {DrawerElementStates[device.status].cta && (
                  <TouchableButton
                    TouchableStyles={[Theme.Button.btnPink,{ minWidth: '100%',borderColor: 'none', borderWidth: 0}]}
                    TextStyles={[Theme.Button.btnPinkText, { fontSize: 10 }]}
                    text={DrawerElementStates[device.status].cta.ctaText}
                    onPress={ () => {
                      if(this.getRedirectScreen(DrawerElementStates[device.status].cta.ctaAction) ){
                        this.props.navigation.navigate(this.getRedirectScreen(DrawerElementStates[device.status].cta.ctaAction));
                      }
                      }}
                  />
                )}
              </View>



            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}