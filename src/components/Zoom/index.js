import React, {PureComponent} from 'react';
import {Text, View, TextInput, TouchableOpacity, Keyboard} from 'react-native';
import Colors from "../../theme/styles/Colors";
import BackArrow from '../CommonComponents/BackArrow';
import inlineStyle from './styles'

import PepoNativeHelper from '../../helpers/PepoNativeHelper';
import CurrentUser from "../../models/CurrentUser";
import reduxGetter from '../../services/ReduxGetters';
import SafeAreaView from 'react-native-safe-area-view';

class ZoomMeeting extends PureComponent {
  static navigationOptions = (options) => {
    return {
      title: 'Join meeting',
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerTitleStyle: {
        fontFamily: 'AvenirNext-Medium'
      },
      headerBackImage: <BackArrow />
    };
  };

  constructor(props) {
    super(props);

    this.meetingId = "";
    this.password = "";

  }

  componentDidMount() {

  }

  meetingIdChanged = (val) => {
    this.meetingId = String(val);
  };

  passwordChanged = (val) => {
    this.password = String(val);
  };

  onPrimaryActionButtonTapped = () => {
    let loggedInUser = CurrentUser.getLogedinUser();
    let userName = reduxGetter.getUserName(loggedInUser.id);
    PepoNativeHelper.startZoomChat(this.meetingId, userName);
    Keyboard.dismiss();
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1,backgroundColor: Colors.white}}>
        <View>
          <View style={{ margin: 20 }}>
            <TextInput style={inlineStyle.textInput}
                       onChangeText={text => this.meetingIdChanged(text)}
                       autoCompleteType={"off"}
                       autoCorrect={false}
                       autoFocus={true}
                       keyboardType={"number-pad"}
                       placeholder={"Meeting Id"}
            />
          </View>

          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => this.onPrimaryActionButtonTapped()}
            underlayColor='#fff'>
            <Text style={styles.primaryActionText}>Join Meeting</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }

}

export default ZoomMeeting
