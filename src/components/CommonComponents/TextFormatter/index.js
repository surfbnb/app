import React, { PureComponent } from 'react';
import { Text} from 'react-native';

import reduxGetter from '../../../services/ReduxGetters';
import Utilities from '../../../services/Utilities';
import CurrentUser from '../../../models/CurrentUser';

const regex = /(^|\s)(#|@)(\w+)/g;

class TextFormatter extends PureComponent{
    isValidTag(descriptionId, tappedText) {
        if(tappedText.indexOf('#') != 0 ) return false;
        return this.isValidIncludes( descriptionId, tappedText );
    }

    isValidMention(descriptionId, tappedText) {
        if(tappedText.indexOf('@') != 0 ) return false;
        return this.isValidIncludes( descriptionId, tappedText );
    }

    isValidIncludes(descriptionId, tappedText){
        return !!reduxGetter.getTappedIncludesEntity(descriptionId, tappedText);
    }

    getHashTagMarkup( item , formattedItem, prevText, index ){
        const tagText = item.replace("#", "");
        return (
            <Text key={`${tagText}-${index}`}>
            {prevText}
            <Text style={[{fontFamily: 'AvenirNext-DemiBold'}]}
                    numberOfLines={1}
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
                    onPress={() => {
                    this.onIncludesPressed(formattedItem)
                    }}>
                {/*<Text style={{fontStyle: 'italic'}}>@</Text>*/}
                {item}
            </Text>
            </Text>
        );
    }

    onIncludesPressed = (tag) => {
        if(!Utilities.checkActiveUser()) return;

        let tapEntity = reduxGetter.getTappedIncludesEntity(this.props.entityDescriptionId, tag);
        if (!tapEntity) {
            return;
        }

        if( tapEntity.kind === 'tags'){
            this.props.navigation.push('VideoTags', { "tagId": tapEntity.id });
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
        console.log(prevText , item)
        return (
          <Text key={`${item}-${index}`}>
            {prevText + item}
          </Text>
        )
      }
      
    render(){
        let processingString = this.props.text;
        let includesArray = processingString.match(regex) || [];
        return  (
            <React.Fragment>
                 {(includesArray.map((item, index) => {
                  let tagLocation = processingString.search(item);
                  let prevText = processingString.slice(0, tagLocation);
                  processingString = processingString.slice(tagLocation + item.length);
                  let formattedItem = item.replace(regex, "$2$3");
                  if (this.isValidTag(this.props.entityDescriptionId, formattedItem)) {
                    return this.getHashTagMarkup(item, formattedItem, prevText, index);
                  } if( this.isValidMention(this.props.entityDescriptionId ,  formattedItem) ){
                    return this.getMentionMarkup(item, formattedItem, prevText, index);
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