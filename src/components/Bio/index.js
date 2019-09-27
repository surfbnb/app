import React, { PureComponent } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { withNavigation } from 'react-navigation';

import BackArrow from '../CommonComponents/BackArrow';
import TagsInput from '../CommonComponents/TagsInput';
import Colors from '../../theme/styles/Colors';
import inlineStyles from './style';

class BioScreen extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Bio',
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
    this.initialVal = this.props.navigation.getParam('initialValue') || '';
    this.onChangeTextDelegate = this.props.navigation.getParam('onChangeTextDelegate');
    this.state = {
      count: this.initialVal.length
    };
  }

  submitEvent = (value) => {
    this.onChangeTextDelegate && this.onChangeTextDelegate(value.trim());
    this.props.navigation.goBack();
  };

  onChangeVal = (val) => {
    val = val || '';
    this.onChangeTextDelegate && this.onChangeTextDelegate(val);
    this.setState({ count: val.length });
  };

  render() {
    return (
      <ScrollView style={{ padding: 20 }} >
        <TagsInput
          horizontal={this.props.horizontal}
          initialValue={this.initialVal}
          onChangeVal={this.onChangeVal}
          placeholderText="Bio"
          submitEvent={this.submitEvent}
          searchResultRowComponent={SearchResultRowComponent}
          textInputStyles={inlineStyles.multilineTextInput}
          maxLength={300}
          autoFocus={true}
        />
        <Text style={inlineStyles.countStyle}>{this.state.count} /300</Text>
      </ScrollView>
    );
  }
}

const SearchResultRowComponent = (props) => (
  <View style={inlineStyles.suggestionTextWrapper}>
    <Text style={inlineStyles.suggestionText}>{`#${props.val}`}</Text>
  </View>
);

export default withNavigation(BioScreen);
