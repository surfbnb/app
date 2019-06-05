import {createBottomTabNavigator, createStackNavigator, createSwitchNavigator, createAppContainer} from 'react-navigation';

import Authentication from "./src/components/Authentication";
import HomePage from "./src/components/HomePage";
import Other from "./src/components/Other";

const AppTabNavigator = createBottomTabNavigator({
    Home: HomePage,
    Other: Other
});
const AuthStackNavigator = createStackNavigator({
    AuthScreen: Authentication
});

export default createAppContainer(createSwitchNavigator(
  {
    App: AppTabNavigator,
    Auth: AuthStackNavigator,
  },
  {
    initialRouteName: 'Auth',
  }
));
