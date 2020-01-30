import React from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import styles from './styles';
import ReduxGetters from '../../../services/ReduxGetters';

const mapStateToProps = (state, ownProps) => {
    return {
      name: ReduxGetters.getName(ownProps.userId, state) || "",
      userName: ReduxGetters.getUserName(ownProps.userId, state)  ||""
    };
  }

const inviteUser = (props) => (<View style={styles.innerViewWrapper}>
                                    <Text style={styles.titleName} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {props.name}
                                    </Text>
                                    <Text style={styles.smallHandleTitle} numberOfLines={1} ellipsizeMode={'tail'}>
                                    {props.userName}
                                    </Text>
                                </View>)


export default connect(mapStateToProps)(inviteUser);