/**
 * @file 用户账号管理页面请求
 * @author chenling
 */
import request from '../../common/js/request';

export const getUserCountList = (data = {}) => request('/console/auth/user/queryPageList', {
    method: 'get',
    body: data
});

export const addUserCount = (data = {}) => request('/console/auth/user/add', {
    method: 'post',
    body: data
});

export const userCountDuplicate = (data = {}) => request('/console/auth/user/duplicate', {
    method: 'get',
    body: data
});

export const userCountUpdate = (data = {}) => request('/console/auth/user/update', {
    method: 'post',
    body: data
});

export const getUserRoleList = (data = {}) => request('/console/auth/user/queryRoleRelation', {
    method: 'get',
    body: data
});

export const setUserRole = (data = {}) => request('/console/auth/user/addRoleRelation', {
    method: 'post',
    body: data
});

// export const userCountSearch = (data = {}) => request('/console/auth/user/searchDetail', {
//     method: 'get',
//     body: data
// });

export const userCountDetail = (data = {}) => request('/console/auth/user/detail', {
    method: 'get',
    body: data
});

export const getAllRoles = (data = {}) => request('/console/auth/role/list', {
    method: 'get',
    body: data
});


