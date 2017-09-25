import {get, post, put, del, postAddUsers} from './http';

export function getUserInfo(){
    return get('/account/me');
}

export function getUserInfoById(id){
    return get(`/account/user/${id}`);
}

export function getUserList() {
    return get('/account');
}

export function getMyInfo() {
    return get('/account/me');
}

export function addUser(data) {
    return postAddUsers('/account', data);
}

export function updateUser(password, perm_group, perm_company, type, group, pass_old) {
    return put('/account', {password, perm_group, perm_company, type, group, pass_old});
}

export function updateUserById(id, password, perm_group, perm_company, type, group) {
// password: 新密码
// perm_group: 组管理权限
// perm_company: 上传数据权限
// type: 用户类型
// group: 组ID
// pass_old: 旧密码
//{password, perm_group, perm_company, type, group, pass_old}
    return put(`/account/${id}`, {password, perm_group, perm_company, type, group});
}
export function delUser(id) {
    return del(`/account/${id}`);
}
