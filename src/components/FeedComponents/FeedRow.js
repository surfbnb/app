import React, { Component } from 'react';
import { View, Text, Image} from 'react-native';
import styles from './styles';
import Store from '../../store';
import TimestampHandling from '../../helpers/timestampHandling';
import NavigationService from '../../services/NavigationService'; 

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

  getFromUserId(){
    return this.transactionEntity.from_user_id; 
  }

  getToUserId(){
    return this.transactionEntity.to_user_ids[0] ; 
  }

  get fromUserName() {
    let fromUserId = this.transactionEntity.from_user_id,
      fromUser = Store.getState().user_entities[`id_${fromUserId}`];
    return fromUserId == this.getCurrentUserId ? 'You' : fromUser.first_name ;
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

  fromUserClick(){
    if(!this.props.nestedNavigation) return;
    const userId = this.getFromUserId(); 
    if(userId ==  this.getCurrentUserId ) {
      NavigationService.navigate('Profile');
    } else{
      NavigationService.navigate('UserFeedScreen', { headerText: this.fromUserName, userId:userId});
    }
  }

  toUserClick(){
    if(!this.props.nestedNavigation) return;
    const userId = this.getToUserId(); 
    if(userId ==  this.getCurrentUserId ) {
      NavigationService.navigate('Profile');
    } else{
      NavigationService.navigate('UserFeedScreen', { headerText: this.toUserName, userId:userId});
    }
   
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cellWrapper}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <View style={{ width: '15%', height: 50 }}>
              <Image
                source={{ uri: 'https://image.flaticon.com/icons/png/512/17/17004.png' }}
                style={{
                  padding: 5,
                  borderRadius: 30,
                  height: '100%',
                  width: '100%'
                }}
              />
            </View>
            <View style={{ width: '70%', height: 50, marginLeft: 10, marginTop: 5 }}>
              <Text style={{ fontSize: 18 }}>
                <Text style={{ fontWeight: 'bold' }}  onPress={() => { this.fromUserClick(); }}> 
                  {this.fromUserName} 
                </Text>
                <Text> gave </Text>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}  onPress={() => { this.toUserClick(); }}> 
                  {this.toUserName}:
                </Text>
              </Text>
              <Text style={{ marginLeft: 5 }}>{TimestampHandling.fromNow(this.feedEntity.published_ts)}</Text>
            </View>
            <View
              style={{
                width: '15%',
                borderRadius: 20,
                height: 40,
                backgroundColor: '#EEEEEE',
                marginTop: 7,
                justifyContent: 'center'
              }}
            >
              <Text style={{ fontSize: 18, textAlign: 'center' }}>P{String(this.transactionEntity.amounts[0])[0]}</Text>
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
              <Text style={{ fontSize: 18 }}>{this.getTextMessage}</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default FeedRow;
