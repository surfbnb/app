import React,{PureComponent} from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';
import {testProps} from "../../constants/AppiumAutomation";

import {DrawerEmitter} from '../../helpers/Emitters';
import ShareOptions from '../CommonComponents/ShareOptions';
import CurrentUser from '../../models/CurrentUser';

class Menu extends PureComponent{
  constructor(props){
    super(props);
  }

  render(){
    return (
  <React.Fragment>
      <ShareOptions entityId= {CurrentUser.getUserId()} entityKind={'user'}/>
        {this.props.navigation && this.props.navigation.state.routeName === 'ProfileScreen' && (
      <TouchableOpacity
        style={{ height: 32, width: 35, alignItems: 'center', justifyContent: 'center', marginRight: 15 }}
        onPress={()=>{DrawerEmitter.emit('toggleDrawer')}}
        activeOpacity={0.2}
      {...testProps('profile-right-side-toggle-drawer')}>
        <Text style={{ width: 20, height: 2, borderWidth: 1 }}></Text>
        <Text style={{ width: 20, height: 2, borderWidth: 1, marginVertical: 5 }}></Text>
        <Text style={{ width: 20, height: 2, borderWidth: 1 }}></Text>
      </TouchableOpacity>
    )}
  </React.Fragment>
)}
}

export default Menu;
