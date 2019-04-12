/**
 * @file
 */
import request from '../../common/js/request';

export const getDataSourceList = (data = {}) => request('/console/auth/datasource/list', {
    method: 'get',
    body: data
});

export const getDataSourceDetail = (data = {}) => request('/console/auth/datasource/detail', {
    method: 'get',
    body: data
});

export const checkConnect = (data = {}) => request('/console/auth/datasource/checkConnect', {
    method: 'post',
    body: data
});

export const editDataSource = (data = {}) => request('/console/auth/datasource/editInfo', {
    method: 'post',
    body: data
});

export const addDataSource = (data = {}) => request('/console/auth/datasource/add', {
    method: 'post',
    body: data
});

export const deleteDataSource = (data = {}) => request('/console/auth/datasource/delete', {
    method: 'post',
    body: data
});

export const getSpaceRelation = (data = {}) => request('/console/auth/datasource/showSpaceRelation', {
    method: 'get',
    body: data
});

export const editSpaceRelation = (data = {}) => request('/console/auth/datasource/editSpaceRelation', {
    method: 'post',
    body: data
});
