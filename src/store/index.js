import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { reducer } from '../reducers';

export const store = __DEV__ === true ? createStore(reducer, applyMiddleware(logger)) : createStore(reducer);
//  export const store = createStore(reducer);

export default store;
