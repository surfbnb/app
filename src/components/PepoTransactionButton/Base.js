import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import Toast from '../../theme/components/NotificationToast';
import deepGet from 'lodash/get';
import assignIn from "lodash/assignIn";

import CurrentUser from '../../models/CurrentUser';
import PepoButton from './PepoButton';
import appConfig from '../../constants/AppConfig';
import PepoApi from '../../services/PepoApi';
import pricer from '../../services/Pricer';
import Store from '../../store';
import { updateExecuteTransactionStatus, updateBalance } from '../../actions';
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import reduxGetter from '../../services/ReduxGetters';
import { ostErrors } from '../../services/OstErrors';
import { ostSdkErrors } from '../../services/OstSdkErrors';
import Pricer from '../../services/Pricer';
import utilities from '../../services/Utilities';
import PixelCall from '../../services/PixelCall';
import {ON_USER_CANCLLED_ERROR_MSG, ensureDeivceAndSession} from '../../helpers/TransactionHelper';
import {VideoPlayPauseEmitter} from "../../helpers/Emitters";


class Base extends PureComponent {
  constructor(props) {
    super(props);
    this.localSupported = this.props.isSupporting;
  }

  isDisabled = () => {
    return (
       this.props.userId == CurrentUser.getUserId() || !this.isBalance() || !this.props.isCurrentUserActivated || this.props.disabled || !this.props.isEntityUserActivated
    );
  };

  isBalance = () => {
    return this.getBalanceToNumber() >= 1 ? true : false;
  };

  getBalanceToNumber = () => {
    return (this.props.balance && Math.floor(Number(pricer.getFromDecimal(this.props.balance)))) || 0;
  };

  getBtAmount = () => {
    let btAmount = Pricer.getToBT(Pricer.getFromDecimal(this.props.totalBt), 2) || 0;
    return Number(btAmount);
  };

  get toUser() {
    return reduxGetter.getUser(this.props.userId);
  }

  sendTransactionToSdk(btAmount) {
    const user = CurrentUser.getUser();
    // const option = { wait_for_finalization: false };
    const btInDecimal = pricer.getToDecimal(btAmount);
    ensureDeivceAndSession(user.ost_user_id, btInDecimal, (device) => {
      this._deviceUnauthorizedCallback(device);
    }, (errorMessage, success) => {
      this._ensureDeivceAndSessionCallback(btAmount,errorMessage, success);
    });
  }

  _ensureDeivceAndSessionCallback(btAmount, errorMessage, success) {

    const btInDecimal = pricer.getToDecimal(btAmount);
    VideoPlayPauseEmitter.emit('play');
    if ( success ) {
      return this._executeTransaction(btInDecimal);
    }

    if ( errorMessage ) {
      if ( ON_USER_CANCLLED_ERROR_MSG === errorMessage) {
        //Cancel the flow.
        this.syncData(1000);
        return;
      }

      // Else: Show the error message.
      this.syncData(1000);
      Toast.show({
        text: errorMessage,
        icon: 'error'
      });

    }
  }

  _deviceUnauthorizedCallback( device ) {
    //Cancel the flow.
    this.syncData(1000);

    this.props.navigation.push('AuthDeviceDrawer', { device });
  }

  _executeTransaction(btInDecimal) {
    this.workflow = new ExecuteTransactionWorkflow(this);
    OstWalletSdk.executeTransaction(
      CurrentUser.getOstUserId(),
      [this.toUser.ost_token_holder_address],
      [btInDecimal],
      appConfig.ruleTypeMap.directTransfer,
      this.getSdkMetaProperties(),
      this.workflow
    );
  }

  getSdkMetaProperties() {
    throw "Overwrite";
  }

  onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
    this.sendTransactionToPlatform(ostWorkflowEntity);
    this.dropPixel();
  }

  getDropPixel(){
    throw "Overwrite";
  }

  dropPixel() {
    //TODO @Ashutosh , confrim from @Akshay
    PixelCall(this.getDropPixel());
  }

  onFlowInterrupt(ostWorkflowContext, error) {
    this.onSdkError(error, ostWorkflowContext);
  }

  sendTransactionToPlatform(ostWorkflowEntity) {
    const params = this.getSendTransactionPlatformData(ostWorkflowEntity);
    new PepoApi('/ost-transactions')
      .post(params)
      .then((res) => {})
      .catch((error) => {})
      .finally(() => {
        this.syncData();
      });
  }

  onSdkError(error, ostWorkflowContext) {
    this.syncData(1000);
    let errMsg;
    if ( ostWorkflowContext ) {
      errMsg = ostSdkErrors.getErrorMessage(ostWorkflowContext, error);
    } else {
      errMsg = ostErrors.getErrorMessage(error);
    }
    Toast.show({
      text: errMsg,
      icon: 'error'
    });
  }

  getSendTransactionPlatformData(ostWorkflowEntity) {
    return {
      ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
      ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id')
    };
  }

  onTransactionIconWrapperClick = () => {
    utilities.checkActiveUser() && CurrentUser.isUserActivated(true);
  };

  reduxUpdate(isTXBtnDisabled, balance, totalBt, supporters) {
    if (isTXBtnDisabled !== undefined) {
      Store.dispatch(updateExecuteTransactionStatus(isTXBtnDisabled));
    }

    if (balance) {
      balance = pricer.getToDecimal(balance);
      Store.dispatch(updateBalance(balance));
    }

    this.reduxEntityUpdate( totalBt, supporters );
  }

  reduxEntityUpdate( totalBt, supporters  ){
     throw "OverWrite";
  }

  onPressOut = (btAmount, totalBt) => {
    this.onLocalUpdate(btAmount, totalBt);
    this.sendTransactionToSdk(btAmount);
  };

  onLocalUpdate(btAmount) {
    this.btAmount = btAmount;
    let expectedTotal = this.getBtAmount() + btAmount;
    this.localSupported = true;
    this.reduxUpdate(true, this.getBalanceToUpdate(btAmount), expectedTotal, this.props.supporters + 1);
  }

  getBalanceToUpdate(updateAmount, isRevert) {
    if (!updateAmount) return;
    let balance = pricer.getFromDecimal(this.props.balance);
    balance = (balance && Number(balance)) || 0;
    updateAmount = (updateAmount && Number(updateAmount)) || 0;
    if (isRevert) {
      return balance + updateAmount;
    } else {
      return balance - updateAmount;
    }
  }

  onMaxReached = () => {
    Toast.show({
      text: ostErrors.getUIErrorMessage('maxAllowedBt'),
      icon: 'error'
    });
  };

  syncData(timeOut) {
    this.props.resyncDataDelegate && this.props.resyncDataDelegate();
    pricer.getBalance();
    setTimeout(() => {
      this.reduxUpdate(false);
      if (!this.props.isSupporting) {
        this.localSupported = false;
      }
    }, timeOut);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this.onTransactionIconWrapperClick}>
        <View>
          <PepoButton
            count={this.getBtAmount()}
            isSelected={this.props.isSupporting || this.localSupported}
            id={this.props.entityId}
            disabled={this.isDisabled()}
            maxCount={this.getBalanceToNumber()}
            onMaxReached={this.onMaxReached}
            onPressOut={this.onPressOut}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Base.defaultProps = {
  getPixelDropData: () => {
    throw "error";
  }
};

export default Base;
