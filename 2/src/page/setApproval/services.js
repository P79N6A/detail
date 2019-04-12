/**
 * @file services
 */

import request from '../../common/js/request';

export const getApprovalFlow = (data = {}) => request('/console/approvalAdapt/flow/query', {
    method: 'get',
    body: data
});

export const setApprovalFlow = (data = {}) => request('/console/approvalAdapt/flow/add', {
    method: 'post',
    body: data
});
