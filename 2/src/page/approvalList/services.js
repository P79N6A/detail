/**
 * @file services
 */

import request from '../../common/js/request';

// 查询用户待办
export const queryByStatus = data => request('/console/approvalAdapt/task/queryByStatus', {
    method: 'get',
    body: data
});

// 查询用户提交的
export const queryByUser = (data = {}) => request('/console/approvalAdapt/task/queryByUser', {
    method: 'get',
    body: data
});

// 审计查询
export const query = (data = {}) => request('/console/approvalAdapt/audit/query', {
    method: 'get',
    body: data
});

// 查寻历史处理记录
export const queryHistory = (data = {}) => request('/console/approvalAdapt/task/history', {
    method: 'get',
    body: data
});

// 提交审批
export const submitAppro = (data = {}) => request('/console/approvalAdapt/audit/submit', {
    method: 'post',
    body: data
});

// 撤回任务
export const cancelAppro = (data = {}) => request('/console/approvalAdapt/task/cancel', {
    method: 'post',
    body: data
});
