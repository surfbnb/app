import { OstWalletSdk, OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import deepGet from "lodash/get";
import { TOKEN_ID } from '../constants';

class Pricer {

    constructor(){
        this.token = null ; 
        this.pricePoints = null; 
    }

    getToken( successCallback ){
        if(this.token){
            successCallback && successCallback( this.token );
            return;
        }
        OstWalletSdk.getToken(TOKEN_ID, (token) => {
            this.token = token ; 
            successCallback && successCallback( token );
        });
    }

    getPricePoints(ostUserId , successCallback , errorCallback ){
        if( ostUserId ){
            errorCallback && errorCallback({
                success: false , 
                msg: "No user found"
            })
        }
        OstJsonApi.getPricePointForUserId(
            ostUserId,
            (res) => {
              this.pricePoints = deepGet( res , "price_point.OST") ; 
              successCallback && successCallback(this.pricePoints);
            },
            (error) => {
              if( this.pricePoints ){ //Not sure should we do this 
                successCallback && successCallback(this.pricePoints);
                return ; 
              }
              errorCallback && errorCallback(error);
            }
        );
    }

    getPriceOracleConfig(ostUserId ,  successCallback , errorCallback ){
        this.getToken((token)=>{
            this.getPricePoints(ostUserId , (pricePoints)=>{
                successCallback && successCallback( token , pricePoints );
            } , (error) => {
                errorCallback && errorCallback( error );
            });
        });
    }

}

export default new Pricer();