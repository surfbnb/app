import React, { PureComponent } from 'react';
import {View, Text, TouchableOpacity , Animated , TextInput , FlatList} from 'react-native';
import { withNavigation } from 'react-navigation';
import PepoApi from "../../services/PepoApi";
import BackArrow from "../CommonComponents/BackArrow";

import Theme from '../../theme/styles';
import Colors from '../../theme/styles/Colors'
import inlineStyles from './style';
const spaceRegex = /\s/g ; 


class BioScreen extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
          title: "Bio",
          headerBackImage: (<BackArrow/>)
        };
      };

    constructor(props){
        super(props);
        this.state ={
          data: [],
          value: "",
          keyword: ""
        }
        this.reqTimer = 0 ;
        this.wordIndex = -1;
        this.indexWord = null;
    }

  
    fetchHashTags = ( keyword ) => {
      clearTimeout( this.reqTimer ) ;
      this.reqTimer = setTimeout( () => {
        new PepoApi("/tags").get( "q="+keyword.substr(1))
        .then(( res ) => {
          if( res && res.data && res.data.tags ){
            this.setState({keyword: keyword,
              data: res.data.tags })
          }
        })
        .catch((error)=> { })
      } ,  300)
    }
    
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

    onChangeText = (val) => { 
      console.log("onChangeText---- " , val );
      const location          = this.location - 1 ,
            currentIndexChar  = val.charAt(location) ,
            isValidChar       =  !spaceRegex.test(currentIndexChar) ,
            wordAtIndex       = this.getWordAtIndex( val , location) ,
            hastagRegex       = /(?:\s|^)#[A-Za-z0-9\-\.\_]+(?:\s|$)/g,
            isHashTag         = hastagRegex.test( wordAtIndex ) 
       ;
       console.log("onChangeText  location ---- " , location );
       console.log("onChangeText  currentIndexChar ---- " , currentIndexChar );
       console.log("onChangeText  isValidChar ---- " , isValidChar );
       console.log("onChangeText  wordAtIndex ---- " , wordAtIndex );
       console.log("onChangeText  isHashTag ---- " , isHashTag );
      if( isValidChar && isHashTag ){
          this.wordIndex = location; 
          this.indexWord = wordAtIndex; 
          console.log("onChangeText inside location ---- " , location );
          console.log("onChangeText inside wordAtIndex ---- " , wordAtIndex );
          this.fetchHashTags( wordAtIndex );
      } else{
        this.closeSuggestionsPanel();
      }
      this.setState({ value: val });
    }

    locationGetter = ( event )=> {
      this.location = event && event.nativeEvent && event.nativeEvent.selection && event.nativeEvent.selection.start ;
    }

    openSuggestionsPanel() {
     //TODO 
    }
  
    closeSuggestionsPanel() {
     //TODO 
    }

    _keyExtractor = (item, index) => `id_${item.id}` ;

    _renderItem = ({ item }) => {
      return (
        <TouchableOpacity style={inlineStyles.suggestionTextWrapper} onPress={() => this.onSuggestionTap(item)}>
          <Text style={inlineStyles.suggestionText}>{`#${item.text}`}</Text>
        </TouchableOpacity>
      )
    }
  
    onSuggestionTap( item ) {
      //Hide panel 
      //Replace text with the selected text
    }

    render() {
        return (
          <View style={{padding:20}}>
            <TextInput 
              style={[Theme.TextInput.textInputStyle,inlineStyles.multilineTextInput]}
              onSelectionChange={this.locationGetter}
              onChangeText={this.onChangeText}
              multiline={true}
              value={this.state.value}
              placeholder={'Bio'}
              multiline = {true}
              numberOfLines = {4}
            />

            <FlatList
              keyboardShouldPersistTaps={"always"}
              horizontal={this.props.horizontal}
              enableEmptySections={true}
              data={this.state.data}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
            />
        </View>
        )
    }
}

export default withNavigation( BioScreen );