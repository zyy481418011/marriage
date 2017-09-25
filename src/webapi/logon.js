import {post} from './http';

// 登陆
export function login(user, password) {
  return post('/login', {
    user,
    password
  });
}

// // 找回密码获取验证码
// export function getUserYZM(telephone) {
//   return post('/generateSecretCode', {telephone});
// }
//
// // 找回密码设置新密码
// export function setNewPassword(username, password, telephone, secretCode) {
//   return post('/user/updatepasswordbytel', {username, password, telephone, secretCode});
// }
//
// // 注册账号
// export function register(username, password) {
//   return post('/user/register', {username, password});
// }
