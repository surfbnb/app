import React from 'react';
 
import { View, TouchableOpacity, Image , Clipboard} from 'react-native';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import inlineStyles from './styles';
import tripleDot from '../../../assets/user_profile_options.png';
 
class BrowserMenu extends React.PureComponent {

  _menu = null;
 
  setMenuRef = ref => {
    this._menu = ref;
  };
 
  hideMenu = () => {
    this._menu.hide();
  };
 
  showMenu = () => {
    this._menu.show();
  };

  copyLink = () => {
    Clipboard.setString(this.props.url);
    this.hideMenu();
  };

  shareVia = async() => {
    if(this.props.share ){
      await this.props.share();
    }
    this.hideMenu();
  };

  reload = () => {
    if(this.props.reload ){
        this.props.reload();
    }
    this.hideMenu();
  }
 
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Menu
          ref={this.setMenuRef}
          button={<TouchableOpacity
                    onPress={this.showMenu}
                    style={inlineStyles.iconWrapper}
                    >
                    <Image style={inlineStyles.tripleDotSkipFont} source={tripleDot}></Image>
                </TouchableOpacity>}
        >
          <MenuItem onPress={this.copyLink}>Copy Link</MenuItem>
          <MenuDivider />
          <MenuItem onPress={this.shareVia}>Share via</MenuItem>
          <MenuItem onPress={this.reload}>Reload</MenuItem>
        </Menu>
      </View>
    );
  }
}
 
export default BrowserMenu;