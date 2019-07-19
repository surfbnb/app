import React, { PureComponent } from 'react';
import {View, Text, TouchableOpacity , Animated , TextInput , FlatList} from 'react-native';
import { withNavigation } from 'react-navigation';
import PepoApi from "../../services/PepoApi";
import BackArrow from "../CommonComponents/BackArrow";

import Theme from '../../theme/styles';
import Colors from '../../theme/styles/Colors';
import inlineStyles from './style';



class BioScreen extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
          title: "Bio",
          headerBackImage: (<BackArrow/>)
        };
      };

    constructor(props){
        super(props);
        const initialVal =  this.props.navigation.getParam('initialValue') || "";
        this.state ={
          data: [],
          value: initialVal,
          keyword: "",
          count:initialVal.length
        };
        this.reqTimer = 0 ;
        this.wordIndex = -1;
        this.indexWord = null;
        this.isTrackingStarted = false;
        this.onChangeTextDelegate  = this.props.navigation.getParam('onChangeTextDelegate') ;
    }

    componentDidMount(){

    }

  
    fetchHashTags = ( keyword ) => {
      clearTimeout( this.reqTimer ) ;
      const reqParam = keyword.substr(1); 
      this.reqTimer = setTimeout( () => {
        if(!reqParam) return;
        new PepoApi("/tags").get( "q="+reqParam)
        .then(( res ) => {
          this.openSuggestionsPanel(res);
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

    changeValue( val ){
      val = val || "";
      if( val.length <= 300 ){
        this.onChangeTextDelegate && this.onChangeTextDelegate( val );
        this.setState({ value: val , count :val.length });
      }
    }

    onChangeText = (val) => { 
      const location          = this.location - 1 ,
            currentIndexChar  = val.charAt(location) ,
            isValidChar       = this.isValidChar( currentIndexChar ) ,
            wordAtIndex       = this.getWordAtIndex( val , location) ,
            isHashTag         = this.isHashTag(wordAtIndex);
       ;
      if( isValidChar && isHashTag ){
          this.wordIndex = location; 
          this.indexWord = wordAtIndex; 
          this.startTracking();
          this.fetchHashTags( wordAtIndex );
      } else{
        this.closeSuggestionsPanel();
      }
      this.changeValue( val );
    }

    isHashTag( val ){
      const hastagRegex = /(?:\s|^)#[A-Za-z0-9\-\.\_]+(?:\s|$)/g ; 
      return hastagRegex.test( val );
    }

    isValidChar( val ){
      const spaceRegex = /\s/g ; 
      return val && !spaceRegex.test(val)
    }

    locationGetter = ( event )=> {
      this.location = event && event.nativeEvent && event.nativeEvent.selection && event.nativeEvent.selection.start ;
    }

    openSuggestionsPanel( res ) {
      if( !this.isTrackingStarted ) return ; 
      if( res && res.data && res.data.tags ){
        this.setState({ data: res.data.tags });
      }
    }
  
    closeSuggestionsPanel() {
      this.stopStracking(); 
      if( this.state.data.length > 0 ){
        this.setState({ data : []});
      }
    }

    startTracking(){
      this.isTrackingStarted =  true ; 
    }

    stopStracking(){
      this.isTrackingStarted =  false ; 
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
      this.closeSuggestionsPanel();
      const wordToReplace = this.getWordAtIndex(this.state.value , this.wordIndex ) ,
            isHashTag = this.isHashTag( wordToReplace ) 
      ;
      if( isHashTag ){
        const startIndex = this.getStartIndex( this.state.value ,  this.wordIndex ) ,
              endIndex = this.getEndIndex( this.state.value ,  this.wordIndex ) ,
              replaceString = ` #${item.text} `,
              newString = this.replaceBetween( startIndex , endIndex , replaceString )
        ;
        this.changeValue( newString );
      }
    }

    replaceBetween( start, end, replaceString ) {
      return this.state.value.substring(0, start) + replaceString + this.state.value.substring(end);
    }

    getStartIndex( text ,  index ){
      let  startIndex = index , charAtIndex = text.charAt( index )  ; 
      ;
      while( charAtIndex && this.isValidChar( charAtIndex ) ){
        --startIndex ;
        if( startIndex < 0 ){
          startIndex =  0 ; 
          break; 
        }
        charAtIndex = text.charAt( startIndex ) 
      }
      return startIndex ; 
    } 

    getEndIndex( text , index ){
      let endIndex = index , charAtIndex = text.charAt( index ) ,
          maxIndex = text.length; 
       ; 
      ;
      while( charAtIndex && this.isValidChar( charAtIndex ) ){
        ++endIndex;
        if( endIndex >= maxIndex ) break;
        charAtIndex = text.charAt( endIndex ) 
      }
      return endIndex ; 
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
              numberOfLines = {3}
              returnKeyType="done"
              returnKeyLabel="Done"
            />
            <Text style={inlineStyles.countStyle}>{this.state.count} /300</Text>

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