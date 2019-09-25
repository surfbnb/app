import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    BackHandler,
    Platform,
    Animated,
    Easing,
    ScrollView,
    Dimensions,
    Image
  } from 'react-native';

import TouchableButton from "../../theme/components/TouchableButton";
import Theme from '../../theme/styles';

import deepGet from "lodash/get";
import PepoApi from "../../services/PepoApi";
import StorePayments from "../../services/StorePayments";
import { paymentEvents,  paymentEventsMap } from "../../helpers/PaymentEvents";
import inlineStyles from './styles';
import dataContract from "../../constants/DataContract";
import {OstWalletSdk} from "@ostdotcom/ost-wallet-sdk-react-native";

import pepoTxIcon from "../../assets/pepo-tx-icon.png";
import toastError from '../../assets/toast_error.png';
import pepoIcon from '../../assets/self-amount-pepo-icon.png';
import mailIcon from '../../assets/mail-filled.png';
import CurrentUser from '../../models/CurrentUser';
import AppConfig from '../../constants/AppConfig';
import { ostErrors } from '../../services/OstErrors';

class StoreProductsScreen extends PureComponent{

    constructor(props){
        super(props); 

        this.state = {
            loadingProducts : true,
            isPurchasing : false,
            rotate: new Animated.Value(0),
            scale: new Animated.Value(0.1)
        }

        this.productIds = [];
        this.products = [];
        this.thresholdLimit = 50;
        this.isProductFetchError = false;
        this.maxThresholdReached = false;
        this.deviceUnAuthorised =  false;
        this.checkDeviceAuthorized();
    }

    componentDidMount(){
        paymentEvents.on( paymentEventsMap.paymentIAPSuccess, this.onPaymentProcessed);
        paymentEvents.on( paymentEventsMap.paymentIAPError, this.onPaymentProcessed);
        paymentEvents.on( paymentEventsMap.paymentBESyncSuccess , ()=> {
            this.props.navigation.goBack();
        } );
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount(){
        this.onFetchSuccess = () => {};
        this.onFetchError = () => {};
        this.onFetchStoreProductSuccess = () => {};
        this.onPaymentProcessed = () => {};
        paymentEvents.removeListener(paymentEventsMap.paymentIAPSuccess);
        paymentEvents.removeListener(paymentEventsMap.paymentIAPError);
        paymentEvents.removeListener( paymentEventsMap.paymentBESyncSuccess);
        BackHandler.removeEventListener('hardwareBackPress');
    }

    isDevicesAuthorized( device ) {
       return device && device.status && device.status.toLowerCase() == AppConfig.deviceStatusMap.authorized;
    }

    checkDeviceAuthorized = () => {
        OstWalletSdk.getCurrentDeviceForUserId(CurrentUser.getOstUserId(), ( device )=> {
            if(this.isDevicesAuthorized( device )){
              this.fetchProducts();
            }else{
                this.deviceUnAuthorised = true;
                this.onFetchError();
            }
        })
    }

    fetchProducts = () => {
       const params = {"os": Platform.OS.toLowerCase()};
       new PepoApi(dataContract.payments.getAllProductsApi)
        .get(params)
        .then((res) => {
            if(res && res.success){
                this.onFetchSuccess(res);
            }else{
                this.onFetchError(res);
            }
        })
        .catch((error) => {
            this.onFetchError(error);
        })
    }

    onFetchSuccess(res){
        this.setProductIds(res);
        this.maxThresholdReached = this.isMaxLimitReached(res) ;
        this.fetchProductsFromStore();
    }

    isMaxLimitReached( res ){
        const limitReached =  deepGet(res,  dataContract.payments.purchaseThresholdReachedKeyPath) ,
              limit = deepGet(res,  dataContract.payments.purchaseThresholdValueKeyPath) 
        ; 
        if(limit){
            this.thresholdLimit = limit ;
        }
        if( limitReached == 1 ){
            return true;
        }
        return false ;
    }

    setProductIds( res ){
        const   result_type = deepGet(res, dataContract.common.resultType),
                products = deepGet(res, `data.${result_type}`); 
        this.productIds = products.map( (product) => {
            return product.id ; 
        }); 
    }

    fetchProductsFromStore = () =>{
        StorePayments.getProductsFromStore(this.productIds , this.onFetchStoreProductSuccess , this.onFetchError )
    }

    onFetchStoreProductSuccess = ( products ) => {
        this.products = products ;  
        this.setState({ loadingProducts : false});
    }

    onFetchError = (error) => {
        this.isProductFetchError =  true ;
        this.setState({ loadingProducts : false});
    }

    onRequestPurchase = ( skuId ) => {
        if(!skuId) return;
        paymentEvents.emit(paymentEventsMap.paymentIAPStarted);
        this.productId = skuId ; 
        this.setState({isPurchasing: true});
        //View controll ends here. 
        StorePayments.requestPurchase( skuId );
    }

    onPaymentProcessed = ( ) => {
        this.setState({isPurchasing: false});
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

    getLoadingMarkup = () => {
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
                <Text>Fetching Topup Options</Text>
            </View>
        )
    }

    getErrorMarkup = (errorMsg) => {
        return (
            <View style={inlineStyles.viewWrapper}>
                <Image source={toastError} style={{ width: 30, height: 30, marginBottom: 20}}></Image>
                <Text style={{textAlign: "center"}}>
                  {errorMsg || ostErrors.getUIErrorMessage("top_not_available")} 
                </Text>
            </View>
        )  
    }

    getThresholdReachedMarkUp = () => {
        return (
            <View style={[inlineStyles.viewWrapper, {marginHorizontal: 20}]} >
               <View style={{paddingHorizontal: 10, paddingVertical: 15, borderWidth: 1, borderColor: '#ff7499', flexDirection: "row" , alignItems: "center", borderRadius: 3}}>
                 <Image source={mailIcon} style={{ width: 45, height: 45}}></Image>
                 <Text style={{textAlign: "left" , marginLeft: 10}}>
                   You have exceeded the Topup limit of ${this.thresholdLimit}{" "}
                   Contact us on info@pepo.com to increase your topup limit.
                 </Text>
               </View>
            </View>
        )
    }

    getDeviceUnAutorizedMarkup(){
        return this.getErrorMarkup(ostErrors.getUIErrorMessage("device_unathorized"));
    }

    getNoProductsMarkUp = () => {
        return this.getErrorMarkup();
    }

    getProductsMarkUp = () => {
        return (
            <View style={inlineStyles.poductListWrapper}>
                <View style={inlineStyles.headerWrapper}>
                    <Text style={inlineStyles.modalHeader}>Top-Up Pepo Coins</Text>
                </View>
                <ScrollView>
                  {this.products.map(( product) => (
                      <View key={ product.productId } style={inlineStyles.poductListRow}>
                          <View style={{flexDirection: "row", alignItems: 'center'}}>
                              <Image source={pepoIcon} style={{ width: 19, height: 19 }}/>
                              <Text style={[inlineStyles.topUpName, {marginLeft: 5}]}>{product.title}</Text>
                          </View>
                          <TouchableButton
                                  disabled={this.state.isPurchasing}
                                  TouchableStyles={[Theme.Button.btnPink , inlineStyles.pepoBtnStyle]}
                                  TextStyles={[Theme.Button.btnPinkText]}
                                  text={this.state.isPurchasing && this.productId == product.productId ? "..." : product.price}
                                  onPress={() => {this.onRequestPurchase(product.productId) }}
                          />
                      </View>
                  ))}
                </ScrollView>
            </View>    
        )
    }

    getMarkUp = () => {
        this.getAnimation().stop() ;
        if(this.deviceUnAuthorised){
            return this.getDeviceUnAutorizedMarkup();
        }else if(this.isProductFetchError){
            return this.getErrorMarkup();
        } else if(this.maxThresholdReached){
            return this.getThresholdReachedMarkUp(); 
        }else if(this.products.length <  1 ){
            return this.getNoProductsMarkUp(); 
        }else{
            return this.getProductsMarkUp(); 
        }
    }

    closeModal = () => {
        if(!this.state.isPurchasing){
            this.props.navigation.goBack();
        }
        return true ;
    }

    handleBackButtonClick = () => {
        return this.closeModal();
    }

    render(){
        return (
            <TouchableWithoutFeedback onPressOut={this.closeModal}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                  <TouchableWithoutFeedback>
                    <View style={[inlineStyles.container, {height:  Dimensions.get('window').height / 2 } ]}>
                        {/*<View style={inlineStyles.dragger}></View>*/}
                        {this.state.loadingProducts && this.getLoadingMarkup()}
                        {!this.state.loadingProducts && this.getMarkUp()}
                    </View>
                  </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

export default StoreProductsScreen  ;