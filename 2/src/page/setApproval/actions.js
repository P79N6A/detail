/**
 * @file actions
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */

import * as services from './services';
import * as actionTypes from '../../conf/actionType';
import {Modal} from 'antd';


const getApprovalFlow = data => (dispatch) => {
    if (data) {
        Object.assign(data, {
            space: sessionStorage.AuthSpaceId
        });
    }
    services.getApprovalFlow(data).then(
        res => {
            dispatch({
                type: actionTypes.SET_APPROVAL_GET_FLOW,
                data: res.data
            });
        }
    );
}

export const fetch = data => {
    return getApprovalFlow(data);
}

export const setApprovalFlow = (data, callback) => function (dispatch) {

    if (data) {
        Object.assign(data, {
            space: sessionStorage.AuthSpaceId
        });
    }


    services.setApprovalFlow(data).then(
        res => {
            if (!res.data.ret || res.data.ret === 'success' || res.data.ret === '0') {
                Modal.success({
                    title: '创建模版成功'
                });
            } else {
                Modal.error({
                    title: res.data.msg
                });
            }
            callback();
        }
    )
}
