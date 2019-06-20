import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import styles from './styles';
import Store from '../../store';
import TimestampHandling from '../../helpers/timestampHandling';
import NavigationService from '../../services/NavigationService';
import DefaultUserIcon from '../../assets/default_user_icon.png';
import PriceOracle from '../../services/PriceOracle';

class FeedRow extends Component {
  constructor(props) {
    super(props);
  }

  get feedEntity() {
    return Store.getState().feed_entities[`id_${this.props.id}`];
  }

  get transactionEntity(){
    let ostTxId = this.feedEntity.payload.ost_transaction_id;
    return Store.getState().transaction_entities[`id_${ostTxId}`];
  }

  get giphyEntity(){
    let gifId = this.feedEntity.payload.gif_id || '';
    return gifId ? Store.getState().giffy_entities[`id_${gifId}`] : null;
  }

  get fromUserId() {
    return this.transactionEntity.from_user_id;
  }

  get toUserId() {
    return this.transactionEntity.to_user_ids[0];
  }

  get fromUserName() {
    let fromUserId = this.transactionEntity.from_user_id,
      fromUser = Store.getState().user_entities[`id_${fromUserId}`];
    return fromUserId == this.getCurrentUserId ? 'You' : fromUser.first_name;
  }

  get toUserName() {
    let toUserId = this.transactionEntity.to_user_ids[0],
      toUser = Store.getState().user_entities[`id_${toUserId}`];
    return toUserId == this.getCurrentUserId ? 'You' : toUser.first_name;
  }

  get getCurrentUserId() {
    return Store.getState().current_user.id;
  }

  get getTextMessage() {
    return this.feedEntity.payload.text ? this.feedEntity.payload.text : null;
  }

  fromUserClick() {
    if (!this.props.nestedNavigation) return;
    const userId = this.fromUserId;
    if (userId == this.getCurrentUserId) {
      NavigationService.navigate('Profile');
    } else {
      NavigationService.navigate('UserFeedScreen', { headerText: this.fromUserName, userId: userId });
    }
  }

  toUserClick() {
    if (!this.props.nestedNavigation) return;
    const userId = this.toUserId;
    if (userId == this.getCurrentUserId) {
      NavigationService.navigate('Profile');
    } else {
      NavigationService.navigate('UserFeedScreen', { headerText: this.toUserName, userId: userId });
    }
  }

  getBtAmount() {
    let btAmount = this.transactionEntity.amounts[0];
    btAmount = PriceOracle.fromDecimal(btAmount);
    btAmount = PriceOracle.toBt(btAmount, 1);
    return btAmount;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ marginTop: 10 }}></View>
        <View style={styles.cellWrapper}>
          <View style={styles.header}>
            <View style={{alignSelf: 'flex-start'}}>
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
                      {this.fromUserName}
                    </Text>
                    <Text style={{ fontWeight: '300', fontSize: 13 }}> gave </Text>
                    <Text
                      onPress={() => {
                        this.toUserClick();
                      }}
                    >
                      {this.toUserName}
                    </Text>
                  </Text>
                  <Text style={styles.timeStamp}>{TimestampHandling.fromNow(this.feedEntity.published_ts)}</Text>
                </View>
                <View style={styles.figure}>
                  <Text style={{ textAlign: 'center', fontSize: 12 }}>P{this.getBtAmount()}</Text>
                </View>
              </View>
            </View>
          </View>
          {this.giphyEntity && (
            <View style={{ marginTop: 10 }}>
              <Image
                source={{ uri: this.giphyEntity.downsized.url }}
                style={{
                  width: '100%',
                  aspectRatio: parseInt(this.giphyEntity.downsized.width) / parseInt(this.giphyEntity.downsized.height)
                }}
              />
            </View>
          )}
          {this.getTextMessage && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 14, color: '#484848', fontWeight: '100' }}>{this.getTextMessage}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default FeedRow;
