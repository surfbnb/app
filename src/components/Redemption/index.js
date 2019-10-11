import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Platform,
    Animated,
    Easing,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image
  } from 'react-native';

import TouchableButton from "../../theme/components/TouchableButton";
import Theme from '../../theme/styles';

import deepGet from "lodash/get";
import PepoApi from "../../services/PepoApi";
import inlineStyles from './styles';

import { ostErrors } from '../../services/OstErrors';
import Pricer from '../../services/Pricer';
import ReduxGetters from '../../services/ReduxGetters';
import DataContract from '../../constants/DataContract';
import FormInput from '../../theme/components/FormInput';

import pepoTxIcon from "../../assets/pepo-tx-icon.png";
import pepo_icon from '../../assets/pepo-tx-icon.png';
import toastError from '../../assets/toast_error.png';
import pepoCornsImg from '../../assets/PepoCornActive.png';
import tx_success from '../../assets/transaction_success_star.png';
import Utilities from '../../services/Utilities';
import MultipleClickHandler from '../../services/MultipleClickHandler';
import AppConfig from '../../constants/AppConfig';


class Redemption extends PureComponent{

    constructor(props){
        super(props);

        this.state = {
            btAmout: 0,
            pepoCorns : 0,
            balance: ReduxGetters.getBalance(),
            errorMsg: null,
            isLoading: true,
            isPurchasing : false,
            redemptionSuccess : false,
            rotate: new Animated.Value(0),
            scale: new Animated.Value(0.1)
        }

        this.isError =  false;
        this.configResponse = null;
        this.serverError = null;
        this.isAppUpdate = false;
    }

    componentDidMount(){
        this.fetchRedemptionConfig();
    }

    componentWillUnmount(){
        this.onFetchRedemptionConfigSuccess = () => {};
        this.onFetchRedemptionConfigError = () => {};
    }

    fetchRedemptionConfig(){
        new PepoApi(DataContract.redemption.configApi)
        .get()
        .then((res)=> {
            if(res && res.success){
                this.onFetchRedemptionConfigSuccess(res);
            }else{
                this.onFetchRedemptionConfigError(res);
            }         
        }).catch((error) =>{
            this.onFetchRedemptionConfigError(error);
        })
    }

    onFetchRedemptionConfigSuccess( res ){
        this.configResponse = res;
        this.isError =  false ;
        this.isAppUpdate = this.__isAppUpdate(res); 
        this.setState({isLoading: false});
    }

    onFetchRedemptionConfigError( error ){
        this.state.errorMsg = ostErrors.getErrorMessage( error  , "redemption_error");
        this.isError = true ;
        this.setState({isLoading: false});
    }

    __isAppUpdate( ){
        return !!deepGet(this.configResponse , DataContract.redemption.isAppUpdateKeyPath);
    }

    getPepoCornsName(){
        const pepoCornsEntity = deepGet(this.configResponse , `data.${deepGet(this.configResponse ,  DataContract.common.resultType)}` , {}); 
        return pepoCornsEntity[DataContract.redemption.pepoCornsNameKey] || AppConfig.redemption.pepoCornsName; 
    }

    getPepoCornsImageSource(){
        const pepoCornsEntity = deepGet(this.configResponse , `data.${deepGet(this.configResponse ,  DataContract.common.resultType)}` , {}); 
        const imageSrc = pepoCornsEntity[DataContract.redemption.pepoCornsImageKey];
        if( imageSrc ){
            return {uri: imageSrc};
        }
        return pepoCornsImg
    }

    onPepoCornChange = (val) => {
        //TODO 
    }

    onPepoCornFocus = () => {
        //TODO 
    }

    onConfrim = () => {
        
    }

    beforeRedemption = () => {
        this.setState({isPurchasing : true});
    }

    onRedemptionSuccess = (res) => {
        this.setState({isPurchasing : false ,  redemptionSuccess : true});
    }

    onRedemptionError = (error) => {
        this.setState({isPurchasing : false ,  redemptionSuccess : false});
    } 

    onRedemptionWebViewClick = () => {
        Utilities.onRedemptionWebViewClick();
    }

    onUpdateAppClick = () =>{
        //TODO 
    }

    getAnimation(){
        return Animated.sequence([
          Animated.delay(800),
          Animated.timing(this.state.rotate, {
            toValue: 1,
            easing:Easing.elastic(1.5),
            useNativeDriver: true
          }),
          Animated.loop(
            Animated.timing(this.state.scale, {
              duration: 1200,
              easing:Easing.inOut(Easing.ease),
              useNativeDriver: true
            })
          )
        ])
      };

    getLoadingMarkup = ( msg ) => {
        const rotateData = this.state.rotate.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg','-135deg'],
          });
          const scaleData = this.state.scale.interpolate({
            inputRange: [0.11, 0.5, 1],
            outputRange: [1, Platform.OS == 'ios' ? 1.15 : 1.3, 1]
          });
          let animationStyle = {
            transform: [
              {scale: scaleData},
              {rotate: rotateData}
            ],
          };
          this.getAnimation().start() ;
        return (
            <View style={inlineStyles.viewWrapper}>
                <Animated.Image
                  style={[ animationStyle, {width: 40, height: 40, marginBottom: 20} ]}
                  source={pepoTxIcon}/>
                <Text> {msg || `Please wait, we are getting your ${this.getPepoCornsName()}` }</Text>
            </View>
        )
    }

    getErrorMarkup = (errorMsg) => {
        return (
            <View style={inlineStyles.viewWrapper}>
                <Image source={toastError} style={{ width: 30, height: 30, marginBottom: 20}}></Image>
                <Text style={{textAlign: "center"}}>
                  {errorMsg ||this.state.errorMsg}
                </Text>
            </View>
        )
    }

    getAppUpdateMarkup = () => {
        return (
            <View style={inlineStyles.viewWrapper}>
                <Image source={toastError} style={{ width: 30, height: 30, marginBottom: 20}}></Image>
                <Text style={{textAlign: "center"}}>Please update your app for redemption.</Text>
                <TouchableButton  TouchableStyles={[Theme.Button.btnPink]}
                                  TextStyles={[Theme.Button.btnPinkText]}
                                  text={"Update"}
                                  onPress={MultipleClickHandler(() => this.onUpdateAppClick())}
                          />
            </View>
        )
    }

    getSuccessMarkup = (msg) => {
        return (
            <View style={inlineStyles.successViewWrapper}>
                <Image source={tx_success} style={[{ width: 164.6, height: 160, marginBottom: 20 }]}></Image>
                <Text style={[inlineStyles.successText , {fontFamily: 'AvenirNext-Regular'}]}>
                    Success, you have {this.state.pepoCorns} new {this.getPepoCornsName()}, you can also view them in your settings menu.
                </Text>
                <TouchableButton  TouchableStyles={[Theme.Button.btnPink]}
                                  TextStyles={[Theme.Button.btnPinkText]}
                                  text={"Cash Out on Pepo.com"}
                                  onPress={MultipleClickHandler(() => this.onRedemptionWebViewClick())}
                          />
            </View>
        )
    }

    getRedemptionMarkup = () => {
        return (
            <View style={inlineStyles.viewWrapper}>
                <Text style={inlineStyles.heading}>Buy {this.getPepoCornsName()}</Text>
                <Image source={this.getPepoCornsImageSource()} style={{ width: 80, height: 80, marginBottom: 20}}></Image>
                <Text style={inlineStyles.subText1}>
                    {this.getPepoCornsName()} are elusive creatures that only exist in Pepo.{" "}
                    {this.getPepoCornsName()} can be only be purchased with Pepo Coins
                </Text>
                <View style={inlineStyles.subSection}>
                    <Text style={inlineStyles.heading2} >How many {this.getPepoCornsName()} do you want to buy?</Text>
                    <View style={inlineStyles.formInputWrapper}>
                        <FormInput
                            editable={true}
                            onChangeText={this.onPepoCornChange}
                            style={[Theme.TextInput.textInputStyle]}
                            value={this.state.pepoCorns}
                            placeholder="Pepocorns"
                            fieldName="pepo_corns"
                            placeholderTextColor="#ababab"
                            keyboardType="decimal-pad"
                            blurOnSubmit={true}
                            errorStyle={{display: "none"}}
                            onFocus={this.onPepoCornFocus}
                        >
                          {this.state.pepoCorns}  
                        </FormInput>
                        <View style={inlineStyles.valueIn}>
                            <Text>Value in <Image style={{ width: 10, height: 10 }} source={pepo_icon}></Image>{' '}{this.state.btAmout}</Text>
                        </View>
                        {/* TODO error handling */}
                        {/* <Text style={[{ textAlign: 'center', marginTop: 10 }, Theme.Errors.errorText]}> {this.state.errorMsg}</Text> */}
                        <TouchableButton    TouchableStyles={[Theme.Button.btnPink , {width: "100%"}]}
                                            TextStyles={[Theme.Button.btnPinkText]}
                                            text={"Buy with Pepocoins"}
                                            onPress={MultipleClickHandler(() => this.onConfrim())}
                          />
                        <Text style={inlineStyles.balanceText}>Your current balance: <Image style={{ width: 14, height: 14 }} source={pepo_icon}></Image>{' '}{this.toBt(this.state.balance)}</Text>  
                   </View> 
                </View>
            </View>
        );
    }

    getMarkUp = () => {
        return this.getRedemptionMarkup();
        this.getAnimation().stop() ;
        if(this.state.isLoading){
           return this.getLoadingMarkup();
        }else if( this.isError ){
            return this.getErrorMarkup();
        }else if( this.isAppUpdate ) {
            return this.getAppUpdateMarkup();
        }else if( this.state.redemptionSuccess ){
            return this.getSuccessMarkup();
        }else{
            return this.getRedemptionMarkup();
        }
    }


    render(){
        return (
            <TouchableWithoutFeedback onPressOut={this.closeModal}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                  <TouchableWithoutFeedback>
                    <View style={[inlineStyles.container]}>
                        {this.getMarkUp()}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    toBt( val ){
        const priceOracle =  Pricer.getPriceOracle() ;
        return priceOracle.fromDecimal( val ) || 0 ;
    }

    closeModal = () => {
        if(!this.state.isPurchasing){
            this.props.navigation.goBack();
            return true ;
        }
        return false;
    }
  

}


export default Redemption ;
