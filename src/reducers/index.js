import { createActions, handleActions } from 'redux-actions';
import { UPSERT } from '../actions/constants';

export const { upsert } = createActions(UPSERT);

console.log('upsertAction', upsert, 'UPSERT', UPSERT);

export const reducer = handleActions(
  {
    [upsert]: (state, action) => {
      console.log(action.payload.feed, 'action.payload.feed', action.payload, 'action.payload');
      return { ...state, feed: action.payload.feed };
    }
  },
  { feed: {} }
);
