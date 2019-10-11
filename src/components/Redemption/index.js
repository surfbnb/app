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
import toastError from '../../assets/toast_error.png';
import pepoCorn from '../../assets/PepoCornActive.png';
import tx_success from '../../assets/transaction_success_star.png';
import Utilities from '../../services/Utilities';
import MultipleClickHandler from '../../services/MultipleClickHandler';


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
        //TODO i dont know.
        this.isError =  false ;
        this.setState({isLoading: false});
    }

    onFetchRedemptionConfigError( error ){
        this.state.errorMsg = ostErrors.getErrorMessage( error  , "redemption_error");
        this.isError = true ;
        this.setState({isLoading: false});
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
                <Text> {msg || "Please wait, we are getting your Pepocorns" }</Text>
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
                    Success, you have {this.state.pepoCorns} new Pepocorns, you can also view them in your settings menu
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
                <Text style={inlineStyles.heading}>Buy Pepocorns</Text>
                <Image source={pepoCorn} style={{ width: 30, height: 30, marginBottom: 20}}></Image>
                <Text style={inlineStyles.subText1}>Pepocorns are elusive creatures that only exist in Pepo. They are currently un-chained but we are working on that.</Text>
                <View style={inlineStyles.subSection}>
                    <Text style={inlineStyles.heading2} >How many Pepocorns do you want to buy?</Text>
                    {/* TODO converstion display */}
                    <Text style={inlineStyles.subText2}>Pepocorns can be only be purchased with Pepo Coins 1 Pepocorn = 1 Pepocoin</Text>
                    <View style={inlineStyles.formInputWrapper}>
                        <FormInput
                            editable={true}
                            onChangeText={this.onPepoCornChange}
                            value={this.state.pepoCorns}
                            placeholder="Pepocorns"
                            fieldName="pepo_corns"
                            placeholderTextColor="#ababab"
                            keyboardType="decimal-pad"
                            blurOnSubmit={true}
                            onFocus={this.onPepoCornFocus}
                        />
                        <Text style={[{ textAlign: 'center', marginTop: 10 }, Theme.Errors.errorText]}> {this.state.errorMsg}</Text>
                        <TouchableButton    TouchableStyles={[Theme.Button.btnPink]}
                                            TextStyles={[Theme.Button.btnPinkText]}
                                            text={"Buy"}
                                            onPress={MultipleClickHandler(() => this.onConfrim())}
                          />
                   </View> 
                </View>
            </View>
        );
    }

    getMarkUp = () => {
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

    closeModal = () => {
        if(!this.state.isPurchasing){
            this.props.navigation.goBack();
            return true ;
        }
        return false;
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

  

}


export default Redemption ;
