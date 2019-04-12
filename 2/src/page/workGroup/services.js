/**
 * @file
 */
import request from '../../common/js/request';

export const spaceList = (data = {}) => request('/console/auth/space/list', {
    method: 'get',
    body: data
});

export const spaceSearch = (data = {}) => request('/console/auth/space/search', {
    method: 'get',
    body: data
});

export const usersList = (data = {}) => request('/console/auth/user/searchAll', {
    method: 'get',
    body: data
});

export const spaceDuplicate = (data = {}) => request('/console/auth/space/duplicate', {
    method: 'get',
    body: data
});

export const spaceAdd = (data = {}) => request('/console/auth/space/add', {
    method: 'post',
    body: data
});

export const spaceDetail = (data = {}) => request('/console/auth/space/detail', {
    method: 'get',
    body: data
});

export const spaceEdit = (data = {}) => request('/console/auth/space/editInfo', {
    method: 'post',
    body: data
});

export const spaceMembersDetail = (data = {}) => request('/console/auth/space/members', {
    method: 'get',
    body: data
});

export const spaceMembersEdit = (data = {}) => request('/console/auth/space/editMembers', {
    method: 'post',
    body: data
});

export const getHmsUserList = (data = {}) => request('/console/auth/space/queryHmsUserList', {
    method: 'get'
});


