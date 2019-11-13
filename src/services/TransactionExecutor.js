import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import {ensureDeivceAndSession} from '../helpers/TransactionHelper';
import ExecuteTransactionWorkflow from '../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import Pricer from "../services/Pricer";
import deepGet from 'lodash/get';
import PepoApi from '../services/PepoApi';
import CurrentUser from "../models/CurrentUser";
import AppConfig from '../constants/AppConfig';
import ReduxGetters from './ReduxGetters';


/***
 * Mandatory config
 *      - apiEndpoint
 *      - metaProperties
 * 
 * Optional config 
 *      - ruleName
 * 
 * CallBack 
 *  onDeviceUnauthorized 
 *  onEnsureDeivceAndSessionSuccess 
 *  onEnsureDeivceAndSessionError
 *  onRequestAcknowledge
 *  onFlowInterrupt
 *  onPlatfromAcknowledgeSuccess
 *  onPlatfromAcknowledgeError
 *  onPlatfromAcknowledgeComplete
 */

class TransactionExecutor {

    constructor( config , callbacks ){
        this.config =  config || {};
        this.callbacks =  callbacks || {};
    }

    sendTransactionToSdk(btAmount=0 , toUserId , validateSession=true  ) {
        const btInDecimal = Pricer.getToDecimal(btAmount);
        this.setToUser( toUserId );

        if( !validateSession ){
            return this._executeTransaction(btInDecimal);
        }

        ensureDeivceAndSession(CurrentUser.getOstUserId(), btInDecimal, (device) => {
          this._deviceUnauthorizedCallback(device);
        }, (errorMessage, success) => {
          this._ensureDeivceAndSessionCallback(btInDecimal,errorMessage, success);
        });
    }

    setToUser( toUserId ){
        this.toUser = ReduxGetters.getUser( toUserId ) || {};
    }

    _deviceUnauthorizedCallback(device){
        this.callbacks.onDeviceUnauthorized && this.callbacks.onDeviceUnauthorized( device );
    }

    _ensureDeivceAndSessionCallback(btInDecimal,errorMessage, success){
        if( success ){
            this.callbacks.onEnsureDeivceAndSessionSuccess && this.callbacks.onEnsureDeivceAndSessionSuccess( btInDecimal,errorMessage, success );
            return this._executeTransaction(btInDecimal);
        }

        if( errorMessage ){
            this.callbacks.onEnsureDeivceAndSessionError && this.callbacks.onEnsureDeivceAndSessionError( btInDecimal,errorMessage, success );
        }
    }

    _executeTransaction(btInDecimal) {
        this.workflow = new ExecuteTransactionWorkflow(this);
        OstWalletSdk.executeTransaction(
          CurrentUser.getOstUserId(),
          [this.toUser.ost_token_holder_address],
          [btInDecimal],
          this.config.ruleName || AppConfig.ruleTypeMap.directTransfer,
          this.getSdkMetaProperties(),
          this.workflow
        );
    }

    getSdkMetaProperties() {
        return this.config.metaProperties || {};
    }

    onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
        this.sendTransactionToPlatform(ostWorkflowEntity);
        this.callbacks.onRequestAcknowledge && this.callbacks.onRequestAcknowledge( ostWorkflowContext, ostWorkflowEntity );
    }

    onFlowInterrupt(ostWorkflowContext, error) {
        this.callbacks.onFlowInterrupt && this.callbacks.onFlowInterrupt( ostWorkflowContext, error );
    }

    sendTransactionToPlatform(ostWorkflowEntity) {
        const params = this.getSendTransactionPlatformData(ostWorkflowEntity);
        const apiEndpoint = this.config.apiEndpoint || '/ost-transactions';
        new PepoApi(apiEndpoint)
          .post(params)
          .then((res) => {
            this.callbacks.onPlatfromAcknowledgeSuccess && this.callbacks.onPlatfromAcknowledgeSuccess(res);
          })
          .catch((error) => {
            this.callbacks.onPlatfromAcknowledgeError && this.callbacks.onPlatfromAcknowledgeError(error);
          })
          .finally(() => {
            this.callbacks.onPlatfromAcknowledgeComplete && this.callbacks.onPlatfromAcknowledgeComplete();
          });
      }

    getSendTransactionPlatformData(ostWorkflowEntity) {
        const params =  {
            ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
            ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id')
        };
        return params;
    }


}

export { TransactionExecutor };
