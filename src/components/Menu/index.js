import React,{PureComponent} from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import deepGet from 'lodash/get';
import {testProps} from "../../constants/AppiumAutomation";

import {DrawerEmitter} from '../../helpers/Emitters';
import GreyShareIcon from '../../assets/grey_share_icon.png';
import inlineStyles from './style'
import { ActionSheet } from "native-base";
import ShareVideo from '../../services/shareVideo';
import DataContract from '../../constants/DataContract';
import PepoApi from '../../services/PepoApi';
import CurrentUser from '../../models/CurrentUser';

const SHARE_VIA_LINK_INDEX     = 0;
const SHARE_VIA_QRCODE_INDEX   = 1;
const PAY_VIA_QRCODE_INDEX     = 2;
const SHARE_CANCEL_INDEX       = 3;
class Menu extends PureComponent{
  constructor(props){
    super(props);
    this.sharingActionSheetButtons  = ['Share via Link', 'Share via QR Code' ,'Pay via Qrcode', 'Cancel'];
    this.currentUserId = CurrentUser.getUserId();
  }

  showSharingOptions = () =>{
    let sharingActionOptions = [...this.sharingActionSheetButtons];
    ActionSheet.show({
        options : sharingActionOptions,
        cancelButtonIndex :SHARE_CANCEL_INDEX,
      },
      (buttonIndex)=>{
        if (buttonIndex == SHARE_VIA_LINK_INDEX) {
          this.shareViaLink();
        }else if( buttonIndex ==  SHARE_VIA_QRCODE_INDEX ){
          this.shareViaQrCode();
        }else if( buttonIndex == PAY_VIA_QRCODE_INDEX){
          this.payViaQrCode();
        }
      }

    )
  }

  shareViaLink = () =>{
    let shareProfile = new ShareVideo(DataContract.share.getProfileShareApi(this.currentUserId));
    shareProfile.perform();
  }

  shareViaQrCode = () =>{
    new PepoApi(DataContract.share.getProfileShareApi(this.currentUserId))
      .get()
      .then((response)=>{
        if(response && response.success){
          this.qrCodeGeneratorUrl = deepGet(response,"data.share.url");
          ActionSheet.hide();
          let options = {
            url : this.qrCodeGeneratorUrl,
            text : 'Scan the QR code to Share',
            backgroundColor:"#2a293b",
            color:"#ff5566",
            size:130
          }
          this.showQrCodeScreen(options);
        }
      });
  }

  payViaQrCode = () => {
    new PepoApi(DataContract.share.getProfileShareApi(this.currentUserId))
      .get()
      .then((response)=>{
        if(response && response.success){
          this.qrCodeGeneratorUrl = deepGet(response,"data.share.url");
          ActionSheet.hide();
          let options = {
            url : this.qrCodeGeneratorUrl+'&at=pay',
            text : 'Scan the QR code to Pay',
            backgroundColor:"#ff5566",
            color:"#2a293b",
            size:130
          }
          this.showQrCodeScreen(options);
        }
      });
  }


showQrCodeScreen = ( options ) =>{
    this.props.navigation.navigate(
      'QrCode',
      {
        url:options.url,
        descText:options.text,
        backgroundColor : options.backgroundColor,
        color:options.color,
        size:options.size
      }
    );
  }

  render(){
    return (
  <React.Fragment>
    <TouchableOpacity
          style={inlineStyles.wrapperShare}
          onPress={() => {
            this.showSharingOptions();
          }}>
          <Image style={inlineStyles.shareIconSkipFont} source={GreyShareIcon}/>
        </TouchableOpacity>

        {this.props.navigation && this.props.navigation.state.routeName === 'ProfileScreen' && (
      <TouchableOpacity
        style={{ height: 32, width: 35, alignItems: 'center', justifyContent: 'center', marginRight: 20 }}
        onPress={()=>{DrawerEmitter.emit('toggleDrawer')}}
        activeOpacity={0.2}
      {...testProps('profile-right-side-toggle-drawer')}>
        <Text style={{ width: 20, height: 2, borderWidth: 1 }}></Text>
        <Text style={{ width: 20, height: 2, borderWidth: 1, marginVertical: 5 }}></Text>
        <Text style={{ width: 20, height: 2, borderWidth: 1 }}></Text>
      </TouchableOpacity>
    )}
  </React.Fragment>
)}
}

export default Menu;
