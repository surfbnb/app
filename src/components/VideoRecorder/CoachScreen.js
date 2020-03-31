import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Text
} from 'react-native';
import styles from './styles';
import reduxGetters from '../../services/ReduxGetters';
import closeIconWhite from '../../assets/cross-icon-white.png';
import LinearGradient from "react-native-linear-gradient";
import Theme from "../../theme/styles";
import multipleClickHandler from "../../services/MultipleClickHandler";
import TouchableButton from "../FanVideoReplyDetails/TouchableButton";
import Pricer from "../../services/Pricer";

class CoachScreen extends PureComponent{

    constructor(props){
        super(props);
    }

    getPepoAmount = () => {
        let amount = reduxGetters.getBtAmountForReply(this.props.videoId);
        return Pricer.getToBT(Pricer.getFromDecimal(amount), 2);
    };

    getUserFullName = () => {
        let userId = reduxGetters.getVideoCreatorUserId(this.props.videoId);
        return reduxGetters.getName(userId)
    };

    render(){
        if (this.props.isLocalVideoPresent) return null;
        if (this.props.isVideoTypeReply) {
            if (this.props.showLightBoxOnReply){
                return <View style={styles.backgroundStyle}>
                        <TouchableOpacity onPressIn={this.props.cancleVideoHandling}
                                        style={[styles.closeBtWrapper, {top: 25}]}>
                            <Image style={{height: 16.6, width: 16.6}} source={closeIconWhite}></Image>
                        </TouchableOpacity>
                        <View style={{ padding: 26, alignItems: 'center'}}>
                            <Text style={[styles.smallText, {fontWeight: '600'}]}>Post a reply</Text>
                            <Text style={[styles.miniText, {textAlign: 'center'}]}>
                                Reply to {this.getUserFullName()}'s video for {this.getPepoAmount()} Pepo Coins
                            </Text>
                            <LinearGradient
                                colors={['#ff7499', '#ff5566']}
                                locations={[0, 1]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={{ alignSelf: 'center', paddingHorizontal: 15, marginTop: 30, borderRadius: 3 }}>
                                <TouchableButton
                                    TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
                                    TextStyles={[Theme.Button.btnPinkText]}
                                    style={{marginBottom: 20}}
                                    textBeforeImage='Reply | '
                                    textAfterImage={this.getPepoAmount()}
                                    onPress={multipleClickHandler(() => { this.props.replyToVideo();})}/>
                            </LinearGradient>
                        </View>
                </View>
        }
    } else {
      if (this.props.acceptedCameraTnC !== 'true') {
        return <View style={styles.backgroundStyle}>
          <View style={{ padding: 26 }}>
            <Text style={styles.headerText}>Create your first 30 second video</Text>
            <Text style={styles.smallText}>Introduce yourself. Share your passions, projects, and your unique personality!</Text>
            <LinearGradient
              colors={['#ff7499', '#ff5566']}
              locations={[0, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ alignSelf: 'center', paddingHorizontal: 15, marginTop: 30, borderRadius: 3 }}
            >
              <TouchableOpacity
                onPress={this.props.acceptCameraTerms}
                style={[Theme.Button.btn, { borderWidth: 0 }]}
              >
                <Text style={[ Theme.Button.btnPinkText, { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' }]}>
                  Start Creating
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      }
    } 
   }

}

export default CoachScreen ;