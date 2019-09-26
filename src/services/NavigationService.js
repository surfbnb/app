import { NavigationActions , StackActions } from 'react-navigation';

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

const findCurrentRoute = (navState) => {
  console.log(JSON.stringify(getTopLevelNavigator().state, null ,2 ) );
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
  reset
};
