import currentUserModal from '../models/CurrentUser';
import pricer from './Pricer';

class InitPricePoint {
  init(successCallback, errorCallback) {
    const ostUserId = currentUserModal.getOstUserId();
    pricer.getPriceOracleConfig(
      ostUserId,
      (token, pricePoints) => {
        successCallback && successCallback(token, pricePoints);
      },
      (error) => {
        errorCallback && errorCallback(error);
      }
    );
  }
}

export default new InitPricePoint();
