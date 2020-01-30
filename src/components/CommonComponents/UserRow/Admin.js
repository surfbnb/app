import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import styles from './styles';
import ReduxGetters from '../../../services/ReduxGetters';

const mapStateToProps = (state, ownProps) => {
    return {
      name: ReduxGetters.getName(ownProps.userId, state) || "",
      userName: ReduxGetters.getUserName(ownProps.userId, state)  ||"" ,
      isChannelAdmin: ReduxGetters.isChannelUserAdmin(ownProps.channelId,  ownProps.userId,  state)
    };
  }

const adminUser = (props) => (<View style={styles.outerWrapper}>
                                <View style={styles.innerViewWrapper}>
                                  <Text style={styles.titleName} numberOfLines={1} ellipsizeMode={'tail'}>
                                  {props.name.length > 40 ? `${props.name.substring(0, 40)}...` : props.name}
                                  </Text>
                                  <Text style={styles.titleHandle} numberOfLines={1} ellipsizeMode={'tail'}>
                                  {props.userName.length > 40 ? `${props.userName.substring(0, 40)}...` : props.userName}
                                  </Text>
                                </View>
                                {props.isChannelAdmin && (<View style={styles.adminLeafInnerWrapper}>
                                  <Text style={styles.adminLeafInnerText}>Admin</Text>
                                </View>)}
                              </View>)

export default connect(mapStateToProps)(adminUser);