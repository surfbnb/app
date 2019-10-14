import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Platform,
    Animated,
    Easing,
    Image,
    BackHandler,
    Linking,
    Keyboard,
    TouchableOpacity
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
import pepoCornSmall from '../../assets/PepoCorn.png';
import tx_success from '../../assets/transaction_success_star.png';
import modalCross from '../../assets/modal-cross-icon.png';
import AppUpgrade from '../../assets/app_upgrade.png';
import Utilities from '../../services/Utilities';
import MultipleClickHandler from '../../services/MultipleClickHandler';
import AppConfig from '../../constants/AppConfig';

import NumberFormatter from "../../helpers/NumberFormatter";
import CurrentUser from '../../models/CurrentUser';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import { ON_USER_CANCLLED_ERROR_MSG, ensureDeivceAndSession } from '../../helpers/TransactionHelper';
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import InAppBrowser from '../../services/InAppBrowser';

const bottomSpace = getBottomSpace([true]),
  extraPadding = 10,
  safeAreaBottomSpace = isIphoneX() ? bottomSpace : extraPadding;

const btnPreText = "Buy with Pepocoins";
const btnPostText = "Confriming...";  

/**TODO Start
 * @Preshita Keyboard avoiding view
 * @Preshita @sunil Appstore linking
 * @Preshita update store icon instead of remeeption icon in BalanceHeader file. --> Done
 * @Preshita App upgrade Screen UI--> done
 * @Preshita Complete dev test
 * @Preshita Check your name below TODO's
 * @Ashutosh confrim meta data to sdk
 * @Ashutosh PepoConrs balance fetch and display
 * @Ashutosh code refactor 
 * @Ashutosh code detail review
 *///TODO end 


class Redemption extends PureComponent{

    constructor(props){
        super(props);

        this.configResponse = null;
        this.isAppUpdate = false;
        this.isConfigFetchError = false;

        this.state = {
            btAmount: 0,
            pepoCorns : 0,
            balance: Pricer.getFromDecimal(  ReduxGetters.getBalance() ) ,
            errorMsg: null,
            isLoading: true,
            isPurchasing : false,
            redemptionSuccess : false,
            bottomPadding: safeAreaBottomSpace,
            inputFieldsEditable: true,
            exceBtnDisabled: false,
            rotate: new Animated.Value(0),
            scale: new Animated.Value(0.1),
            btnText: btnPreText
        }

        this.numberFormatter = new NumberFormatter();

        this.defaultState = {
            exceBtnDisabled: false,
            redemptionSuccess: false,
            isPurchasing: false,
            btnText: btnPreText,
            inputFieldsEditable: true,
            errorMsg: null
          }
    }

    resetState() {
        this.setState({...this.defaultState});
      }

    componentDidMount(){
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardShown.bind(this));
        this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardHidden.bind(this));

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardShown.bind(this));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardHidden.bind(this));
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.fetchRedemptionConfig();
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.onFetchRedemptionConfigSuccess = () => {};
        this.onFetchRedemptionConfigError = () => {};  
        this.onValidatePricePointSuccess = () => {};
        this.onValidatePricePointError = () => {};
        this.onTransactionSuccess = () => {};
        this.redemptionSuccess = () => {};
        this.onError = () => {};
    }

    fetchRedemptionConfig( successCallback, errorCallback ){
        new PepoApi(DataContract.redemption.configApi)
        .get()
        .then((res)=> {
            if(res && res.success){
                this.onFetchRedemptionConfigSuccess(res);
                successCallback && successCallback(res);
            }else{
                this.onFetchRedemptionConfigError(res);
                errorCallback && errorCallback( res );
            }         
        }).catch((error) =>{
            this.onFetchRedemptionConfigError(error);
            errorCallback && errorCallback( error );
        })
    }

    onFetchRedemptionConfigSuccess( res ){
        this.configResponse = res;
        this.isAppUpdate = this.__isAppUpdate(res); 
        this.setState({isLoading: false});
    }

    onFetchRedemptionConfigError( error ){
        this.isConfigFetchError = true;
        this.onError(error);
    }

    __isAppUpdate( ){
        return !!deepGet(this.configResponse , DataContract.redemption.appUpdateKeyPath);
    }

    getPepoCornEntity(){
       return deepGet(this.configResponse , `data.${deepGet(this.configResponse ,  DataContract.common.resultType)}` , {});
    }

    getPepoCornsName(){
        const pepoCornsEntity = this.getPepoCornEntity();
        return pepoCornsEntity[DataContract.redemption.pepoCornsNameKey] || AppConfig.redemption.pepoCornsName; 
    }

    getPepoCornsImageSource(){
        const pepoCornsEntity = this.getPepoCornEntity();
        const imageSrc = pepoCornsEntity[DataContract.redemption.pepoCornsImageKey];
        if( imageSrc ){
            return {uri: imageSrc};
        }
        return pepoCornsImg
    }

    getStep() {
        const pepoCornsEntity = this.getPepoCornEntity();
        let step = pepoCornsEntity[DataContract.redemption.pepoCornInputStep] || 1;
        return Number( step );
    }

    getPepoInWeiPerStep(){
        const pepoCornsEntity = this.getPepoCornEntity();
        return pepoCornsEntity[DataContract.redemption.pepoInWeiPerStep];
    }

    getBeneficiaryAddress(){
        const pepoCornsEntity = this.getPepoCornEntity();
        return pepoCornsEntity[DataContract.redemption.pepoBeneficiaryAddress];
    }

    _keyboardShown(e) {
        let bottomPaddingValue = deepGet(e, 'endCoordinates.height') || 350;
    
        if (this.state.bottomPadding == bottomPaddingValue) {
          return;
        }
    
        this.setState({
          bottomPadding: bottomPaddingValue
        });
    }
    
    _keyboardHidden(e) {
        if (this.state.bottomPadding == safeAreaBottomSpace) {
          return;
        }
        this.setState({
          bottomPadding: safeAreaBottomSpace
        });
    }

    onPepoCornChange = (val) => {
        if (!this.numberFormatter.isValidInputProvided(val)) {
            this.setState({
              pepoCorns: val,
              btAmount: 0,
              errorMsg:  this.getErrorMessage(val)
            });
            return;
          }

        let formattedVal = this.numberFormatter.convertToValidFormat(val)
        , fullStopval = this.numberFormatter.getFullStopValue(formattedVal)
        , btVal = Pricer.getBtFromPepoCorns( fullStopval , this.getStep() ,  this.getPepoInWeiPerStep()) 
        , forMattedbtVal = this.numberFormatter.getFormattedValue(String(btVal))
        ;
        this.setState({ btAmount: forMattedbtVal, pepoCorns: val , errorMsg: null   });
    }

    onConfirm = () => {
        if (this.btValidationAndError()) {
           this.beforeRedemption(); 
           this.validatePricePoint();
        }
    };
    
    btValidationAndError() {
        let btAmount = this.state.btAmount;
        btAmount = this.numberFormatter.getFullStopValue(btAmount);
        btAmount = btAmount && Number(btAmount);
        if ( btAmount > this.state.balance) {
            this.setState({errorMsg: ostErrors.getUIErrorMessage('max_pepocorns') });
            return false;
        }
        return true;
    }  
        
    beforeRedemption = () => {
        this.setState({
            exceBtnDisabled: true,
            inputFieldsEditable: false,
            btnText: btnPostText,
            isPurchasing: true,
            errorMsg: null
        });
    }

    validatePricePoint(){
        const validateParams = this.getValidateParams();
        new PepoApi(DataContract.redemption.validatePricePoint)
        .get(validateParams)
        .then((res)=> {
            if(res && res.success){
                this.onValidatePricePointSuccess(res);
            }else{
                this.onValidatePricePointError(res);  
            }
        })
        .catch((error)=> {
            this.onValidatePricePointError(res);  
        })
    }

    getValidateParams() {
        return {
            pepo_amount_in_wei : Pricer.getToDecimal(this.state.btAmount),
            pepocorn_amount: this.numberFormatter.getFullStopValue( this.state.pepoCorns ) ,
            product_id: this.getPepoCornEntity()["id"],
            pepo_usd_price_point: ReduxGetters.getUSDPrice() 
        }
    }

    onValidatePricePointSuccess(res){
        this.sendTransactionToSdk();
    }

    onValidatePricePointError(err){
       this.fetchRedemptionConfig( () => {
            this.resetState();
            this.onError(err,  null , "price_point_validation_failed");
       });
    }

    sendTransactionToSdk() {
        let btVal = this.numberFormatter.getFullStopValue(this.state.btAmount);
        const btInDecimal = Pricer.getToDecimal(btVal);
        ensureDeivceAndSession(CurrentUser.getOstUserId(), btInDecimal, (device) => {
          this._deviceUnauthorizedCallback(device);
          }, (errorMessage, success) => {
            this._ensureDeivceAndSessionCallback(errorMessage, success);
        });
    }

    _deviceUnauthorizedCallback(device) {
        this.closeModal();
        setTimeout(()=> {
            this.props.navigation.push("AuthDeviceDrawer" , {device: device});
        },100)
    }

    _ensureDeivceAndSessionCallback(errorMessage, success) {
        if (success) {
    
          let btVal = this.numberFormatter.getFullStopValue(this.state.btAmount);
          const btInDecimal = Pricer.getToDecimal(btVal);
    
          return this._executeTransaction(btInDecimal);
        }
    
        if (errorMessage) {
          if (ON_USER_CANCLLED_ERROR_MSG === errorMessage || WORKFLOW_CANCELLED_MSG === errorMessage) {
            //Cancel the flow.
            this.resetState();
            return;
          }
    
          // Else: Show the error message.
          this.showError(errorMessage);
        }
    }

    _executeTransaction(btInDecimal) {
        this.workflow = new ExecuteTransactionWorkflow(this);
        OstWalletSdk.executeTransaction(
          CurrentUser.getOstUserId(),
          [this.getBeneficiaryAddress()],
          [btInDecimal],
          AppConfig.ruleTypeMap.directTransfer,
          this.getSdkMetaProperties(),
          this.workflow
        );
      }
    
    getSdkMetaProperties() {
        const metaProperties = clone(AppConfig.redemptionMetaProperties);
        let details = "";
        details += `pid_${this.getPepoCornEntity()['id']} `;
        details += `pupp_${ReduxGetters.getUSDPrice()}`;
        details += `pca_$${this.numberFormatter.getFullStopValue(this.state.pepoCorns)}` 
        metaProperties["details"] = details;
        return metaProperties;
    }

    onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
        Pricer.getBalance();
        this.sendTransactionToPlatform(ostWorkflowContext, ostWorkflowEntity);
    }

    sendTransactionToPlatform(ostWorkflowContext, ostWorkflowEntity) {
        const params = this.getSendTransactionPlatformData(ostWorkflowEntity);
        new PepoApi('/ost-transactions')
          .post(params)
          .then((res) => {
            if (res && res.success) {
              this.onTransactionSuccess(res);
            } else {
              this.onError(res);
            }
          })
          .catch((error) => {
            this.onError(error);
          })
    }

    getSendTransactionPlatformData( ostWorkflowEntity ){
        return {
            ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
            ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id')
          };
    }
    
    onTransactionSuccess(res) {
        this.redemptionSuccess = true;
        this.resetState();
    }

    onError(error, ostWorkflowContext , errorKey) {
        if (ostWorkflowContext) {
          // workflow error.
          const errorMsg = ostSdkErrors.getErrorMessage(ostWorkflowContext, error);
          this.showError(errorMsg);
          return;
        }
    
        const errorMsg = ostErrors.getErrorMessage(error , errorKey);
        if (errorMsg) {
          this.showError(errorMsg);
          return;
        }
        const errorDataMsg = deepGet(error, 'err.error_data[0].msg');
        if (errorDataMsg) {
          this.showError(errorDataMsg);
          return;
        }
    }

    showError(errorMessage) {
        this.resetState();
        this.setState({ errorMsg: errorMessage });
    }

    getErrorMessage(val) {
        if (val && String(val).indexOf(',') > -1) {
          return ostErrors.getUIErrorMessage('bt_amount_decimal_error');
        }
        if (val && String(val).split('.')[1] && String(val).split('.')[1].length > 2) {
          return ostErrors.getUIErrorMessage('bt_amount_decimal_allowed_error');
        }
        let step = this.getStep();
        if( (val%step) !== 0  ){
            return `Please enter amount in multiples of ${step}`;
        }
        return ;
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
                  {errorMsg || ostErrors.getUIErrorMessage("redemption_error")}
                </Text>
            </View>
        )
    }

    getAppUpdateMessage(){
       return deepGet(this.configResponse , `${DataContract.redemption.appUpdateKeyPath}.${Platform.OS}.message`);
    }

    getAppUpdateCTAText(){
        return deepGet(this.configResponse , `${DataContract.redemption.appUpdateKeyPath}.${Platform.OS}.cta_text`) || 'Update';
    }

    getAppUpdateCTAUrl(){
        return deepGet(this.configResponse , `${DataContract.redemption.appUpdateKeyPath}.${Platform.OS}.cta_url`);
    }

    getAppUpdateMarkup = () => {
        return (
            <View style={inlineStyles.viewWrapper}>
                <Image source={AppUpgrade} style={{ height: 100, aspectRatio: 220/368, marginBottom: 20 }}></Image>
                <Text style={{marginBottom: 20,  textAlign: 'center'}}>
                    {this.getAppUpdateMessage()}
                </Text>
                <TouchableButton  TouchableStyles={[Theme.Button.btnPink]}
                                    TextStyles={[Theme.Button.btnPinkText]}
                                    text={this.getAppUpdateCTAText()}
                                    onPress={MultipleClickHandler(() => this.onUpdateAppClick())}
                            />
            </View>
        )
    }

    getSuccessMarkup = (msg) => {
         //TODO @Preshita , do the UI part as well --> done
        return (
            <View style={inlineStyles.successViewWrapper}>
                <Image source={tx_success} style={[{ width: 164.6, height: 160, marginBottom: 20 }]}></Image>
                <Text style={[inlineStyles.successText]}>
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
        //TODO minor UI @Preshita , Unicorn icon --> done
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
                    <View>
                       <View style={inlineStyles.formInputWrapper}>
                         <Image source={pepoCornSmall} style={inlineStyles.textInputImage}/>
                         <FormInput
                            editable={this.state.inputFieldsEditable}
                            onChangeText={this.onPepoCornChange}
                            style={[Theme.TextInput.textInputStyle, {paddingLeft: 35}]}
                            value={this.state.pepoCorns}
                            placeholder="Pepocorns"
                            fieldName="pepo_corns"
                            placeholderTextColor="#ababab"
                            keyboardType="decimal-pad"
                            blurOnSubmit={true}
                            errorStyle={{display: "none"}}
                            />
                        </View>
                        <View style={inlineStyles.valueIn}>
                            <Text>Value in <Image style={{ width: 10, height: 10 }} source={pepo_icon}></Image>{' '}{this.state.btAmount}</Text>
                        </View>
                        <Text style={[{ textAlign: 'center', marginTop: 10 }, Theme.Errors.errorText]}> {this.state.errorMsg}</Text>
                        <TouchableButton    disabled={this.state.exceBtnDisabled}
                                            TouchableStyles={[Theme.Button.btnPink , {width: "100%"}]}
                                            TextStyles={[Theme.Button.btnPinkText]}
                                            text={this.state.btnText}
                                            onPress={MultipleClickHandler(() => this.onConfirm())}
                          />
                        <Text style={inlineStyles.balanceText}>Your current balance: <Image style={{ width: 14, height: 14 }} source={pepo_icon}></Image>{' '}{this.state.balance}</Text>  
                   </View> 
                </View>
            </View>
        );
    }

    getMarkUp = () => {
        this.getAnimation().stop() ;
        if(this.state.isLoading){
           return this.getLoadingMarkup();
        }else if(this.isConfigFetchError){
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
                    <View style={[inlineStyles.container , { paddingBottom: this.state.bottomPadding }]}>
                        <View style={{position:'relative'}}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.closeModal();
                                }}
                                style={inlineStyles.crossIconWrapper}
                                disabled={this.state.isPurchasing}
                                >
                                <Image source={modalCross} style={inlineStyles.crossIconSkipFont} />
                            </TouchableOpacity>
                            {this.getMarkUp()}
                        </View>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    closeModal = () => {
        if(!this.state.isPurchasing){
            this.props.navigation.goBack();
            return true ;
        }
        return false;
    }

    handleBackButtonClick = () => {
        return this.state.isPurchasing
    }

    onUpdateAppClick = () => {
        const url = this.getAppUpdateCTAUrl();
        if(url) {
            Linking.openURL(url);
        }
    }

    onRedemptionWebViewClick = () => {
        Utilities.onRedemptionWebViewClick();
    }
  
}


export default Redemption ;
