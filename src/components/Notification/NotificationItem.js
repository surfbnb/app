import React, { Component } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, ImageBackground , Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import escapeRegExp from 'lodash/escapeRegExp';
import unescape from 'lodash/unescape';

import styles from './styles';
import Pricer from '../../services/Pricer';
import reduxGetter from '../../services/ReduxGetters';
import ProfilePicture from '../ProfilePicture';
import PepoIcon from '../../assets/pepo-tx-icon.png';
import PepoPinkIcon from '../../assets/heart.png';
import { connect } from 'react-redux';
import AppConfig from '../../../src/constants/AppConfig';
import { shortenedFromNow } from '../../helpers/timestampHandling';
import {navigateTo} from '../../helpers/navigateTo';
import multipleClickHandler from '../../services/MultipleClickHandler';
import playIcon from '../../assets/play_icon.png';
import pepoCornsImg from '../../assets/Unicorn.png';

const mapStateToProps = (state, ownProps) => {
  return {
    heading: reduxGetter.getNotificationHeading(ownProps.notificationId, state),
    pictureId: reduxGetter.getNotificationPictureId(ownProps.notificationId, state),
    kind: reduxGetter.getNotificationKind(ownProps.notificationId, state),
    payload: reduxGetter.getNotificationPayload(ownProps.notificationId, state),
    timeStamp: reduxGetter.getNotificationTimestamp(ownProps.notificationId, state),
    goTo: reduxGetter.getNotificationGoTo(ownProps.notificationId, state)
  };
};

let textStyling = {fontWeight: '600'};
if( Platform.OS == "android"){
  textStyling['fontFamily'] = 'AvenirNext-Medium';
}

class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.state = { showSayThanks: true };
  }

  getBtAmount() {
    return Pricer.toDisplayAmount(Pricer.getFromDecimal(this.props.payload.amount));
  }

  handleRowClick = () => {
    this.props.goTo && navigateTo.navigate(this.props.goTo , this.props.navigation);
  };

  sendMessageSuccess = () => {
    this.setState({
      showSayThanks: false
    });
  };

  sortNumber(a, b) {
    return a - b;
  }

  includesTextNavigate = (includesObject) => {
    if (includesObject.kind === 'users') {
      navigateTo.goToProfilePage(includesObject.id, this.props.navigation);
    }
  };

  getHeading = () => {
    let heading = this.props.heading,
      text = heading.text,
      lastIndex = -1,
      entityArray = [],
      stringArray = [];

    if (!heading.includes || Object.keys(heading.includes).length == 0) {
      return text.split(/(\s+)/).map((element, id) => {
        return <Text key={id}>{`${element}`}</Text>;
      });
    }
    for (entity in heading.includes) {
      let entityStartedAt = text.search(escapeRegExp(entity));
      let entityendedAt = entityStartedAt + entity.length;
      entityArray.push(entityStartedAt);
      entityArray.push(entityendedAt);
    }
    entityArray.push(text.length);
    entityArray.sort(this.sortNumber);

    entityArray.forEach(function(element) {
      stringArray.push(text.substring(lastIndex, element));
      lastIndex = element;
    });

    return stringArray.map((item, i) => {
      return heading.includes[item] ? (
        <TouchableWithoutFeedback
        onPress={multipleClickHandler(() =>  this.includesTextNavigate(heading.includes[item]))}
          key={i}
        >
          <Text style={textStyling}> {unescape(heading.includes[item]['display_text'] || item)}</Text>
        </TouchableWithoutFeedback>
      ) : (
        item.split(/(\s+)/).map((element, id) => {
          return <Text key={id}>{`${element}`}</Text>;
        })
      );
    });
  };

  showAmountComponent = () => {
    return (
      <View style={[styles.numericInnerWrapper]}>
        <Image source={PepoIcon} style={styles.imageIconSkipFont} />
        <Text style={styles.numericInfoText}>{this.getBtAmount()}</Text>
      </View>
    );
  };

  showVideoComponent = () => {
    let imageUrl = reduxGetter.getVideoImgUrl( this.props.payload.video_id,  null , AppConfig.userVideos.userScreenCoverImageWidth);
    return (
      <ImageBackground style={styles.posterImageSkipFont} source={{ uri: imageUrl }}>
        <Image style={styles.playIconSkipFont} source={playIcon} />
      </ImageBackground>
    );
  };

  notificationInfo = () => {
    if (this.props.kind == AppConfig.notificationConstants.videoAddKind) {
      return this.showVideoComponent();
    }
  };

  sayThanks = () => {
    this.props.navigation.navigate('SayThanksScreen', {
      userId: this.props.payload.thank_you_user_id,
      notificationId: this.props.notificationId,
      sendMessageSuccess: this.sendMessageSuccess
    });
  };
  showSayThanks = () => {
    if (this.props.payload.thank_you_flag === 0 && this.state.showSayThanks) {
      return (
        <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.sayThanks())}>
          <View style={styles.sayThanksButton}>
            <Text style={styles.sayThanksText}>Say Thanks</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  };

  showAppreciationText = () => {
    if (this.props.kind == AppConfig.notificationConstants.AppreciationKind && this.props.payload.thank_you_text) {
      return <Text style={{ marginLeft: 10, marginTop: 2 }}>&quot;{unescape(this.props.payload.thank_you_text)}&quot;</Text>;
    }
  };

  showIfFailed = () => {
    return;
    return <Text style={{ marginLeft: 10, marginTop: 2, fontSize: 10 }}> failed </Text>;
  };

  showPepoAmout = () => {
    if (AppConfig.notificationConstants.showCoinComponentArray.includes(this.props.kind)) {
      return this.showAmountComponent();
    }
  };

  getActivityIcon(){
    if([AppConfig.notificationConstants.systemNotification, AppConfig.notificationConstants.airDropNotification, AppConfig.notificationConstants.topupNotification, AppConfig.notificationConstants.recoveryInitiate ].includes(this.props.kind)) {
      return(
        <View style={styles.activityIcon}>
          <Image source={PepoPinkIcon} style={styles.systemNotificationIconSkipFont} />
        </View>
        )
    }else if( AppConfig.pepoCornsActivityKinds.includes(this.props.kind)){
      return (
        <View style={styles.activityIcon}>
          <Image source={pepoCornsImg} style={styles.systemNotificationIconSkipFont} />
        </View>
      )
    }else{
      let includesObj  = this.props.heading && this.props.heading["includes"] || {} ,
          userObj ;
      for(let key in includesObj ){
        userObj = includesObj[key] || null;
        break ;
      }
      if(userObj){
        return <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.includesTextNavigate(userObj))}>
                  <View style={styles.activityIcon}>
                    <ProfilePicture pictureId={this.props.pictureId} />
                  </View>
               </TouchableWithoutFeedback>
      }else {
        return(
          <View style={styles.activityIcon}>
            <ProfilePicture pictureId={this.props.pictureId} />;
          </View>
        )

      }

    }
  }

  render() {
    let headerWidth = '92%',
    notificationInfoWidth = '0%';
    if (this.props.kind === AppConfig.notificationConstants.videoAddKind) {
        headerWidth = '72%';
        notificationInfoWidth = '20%';
    }
    
    return (
      <View style={{ minHeight: 25 }}>
        <TouchableWithoutFeedback onPress={multipleClickHandler(() => this.handleRowClick())}>
          <View>
            <View style={[styles.txtWrapper]}>
              <View>
                {this.getActivityIcon()}
              </View>
              <View style={{ flex: this.props.kind === AppConfig.notificationConstants.videoAddKind ? 6 : 2, flexDirection: 'row'}}>
                <View style={{ flexDirection: 'column' }}>
                  <View style={styles.descriptionText}>
                    {this.getHeading()}
                    {this.showPepoAmout()}
                    <Text style={styles.timeStamp}>
                      {this.props.timeStamp && shortenedFromNow(this.props.timeStamp)}
                    </Text>
                  </View>
                  {this.showAppreciationText()}
                  {this.showIfFailed()}
                </View>
              </View>
              {this.props.kind === AppConfig.notificationConstants.videoAddKind ?
                  <View
                    style={{ flex: 1 }}>{this.notificationInfo()}
                  </View>
                : <React.Fragment></React.Fragment>}
            </View>
            {this.showSayThanks()}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(NotificationItem));
