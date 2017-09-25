import {
    SAVE_TOKENS,
    SAVE_TOKENS_INFO,
    LOAD_USERINFO_FROM_STORAGE,
    LOAD_TOKENS_FROM_STORAGE,
    LOGOUT
} from './action-types';

const initialState = {
  accessToken: null,
  tokenInfo: null
};

export default function logon(state=initialState, action) {
  switch (action.type) {
    case LOAD_TOKENS_FROM_STORAGE:
      return {
        ...state,
        accessToken: action.accessToken
      };
    case LOAD_USERINFO_FROM_STORAGE:
      return {
        ...state,
        tokenInfo: action.tokenInfo
      };
    case SAVE_TOKENS:
      return {
        ...state,
        accessToken: action.accessToken
      };
    case SAVE_TOKENS_INFO:
      return {
        ...state,
        tokenInfo: action.tokenInfo
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
}
