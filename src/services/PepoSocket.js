import io from 'socket.io-client';
import PepoApi from '../services/PepoApi';
import deepGet from "lodash/get";
import CurrentUser from '../models/CurrentUser';

export default class PepoSocket{

  constructor(userId) {
    this.userId = userId;
    this.endPoint = null;
    this.protocol = null;
    this.payload = null;
  }

  setConnectionParams(response){
      let resultType = deepGet(response, 'data.result_type');
      this.endPoint = deepGet(response, `data.${resultType}.websocket_endpoint.endpoint`);
      this.protocol = deepGet(response, `data.${resultType}.websocket_endpoint.protocol`);
      this.authKeyExpiryAt = deepGet(response, `data.${resultType}.auth_key_expiry_at`);
      this.payload = deepGet(response, `data.${resultType}.payload`);
  }

  connect() {
    new PepoApi(`/users/${this.userId}/websocket-details`)
        .get()
        .then((response) => {
            this.setConnectionParams(response);
            console.log(`${this.protocol}://${this.endPoint}?auth_key_expiry_at=${this.authKeyExpiryAt}&payload=${this.payload}`);
        })
  }

}
