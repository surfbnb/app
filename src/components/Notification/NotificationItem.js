import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { withNavigation } from 'react-navigation';
import styles from './styles';
import Pricer from '../../services/Pricer';
import reduxGetter from '../../services/ReduxGetters';
import CurrentUser from '../../models/CurrentUser';
import utilities from '../../services/Utilities';
import multipleClickHandler from '../../services/MultipleClickHandler';
import ProfilePicture from '../ProfilePicture';
import PepoIcon from '../../assets/pepo-tx-icon.png';
import PepoPinkIcon from '../../assets/heart.png';
import { connect } from 'react-redux';
import AppConfig from '../../../src/constants/AppConfig';
import TimestampHandling from '../../helpers/timestampHandling';
import playIcon from '../../assets/play_icon.png';

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

class NotificationItem extends Component {
  constructor(props) {
    super(props);
  }

  getBtAmount() {
    return Pricer.getToBT(Pricer.getFromDecimal(this.props.payload.amount));
  }

  handleRowClick = () => {
    if (this.props.goTo && this.props.goTo.pn == 'p') {
      this.goToProfilePage(this.props.goTo.v.puid);
    } else if (this.props.goTo && this.props.goTo.pn == 'cb') {
      this.goToSupporters(this.props.goTo.v.puid);
    } else if (this.props.goTo && this.props.goTo.pn == 'v') {
      this.goToVideo(this.props.goTo.v.vid);
    }
  };

  goToVideo = (vId) => {
    this.props.navigation.push('VideoPlayer', {
      videoId: vId
    });
  };

  goToSupporters = (profileId) => {
    this.props.navigation.push('SupportersListWrapper', { userId: profileId });
  };

  sortNumber(a, b) {
    return a - b;
  }

  includesTextNavigate = (includesObject) => {
    if (includesObject.kind == 'users') {
      this.goToProfilePage(includesObject.id);
    }
  };

  goToProfilePage = (id) => {
    if (id == CurrentUser.getUserId()) {
      this.props.navigation.navigate('ProfileScreen');
    } else {
      this.props.navigation.push('UsersProfileScreen', { userId: id });
    }
  };

  getHeading = () => {
    let heading = this.props.heading,
      text = heading.text,
      lastIndex = -1,
      entityArray = [],
      stringArray = [];

    if (!heading.includes || Object.keys(heading.includes).length == 0) {
      return <Text>{text}</Text>;
    }
    for (entity in heading.includes) {
      let entityStartedAt = text.search(entity);
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
      if (heading.includes[item]) {
        return (
          <TouchableOpacity
            onPress={() => {
              this.includesTextNavigate(heading.includes[item]);
            }}
            key={i}
          >
            <Text style={{ fontWeight: '600' }}>{item}</Text>
          </TouchableOpacity>
        );
      } else {
        return <Text key={i}>{item}</Text>;
      }
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
    let imageUrl = reduxGetter.getVideoImgUrl(this.props.payload.videoId);
    return (
      <ImageBackground style={styles.posterImageSkipFont} source={{ uri: imageUrl }}>
        <Image style={styles.playIconSkipFont} source={playIcon}></Image>
      </ImageBackground>
    );
  };

  notificationInfo = () => {
    if (AppConfig.notificationConstants.showCoinComponentArray.includes(this.props.kind)) {
      return this.showAmountComponent();
    } else if (this.props.kind == AppConfig.notificationConstants.videoAddKind) {
      return this.showVideoComponent();
    } else {
      return <React.Fragment />;
    }
  };

  sayThanks = () => {
      console.log('sayThanks');
  }

  showSayThanks = () => {
    if (this.props.payload.thank_you_flag === 1) {
      return (
        <TouchableOpacity onPress={this.sayThanks}>
        <View style={styles.sayThanksButton}>
          <Text style={styles.sayThanksText}>Say Thanks</Text>
        </View>
        </TouchableOpacity>  
      );
    }
  };

  showAppreciationText = () => {
    if (this.props.kind == AppConfig.notificationConstants.AppreciationKind && this.props.payload.thank_you_text) {
      return <Text style={{ marginLeft: 10, marginTop: 2 }}>"{this.props.payload.thank_you_text}"</Text>;
    }
  };

  render() {
    return (
      <TouchableOpacity onPress={this.handleRowClick}>
        <View style={styles.txtWrapper}>
        {this.props.kind == AppConfig.notificationConstants.systemNotification ?  (<Image source={PepoPinkIcon} style={styles.systemNotificationIconSkipFont} />) : (<ProfilePicture pictureId={this.props.pictureId} />)} 
          <View style={{ flexDirection: 'column' }}>
            <View style={styles.item}>{this.getHeading()}</View>
            {this.showAppreciationText()}
          </View>
          <Text style={styles.timeStamp}>
            {this.props.timeStamp && TimestampHandling.shortenedFromNow(this.props.timeStamp)}
          </Text>
          {this.notificationInfo()}
        </View>
        {this.showSayThanks()}
      </TouchableOpacity>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(NotificationItem));
