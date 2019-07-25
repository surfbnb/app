import React, { PureComponent } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import styles from './styles';
import appConfig from '../../constants/AppConfig';
import TimestampHandling from '../../helpers/timestampHandling';
import DefaultUserIcon from '../../assets/default_user_icon.png';
import Pricer from '../../services/Pricer';
import GracefulImage from '../Giphy/GracefulImage';
import utilities from '../../services/Utilities';
import FastImage from 'react-native-fast-image';
import reduxGetter from "../../services/ReduxGetters";
import CurrentUser from '../../models/CurrentUser';

const mapStateToProps = (state, ownProps) => {
  return {
    fromUserId: reduxGetter.getTransactionFromUserId(reduxGetter.getActivityTransactionId( ownProps.id)),
    toUserId:reduxGetter.getTransactionToUserId(reduxGetter.getActivityTransactionId( ownProps.id)),
    fromUserName: reduxGetter.getUserName(reduxGetter.getTransactionFromUserId(reduxGetter.getActivityTransactionId( ownProps.id))),
    toUserName: reduxGetter.getUserName(reduxGetter.getTransactionToUserId(reduxGetter.getActivityTransactionId( ownProps.id))),
    status:  reduxGetter.getActivityTransactionStatus( ownProps.id ),
    timeStamp: reduxGetter.getActivityTransactionTimeStamp( ownProps.id ),
    btAmount: reduxGetter.getTransactionAmount( reduxGetter.getActivityTransactionId( ownProps.id ) ),
    giffy: reduxGetter.getGiffy( reduxGetter.getActivityGiffyId( ownProps.id )),
    message: reduxGetter.getActivityMessage(ownProps.id)
  }
};

class ActivityRow extends PureComponent {
  constructor(props) {
    super(props);
  }

  fromUserClick() {
    if ( this.props.fromUserId == CurrentUser.getUserId( )) {
      this.props.navigation.navigate('Profile');
    } else {
      this.props.navigation.push('UsersProfileScreen' ,{ userId:this.props.fromUserId });
    }
  }

  toUserClick() {
    if ( this.props.toUserId == CurrentUser.getUserId(  )) {
      this.props.navigation.navigate('Profile');
    } else {
      this.props.navigation.push('UsersProfileScreen' ,{ userId:this.props.toUserId });
    }
  }

  getBtAmount( btAmount ) {
    return Pricer.getFromDecimal( btAmount );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 10 }}></View>
        <View style={styles.cellWrapper}>
          <View style={styles.header}>
            <View style={{ alignSelf: 'flex-start' }}>
              <Image source={DefaultUserIcon} style={styles.profileImgSkipFont} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.userInfo}>
                <View style={{ flex: 1, alignSelf: 'flex-start' }}>
                  <Text style={styles.userNameText}>
                    <Text
                      onPress={() => {
                        this.fromUserClick();
                      }}
                    >
                      {this.props.fromUserName}
                    </Text>
                    <Text style={{ fontWeight: '300', fontSize: 13 }}> gave </Text>
                    <Text
                      onPress={() => {
                        this.toUserClick();
                      }}
                    >
                      {this.props.toUserName}
                    </Text>
                  </Text>
                  <Text style={styles.timeStamp}>
                    {this.props.status == appConfig.transactionStatus.done
                      ? TimestampHandling.fromNow(this.props.timeStamp)
                      : this.props.status.toLowerCase()}
                  </Text>
                </View>
                <View style={styles.figure}>
                  <Text style={{ textAlign: 'center', fontSize: 12 }}>
                    <Image style={{ width: 8, height: 9 }} source={utilities.getTokenSymbolImageConfig()['image1']} />{' '}
                    {this.getBtAmount( this.props.btAmount )}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {this.props.giffy ? (
            <View style={{ marginTop: 10 }}>
              <GracefulImage
                style={{
                  width: '100%',
                  aspectRatio:
                    parseInt(this.props.giffy[appConfig.giphySizes.activity].width) /
                    parseInt(this.props.giffy[appConfig.giphySizes.activity].height)
                }}
                source={{
                  uri: this.props.giffy[appConfig.giphySizes.activity].url,
                  priority: FastImage.priority.high
                }}
                showActivityIndicator={true}
                imageBackgroundColor="rgba(238,238,238,1)" //can be string or array of colors
              />
            </View>
          ): <View/>}
          {this.props.message ? (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 14, color: '#484848', fontWeight: '100' }}>{this.props.message}</Text>
            </View>
          ) : <View/>}
        </View>
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(ActivityRow)) ;

