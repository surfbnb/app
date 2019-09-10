import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import  { purchaseUpdatedListener,purchaseErrorListener } from 'react-native-iap';
import StorePayments from "../../services/StorePayments";
import CurrentUser from '../../models/CurrentUser';

let purchaseUpdateSubscription , purchaseErrorSubscription ;

const mapStateToProps = (state, ownProps) => {
    return {
      userId : CurrentUser.getUserId() 
    };
};

class PaymentWorker extends PureComponent {

    constructor(props){
        super(props);
    }

    componentDidMount() {
        purchaseUpdateSubscription = purchaseUpdatedListener(( res ) => {
            console.log("purchaseUpdateSubscription" , res);
            this.onRequestPurchaseSuccess( res ); 
        });

        purchaseErrorSubscription = purchaseErrorListener((error) => {
            console.log("purchaseUpdateSubscription" , error);
            this.onRequestPurchaseError(error);
        });
    }

    componentWillUnmount(){
        if (purchaseUpdateSubscription) {
            purchaseUpdateSubscription.remove();
            purchaseUpdateSubscription = null;
        }
         if (purchaseErrorSubscription) {
            purchaseErrorSubscription.remove();
            purchaseErrorSubscription = null;
        }
    }

    componentDidUpdate( ){
        if(this.props.userId){
            StorePayments.snycPendingPayments( this.props.userId );
        }
    }

    onRequestPurchaseSuccess = ( res ) => {
        StorePayments.onRequestPurchaseSuccess( res , CurrentUser.getUserId() ) ; 
     }
 
     onRequestPurchaseError = ( error  ) => {
        StorePayments.onRequestPurchaseError( error , CurrentUser.getUserId() ) ; 
     }

     render(){
         return <React.Fragment />;
     }

}

export default connect(mapStateToProps)(PaymentWorker);