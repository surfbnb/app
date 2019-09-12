import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import FormInput from "../../theme/components/FormInput";
import LinearGradient from "react-native-linear-gradient";


class AddEmailScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <TouchableWithoutFeedback >
        <View style={ inlineStyles.parent }>
          <TouchableWithoutFeedback>
            <View style={[inlineStyles.container ]}>
              <Text style={[inlineStyles.desc, {marginBottom: 10, fontSize: 18}]}>Please enter email address to continue</Text>
              <Text style={[inlineStyles.desc, {fontFamily: 'AvenirNext-Regular'}]}>We will only send you important email related to you account activity and transaction.</Text>
              <FormInput
                onChangeText={{}}
                value={{}}
                placeholder="email@gmail.com"
                fieldName=""
                style={[Theme.TextInput.textInputStyle, {width: '100%', marginTop: 20, marginBottom: 10}]}
                placeholderTextColor="#ababab"
                keyboardType="numeric"
                isFocus={{}}
              />
              <LinearGradient
                colors={['#ff7499', '#ff7499', '#ff5566']}
                locations={[0, 0.35, 1]}
                style={{ borderRadius: 3, marginHorizontal: 20, borderWidth: 0, width: '100%' }}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <TouchableButton
                  TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0 }]}
                  TextStyles={[Theme.Button.btnPinkText, { fontSize: 18 }]}
                  text={"Sign Up"}
                />
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default AddEmailScreen;
