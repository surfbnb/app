import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import styles from './styles';
import Pricer from '../../services/Pricer';
import reduxGetter from '../../services/ReduxGetters';
import CurrentUser from '../../models/CurrentUser';
import utilities from '../../services/Utilities';
import multipleClickHandler from '../../services/MultipleClickHandler';
import ProfilePicture from '../ProfilePicture';
import PepoIcon from '../../assets/pepo-tx-icon.png';
import { connect } from 'react-redux';
import AppConfig from '../../../src/constants/AppConfig';
import TimestampHandling from '../../helpers/timestampHandling';

// const userClick = function(userId, navigation) {
//   if (userId == CurrentUser.getUserId()) {
//     navigation.navigate('ProfileScreen');
//   } else {
//     navigation.push('UsersProfileScreen', { userId: userId });
//   }
// };

const mapStateToProps = (state, ownProps) => {
  return {
    heading: reduxGetter.getNotificationHeading(ownProps.notificationId, state),
    pictureId: reduxGetter.getNotificationPictureId(ownProps.notificationId, state),
    kind: reduxGetter.getNotificationKind(ownProps.notificationId, state),
    payload: reduxGetter.getNotificationPayload(ownProps.notificationId, state),
    timeStamp: reduxGetter.getNotificationTimestamp(ownProps.notificationId, state),
    goTo: reduxGetter.getNotificationGoTo(ownProps.notificationId, state)
    //isActivated : utilities.isUserActivated( reduxGetter.getUserActivationStatus(ownProps.userId))
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
    }
  };

  sortNumber(a, b) {
    return a - b;
  }

  componentDidMount() {
    //   this.getHeading();
  }

  goTo = (goToObj) => {
    if (goToObj.kind == 'users') {
      this.goToProfilePage(goToObj.id);
    }
  };

  goToProfilePage = (id) => {
    if (id == CurrentUser.getUserId()) {
      this.props.navigation.navigate('ProfileScreen');
    } else {
      this.props.navigation.push('UsersProfileScreen', { userId: id });
    }
  };

  rowGoTo = () => {};

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
              this.goTo(heading.includes[item]);
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
    return;
  };

  notificationInfo = () => {
    if (
      this.props.kind == AppConfig.notificationConstants.profileTxReceiveKind ||
      this.props.kind == AppConfig.notificationConstants.profileTxSendKind
    ) {
      return this.showAmountComponent();
    } else if (this.props.kind == AppConfig.notificationConstants.videoAddKind) {
      return this.showVideoComponent();
    } else {
      return <React.Fragment />;
    }
  };

  render() {
    return (
      <TouchableOpacity onPress={this.handleRowClick}>
        <View style={styles.txtWrapper}>
          <ProfilePicture pictureId={this.props.pictureId} />
          <View style={styles.item}>{this.getHeading()}</View>
          <Text style={styles.timeStamp}>{TimestampHandling.shortenedFromNow(this.props.timeStamp)}</Text>
          {this.notificationInfo()}
        </View>
      </TouchableOpacity>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(NotificationItem));
