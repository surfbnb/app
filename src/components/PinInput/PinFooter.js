import React from 'react';
import { Text, KeyboardAvoidingView, Platform } from 'react-native';
import inlineStyles from './styles';
import InAppBrowser from '../../services/InAppBrowser';
import multipleClickHandler from '../../services/MultipleClickHandler';
import { WEB_ROOT } from '../../constants/index';

export default () => {
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : -500;
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
      <Text style={inlineStyles.termsPoliciesInfoText}>By creating your wallet, you agree to our</Text>
      <Text style={inlineStyles.termsPoliciesLinkText}>
        <Text
            onPress={multipleClickHandler(() => {
                InAppBrowser.openBrowser(`${WEB_ROOT}/terms`);
            })}
        > Terms of Service </Text>
        <Text style={{ fontWeight: '300', color: '#484848' }}>and</Text>
        <Text
            onPress={multipleClickHandler(() => {
                InAppBrowser.openBrowser(`${WEB_ROOT}/privacy`);
            })}
        > Privacy Policy </Text>
      </Text>
    </KeyboardAvoidingView>
  );
};
