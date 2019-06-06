import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

import AuthLoading from './src/components/AuthLoading';
import Authentication from './src/components/Authentication';
import Feed from './src/components/Feed';
import Users from './src/components/Users';

const AppTabNavigator = createBottomTabNavigator({
  Feed: Feed,
  Users: Users
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoadingScreen: AuthLoading,
      AuthScreen: Authentication,
      Home: AppTabNavigator
    },
    {
      initialRouteName: 'AuthLoadingScreen'
    }
  )
);
