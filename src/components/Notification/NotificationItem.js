import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { withNavigation } from 'react-navigation';
import styles from './styles';
import Pricer from '../../services/Pricer';
import reduxGetter from '../../services/ReduxGetters';
import ProfilePicture from '../ProfilePicture';
import PepoIcon from '../../assets/pepo-tx-icon.png';
import PepoPinkIcon from '../../assets/heart.png';
import { connect } from 'react-redux';
import AppConfig from '../../../src/constants/AppConfig';
import { shortenedFromNow } from '../../helpers/timestampHandling';
import NavigateTo from '../../helpers/navigateTo';
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
    return Pricer.toDisplayAmount(Pricer.getFromDecimal(this.props.payload.amount));
  }

  handleRowClick = () => {
    this.props.goTo && new NavigateTo(this.props.navigation).navigate(this.props.goTo);  
  };

 

  sortNumber(a, b) {
    return a - b;
  }

  includesTextNavigate = (includesObject) => {
    if (includesObject.kind == 'users') {
      new NavigateTo(this.props.navigation).goToProfilePage(includesObject.id);        
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

    return stringArray.map((item, i) =>
      heading.includes[item] ? (
        <TouchableOpacity
          onPress={() => {
            this.includesTextNavigate(heading.includes[item]);
          }}
          key={i}
        >
          <Text style={{ fontWeight: '600' }}>{item}</Text>
        </TouchableOpacity>
      ) : (
        <Text key={i}>{item}</Text>
      )
    );
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
    }
  };

  sayThanks = () => {
    console.log('sayThanks');
    //this.props.navigation.navigate('SayThanksScreen');
  };

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

  showHeader = () => {
    if (this.props.header) {
      return <View style={styles.sectionHeaderView}><Text style={styles.sectionHeaderTitle}>{this.props.header}</Text></View>;
    }
  };

  showAppreciationText = () => {
    if (this.props.kind == AppConfig.notificationConstants.AppreciationKind && this.props.payload.thank_you_text) {
      return <Text style={{ marginLeft: 10, marginTop: 2 }}>&quot;{this.props.payload.thank_you_text}&quot;</Text>;
    }
  };

  render() {
    return (
      <React.Fragment>
        {this.showHeader()}
        <TouchableOpacity onPress={this.handleRowClick}>
          <View style={styles.txtWrapper}>
            {this.props.kind == AppConfig.notificationConstants.systemNotification ? (
              <Image source={PepoPinkIcon} style={styles.systemNotificationIconSkipFont} />
            ) : (
              <ProfilePicture pictureId={this.props.pictureId} />
            )}
            <View style={{ flexDirection: 'column' }}>
              <View style={styles.item}>{this.getHeading()}</View>
              {this.showAppreciationText()}
            </View>
            <Text style={styles.timeStamp}>{this.props.timeStamp && shortenedFromNow(this.props.timeStamp)}</Text>
            {this.notificationInfo()}
          </View>
          {this.showSayThanks()}
        </TouchableOpacity>
      </React.Fragment>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(NotificationItem));
