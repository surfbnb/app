import io from 'socket.io-client';
import PepoApi from '../services/PepoApi';
import deepGet from "lodash/get";
import CurrentUser from '../models/CurrentUser';

if (!window.location) {
    // App is running in simulator
    window.navigator.userAgent = 'ReactNative';
}

export default class PepoSocket{

  constructor(userId) {
    this.userId = userId;
    this.endPoint = null;
    this.protocol = null;
    this.payload = null;
    this.socket = null;
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
            console.log(`Connecting to socket :: ${this.protocol}://${this.endPoint}?auth_key_expiry_at=${this.authKeyExpiryAt}&payload=${this.payload}`);
            const socket = io(`wss://${this.endPoint}`, {
                query: {
                    auth_key_expiry_at: this.authKeyExpiryAt,
                    payload: this.payload+'abc'
                }
            });

            //console.log(socket);

            socket.on('connect', () => {
                console.log('Connected to socket server');
            });

            socket.on('connect_error', (err) => {
                console.log('connect_error :', err)
            });

            socket.on('disconnect', () => {
                console.log("Disconnected Socket!")
            });

            socket.on('pepo-stream', payload => {
                console.log('Socket payload pepo-stream:: ', payload);
            })

        });
  }



}
