import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import BalanceHeader from '../Profile/BalanceHeader';
import LogoutComponent from '../LogoutLink';
import UserInfo from '../CommonComponents/UserInfo';
import CurrentUser from '../../models/CurrentUser';

import reduxGetter from '../../services/ReduxGetters';

import UserProfileFlatList from "../CommonComponents/UserProfileFlatList"
import TouchableButton from "../../theme/components/TouchableButton";
import Theme from "../../theme/styles";

const mapStateToProps = (state, ownProps) => {
  return { userId: CurrentUser.getUserId() };
};

class ProfileScreen extends PureComponent {
  static navigationOptions = (options) => {
    const name = options.navigation.getParam('headerTitle') || reduxGetter.getName(CurrentUser.getUserId());
    return {
      headerBackTitle: null,
      headerTitle: name,
      headerRight: <LogoutComponent {...options} />
    };
  };

  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId != prevProps.userId) {
      this.props.navigation.setParams({ headerTitle: reduxGetter.getName(CurrentUser.getUserId()) });
      //TODO Stack pop. 
    }
  }
  
  onEdit = () => {
    this.props.navigation.push('ProfileEdit');
  }

  _headerComponent(){
    return (
      <UserInfo userId={this.props.userId} header = {<BalanceHeader />}
                editButton={
                  <TouchableButton
                    onPress={this.onEdit}
                    TouchableStyles={[Theme.Button.btnPinkSecondary, { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 50 }]}
                    TextStyles={[Theme.Button.btnPinkSecondaryText]}
                    text="Edit Your Profile"
                  /> } />
    )
  }

  render() {
    return (
      <UserProfileFlatList listHeaderComponent = {this._headerComponent()}
                           userId={this.props.userId} />
    );
  }
}

export default connect(mapStateToProps)(ProfileScreen);
