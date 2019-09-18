import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import EventEmitter from 'eventemitter3';
import deepGet from 'lodash/get';

import BalanceHeader from '../Profile/BalanceHeader';
import SideMenu from '../Menu';
import UserInfo from '../CommonComponents/UserInfo';
import CurrentUser from '../../models/CurrentUser';
import reduxGetter from '../../services/ReduxGetters';
import UserProfileFlatList from '../CommonComponents/UserProfileFlatList';
import inlineStyles from './styles';
import Colors from '../../theme/styles/Colors';
import NavigationEmitter from '../../helpers/TabNavigationEvent';
import Pricer from '../../services/Pricer';
import appConfig from '../../constants/AppConfig';
import profileEditIcon from '../../assets/profile_edit_icon.png';
import multipleClickHandler from '../../services/MultipleClickHandler';
import PepoApi from '../../services/PepoApi';

const mapStateToProps = (state, ownProps) => {
  return { userId: CurrentUser.getUserId() };
};

class ProfileScreen extends PureComponent {
  static navigationOptions = (options) => {
    const name = options.navigation.getParam('headerTitle') || reduxGetter.getName(CurrentUser.getUserId());
    return {
      headerBackTitle: null,
      headerTitle: name,
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerRight: <SideMenu {...options} />
    };
  };

  constructor(props) {
    super(props);
    this.refreshEvent = new EventEmitter();
    this.state = {
      emailAddress: '',
      isVerifiedEmail: false
    };
  }

  componentDidMount() {
    NavigationEmitter.on('onRefresh', (screen) => {
      if (screen.screenName == appConfig.tabConfig.tab5.childStack) {
        this.refresh();
      }
    });
    this.didFocus = this.props.navigation.addListener('didFocus', (payload) => {
      this.props.navigation.setParams({ headerTitle: reduxGetter.getName(CurrentUser.getUserId()) });
    });
    this.refresh();
    this.setEmail();
  }

  setEmail() {
    new PepoApi(`/users/email`)
      .get()
      .then((res) => {
        if (res && res.success) {
          this.onEmailSuccess(res);
        } else {
          this.onEmailError(res);
        }
      })
      .catch((error) => {
        this.onEmailError(error);
      });
  }

  onEmailSuccess(res) {
    this.setState({
      emailAddress: deepGet(res, 'data.email.address'),
      isVerifiedEmail: deepGet(res, 'data.email.verified')
    });
  }

  onEmailError(error) {}

  componentWillUnmount() {
    NavigationEmitter.removeListener('onRefresh');
    this.didFocus && this.didFocus.remove && this.didFocus.remove();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId && this.props.userId != prevProps.userId) {
      this.props.navigation.setParams({ headerTitle: reduxGetter.getName(CurrentUser.getUserId()) });
      this.refresh();
    }
  }

  refresh() {
    this.refreshEvent.emit('refresh');
  }

  onEdit = () => {
    this.props.navigation.push('ProfileEdit', {
      email: this.state.emailAddress,
      isVerifiedEmail: this.state.isVerifiedEmail
    });
  };

  fetchBalance = () => {
    Pricer.getBalance();
  };

  _headerComponent() {
    return (
      <UserInfo
        userId={this.props.userId}
        header={<BalanceHeader />}
        editButton={
          <TouchableOpacity
            onPress={multipleClickHandler(() => this.onEdit())}
            style={[inlineStyles.editProfileIconPos]}
          >
            <Image style={{ width: 13, height: 13 }} source={profileEditIcon}></Image>
          </TouchableOpacity>
        }
        isOwnProfile={true}
      />
    );
  }

  _subHeader() {
    return <Text style={{ color: 'transparent' }}>Videos</Text>;
  }

  render() {
    return (
      <UserProfileFlatList
        refreshEvent={this.refreshEvent}
        ref={(ref) => {
          this.flatlistRef = ref;
        }}
        listHeaderComponent={this._headerComponent()}
        listHeaderSubComponent={this._subHeader()}
        beforeRefresh={this.fetchBalance}
        userId={this.props.userId}
      />
    );
  }
}

export default connect(mapStateToProps)(ProfileScreen);
