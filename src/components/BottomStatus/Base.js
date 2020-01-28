import React, { PureComponent } from 'react';
import { View, Text , TouchableWithoutFeedback} from 'react-native';

import inlineStyles from './styles';

import multipleClickHandler from '../../services/MultipleClickHandler';
import InAppBrowser from '../../services/InAppBrowser';
import Utilities from '../../services/Utilities';
import CurrentUser from '../../models/CurrentUser';
import TextFormatter from '../CommonComponents/TextFormatter';

class BottomStatus extends PureComponent {
  constructor(props) {
    super(props);
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

  render() {
    return (
      <View style={inlineStyles.bottomBg}>

          <View style={{ paddingTop: 8, paddingBottom: 5 }}>
          {!!this.props.userName &&(
              <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.navigateToUserProfile())}
              pointerEvents={'auto'}>
                <Text style={[inlineStyles.handle]} ellipsizeMode={'tail'} numberOfLines={1}>
                  {`@${this.props.userName}`}
                </Text>
            </TouchableWithoutFeedback>)}
            {this.props.description ? (
              <Text
                style={[{ fontSize: 14, flexWrap: 'wrap', fontFamily: 'AvenirNext-Regular', textAlign: 'left' }, inlineStyles.bottomBgTxt]}
                ellipsizeMode={'tail'}
                numberOfLines={3}
              >
                <TextFormatter text={this.props.description} entityDescriptionId={this.props.entityDescriptionId} 
                        navigation={this.props.navigation}/>
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
