import * as types from './constants';

export const upsertAction = (data) => ({ type: types.UPSERT, payload: { feed: data } });
