import React from 'react';
import { connect } from 'react-redux';
import { Text, View , Image} from 'react-native';
import styles from './styles';
import ReduxGetters from '../../../services/ReduxGetters';
import Pricer from "../../../services/Pricer";
import PepoIcon from '../../../assets/pepo-tx-icon.png';

const mapStateToProps = (state, ownProps) => {
    return {
      name: ReduxGetters.getName(ownProps.userId, state) || "",
      userName: ReduxGetters.getUserName(ownProps.userId, state)  ||"" 
    };
  }

const supportersSupportingUser = (props) => (<React.Fragment>
                                                <Text numberOfLines={1} style={styles.supportersSupportingWrapper}>
                                                    {props.name.length > 40 ? `${props.name.substring(0, 40)}...` : props.name}
                                                </Text>
                                                <View style={[styles.numericInnerWrapper]}>
                                                    <Image source={PepoIcon} style={styles.pepoAmountimageIconSkipFont} />
                                                    <Text style={styles.numericInfoText}>{Pricer.toDisplayAmount(props.amount)}</Text>
                                                </View>
                                             </React.Fragment>)


export default connect(mapStateToProps)(supportersSupportingUser);