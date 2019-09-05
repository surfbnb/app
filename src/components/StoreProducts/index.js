import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ActivityIndicator,
    BackHandler,
    Platform
  } from 'react-native';


import deepGet from "lodash/get";
import PepoApi from "../../services/PepoApi";
import StorePayments from "../../services/StorePayments";

import inlineStyles from './styles';

class StoreProductsScreen extends PureComponent{

    constructor(props){
        super(props); 

        this.state = {
            loadingProducts : true,
            isPurchasing : false
        }

        this.productIds = [];
        this.products = [];
        this.isProductFetchError = false;
        this.maxThresholdReached = false;
        this.fetchProducts();
    }

    componentDidMount(){
        StorePayments.events.on("paymentProcessed" , this.onPaymentProcessed);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount(){
        this.onFetchSuccess = () => {};
        this.onFetchError = () => {};
        this.onFetchStoreProductSuccess = () => {};
        this.onPaymentProcessed = () => {};
        StorePayments.events.removeListener('paymentProcessed');
        BackHandler.removeEventListener('hardwareBackPress');
    }

    fetchProducts = () => {
       const params = {"os": Platform.OS.toLowerCase()};
       new PepoApi('/users/available-products')
        .get(params)
        .then(async (res) => {
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
        const limits =  deepGet(res, 'data.limits_data') || {} ; 
        for (var key in limits) {
            if (limits[key] == 1) {
              return true;
            }
        }
        return false ;
    }

    setProductIds( res ){
        const products = deepGet(res, `data.${data.result_type}`); 
        this.productIds = products.map( (product) => {
            return product.id ; 
        }); 
    }

    fetchProductsFromStore = () =>{
        StorePayments.getProductsFromStore( this.products , this.onFetchStoreProductSuccess , this.onFetchError )
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
        this.productId = skuId ; 
        this.setState({isPurchasing: true});
          //View controll ends here. 
        StorePayments.requestPurchase( skuId );
    }

    onPaymentProcessed = ( ) => {
        this.setState({isPurchasing: false});
    }

    getErrorMarkup = () => {
        return (
            <View style={{padding: 30}}><Text>TODO UI Error Please try again</Text></View>
        )  
    }

    getThresholdReachedMarkUp = () => {
        return (
            <View tyle={{padding: 30}} ><Text>TODO UI Max Threshold reached</Text></View>
        )
    }

    getNoProductsMarkUp = () => {
        return this.getErrorMarkup();
    }

    getProductsMarkUp = () => {
        return this.products.map(( product )=> {
            <View style={{flexDirection: "row", justifyContent:"space-between" , paddingHorizontal: 20 , paddingVertical: 5}}>
                <View><Text>{product.title}</Text></View>
                <TouchableOpacity disabled={this.state.isPurchasing}
                    onPress={() => {this.onRequestPurchase(product.productId) }}>
                    <Text>{this.state.isPurchasing && this.productId == product.productId ? "..." : product.price}</Text>
                </TouchableOpacity>
            </View>
        })
    }

    getMarkUp = () => {
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
        if(this.state.isPurchasing){
            return true ; 
        }
        this.props.navigation.goBack();
        return false ;
    }

    handleBackButtonClick = () => {
        this.closeModal();
    }

    render(){
        return (
            <TouchableWithoutFeedback onPressOut={this.closeModal}>
                <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={[inlineStyles.container]}>
                        {this.state.loadingProducts && <ActivityIndicator/>}                   
                        {!this.state.loadingProducts && this.getMarkUp()}
                    </View>     
                </View>
            </TouchableWithoutFeedback>
        );
    }

}

export default StoreProductsScreen  ;