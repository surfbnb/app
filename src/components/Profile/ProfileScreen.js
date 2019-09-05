import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import EventEmitter from 'eventemitter3';
import BalanceHeader from '../Profile/BalanceHeader';
import LogoutComponent from '../LogoutLink';
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
      headerRight: <LogoutComponent {...options} />
    };
  };

  constructor(props) {
    super(props);
    this.refreshEvent = new EventEmitter();
    this.refresh();
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
  }

  componentWillUnmount() {
    NavigationEmitter.removeListener('onRefresh');
    this.didFocus.remove();
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId != prevProps.userId) {
      this.props.navigation.setParams({ headerTitle: reduxGetter.getName(CurrentUser.getUserId()) });
      this.props.navigation.goBack(null);
      this.refresh();
    }
  }

  refresh() {
    this.refreshEvent.emit('refresh');
  }

  onEdit = () => {
    this.props.navigation.push('ProfileEdit');
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
