import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';
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
      headerBackImage: <BackArrow />
    };
  };

  constructor(props) {
    super(props);
    this.initialVal = this.props.navigation.getParam('initialValue') || '';
    this.onChangeTextDelegate = this.props.navigation.getParam('onChangeTextDelegate');
  }

  submitEvent = (value) => {
    this.onChangeTextDelegate && this.onChangeTextDelegate(value.trim());
    this.props.navigation.goBack();
  };

  render() {
    return (
      <View style={{ padding: 20 }}>
        <TagsInput
          horizontal={this.props.horizontal}
          initialValue={this.initialVal}
          onChangeTextDelegate={this.onChangeTextDelegate}
          placeholderText="Bio"
          submitEvent={this.submitEvent}
          searchResultRowComponent={SearchResultRowComponent}
          textInputStyles={inlineStyles.multilineTextInput}
        />
      </View>
    );
  }
}

const SearchResultRowComponent = (props) => (
  <View style={inlineStyles.suggestionTextWrapper}>
    <Text style={inlineStyles.suggestionText}>{`#${props.val}`}</Text>
  </View>
);

export default withNavigation(BioScreen);
