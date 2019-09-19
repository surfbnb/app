import { NavigationActions , StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}


function reset(navigation) {
  if(!navigation) return;
   navigation.dispatch(StackActions.popToTop("Notification"));
   navigation.dispatch(StackActions.popToTop("Search"));
   navigation.dispatch(StackActions.popToTop("Home"));
}

export default {
  navigate,
  setTopLevelNavigator,
  reset
};
