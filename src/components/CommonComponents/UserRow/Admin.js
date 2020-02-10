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
                                <View style={[styles.innerViewWrapper, {flex: 1, marginRight: props.isChannelAdmin ? 5 : 0}]}>
                                  <Text style={styles.titleName} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {props.name}
                                  </Text>
                                  <Text style={styles.titleHandle} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {props.userName}
                                  </Text>
                                </View>
                                {props.isChannelAdmin && (<View style={[styles.adminLeafInnerWrapper]}>
                                  <Text style={styles.adminLeafInnerText}>Admin</Text>
                                </View>)}
                              </View>)

export default connect(mapStateToProps)(adminUser);