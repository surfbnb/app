import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Image, TouchableOpacity , View ,Text } from 'react-native';
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
import ReviewStatusBanner from './ReviewStatusBanner';
import CustomDrawer from '../CustomDrawer';
import {DrawerEmitter} from '../../helpers/Emitters';
import {testProps} from "../../constants/AppiumAutomation";
import { fetchUser } from '../../helpers/helpers';

const mapStateToProps = (state, ownProps) => {
  return { userId: CurrentUser.getUserId() };
};

class ProfileScreen extends PureComponent {
  static navigationOptions = (options) => {
    const name = options.navigation.getParam('headerTitle') || reduxGetter.getName(CurrentUser.getUserId());
    return {
      headerBackTitle: null,
      title: name,
      headerTitleStyle: {
        fontFamily: 'AvenirNext-Medium'
      },
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
    this.state = {
      emailAddress: '',
      isVerifiedEmail: false,
      hasVideos: false,
      openDrawer: false
    };
  }

  componentDidMount() {
    this.getEmail();
    NavigationEmitter.on('onRefresh', (screen) => {
      if (screen.screenName == appConfig.tabConfig.tab5.childStack) {
        this.refresh();
      }
    });
    this.didFocus = this.props.navigation.addListener('didFocus', (payload) => {
      this.props.navigation.setParams({ headerTitle: reduxGetter.getName(CurrentUser.getUserId()) });
    });
    DrawerEmitter.on('toggleDrawer', ()=>{
      this.setState({
        openDrawer: !this.state.openDrawer
      })
    });
    DrawerEmitter.on('closeDrawer', ()=>{
      this.setState({
        openDrawer: false
      })
    })
  }

  getEmail() {
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
    this.setState({ emailAddress : deepGet(res, 'data.email.address' , "") , isVerifiedEmail : deepGet(res, 'data.email.verified' , false)});
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
    this.listRef.forceRefresh();
  }

  onEdit = () => {

    this.props.navigation.push('ProfileEdit', {
      email: this.state.emailAddress,
      isVerifiedEmail: this.state.isVerifiedEmail ,
      onEmailSave : this.onEmailSave
    });

  };

  onEmailSave = ( email ) => {
    if(!email) return;
    this.state.emailAddress = email;
  }

  beforeRefresh = () => {
    fetchUser(CurrentUser.getUserId())
    this.getEmail();
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
            {...testProps('profile-edit-icon')}
          >
            <Image style={{ width: 13, height: 13 }} source={profileEditIcon}></Image>
          </TouchableOpacity>
        }
        videoInReviewHeader={this.videoInReviewHeader()}
      />
    );
  }

  onRefresh =(list , res) => {
    this.setState({ hasVideos : !!list.length });
  }

  videoInReviewHeader = () => {
    if(this.state.hasVideos){
      return <ReviewStatusBanner />
    }
  }

  onClose = ()=>{
    this.setState({
      openDrawer: false
    })
  }

  onDelete = (list) => {
    if (!list || list.length == 0){
      this.setState({hasVideos: false});
    }
  }

  render() {
    if(this.props.userId){
      return  <CustomDrawer openDrawer={this.state.openDrawer} navigation={this.props.navigation} onClose={this.onClose}>
        <UserProfileFlatList
                      onRef={(elem) => this.listRef = elem}
                      listHeaderComponent={this._headerComponent()}
                      beforeRefresh={this.beforeRefresh}
                      onRefresh={this.onRefresh}
                      userId={this.props.userId}
                      onDelete={this.onDelete}
                    />
              </CustomDrawer>


    }else{
      return <View style={{flex: 1 , backgroundColor: Colors.black}} />
    }
  }
}

export default connect(mapStateToProps)(ProfileScreen);
