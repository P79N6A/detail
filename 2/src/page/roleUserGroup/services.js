/**
 * @file services
 */

import request from '../../common/js/request';

export const getUserGroupList = (data = {}) => request('/console/auth/group/list', {
    method: 'get',
    body: data
});

export const getRoleList = (data = {}) => request('/console/auth/role/list', {
    method: 'get',
    body: data
});

export const addUserGroup = (data = {}) => request('/console/auth/group/add', {
    method: 'post',
    body: data
});

export const getRole = (data = {}) => request('/console/auth/group/queryRoles', {
    method: 'get',
    body: data
});

export const setRole = (data = {}) => request('/console/auth/group/editRoles', {
    method: 'post',
    body: data
});

export const getMembers = (data = {}) => request('/console/auth/group/queryMembers', {
    method: 'get',
    body: data
});

export const setMembers = (data = {}) => request('/console/auth/group/editMembers', {
    method: 'post',
    body: data
});

export const setStatus = (data = {}) => request('/console/auth/group/editDetail', {
    method: 'post',
    body: data
});

export const getStatus = (data = {}) => request('/console/auth/group/detail', {
    method: 'get',
    body: data
});

export const getUserList = (data = {}) => request('/console/auth/user/search', {
    method: 'get',
    body: data
});
