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
  }

  onLinkClick = () => {
    InAppBrowser.openBrowser(this.props.link);
  };

  onTagPressed = (tag) => {
    let entity = reduxGetter.getTappedIncludesEntity(this.props.entityDescriptionId, tag);
    this.onDescriptionClick(entity, tag);
  };

  isValidTag(descriptionId, tappedText) {
    let entity = reduxGetter.getTappedIncludesEntity(descriptionId, tappedText);
    return !!entity
  }

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

  onDescriptionClick = ( tapEntity  ) => {
    if (!tapEntity) {
      return;
    }
    if( tapEntity.kind === 'tags'){
      this.props.navigation.push('VideoTags', {
        "tagId": tapEntity.id
      });
    }
  }

  render() {

    let processingString = this.props.description;
    let hasTagArray = processingString.match(/#\w+/g) || [];

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

                {(hasTagArray.map((hashTag) => {

                  let tagLocation = processingString.search(hashTag);
                  let prevText = processingString.slice(0, tagLocation);

                  processingString = processingString.slice(tagLocation + hashTag.length);

                  if (this.isValidTag(this.videoDescriptionId, hashTag)) {
                    let tagText = hashTag.replace("#", "");
                    return (
                      <Text>
                        {prevText}
                        <Text style={[{fontFamily: 'AvenirNext-DemiBold'}]}
                              numberOfLines={1}
                              onPress={() => {
                                this.onTagPressed(hashTag)
                              }}>
                          <Text style={{fontStyle: 'italic'}}>#</Text>
                          {tagText}
                        </Text>
                      </Text>

                    );
                  } else {
                    return (
                      <Text>
                        {prevText + hashTag}
                      </Text>
                    )
                  }
                }))
                }
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
