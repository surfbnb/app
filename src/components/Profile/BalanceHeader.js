import React, { Component } from 'react';
import { View, Text} from 'react-native';
import PriceOracle  from "../../services/PriceOracle";
import { TOKEN_ID } from '../../constants';
import currentUserModal from "../../models/CurrentUser";
import { OstWalletSdk, OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import utilities from "../../services/Utilities";
import deepGet from "lodash/get";


class BalanceHeader extends Component {

    constructor(props){
        super(props);
        this.state = {
            balInBt : 0,
            balInUsd: 0
        }
        this.fetching =false;
        this.initDefaults();
        this.updatePricePoint(); 
    }

    initDefaults(){
        this.priceOracle = null;
    }

    componentDidUpdate(){
        if( !!this.props.toRefresh ){
            this.getBalance();
        }
    }
    
    updatePricePoint() {
        const ostUserId = currentUserModal.getOstUserId();
        if( !currentUserModal.isUserActivated() ){
            return;
        }
        OstWalletSdk.getToken(TOKEN_ID, (token) => {
          OstJsonApi.getPricePointForUserId(
            ostUserId,
            (pricePoints) => {
                this.initPriceOracle(token ,  pricePoints );
                this.getBalance();
            },
            (ostError) => {
            }
          );
        });
      }
     
    initPriceOracle( token , pricePoints ){
        this.priceOracle = new PriceOracle(utilities.getPriceOracleConfig(token, pricePoints));
    }  

    getBalance(  ){
        if( !this.priceOracle || this.fetching ){
            return ;
        }
        this.fetching = true ; 
        const ostUserId = currentUserModal.getOstUserId();
        OstJsonApi.getBalanceForUserId( ostUserId ,  (res)=> {
            this.updateBalance( res );
        } , (err)=> {
            this.fetching = false;
        })
    }


    updateBalance( res ){
        this.fetching = false;
        let btBalance = deepGet( res , "balance.available_balance"); 
        btBalance = this.priceOracle.fromDecimal( btBalance );
        btBalance = this.priceOracle.toBt( btBalance );
        let usdBalance = this.priceOracle.btToFiat( btBalance ); 
        this.setState({ balInBt :btBalance , balInUsd:  usdBalance });
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <Text>Your Balance</Text>
                <Text>P {this.state.balInBt}</Text>
                <Text>$ {this.state.balInUsd} </Text>
            </View>
        );
    }

}

export default BalanceHeader ; 