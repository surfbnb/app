import PepoApi from "../services/PepoApi";
import { Toast } from 'native-base';

function fetchUser(userId,  successCallback , errorCallback , finallyCallback ){
    new PepoApi(`/users/${userId}/profile`)
    .get()
    .then((res) => {
        if(successCallback ){
            successCallback( res ); 
        }else{
            if (!res || !res.success) {
                Toast.show({
                  text: ostErrors.getErrorMessage(res),
                  buttonText: 'OK'
                });
            }
        }
    })
    .catch((error) => {
        if(errorCallback){
            errorCallback( error )
        }else{
            Toast.show({
                text: ostErrors.getErrorMessage(error),
                buttonText: 'OK'
            });
        }
    })
    .finally(() => {
        finallyCallback && finallyCallback();
    });

} 


export { fetchUser } ; 
