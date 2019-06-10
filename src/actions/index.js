import * as types from './constants';

export const upsertPosts = (data) => ({ type: types.UPSERT_POSTS, payload: { feed: data } });
export const upsertUsers = (data) => ({ type: types.UPSERT_USERS, payload: { users: data } });
