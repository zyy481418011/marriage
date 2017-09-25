import {get, post} from './http';

// 获取企业信息
export function getInfo() {
  return get('/company/query');
}

// 保存企业信息
export function saveInfo(comName, comProvince, comIndustry, comStandard, comContact, branchOff, branchOrg) {
  return post('/company/update', {comName, comProvince, comIndustry, comStandard, comContact, branchOff, branchOrg});
}

// 获取验证码在login.js

// 保存企业信息
export function bindTel(telephone, secretCode) {
  return post('/user/update', {telephone, secretCode});
}
