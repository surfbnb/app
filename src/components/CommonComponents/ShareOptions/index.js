import React from 'react';
import { TouchableOpacity, Image} from 'react-native';
import { ActionSheet } from "native-base";
import deepGet from 'lodash/get';
import { withNavigation } from 'react-navigation';

import GreyShareIcon from '../../../assets/grey_share_icon.png';
import ShareVideo from '../../../services/shareVideo';
import DataContract from '../../../constants/DataContract';
import PepoApi from '../../../services/PepoApi';
import inlineStyles from './styles';
import ReduxGetters from '../../../services/ReduxGetters';
import Colors from '../../../theme/styles/Colors';

const QRCODE_SIZE  = 130;

class ShareOptions extends React.PureComponent {

    constructor( props) {
        super( props );
    }

    getDefaultConfig = () => {
        return {
            channelConfig : {
                actionConfig : {
                    0: 'shareViaLink',
                    1: 'shareViaQrCode'
                },
                actionSheetConfig: {
                    options: ['Invite via Link', 'Invite via QR Code', 'Cancel'],
                    cancelButtonIndex: 2,  //Cancel button index in options array
                },
                apiConfig : {
                    shareApi : DataContract.share.getChannelShareApi
                },
                displayConfig : {
                    text : `Scan the QR code to join\n ${ReduxGetters.getChannelName(this.props.entityId)}`,
                    backgroundColor: Colors.wildWatermelon2,
                    color:Colors.white,
                    size:QRCODE_SIZE
                }
            },
            userConfig : {
                actionConfig : {
                    0: 'shareViaLink',
                    1: 'shareViaQrCode',
                    2: 'payViaQrCode'
                },
                actionSheetConfig: {
                    options: ['Share via Link', 'Share via QR Code','Pay via Qrcode', 'Cancel'],
                    cancelButtonIndex: 3,  //Cancel button index in options array
                },
                apiConfig : {
                    shareApi : DataContract.share.getProfileShareApi
                },
                displayConfig : {
                    text : 'Scan the QR code to Share',
                    backgroundColor:Colors.valhalla,
                    color:Colors.wildWatermelon2,
                    size:QRCODE_SIZE
                  }
            }
        }
    }

    getConfig = () => {
        let defaultConfig = this.getDefaultConfig();
        if(this.props.entityKind == DataContract.knownEntityTypes.channel){
            return defaultConfig.channelConfig;
        } else if( this.props.entityKind == DataContract.knownEntityTypes.user){
            return defaultConfig.userConfig;
        }
    }

    showSharingOptions = () =>{
        let config = this.getConfig();
        if(!config) return;
        ActionSheet.show(config.actionSheetConfig,
          (buttonIndex)=>{
            const fnName = deepGet(config, `actionConfig[${buttonIndex}]`);
            if (fnName && this[fnName]) {
              this[fnName]();
            }
          }
        )
      };

      shareViaLink = () =>{
        let apiConfig = this.getConfig().apiConfig;
        let shareProfile = new ShareVideo(apiConfig.shareApi(this.props.entityId));
        shareProfile.perform();
      };
    
      shareViaQrCode = () =>{
        let apiConfig = this.getConfig().apiConfig;
        let displayConfig = this.getConfig().displayConfig;
        new PepoApi(apiConfig.shareApi(this.props.entityId))
          .get()
          .then((response)=>{
            if(response && response.success){
              this.qrCodeGeneratorUrl = deepGet(response,"data.share.url");
              let options = {
                url : this.qrCodeGeneratorUrl,
                ...displayConfig
              }
              this.showQrCodeScreen(options);
            }
          })
          .catch((error) =>{
            cosole.log("**** error in share via qrcode ****" );
        });
      }
    
      payViaQrCode = () => {
        let apiConfig = this.getConfig().apiConfig;
        new PepoApi(apiConfig.shareApi(this.props.entityId))
          .get()
          .then((response)=>{
            if(response && response.success){
              this.qrCodeGeneratorUrl = deepGet(response,"data.share.url");
              let options = {
                url : this.qrCodeGeneratorUrl+'&at=pay',
                text : 'Scan the QR code to Pay',
                backgroundColor:Colors.wildWatermelon2,
                color:Colors.valhalla,
                size: QRCODE_SIZE
              }
              this.showQrCodeScreen(options);
            }
          })
          .catch((error) =>{
          cosole.log("**** error in pay via qrcode ****" );
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
    

    render() {
        return (
            <TouchableOpacity
                style={inlineStyles.wrapperShare}
                onPress={() => {
                this.showSharingOptions();
                }}>
                <Image style={inlineStyles.shareIconSkipFont} source={GreyShareIcon}/>
            </TouchableOpacity>
        )
    }
}

export default withNavigation(ShareOptions);