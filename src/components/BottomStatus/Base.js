import React, { PureComponent } from 'react';
import { View, Text } from 'react-native';

import inlineStyles from './styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import reduxGetter from '../../services/ReduxGetters';

import multipleClickHandler from '../../services/MultipleClickHandler';
import InAppBrowser from '../../services/InAppBrowser';
import Utilities from '../../services/Utilities';
import CurrentUser from '../../models/CurrentUser';

class BottomStatus extends PureComponent {
  constructor(props) {
    super(props);
    this.videoDescriptionId = reduxGetter.getVideoDescriptionId(this.props.entityId);
  }

  onLinkClick = () => {
    InAppBrowser.openBrowser(this.props.link);
  };

  navigateToUserProfile = () => {
    if(!this.props.isUserNavigate) return;
    if (Utilities.checkActiveUser()) {
        if (this.props.userId == CurrentUser.getUserId()) {
            this.props.navigation.navigate('ProfileScreen');
        } else {
            this.props.navigation.push('UsersProfileScreen', { userId: this.props.userId });
        }
    }
  };

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

  getHashTagMarkup( item , prevText ){
    const tagText = item.replace("#", "");
    return (
      <Text>
        {prevText}
        <Text style={[{fontFamily: 'AvenirNext-DemiBold'}]}
              numberOfLines={1}
              onPress={() => {
                this.onIncludesPressed(item)
              }}>
          <Text style={{fontStyle: 'italic'}}>#</Text>
          {tagText}
        </Text>
      </Text>
    );
  }

  getMentionMarkup( item , prevText ){
    const mentionText = item.replace("@", "");
    return (
      <Text>
        {prevText}
        <Text style={[{fontFamily: 'AvenirNext-DemiBold'}]}
              numberOfLines={1}
              onPress={() => {
                this.onIncludesPressed(item)
              }}>
          <Text style={{fontStyle: 'italic'}}>@</Text>
          {mentionText}
        </Text>
      </Text>
    );
  }

  onIncludesPressed = (tag) => {
    let tapEntity = reduxGetter.getTappedIncludesEntity(this.props.entityDescriptionId, tag);
    if (!tapEntity) {
      return;
    }

    if( tapEntity.kind === 'tags'){
      this.props.navigation.push('VideoTags', { "tagId": tapEntity.id });
      return;
    }

    if( tapEntity.kind === 'users'){
      this.props.navigation.push('UsersProfileScreen', { userId: tapEntity.id });
      return;
    }
  };

  getTextMarkup( item  , prevText){
    return (
      <Text>
        {prevText + item}
      </Text>
    )
  }

  render() {

    let processingString = this.props.description;
    let includesArray = processingString.match(/(#|@)\w+/g) || [];

    return (
      <View style={inlineStyles.bottomBg}>

          <View style={{ paddingTop: 8, paddingBottom: 5 }}>
          <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.navigateToUserProfile())} pointerEvents={'auto'}>
            <Text style={[inlineStyles.handle]} ellipsizeMode={'tail'} numberOfLines={1}>
              {`@${this.props.userName}`}
            </Text>
            </TouchableWithoutFeedback>
            {this.props.description ? (
              <Text
                style={[{ fontSize: 14, flexWrap: 'wrap', fontFamily: 'AvenirNext-Regular', textAlign: 'left' }, inlineStyles.bottomBgTxt]}
                ellipsizeMode={'tail'}
                numberOfLines={3}
              >

                {(includesArray.map((item) => {
                  let tagLocation = processingString.search(item);
                  let prevText = processingString.slice(0, tagLocation);
                  processingString = processingString.slice(tagLocation + item.length);
                  if (this.isValidTag(this.videoDescriptionId, item)) {
                    return this.getHashTagMarkup(item, prevText);
                  } if( this.isValidMention(this.videoDescriptionId ,  item) ){
                    return this.getMentionMarkup(item, prevText);
                  }else {
                    return this.getTextMarkup(item, prevText);
                  }
                }))}
                
                <Text>{processingString}</Text>

              </Text>
            ) : (
                <React.Fragment />
              )
            }
          </View>

        {this.props.link ? (
          <TouchableWithoutFeedback
            onPress={multipleClickHandler(() => {
             this.onLinkClick();
            })}
            pointerEvents={'auto'}
          >
            <Text
              style={[{ fontSize: 13, paddingBottom: 10, fontFamily: 'AvenirNext-DemiBold', fontWeight: '700'}, inlineStyles.bottomBgTxt]}
              numberOfLines={1}
              ellipsizeMode={'tail'}
            >
              {this.props.link.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')}
            </Text>
          </TouchableWithoutFeedback>
        ) : (
          <React.Fragment />
        )}
      </View>
    );
  };
}

BottomStatus.defaultProps = {
  isUserNavigate : true
}

export default BottomStatus;
