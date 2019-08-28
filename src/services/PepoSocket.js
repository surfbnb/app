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

            console.log(`Connecting to socket server https://${this.endPoint}`);

            this.socket = io(`https://${this.endPoint}?auth_key_expiry_at=${this.authKeyExpiryAt}&payload=${this.payload}`, {
                jsonp: false,
                transports: ['websocket']
            });

            this.socket.on('connect', () => {
                console.log(`Connected to socket server https://${this.endPoint} successfully!`);
            });

            this.socket.on('connect_error', (err) => {
                console.log(`Error connecting to socket server https://${this.endPoint}:`, err);
            });

            this.socket.on('disconnect', (reason) => {
                console.log(`Disconnected from socket server https://${this.endPoint}`, reason);
                if (reason === 'io server disconnect') {
                    // the disconnection was initiated by the server, you need to reconnect manually
                    this.connect();
                }
            });

            this.socket.on('pepo-stream', payload => {
                console.log('Socket payload pepo-stream:: ', payload);
            })

        });
  }



}
