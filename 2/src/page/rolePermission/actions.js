/**
 * @file actions
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */

import * as services from './services';
import * as actionTypes from '../../conf/actionType';

const getList = (
    data = {
        pageSize: 20,
        currentPage: 1,
        key: null
    },
callback) => dispatch => {
    if (!data.pageSize) {
        data.pageSize = 20;
    }
    if (!data.currentPage) {
        data.currentPage = 1;
    }
    services.getRolePageList(data).then(
        res => {
            dispatch({
                type: actionTypes.ROLE_GET_LIST,
                data: res.data,
                currentPage: data.currentPage
            });

            callback && callback();
        }
    );
}

export const fetch = (data, callback) => {
    return getList(data, callback);
};

export const showAddModal = () => {
    return {
        type: actionTypes.ROLE_SHOW_ADD_MODAL
    }
};

export const hideAddModal = () => {
    return {
        type: actionTypes.ROLE_HIDE_ADD_MODAL
    }
};

export const submitAddForm = data => function (dispatch) {
    services.addRole(data).then(
        res => {
            getList()(dispatch);
        }
    )
}

export const getRolePermissions = roleId => function (dispatch) {
    services.getRoleDetail({
        roleId
    }).then(
        res => {
            dispatch({
                type: actionTypes.ROLE_PERMISSION_DETAIL,
                data: res.data
            });

            dispatch({
                type: actionTypes.ROLE_SHOW_SET_MODAL
            });
        }
    );
}

export const hideRoleSetModal = () => function (dispatch) {
    dispatch({
        type: actionTypes.ROLE_HIDE_SET_MODAL
    });
}

export const submitSetForm = (data, pagination) => function (dispatch) {
    services.setRole(data).then(
        res => {
            getList(pagination)(dispatch);
        }
    )
}
