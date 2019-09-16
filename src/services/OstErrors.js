import deepGet from 'lodash/get';

const sdkErrors = {
  USER_NOT_ACTIVATED: 'User is not activated.',
  SESSION_NOT_FOUND: 'Please check your spending limit.',
  DEVICE_UNAUTHORIZED: 'Device is unauthorized.',
  GENERAL_ERROR: 'Something went wrong please try again later.'
};

const UIErros = {
  user_name: 'User name is mandatory.',
  user_name_min_max: 'User name can be minimum 1 characters and maximum 15 characters.',
  password: 'Please enter password of minimum 8 characters.',
  first_name: 'First name is mandatory.',
  last_name: 'Last name is mandatory',
  user_not_found: 'User not found.',
  general_error: 'Something went wrong. Please try again later',
  general_error_ex: 'Oops, Please try again.',
  bt_amount_error: 'Please enter valid amount.',
  bt_amount_decimal_error: 'Only . is allowed as decimails',
  bt_amount_decimal_allowed_error: 'Only 2 decimals are allowed',
  user_not_active: 'Please wait for your user activation.',
  no_internet: 'No Internet, please try again later.',
  maxAllowedBt: `Max allowed Pepo coin transfer reached`,
  name: 'Name is mandatory.',
  payment_failed_error : "Unable to process the payment.",
  init_iap_payment: "Failed to initalize in app payments, please try again later.",
  payment_acknowledge_to_be: "The in app transaction is complete, we  have noted it on device. We are facing some problem BE problems. Will update soon",
  payment_invalid: "This is invalid payment, please contact in app store",
  payment_pending: "We have noted your order, will update your balance once processed.",
  payment_cancelled: "The payment was cancelled",
  pending_transaction_poll: "Failed to check status please wait",
  invite_code_error: 'Enter a valid invite code.',
  email_error: 'Enter a valid email.'
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

    let errorMessage = deepGet(ostError, 'err.msg') || sdkErrors[generalErrorKey];
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
