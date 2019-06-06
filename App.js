import {
  createBottomTabNavigator,
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from "react-navigation";

import Authentication from "./src/components/Authentication";
import Feed from "./src/components/Feed";
import Users from "./src/components/Users";

const AppTabNavigator = createBottomTabNavigator({
  Feed: Feed,
  Users: Users
});

export default createAppContainer(
  createSwitchNavigator(
    {
      App: AppTabNavigator,
      Auth: Authentication
    },
    {
      initialRouteName: "Auth"
    }
  )
);
