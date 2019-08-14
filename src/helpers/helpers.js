import PepoApi from '../services/PepoApi';
import Toast from '../components/NotificationToast';

function fetchUser(userId, successCallback, errorCallback, finallyCallback) {
  new PepoApi(`/users/${userId}/profile`)
    .get()
    .then((res) => {
      if (successCallback) {
        successCallback(res);
      } else {
        if (!res || !res.success) {
          Toast.show({
            text: ostErrors.getErrorMessage(res),
            icon: 'error'
          });
        }
      }
    })
    .catch((error) => {
      if (errorCallback) {
        errorCallback(error);
      } else {
        Toast.show({
          text: ostErrors.getErrorMessage(error),
          icon: 'error'
        });
      }
    })
    .finally(() => {
      finallyCallback && finallyCallback();
    });
}

export { fetchUser };
