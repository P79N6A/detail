/**
 * @file actions
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */

import * as services from './services';
import * as actionTypes from '../../conf/actionType';
import {Modal} from 'antd';

// 待我审批列表
const queryByStatus = (data = {
    pageSize: 20,
    currentPage: 1
}) => (dispatch) => {
    if (data) {
        Object.assign(data, {
            space: sessionStorage.AuthSpaceId,
            status: 0
        });
    }
    services.queryByStatus(data).then(
        res => {
            dispatch({
                type: actionTypes.APPROVAL_LIST_QERUY_BY_STATUS,
                data: res.data
            });
        }
    );
}

export const fetch = data => {
    return queryByStatus(data);
}

// 我提交的
const queryByUserFn = (data = {
    pageSize: 20,
    currentPage: 1
}) => dispatch => {
    if (data) {
        Object.assign(data, {
            space: sessionStorage.AuthSpaceId
        });
    }
    services.queryByUser(data).then(
        res => {
            dispatch({
                type: actionTypes.APPROVAL_LIST_QERUY_BY_USER,
                data: res.data
            });
        }
    );
}

export const queryByUser = data => {
    return queryByUserFn(data);
}

const queryFn = (data = {
    pageSize: 20,
    currentPage: 1
}, callback) => dispatch => {
    if (data) {
        Object.assign(data, {
            space: sessionStorage.AuthSpaceId
        });
    }
    services.query(data).then(
        res => {
            dispatch({
                type: actionTypes.APPROVAL_LIST_QERUY,
                data: res.data
            });

            callback && callback();
        }
    );
}

// 查询审批任务
export const query = (data, callback) => {
    return queryFn(data, callback);
}

export const queryHistory = data => dispatch => {
    services.queryHistory(data).then(
        res => {
            dispatch({
                type: actionTypes.APPROVAL_QUERY_HISTORY,
                data: res.data
            });
        }
    );
}

// 提交审批任务
export const submitAppro = data => dispatch => {
    services.submitAppro(data).then(
        res => {
            if (res && res.data.msg) {
                if (!res.data.ret || res.data.ret === 'success' || res.data.ret === '0') {
                    Modal.success({
                        title: '提交成功'
                    });
                } else {
                    Modal. error({
                        title: res.data.msg
                    });
                }

                queryByStatus()(dispatch);
            }
        }
    )
}

// 撤回审批任务
export const cancelAppro = data => dispatch => {
    services.cancelAppro(data).then(
        res => {
            if (res && res.data.msg) {
                if (!res.data.ret || res.data.ret === 'success' || res.data.ret === '0') {
                    Modal.success({
                        title: '撤回成功'
                    });
                } else {
                    Modal.error({
                        title: res.data.msg
                    });
                }

                queryByUser()(dispatch);
            }
        }
    )
}
