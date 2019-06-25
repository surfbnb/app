import { Component } from 'react';
import { TextInput, Modal } from 'react-native';

import TouchableButton from '../../../theme/components/TouchableButton';
import CircleCloseIcon from '../../../assets/circle_close_icon.png';
import inlineStyles from '../Style';

export default class EditTxModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.showTxModal}
        onRequestClose={() => {
          props.onRequestClose();
        }}
      >
        <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={200}>
          <View style={{ height: Dimensions.get('window').height }}>
            <View style={inlineStyles.modalBackDrop}>
              <View style={inlineStyles.modelWrapper}>
                <View>
                  <TouchableOpacity
                    style={inlineStyles.modalCloseBtnWrapper}
                    onPress={() => {
                      this.onAmountModalClose();
                    }}
                  >
                    <Image source={CircleCloseIcon} style={inlineStyles.crossIconSkipFont} />
                  </TouchableOpacity>
                </View>
                <View style={inlineStyles.modalContentWrapper}>
                  <Text style={inlineStyles.modalHeader}>Enter The Amount you want to send</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.7 }}>
                      <FormInput
                        editable={true}
                        onChangeText={(val) => this.onBtChange(val)}
                        placeholder="BT"
                        fieldName="bt_amount"
                        style={Theme.TextInput.textInputStyle}
                        value={`${props.btAmount}`}
                        placeholderTextColor="#ababab"
                        errorMsg={props.btAmountErrorMsg}
                        serverErrors={props.server_errors}
                        clearErrors={props.clearErrors}
                        keyboardType="numeric"
                        isFocus={props.btAmountFocus}
                        blurOnSubmit={false}
                      />
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <TextInput
                        editable={false}
                        style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}
                      >
                        <Text>PEPO</Text>
                      </TextInput>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 0.7 }}>
                      <FormInput
                        editable={true}
                        onChangeText={(val) => props.onUSDChange(val)}
                        value={`${props.btUSDAmount}`}
                        placeholder="USD"
                        fieldName="usd_amount"
                        style={Theme.TextInput.textInputStyle}
                        placeholderTextColor="#ababab"
                        serverErrors={props.server_errors}
                        clearErrors={props.clearErrors}
                        keyboardType="numeric"
                        blurOnSubmit={true}
                      />
                    </View>
                    <View style={{ flex: 0.3 }}>
                      <TextInput
                        editable={false}
                        style={[Theme.TextInput.textInputStyle, inlineStyles.nonEditableTextInput]}
                      >
                        <Text>USD</Text>
                      </TextInput>
                    </View>
                  </View>
                  <TouchableButton
                    TouchableStyles={[Theme.Button.btnPink, { marginTop: 10 }]}
                    TextStyles={[Theme.Button.btnPinkText]}
                    text="CONFIRM"
                    onPress={() => {
                      props.onAmountModalConfirm();
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    );
  }
}
