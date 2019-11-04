import { NavigationActions , StackActions } from 'react-navigation';
import deepGet from 'lodash/get';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function getTopLevelNavigator(){
  return _navigator;
}


function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
}

function getActiveTab(){
  let activeIndex = deepGet(_navigator , 'state.nav.index'),
      tabIndex = deepGet(_navigator , `state.nav.routes[${activeIndex}].index`),
      route = deepGet(_navigator , `state.nav.routes[${activeIndex}].routes[${tabIndex}]`);
  return route && route["routeName"];
}

const findCurrentRoute = (navState) => {
  if ( !navState ) {
    navState = getTopLevelNavigator().state.nav;
  }

  let index = navState.index;
  if (typeof index !== "number") {
    //No more index.
    return navState.routeName;
  } else {
    //Call recursive;
    return findCurrentRoute(navState.routes[index] );
  }
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
  getTopLevelNavigator,
  findCurrentRoute,
  getActiveTab,
  reset
};
