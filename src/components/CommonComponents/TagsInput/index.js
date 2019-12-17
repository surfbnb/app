import React, { PureComponent } from 'react';
import { View, Dimensions, Text, Animated} from 'react-native';
import { FlatList, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import PepoApi from '../../../services/PepoApi';
import CustomTextInput from './CustomTextInput';
import deepGet from 'lodash/get';
import unescape from 'lodash/unescape';
import DataContract from "../../../constants/DataContract";
import inlineStyles from "./styles";
import ProfilePicture from "../../ProfilePicture";

class TagsInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hashTagsData: [],
      mentionsData: [],
      keyword: ''
    };
    this.value = this.props.initialValue;
    this.reqTimer = 0;
    this.wordIndex = -1;
    this.indexWord = null;
    this.isTrackingStarted = false;
    this.customTextInputRef = null;
  }

  fetchHashTags = (keyword) => {
    clearTimeout(this.reqTimer);
    const reqParam = keyword.substr(1);
    this.reqTimer = setTimeout(() => {
      if (!reqParam) return;
      new PepoApi(DataContract.tags.userTags)
        .get(  {...{q: reqParam},...(this.props.extraParams || {})} )
        .then((res) => {
          this.openTagsPanel(res);
        })
        .catch((error) => {});
    }, 300);
  };


  fetchMentions = (keyword) => {
    clearTimeout(this.reqTimer);
    const reqParam = keyword.substr(1);
    this.reqTimer = setTimeout(() => {
      //if (!reqParam) return;
      new PepoApi(DataContract.mentions.userMentions)
        .get({...{q: reqParam},...(this.props.extraParams || {})})
        .then((res) => {
          this.openMentionsPanel(res);
        })
        .catch((error) => {});
    }, 300);
  };

  getWordAtIndex(str, pos) {
    // Perform type conversions.
    str = String(str);
    pos = Number(pos) >>> 0;

    // Search for the word's beginning and end.
    var left = str.slice(0, pos + 1).search(/\S+$/),
      right = str.slice(pos).search(/\s/);

    // The last word in the string is a special case.
    if (right < 0) {
      return str.slice(left);
    }
    // Return the word, using the located bounds to extract it from the string.
    return str.slice(left, right + pos);
  }

  shouldCallOnEmptyData = (wordAtIndex) => {
      return this.props.mentionsCallWithEmptyChars && this.props.mentionsCallWithEmptyChars.includes(wordAtIndex);
  };


  onChangeText = (val) => {
    const location = this.location - 1,
      currentIndexChar = val.charAt(location),
      isValidChar = this.isValidChar(currentIndexChar),
      wordAtIndex = this.getWordAtIndex(val, location),
      isHashTag = this.isHashTag(wordAtIndex),
      isMention = this.isMention(wordAtIndex);
      let callWithoutData = this.shouldCallOnEmptyData(wordAtIndex);
    if (isValidChar && isHashTag || isMention || callWithoutData) {
      this.wordIndex = location;
      this.indexWord = wordAtIndex;
      this.startTracking();
      (isHashTag || callWithoutData) && this.fetchHashTags(wordAtIndex);
      (isMention || callWithoutData)  && this.fetchMentions(wordAtIndex);
    } else {
      this.closeSuggestionsPanel();
    }
    this.changeValue(val);
  };


  setCustomInputRef = ( ref )=> {
    this.customTextInputRef = ref;
  }

  changeValue = (val) => {
    this.customTextInputRef.textInputRef.setNativeProps({
      "text": val
    });
    this.value = val;
    this.props.onChangeVal(val);
  };

  isHashTag(val) {
      const hastagRegex = /(?:\s|^)#[A-Za-z0-9\-\.\_]+(?:\s|$)/g;
      return hastagRegex.test(val);
  };

  inIncludeMentions(){
    return this.props.mentions && this.props.mentions.includes("@");
  }

  isMention(val){
    if(this.inIncludeMentions()) {
      const mentionRegex = /(?:\s|^)@[A-Za-z0-9\-\.\_]+(?:\s|$)/g;
      return mentionRegex.test(val);
    }
    return false;
  };

  isValidChar(val) {
    const spaceRegex = /\s/g;
    return val && !spaceRegex.test(val);
  }

  locationGetter = (event) => {
    this.location = event && event.nativeEvent && event.nativeEvent.selection && event.nativeEvent.selection.start;
  };

  openTagsPanel(res) {
    if (!this.isTrackingStarted) return;
    if ( deepGet(res , "data.meta.search_kind") === "tags" ) {
      let resultTypeTags = res.data.result_type;
      if ( !resultTypeTags ) {
        return;
      }
      let results = res.data[resultTypeTags];
      this.setState({ mentionsData:[], hashTagsData: results});
      if ( results && results.length ) {
        this.triggerOnSuggestionsPanelOpen();  
      } else {
        this.triggerOnSuggestionsPanelClose();
      }
    }
  }

  openMentionsPanel(res) {
    if (!this.isTrackingStarted) return;
    if ( deepGet(res , "data.meta.search_kind") == "users") {
      let resultTypeMentions = res.data.result_type;
      if ( !resultTypeMentions ) {
        return;
      }
      let results = res.data[resultTypeMentions];
      this.setState({hashTagsData:[], mentionsData: results});
      this.triggerOnSuggestionsPanelOpen();
      if ( results && results.length ) {
        this.triggerOnSuggestionsPanelOpen();  
      } else {
        this.triggerOnSuggestionsPanelClose();
      }
    }
  }

  closeSuggestionsPanel() {
    this.stopStracking();
    this.setState({ hashTagsData: [], mentionsData: [] });
    this.triggerOnSuggestionsPanelClose();
  }

  triggerOnSuggestionsPanelOpen() {
    if( this.props.onSuggestionsPanelOpen ) {
      this.props.onSuggestionsPanelOpen();
    }
  }

  triggerOnSuggestionsPanelClose() {
    if ( this.props.onSuggestionsPanelClose ) {
      this.props.onSuggestionsPanelClose();  
    }
  }

  startTracking() {
    this.isTrackingStarted = true;
  }

  stopStracking() {
    this.isTrackingStarted = false;
  }

  _keyExtractor = (item, index) => `id_${item.id}`;

  _renderHashTagItem = ({ item }) => {
    const HashRow = this.props.hashResultRowComponent || HashResultRowComponent ;
    return (
      <TouchableOpacity onPress={() => this.onHashSuggestionTap(item)} style={{paddingLeft: 8}}>
        {/* Hashtags do not include special character like '&' today, but unescaped if they start supporting*/}
        <HashRow val={unescape(item.text)} />
      </TouchableOpacity>
    );
  };

  _renderMentionsItem = ({ item }) => {
    const MentionRow = this.props.mentionResultRowComponent || MentionResultRowComponent ;
    return (
      <TouchableOpacity onPress={() => this.onMentionSuggestionTap(item)} style={{paddingLeft: 8}}>
        <MentionRow userName={unescape(item.user_name)} name={unescape(item.name)} userId={item.id} />
      </TouchableOpacity>
    );
  };

  onHashSuggestionTap(item ) {
    this.closeSuggestionsPanel();
    const wordToReplace = this.getWordAtIndex(this.value, this.wordIndex),
      isHashTag = this.isHashTag(wordToReplace);
    if (isHashTag) {
      const startIndex = this.getStartIndex(this.value, this.wordIndex),
        endIndex = this.getEndIndex(this.value, this.wordIndex),
        replaceString = `#${item.text} `,
        newString = this.replaceBetween(startIndex, endIndex, replaceString);
      this.changeValue(newString);
    }
  }

  onMentionSuggestionTap(item ) {
    this.closeSuggestionsPanel();
    const wordToReplace = this.getWordAtIndex(this.value, this.wordIndex),
      isMention = this.isMention(wordToReplace);
    if (isMention || this.shouldCallOnEmptyData(wordToReplace)){
      const startIndex = this.getStartIndex(this.value, this.wordIndex),
        endIndex = this.getEndIndex(this.value, this.wordIndex),
        replaceString = `@${item.user_name} `,
        newString = this.replaceBetween(startIndex, endIndex, replaceString);
      this.changeValue(newString);
    }
  }

  replaceBetween(start, end, replaceString) {
    return this.value.substring(0, start) + replaceString + this.value.substring(end);
  }

  getStartIndex(text, index) {
    let startIndex = index,
      charAtIndex = text.charAt(index);
    while (charAtIndex && this.isValidChar(charAtIndex)) {
      --startIndex;
      if (startIndex < 0) {
        // startIndex = 0;
        break;
      }
      charAtIndex = text.charAt(startIndex);
    }
    return startIndex + 1;
  }

  getEndIndex(text, index) {
    let endIndex = index,
      charAtIndex = text.charAt(index),
      maxIndex = text.length;
    while (charAtIndex && this.isValidChar(charAtIndex)) {
      ++endIndex;
      if (endIndex >= maxIndex) break;
      charAtIndex = text.charAt(endIndex);
    }
    return endIndex;
  }

  isHastagData(){
    return this.state.hashTagsData && this.state.hashTagsData.length > 0 ;
  }

  isMentionsData(){
    return this.state.mentionsData && this.state.mentionsData.length > 0 ;
  }

  render() {
    return (
      <React.Fragment>
        <CustomTextInput
          ref={this.setCustomInputRef}
          textInputStyles={[this.props.textInputStyles, this.props.inputBoxStyle]}
          value={this.value}
          submitEvent={() => {
            this.props.submitEvent(this.value);
          }}
          locationGetter={this.locationGetter}
          onChangeText={this.onChangeText}
          placeholderText={this.props.placeholderText}
          autoFocus={this.props.autoFocus}
          maxLength={this.props.maxLength}
        />
        <View
          style={[{
            position: 'absolute',
            top: 122,
            maxHeight: Dimensions.get('window').height - 350,
            backgroundColor: '#fff',
          } , this.props.dropdownStyle ]}>
              {this.isHastagData() ?
              <FlatList
                keyboardDismissMode={"on-drag"}
                keyboardShouldPersistTaps={'always'}
                bounces={false}
                horizontal={this.props.horizontal}
                enableEmptySections={true}
                data={this.state.hashTagsData}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderHashTagItem}
              /> : this.isMentionsData() && (
                  <FlatList
                keyboardDismissMode={"on-drag"}
                keyboardShouldPersistTaps={'always'}
                bounces={false}
                horizontal={this.props.horizontal}
                enableEmptySections={true}
                data={this.state.mentionsData}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderMentionsItem}
              />
              )
            }
        </View>
      </React.Fragment>
    );
  }
}


const HashResultRowComponent = (props) => (
  <View style={inlineStyles.suggestionTextWrapper}>
    <Text style={inlineStyles.suggestionText}>{`#${props.val}`}</Text>
  </View>
);

const MentionResultRowComponent = (props) => (
  <View style={[inlineStyles.suggestionTextWrapper, {flexDirection: 'row', alignItems: 'center'}]}>
    <ProfilePicture userId={props.userId} style={{height: 40, width: 40, borderRadius: 20}}/>
    <View style={{marginLeft: 10}}>
      <Text style={[inlineStyles.suggestionText, inlineStyles.mentionsTitle]}>{`${props.name}`}</Text>
      <Text style={[inlineStyles.suggestionText, inlineStyles.mentionSubTitle]}>{`@${props.userName}`}</Text>
    </View>
  </View>
);

export default TagsInput;
