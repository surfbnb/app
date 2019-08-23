import React,{Component} from 'react';
import {Text,View,Image} from 'react-native';
import reduxGetter from '../../services/ReduxGetters';
import { connect } from 'react-redux';

import Theme from "../../theme/styles";
import styles from "./styles";
import ProfilePicture from "../ProfilePicture";
import PepoPinkIcon from "../../assets/heart.png";
import utilities from "../../services/Utilities";


const mapStateToProps = (state, ownProps) => {
  return {
    name: reduxGetter.getName(ownProps.userId, state) ,
    userName : reduxGetter.getUserName(ownProps.userId, state)
  };
}
const User = (props) =>{
  {
    return(
      <View style={styles.txtWrapper}>
        <Image source={PepoPinkIcon} style={styles.systemNotificationIconSkipFont} />
        <View style={{ flexDirection: 'column', flex: 1 }}>
          <Text style={styles.titleName} numberOfLines={1} ellipsizeMode={'tail'}>{props.name}</Text>
          <Text style={styles.titleHandle} numberOfLines={1} ellipsizeMode={'tail'}>{props.userName}</Text>
        </View>
      </View>
    )

}
}


export default connect(mapStateToProps)(User);