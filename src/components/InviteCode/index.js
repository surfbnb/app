import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import TouchableButton from '../../theme/components/TouchableButton';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import FormInput from "../../theme/components/FormInput";
import LinearGradient from "react-native-linear-gradient";


class InviteCodeScreen extends React.Component {

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
              <Text style={[inlineStyles.desc, {marginBottom: 10, fontSize: 18}]}>Looks like your account is not whitelisted</Text>
              <Text style={[inlineStyles.desc, {fontFamily: 'AvenirNext-Regular'}]}>To activite your account you can either join via a invite link enter a referal code below.</Text>
              <FormInput
                onChangeText={{}}
                value={{}}
                placeholder="1-2-2-1-2-1"
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
                  text={"Enter"}
                />
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default InviteCodeScreen;
