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
            fetching: true,
            balInBt : 0,
            balInUsd: 0
        }
        this.baseState = this.state;
        this.initDefaults();
    }

    initDefaults(){
        this.priceOracle = null;
    }

    componentWillMount(){
        this.initBalance();
    }

    componentWillUnmount(){
        this.setState( this.baseState );
        this.initDefaults();
    }

    componentWillUpdate(){
        if( this.props.isToRefresh ){
            this.getBalance();
        }
    }
    
    initBalance(){
        this.updatePricePoint();
    }

    updatePricePoint() {
        const ostUserId = currentUserModal.getOstUserId();
        if( !currentUserModal.isUserActivated() ){
            this.onBalanceStateChange();
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
                this.onBalanceStateChange();
            }
          );
        });
      }
     
    initPriceOracle( token , pricePoints ){
        this.priceOracle = new PriceOracle(utilities.getPriceOracleConfig(token, pricePoints));
    }  

    getBalance(  ){
        if( !this.priceOracle ){
            this.onBalanceStateChange();
        }
        const ostUserId = currentUserModal.getOstUserId();
        OstJsonApi.getBalanceForUserId( ostUserId ,  (res)=> {
            this.updateBalance( res );
        } , (err)=> {
            this.onBalanceStateChange();
        })
    }

    onBalanceStateChange(){
        this.setState({ fetching: false });
    }

    updateBalance( res ){
        let btBalance = deepGet( res , "balance.available_balance"); 
        btBalance = this.priceOracle.fromDecimal( btBalance );
        btBalance = this.priceOracle.toBt( btBalance );
        let usdBalance = this.priceOracle.btToFiat( btBalance ); 
        this.setState({ balInBt :btBalance , balInUsd:  usdBalance });
        this.onBalanceStateChange();
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