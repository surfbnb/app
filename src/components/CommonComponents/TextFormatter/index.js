import React, { PureComponent } from 'react';
import { Text} from 'react-native';

import Utilities from '../../../services/Utilities';
import CurrentUser from '../../../models/CurrentUser';
import InAppBrowser from '../../../services/InAppBrowser';

const regex = /(^|\s)(#|@)(\w+)|(^|\s)(http:\/\/|https:\/\/|www.)([^\s]+)/gi;
const linkRegex = /(^|\s)(http:\/\/|https:\/\/|www.)([^\s]+)/gi;

class TextFormatter extends PureComponent{
    isValidTag(tappedText) {
        if(tappedText.indexOf('#') != 0 ) return false;
        return this.isValidIncludes( tappedText );
    }

    isValidMention(tappedText) {
        if(tappedText.indexOf('@') != 0 ) return false;
        return this.isValidIncludes( tappedText );
    }

    isValidLink(tappedText) {
        return this.isValidIncludes( tappedText );
    }

    isValidIncludes(tappedText){
        return !!this.props.getTappedIncludesEntity(tappedText);
    }

    getHashTagMarkup( item , formattedItem, prevText, index ){
        const tagText = item.replace("#", "");
        return (
            <Text key={`${tagText}-${index}`}>
            {prevText}
            <Text style={[{fontFamily: 'AvenirNext-DemiBold'}]}
                    numberOfLines={1}
                    suppressHighlighting={true}
                    onPress={() => {
                    this.onIncludesPressed(formattedItem)
                    }}>
                {/*<Text style={{fontStyle: 'italic'}}>#</Text>*/}
                {item}
            </Text>
            </Text>
        );
    }

    getMentionMarkup( item , formattedItem, prevText, index ){
        const mentionText = item.replace("@", "");
        return (
            <Text key={`${mentionText}-${index}`}>
            {prevText}
            <Text style={[{fontFamily: 'AvenirNext-DemiBold'}]}
                    numberOfLines={1}
                    suppressHighlighting={true}
                    onPress={() => {
                    this.onIncludesPressed(formattedItem)
                    }}>
                {/*<Text style={{fontStyle: 'italic'}}>@</Text>*/}
                {item}
            </Text>
            </Text>
        );
    }

    getLinkMarkup( item , formattedItem, prevText, index ){
        return (
            <Text key={`${item}-${index}`}>
            {prevText}
            <Text style={[{fontFamily: 'AvenirNext-DemiBold'}]}
                    numberOfLines={1}
                    suppressHighlighting={true}
                    onPress={() => {
                    this.onIncludesPressed(formattedItem)
                    }}>
                {/*<Text style={{fontStyle: 'italic'}}>@</Text>*/}
                {item}
            </Text>
            </Text>
        );
    }

    onIncludesPressed = (item) => {
        if(!Utilities.checkActiveUser()) return;

        let tapEntity = this.props.getTappedIncludesEntity(item);
        if (!tapEntity) {
            return;
        }

        if( tapEntity.kind === 'tags'){
            this.props.navigation.push('VideoTags', { "tagId": tapEntity.id });
            return;
        }

        if( tapEntity.kind === 'links'){
            InAppBrowser.openBrowser(item);
            return;
        }

        if( tapEntity.kind === 'users'){
            if (tapEntity.id == CurrentUser.getUserId()) {
            this.props.navigation.navigate('ProfileScreen');
            }else{
            this.props.navigation.push('UsersProfileScreen', { userId: tapEntity.id });
            }
            return;
        }
    };

    getTextMarkup( item  , prevText, index){
        return (
          <Text key={`${item}-${index}`}>
            {prevText + item}
          </Text>
        )
      }
      
    render(){
        let processingString = this.props.text;
        let includesAndLinksArray = processingString.match(regex) || [];
        return  (
            <React.Fragment>
                 {(includesAndLinksArray.map((item, index) => {
                  let itemLocation = processingString.search(item);
                  let prevText = processingString.slice(0, itemLocation);
                  processingString = processingString.slice(itemLocation + item.length);
                  let formattedItem = item;
                  if(item.match(linkRegex) && item.match(linkRegex).length > 0){
                    formattedItem = item.replace(regex, "$5$6");
                  } else{
                    formattedItem = item.replace(regex, "$2$3");
                  }
                  if (this.isValidTag( formattedItem)) {
                    return this.getHashTagMarkup(item, formattedItem, prevText, index);
                  } if( this.isValidMention( formattedItem) ){
                    return this.getMentionMarkup(item, formattedItem, prevText, index);
                  }else if(this.isValidLink( formattedItem )){
                    return this.getLinkMarkup( item, formattedItem, prevText, index );
                  }else {
                    return this.getTextMarkup(item, prevText, index);
                  }
                }))}

                <Text>{processingString}</Text>
            </React.Fragment>
        )
    }
}

export default TextFormatter;