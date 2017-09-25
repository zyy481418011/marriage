import {
    SAVE_TOKENS,
    SAVE_TOKENS_INFO,
    LOAD_USERINFO_FROM_STORAGE,
    LOAD_TOKENS_FROM_STORAGE,
    LOGOUT
} from './action-types';

// 从localStorage初始化token
export function getTokenFromStorage() {
  return function(dispatch) {
    dispatch(getUserInfoFromLocalStorage());
    let accessToken = window.localStorage.getItem('accessToken');
    dispatch({
      type: LOAD_TOKENS_FROM_STORAGE,
      accessToken
    });
  };
}

// 获取token后，保存token
export function saveToken(accessToken) {
  return function(dispatch) {
    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: SAVE_TOKENS,
      accessToken
    });
  };
}

// 保存tokenInfo
export function saveUserInfo(tokenInfo) {
  return function(dispatch) {
    window.localStorage.setItem('tokenInfo', JSON.stringify(tokenInfo));
    dispatch({
      type: SAVE_TOKENS_INFO,
      tokenInfo
    });
  };
}

// 重新从内存获取tokenInfo保存到store
export function getUserInfoFromLocalStorage() {
  let tokenInfo = JSON.parse(window.localStorage.getItem('tokenInfo'));
  return {
    type: LOAD_USERINFO_FROM_STORAGE,
    tokenInfo
  };
}

// 清空所有凭据，登出
export function logout() {
  window.localStorage.removeItem('accessToken');
  window.localStorage.removeItem('tokenInfo');
  return {
    type: LOGOUT
  };
}

