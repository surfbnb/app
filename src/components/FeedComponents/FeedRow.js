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
    this.feedEntity = this.getFeedEntity;

    this.setTransactionEntity();
    this.setGiphyEntity();
  }

  get getFeedEntity() {
    return Store.getState().feed_entities[`id_${this.props.id}`];
  }

  setTransactionEntity() {
    let ostTxId = this.feedEntity.payload.ost_transaction_id;
    this.transactionEntity = Store.getState().transaction_entities[`id_${ostTxId}`];
  }

  setGiphyEntity() {
    let gifId = this.feedEntity.payload.gif_id || '';
    this.giphyEntity = gifId ? Store.getState().giffy_entities[`id_${gifId}`] : null;
  }

  getFromUserId() {
    return this.transactionEntity.from_user_id;
  }

  getToUserId() {
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
    const userId = this.getFromUserId();
    if (userId == this.getCurrentUserId) {
      NavigationService.navigate('Profile');
    } else {
      NavigationService.navigate('UserFeedScreen', { headerText: this.fromUserName, userId: userId });
    }
  }

  toUserClick() {
    if (!this.props.nestedNavigation) return;
    const userId = this.getToUserId();
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
        <View style={styles.cellWrapper}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View>
              <Image
                source={DefaultUserIcon}
                style={{
                  borderRadius: 20,
                  height: 40,
                  width: 40
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10
                  // justifyContent: "space-between"
                }}
              >
                <View>
                  <Text style={{ marginBottom: 2 }}>
                    <Text
                      style={{ fontWeight: '500', fontSize: 16 }}
                      onPress={() => {
                        this.fromUserClick();
                      }}
                    >
                      {this.fromUserName}
                    </Text>
                    <Text style={{ fontWeight: '300', fontSize: 14 }}> gave </Text>
                    <Text
                      style={{ fontWeight: '500', fontSize: 16 }}
                      onPress={() => {
                        this.toUserClick();
                      }}
                    >
                      {this.toUserName}:
                    </Text>
                  </Text>
                  <Text style={{ color: '#afafaf', fontSize: 12 }}>
                    {TimestampHandling.fromNow(this.feedEntity.published_ts)}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: '#EEEEEE',
                    borderRadius: 25,
                    paddingVertical: 4,
                    paddingHorizontal: 15,
                    marginLeft: 'auto'
                  }}
                >
                  <Text style={{ fontSize: 14, textAlign: 'center', justifyContent: 'center', color: '#484848' }}>
                    P {this.getBtAmount()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {this.giphyEntity && (
            <View>
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
              <Text style={{ fontSize: 14, color: '#34445b' }}>{this.getTextMessage}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default FeedRow;
