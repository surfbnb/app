/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {createBottomTabNavigator, createStackNavigator, createSwitchNavigator, createAppContainer} from 'react-navigation';
import Authentication from "./src/components/Authentication";
import HomePage from "./src/components/HomePage";
import Other from "./src/components/Other";
//
// const HomeStack = createStackNavigator({ Home: HomePage, Other: Other });
// const OtherStack = createStackNavigator({ Home: HomePage, Other: Other });
const AppStack = createBottomTabNavigator({ Home: HomePage, Other: Other });
const AuthStack = createStackNavigator({ AuthScreen: Authentication });

export default createAppContainer(createSwitchNavigator(
  {
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Auth',
  }
));