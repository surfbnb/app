import { NavigationActions } from 'react-navigation';
import { StackActions } from 'react-navigation';

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

function stackNavigate( routeName , params ){
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params
    })
  );
}

export default {
  navigate,
  stackNavigate,
  setTopLevelNavigator
};
