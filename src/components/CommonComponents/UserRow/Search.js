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

const searchUser = (props) => ( <View style={styles.innerViewWrapper}>
                                  <Text numberOfLines={1} style={styles.titleName}>
                                    {props.name.length > 40 ? `${props.name.substring(0, 40)}...` : props.name}
                                  </Text>
                                  <Text style={styles.smallHandleTitle}>{`@${props.userName}`}</Text>
                                </View>)


export default connect(mapStateToProps)(searchUser);