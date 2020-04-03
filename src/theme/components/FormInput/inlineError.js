import React, { PureComponent } from 'react';
import { Text } from 'react-native';
import Theme from '../../../theme/styles';
import deepGet from 'lodash/get';

class InlineError extends PureComponent {
  constructor(props) {
    super(props);
  }

  getErroMsg() {
    let errors = this.props.serverErrors;
    const errorData = deepGet(errors, 'err.error_data');
    if (errorData && errorData.length) {
      for (let cnt = 0; cnt < errorData.length; cnt++) {
        let parameter = errorData[cnt]['parameter'];
        if(this.props.fieldName instanceof Array){
            for( let i = 0 ;  i< this.props.fieldName.length ; i++){
                if( parameter == this.props.fieldName[i]){
                    return errorData[cnt]['msg'];
                }
            }
        }else if (parameter == this.props.fieldName) {
            return errorData[cnt]['msg'];
        }
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <Text style={[Theme.Errors.errorText , this.props.style]}>
          { this.props.errorMsg || this.getErroMsg()}
        </Text>
      </React.Fragment>
    );
  }
}

export default InlineError;
