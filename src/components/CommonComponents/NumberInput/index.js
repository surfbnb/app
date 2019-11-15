import React,{PureComponent} from 'react';
import {View,Text,TextInput} from 'react-native';

import NumberFormatter from '../../../helpers/NumberFormatter';
import { ostErrors } from '../../../services/OstErrors';
import Theme from '../../../theme/styles';

export default class NumberInput extends PureComponent{
    constructor( props ){
        super( props );
        this.state={
            value       : props.value,
            errorMsg    : null
        };
        this.numberFormatter = new NumberFormatter();
    }

    validateAndSet(val){
        let errMsg = null;
        if (!this.numberFormatter.isValidInputProvided(val)) {
          errMsg = this.getErrorMessage( val );
        }
        this.setState({
          value: val,
          valueError: errMsg
        });
    }

    getErrorMessage( val ){
      if (val && String(val).indexOf(',') > -1) {
        return ostErrors.getUIErrorMessage('bt_amount_decimal_error');
      }
      else if (val && String(val).split('.')[1] && String(val).split('.')[1].length > 2) {
        return ostErrors.getUIErrorMessage('bt_amount_decimal_allowed_error');
      } else {
        return "invalid input";
      }
    }

    onChangeText(value) {
      let formattedVal = this.numberFormatter.convertToValidFormat(value)
        , val = this.numberFormatter.getFullStopValue(formattedVal)
      ;
        this.validateAndSet(value);
        this.props.onChangeText && this.props.onChangeText(val);
    }

    render(){
        return(
          <React.Fragment>
            <View style={{flex:1,flexDirection:"column",alignItem:'flex-start',justifyContent:'center'}}>
                <TextInput
                  onChangeText={(value) => {this.onChangeText(value)}}
                  value = {this.props.value}
                  keyboardType = 'decimal-pad'

                />
                <Text style={[Theme.Errors.errorText ,  this.props.errorStyle]}>
                  { this.props.errorMsg || this.state.valueError }
                </Text>
            </View>
          </React.Fragment>
        )
    }
}


