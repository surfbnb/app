import io from 'socket.io-client';
import PepoApi from '../services/PepoApi';
import deepGet from 'lodash/get';

import { upsertNotificationUnread } from '../actions';
import Store from '../store';

if (!window.location) {
  // App is running in simulator
  window.navigator.userAgent = 'ReactNative';
}

export default class PepoSocket {
  constructor(userId) {
    this.userId = userId;
    this.endPoint = null;
    this.protocol = null;
    this.payload = null;
    this.socket = null;
    this.isConnecting = false;
  }

  setConnectionParams(response) {
    let resultType = deepGet(response, 'data.result_type');
    this.endPoint = deepGet(response, `data.${resultType}.websocket_endpoint.endpoint`);
    this.protocol = deepGet(response, `data.${resultType}.websocket_endpoint.protocol`);
    this.authKeyExpiryAt = deepGet(response, `data.${resultType}.auth_key_expiry_at`);
    this.payload = deepGet(response, `data.${resultType}.payload`);
  }

  connect() {

    if(this.isConnecting) {
      console.log(`Socket instance is connecting, aborting...`);
      return;
    }

    console.log(`Getting websocket details to connect...`);

    this.isConnecting = true;
    new PepoApi(`/users/${this.userId}/websocket-details`).get().then((response) => {
      this.setConnectionParams(response);

      console.log(`Connecting to socket server ${this.protocol}://${this.endPoint}`);

      this.socket = io(
        `${this.protocol}://${this.endPoint}?auth_key_expiry_at=${this.authKeyExpiryAt}&payload=${this.payload}`,
        {
          jsonp: false,
          transports: ['websocket'],
          reconnectionAttempts: 10
        }
      );

      this.socket.on('connect', () => {
        console.log(`Connected to socket server ${this.protocol}://${this.endPoint} successfully!`);
        this.isConnecting = false;
      });

      this.socket.on('connect_error', (err) => {
        console.log(`Error connecting to socket server ${this.protocol}://${this.endPoint} reason:`, err);
        this.isConnecting = false;
      });

      this.socket.on('disconnect', (reason) => {
        console.log(`Disconnected from socket server ${this.protocol}://${this.endPoint} reason: ${reason}`);
        this.isConnecting = false;
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          this.connect();
        }
      });

      this.socket.on('pepo-stream', (payload) => {
        if (payload && payload.notification_unread) {
          Store.dispatch(upsertNotificationUnread(payload.notification_unread));
        }
      });
    });
  }

  disconnect() {
    if(this.socket){
      console.log(`Disconnecting from socket server ${this.protocol}://${this.endPoint}`);
      this.socket.close();
    }
  }
}
