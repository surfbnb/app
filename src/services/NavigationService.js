import { StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    StackActions.push({
      routeName,
      params
    })
  );
}

export default {
  navigate,
  setTopLevelNavigator
};
