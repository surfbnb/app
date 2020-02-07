import deepGet from 'lodash/get';
import Utilities from './Utilities';

const sdkErrors = {
  USER_NOT_ACTIVATED: 'User is not activated.',
  SESSION_NOT_FOUND: 'Please check your spending limit.',
  DEVICE_UNAUTHORIZED: 'Device is unauthorized.',
  GENERAL_ERROR: 'Something went wrong please try again later.',
  WORKFLOW_CANCELLED: 'Workflow Cancelled'
};

const UIErros = {
  user_name: 'Usernames can be max 15 characters and can only include letters, numbers, or underscore.',
  user_name_min_max: 'Usernames can be max 15 characters and can only include letters, numbers, or underscore.',
  password: 'Please enter password of minimum 8 characters.',
  first_name: 'First name is mandatory.',
  last_name: 'Last name is mandatory',
  user_not_found: 'User not found.',
  general_error: 'Something went wrong. Please try again later',
  general_error_ex: 'Oops, Please try again.',
  bt_amount_error: 'Minimum amount allowed is 1 Pepo.',
  bt_amount_decimal_error: 'Only . or , is allowed as decimals',
  bt_amount_decimal_allowed_error: 'Only 2 decimals are allowed',
  user_not_active: 'Please wait for your user activation.',
  no_internet: 'No Internet, please try again later.',
  maxAllowedBt: `Visit user's profile to send more Pepo Coins.`,
  name: 'Name is required',
  payment_failed_error : `Transaction failed. Please check your ${Utilities.getNativeStoreName()} account.`,
  init_iap_payment: "Failed to initalize in app payments, please try again later.",
  payment_acknowledge_to_be: "We are not able to connect to our servers right now. We will try again and  update your transaction status soon. Please do not uninstall the app until then.",
  payment_invalid: `Transaction failed in ${Utilities.getNativeStoreName()}. Please check your ${Utilities.getNativeStoreName()} account.`,
  payment_pending: `Transaction is still being processed at ${Utilities.getNativeStoreName()}. Please check your ${Utilities.getNativeStoreName()} account.`,
  payment_cancelled: `Transaction has been canceled by ${Utilities.getNativeStoreName()}. Please check your ${Utilities.getNativeStoreName()} account.`,
  pending_transaction_poll: 'We are not able to connect to the server. Your transaction status will be updated shortly.',
  invite_code_error: 'Enter a valid invite code.',
  email_error: 'Enter a valid email.',
  device_unathorized: "Your device is not authorized. Please authorized the device.",
  top_not_available: "Topup not available at this time, we are looking into it. Please check back later.",
  delete_video_error:"Unable to delete Video at this moment.",
  redemption_error : "Failed to redeem, please try again later",
  max_pepocorns: `Sorry, you don't have enough Pepo Coins to buy this many ${Utilities.getPepoCornsName()}`,
  price_point_validation_failed: `Sorry, you don't have enough Pepo Coins to buy this many ${Utilities.getPepoCornsName()}`,
  min_pepocorns: `Minimum amount allowed is 1 ${Utilities.getPepoCornsName()}.`,
  bt_exceeds_bal_amount_error : `Sorry, you don't have enough Pepo Coins for this transactions.`,
  video_reply_not_allowed: 'Reply is not allowed for this video.',
  video_reply_not_allowed_low_bal: (requiredPepo) => `Reply for ${requiredPepo} Pepo Coins.`,
  channel_unmute_failure : "Community unmute failed.",
  channel_mute_failure : "Community mute failed.",
  report_channel_failure : "Community report failed.",
  leave_channel_failure : "Community leave failed",
  share_via_qrcode_failure : "Error in share via QR Code",
  pay_user_via_qrcode_failure : "Error in pay via QR Code "

};

const UIWhitelistedErrorCode = {
  no_internet: 'no_internet'
};

class OstErrors {
  getErrorMessage(ostError, generalErrorKey) {
    if (this.isWhiteListedErrorCode(ostError)) return null;

    generalErrorKey = generalErrorKey || 'GENERAL_ERROR';
    if (ostError && ostError.getApiErrorMessage) {
      return deepGet(ostError, 'error.api_error.msg');
    }

    if (ostError && ostError.getErrorCode) {
      let errorCode = ostError.getErrorCode();
      let errorMessage = sdkErrors[errorCode] || sdkErrors[generalErrorKey];
      //return errorMessage + ' ' + errorCode;
      return errorMessage;
    }

    const errorData = deepGet(ostError, 'err.error_data');
    if (errorData && errorData.length > 0) {
      return;
    }

    let errorMessage = deepGet(ostError, 'err.msg') || sdkErrors[generalErrorKey] || UIErros[generalErrorKey];
    if (errorMessage) {
      return errorMessage;
    }
  }

  isWhiteListedErrorCode(ostError) {
    return !!UIWhitelistedErrorCode[ostError];
  }

  getUIErrorMessage(key) {
    return UIErros[key];
  }
}

const ostErrors = new OstErrors();

export { ostErrors, UIWhitelistedErrorCode };
