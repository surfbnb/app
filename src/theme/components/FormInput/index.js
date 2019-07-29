import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import Theme from '../../../theme/styles';
import deepGet from 'lodash/get';

class FormInput extends Component {
  constructor(props) {
    super(props);
    this.state = { errorMsg: null };
  }

  validate() {
    let errors = this.props.serverErrors,
      msg = '';
    const errorData = deepGet(errors, 'err.error_data');
    if (errorData && errorData.length) {
      for (let cnt = 0; cnt < errorData.length; cnt++) {
        let parameter = errorData[cnt]['parameter'];
        if (parameter == this.props.fieldName) {
          msg = errorData[cnt]['msg'];
          break;
        }
      }
    }
    if (msg) {
      this.props.errorHandler && this.props.errorHandler(msg);
    }
    this.setState({ errorMsg: msg });
  }

  componentDidMount() {
    if (this.props.isFocus) {
      this.refs[this.props.fieldName].focus();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.serverErrors !== this.props.serverErrors) {
      this.validate();
    }
    if (prevProps.isFocus != this.props.isFocus && this.props.isFocus) {
      this.refs[this.props.fieldName].focus();
    }
  }

  onChange(val) {
    this.setState({ errorMsg: null });
    this.props.onChangeText && this.props.onChangeText(val);
  }

  render() {
    let props = { ...this.props, ...{ ref: this.props.fieldName } };
    return (
      <React.Fragment>
        <TextInput
          {...props}
          onChangeText={(val) => {
            this.onChange(val);
          }}
          style={[
            this.props.style,
            (this.state.errorMsg || this.props.errorMsg) ? Theme.Errors.errorBorder : {}
          ]}
        />
        <Text style={Theme.Errors.errorText}>
          { this.props.errorMsg || this.state.errorMsg }
        </Text>
      </React.Fragment>
    );
  }
}

export default FormInput;
