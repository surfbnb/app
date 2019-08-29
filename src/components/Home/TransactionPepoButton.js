import React, { PureComponent } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import Toast from '../../theme/components/NotificationToast';
import deepGet from 'lodash/get';
import clone from 'lodash/clone';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import CurrentUser from '../../models/CurrentUser';
import PepoButton from './PepoButton';
import appConfig from '../../constants/AppConfig';
import PepoApi from '../../services/PepoApi';
import pricer from '../../services/Pricer';
import Store from '../../store';
import { updateExecuteTransactionStatus, updateBalance, upsertVideoStatEntities } from '../../actions';
import ExecuteTransactionWorkflow from '../../services/OstWalletCallbacks/ExecuteTransactionWorkFlow';
import reduxGetter from '../../services/ReduxGetters';
import { ostErrors } from '../../services/OstErrors';
import Pricer from '../../services/Pricer';
import utilities from '../../services/Utilities';
import PixelCall from '../../services/PixelCall';

const mapStateToProps = (state, ownProps) => ({
  balance: state.balance,
  disabled: state.executeTransactionDisabledStatus,
  isVideoUserActivated: utilities.isUserActivated(reduxGetter.getUserActivationStatus(ownProps.userId)),
  supporters: reduxGetter.getVideoSupporters(ownProps.videoId),
  isSupporting: reduxGetter.isVideoSupported(ownProps.videoId),
  totalBt: reduxGetter.getVideoBt(ownProps.videoId, state),
  isCurrentUserActivated: CurrentUser.isUserActivated()
});

class TransactionPepoButton extends PureComponent {
  constructor(props) {
    super(props);
    this.localSupported = this.props.isSupporting;
  }

  isDisabled = () => {
    return (
      !this.isBalance() || !this.props.isCurrentUserActivated || this.props.disabled || !this.props.isVideoUserActivated
    );
  };

  isBalance = () => {
    return this.getBalanceToNumber() >= 1 ? true : false;
  };

  getBalanceToNumber = () => {
    return (this.props.balance && Number(pricer.getFromDecimal(this.props.balance))) || 0;
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
    this.workflow = new ExecuteTransactionWorkflow(this);
    OstWalletSdk.executeTransaction(
      user.ost_user_id,
      [this.toUser.ost_token_holder_address],
      [btInDecimal],
      appConfig.ruleTypeMap.directTransfer,
      this.getSdkMetaProperties(),
      this.workflow
    );
  }

  getSdkMetaProperties() {
    const metaProperties = clone(appConfig.metaProperties);
    if (this.props.videoId) {
      metaProperties['name'] = 'video';
      metaProperties['details'] = `vi_${this.props.videoId}`;
    }
    return metaProperties;
  }

  onRequestAcknowledge(ostWorkflowContext, ostWorkflowEntity) {
    this.sendTransactionToPlatform(ostWorkflowEntity);
    this.dropPixel();
  }

  dropPixel() {
    let pixelParams = {
      e_entity: 'video',
      e_action: 'contribution',
      e_data_json: {
        video_id: this.props.videoId,
        profile_user_id: this.props.userId,
        amount: this.btAmount
      },
      p_type: 'feed'
    };
    PixelCall(pixelParams);
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

  onSdkError(error) {
    this.syncData(1000);
    Toast.show({
      text: ostErrors.getErrorMessage(error),
      icon: 'error'
    });
  }

  getSendTransactionPlatformData(ostWorkflowEntity) {
    return {
      ost_transaction: deepGet(ostWorkflowEntity, 'entity'),
      ost_transaction_uuid: deepGet(ostWorkflowEntity, 'entity.id'),
      meta: {
        vi: this.props.videoId
      }
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

    let videoStats = reduxGetter.getVideoStats(this.props.videoId),
      updateVideoStats = false;
    if (totalBt && totalBt > 0) {
      videoStats['total_amount_raised_in_wei'] = Pricer.getToDecimal(totalBt);
      updateVideoStats = true;
    }

    if (supporters && !this.props.isSupporting) {
      videoStats['total_contributed_by'] = supporters;
      updateVideoStats = true;
    }

    if (updateVideoStats) {
      Store.dispatch(upsertVideoStatEntities(utilities._getEntityFromObj(videoStats)));
    }
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
            id={this.props.videoId}
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

export default connect(mapStateToProps)(withNavigation(TransactionPepoButton));
