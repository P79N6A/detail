/**
 * @file services
 */

import request from '../../common/js/request';

export const getRolePageList = (data = {}) => request('/console/auth/role/queryPageList', {
    method: 'get',
    body: data
});

export const addRole = (data = {}) => request('/console/auth/role/add', {
    method: 'post',
    body: data
});

export const setRole = (data = {}) => request('/console/auth/role/auth', {
    method: 'post',
    body: data
});

export const getRoleDetail = (data = {}) => request('/console/auth/role/permissions', {
    method: 'get',
    body: data
});

// export const search = (data = {}) => request('/console/auth/role/search', {
//     method: 'post',
//     body: data
// });
