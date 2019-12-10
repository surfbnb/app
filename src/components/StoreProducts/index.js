import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  Easing,
  ScrollView,
  Dimensions,
  Image, TouchableOpacity
} from 'react-native';

import TouchableButton from "../../theme/components/TouchableButton";
import Theme from '../../theme/styles';

import deepGet from "lodash/get";
import PepoApi from "../../services/PepoApi";
import StorePayments from "../../services/StorePayments";
import { paymentEvents,  paymentEventsMap } from "../../helpers/PaymentEvents";
import inlineStyles from './styles';
import dataContract from "../../constants/DataContract";

import pepoTxIcon from "../../assets/pepo-tx-icon.png";
import toastError from '../../assets/toast_error.png';
import pepoIcon from '../../assets/self-amount-pepo-icon.png';
import mailIcon from '../../assets/mail-filled.png';
import { ostErrors } from '../../services/OstErrors';
import CommonStyle from '../../theme/styles/Common';
import modalCross from "../../assets/modal-cross-icon.png";

class StoreProductsScreen extends PureComponent{

    constructor(props){
        super(props);

        this.state = {
            loadingProducts : true,
            isPurchasing : false,
            rotate: new Animated.Value(0),
            scale: new Animated.Value(0.1),
            showCrossIcon : false
        }

        this.productIds = [];
        this.products = [];
        this.thresholdLimit;
        this.isProductFetchError = false;
        this.maxThresholdReached = false;
        this.fetchProducts();
    }

    componentDidMount(){
        paymentEvents.on( paymentEventsMap.paymentIAPSuccess, this.onPaymentProcessed);
        paymentEvents.on( paymentEventsMap.paymentIAPError, this.onPaymentProcessed);
        paymentEvents.on( paymentEventsMap.paymentBESyncSuccess , ()=> {
            this.props.navigation.goBack();
        } );
    }

    componentWillUnmount(){
        this.onFetchSuccess = () => {};
        this.onFetchError = () => {};
        this.onFetchStoreProductSuccess = () => {};
        this.onPaymentProcessed = () => {};
        paymentEvents.removeListener(paymentEventsMap.paymentIAPSuccess);
        paymentEvents.removeListener(paymentEventsMap.paymentIAPError);
        paymentEvents.removeListener( paymentEventsMap.paymentBESyncSuccess);
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

    arrangeProducts = ( products ) =>{
      console.log("products",products);
      console.log("productIds",this.productIds);
      for(let i = 0 ; i < this.productIds.length ; i++){
        let productId = this.productIds[i];
        for(let j = 0 ; j < products.length ; j++){
          if( products[j].productId == productId ){
            this.products.push(products[j]);
            break;
          }
        }
      }

    }


    onFetchStoreProductSuccess = ( products ) => {

        this.arrangeProducts( products );
        console.log("this.products",this.products);
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
            <View style={[inlineStyles.poductListWrapper , {height: Dimensions.get('window').height * 0.50}]}>
                <View style={inlineStyles.headerWrapper}>
                    <Text style={inlineStyles.modalHeader}>Top-Up Pepo Coins</Text>
                </View>
                <ScrollView>
                  {this.products.map(( product) => (
                    <TouchableWithoutFeedback key={ product.productId }>
                      <View style={inlineStyles.poductListRow}>
                          <View style={{flexDirection: "row", alignItems: 'center'}}>
                              <Image source={pepoIcon} style={{ width: 19, height: 19 }}/>
                              <Text style={[inlineStyles.topUpName, {marginLeft: 5}]}>{product.title && product.title.replace(/\s\(Pepo.*\)+/ig , "") || product.title }</Text>
                          </View>
                          <TouchableButton
                                  disabled={this.state.isPurchasing}
                                  TouchableStyles={[Theme.Button.btnPink , inlineStyles.pepoBtnStyle]}
                                  TextStyles={[Theme.Button.btnPinkText]}
                                  text={this.state.isPurchasing && this.productId == product.productId ? "..." :  product.localizedPrice || product.price }
                                  onPress={() => {this.onRequestPurchase(product.productId) }}
                          />
                      </View>
                    </TouchableWithoutFeedback>
                  ))}
                </ScrollView>
            </View>
        )
    }

    getMarkUp = () => {
        this.getAnimation().stop() ;
        this.setState({
          showCrossIcon : true
        });
        if(this.isProductFetchError){
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
        this.props.navigation.goBack();
    }

  getCrossIconMarkup = () =>{
      return(
        <TouchableOpacity
          onPress={() => {
            this.closeModal();
          }}
          style={inlineStyles.crossIconWrapper}
          disabled={this.state.isPurchasing}
        >
          <Image source={modalCross} style={inlineStyles.crossIconSkipFont} />
        </TouchableOpacity>
      )
  }

    render(){
        return (
            <TouchableWithoutFeedback onPressOut={this.closeModal}>
                <View style={[CommonStyle.modalViewContainer]}>
                  <TouchableWithoutFeedback>
                    <View style={[inlineStyles.container]}>
                        {this.state.showCrossIcon && this.getCrossIconMarkup()}
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
