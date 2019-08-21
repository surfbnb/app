import io from 'socket.io-client';
import PepoApi from '../services/PepoApi';

const socket = io(
  'http://stagingpepo.com:4000?auth_key_expiry_at=1565688022&payload=YzY5N2VkYzMyNDNmZGU1OTM0YmE2MDE2ZjQwMTJkYjU5MjEzZDEzMjJlMTM4MTkzNzI5NDVjMWJmNGI3YmRkYjIwNmYyOTJkNTg2MDE3NTVhYzQyODFkYWE4ZjBhNmQ4MGQ0YzkwZTBiOGY3ZWU1OGMyY2I1ZDlmZTRkZGExMGJmMTE3YmY5NmE0NjE4OTU2ODY3NDU5ZjJhMTY1NTE2OA=='
);

let init = () => {
  new PepoApi('users/:user_id/websocket-details')
    .get()
    .then((res) => {
      console.log('------success');
    })
    .catch((error) => {
      console.log('------error', error);
    });
  socket.on('connect', function() {
    alert('socket connected!!');
  });
  socket.on('connect_error', (err) => {
    console.log('socket ------' + err);
  });
};

export default {
  init: init
};
