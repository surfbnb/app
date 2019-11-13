import React,{PureComponent} from 'react';
import {View,Text,TextInput} from 'react-native';

import NumberFormatter from '../../../helpers/NumberFormatter';
import { ostErrors } from '../../../services/OstErrors';

export default class NumberInput extends PureComponent{
    constructor( props ){
        super( props );
        
        this.min = 1;
        this.max = 500;
        if(props.min){
            this.min = props.min;
        }
        if(props.max){
          this.max = props.max
        }
        this.state={
            value       : props.value,
            errorMsg    : ""
        }
        this.numberFormatter = new NumberFormatter();
        
        
    }
    isValidInput(val){
        let errorMsg = this.getErrorMessage(val);
        if(errorMsg){
          this.props.onErrorCallBack(errorMsg);
            this.setState({
                value: val,
                valueError: errorMsg
              });
              return false;
        }else{

            this.setState({
                value: val,
                valueError: ""
              });
              return true;
        }
        
    }
  onChangeText(value) {
      console.log("value",value)
      let formattedVal = this.numberFormatter.convertToValidFormat(value)
        , val = this.numberFormatter.getFullStopValue(formattedVal);
          this.props.onChangeText(val);
        if(this.isValidInput(value)){
          this.setState({value : val});
        }
    }

    getErrorMessage( val ){
        if (val && String(val).indexOf(',') > -1) {
            return ostErrors.getUIErrorMessage('bt_amount_decimal_error');
          }
          if (val && String(val).split('.')[1] && String(val).split('.')[1].length > 2) {
            return ostErrors.getUIErrorMessage('bt_amount_decimal_allowed_error');
          }
          val = val && Number(val);
          if (!val || val < this.min) {
            return ostErrors.getUIErrorMessage('bt_amount_error');
          }
          if( val && val > this.max ){
            return ostErrors.getUIErrorMessage('bt_exceeds_bal_amount_error');
          }
      
          return undefined;
    }

    render(){
        return(
            <View>
                <TextInput
                onChangeText={(value) => {this.onChangeText(value)}}
                keyboardType = 'decimal-pad'
                >{this.state.value}
                </TextInput>
            </View>
        )
    }
}
