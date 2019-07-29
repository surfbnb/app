import React from 'react';
import { Text, Alert, KeyboardAvoidingView, View, Linking, Platform } from 'react-native';
import inlineStyles from './styles';

export default () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : -500;
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
      <Text style={inlineStyles.termsPoliciesInfoText}>By Creating Your Wallet, you Agree to our</Text>
      <Text style={inlineStyles.termsPoliciesLinkText}>
        <Text onPress={() => Alert.alert('todo: TOS link')}> Terms of Service </Text>
        <Text style={{ fontWeight: '300', color: '#484848' }}>and</Text>
        <Text onPress={() => Alert.alert('todo: PP link')}> Privacy Policy </Text>
      </Text>
    </KeyboardAvoidingView>
  );
};
