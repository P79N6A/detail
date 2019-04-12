/**
 * @file
 */
import * as actionType from '../../conf/actionType';
import * as services from './service';

const getList =  params => function (dispatch) {
    services.getUserCountList(params).then(
        res => {
            res && res.data.ret === 'SUCCESS' && dispatch({
                type: actionType.USER_COUNT_LIST,
                data: res.data.content,
                pagination: params
            });
        }
    ).catch(err => {
        console.log(err);
    });
};

export const getUserCountList = params => {
    return getList(params);
};

export const addUserCount = (params, pagination) => function (dispatch) {
    services.addUserCount(params).then(
        res => {
            res && res.data.ret === 'SUCCESS' && getList(pagination)(dispatch);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const userCountDuplicate = (params, callback) => function (dispatch) {
    services.userCountDuplicate(params).then(
        res => {
            if (res && res.data.ret === 'SUCCESS') {
                callback(res.data.content);
            }
        }
    ).catch(err => {
        console.log(err);
    });
};

export const userCountId = userCountId => {
    return {
        type: actionType.USER_COUNT_ID,
        userCountId
    };
};

export const userCountName = userCountName => {
    return {
        type: actionType.USER_COUNT_NAME,
        userCountName
    };
};

export const userCountUpdate = (params, pagination) => function (dispatch) {
    services.userCountUpdate(params).then(
        res => {
            res && res.data.ret === 'SUCCESS' && getList(pagination)(dispatch);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const getUserRoleList = (params, callback) => function (dispatch) {
    services.getUserRoleList(params).then(
        res => {
            callback(res);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const setUserRole = (params, pagination) => function (dispatch) {
    services.setUserRole(params).then(
        res => {
            res && res.data.ret === 'SUCCESS' && getList(pagination)(dispatch);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const userCountDetail = (params, callback) => function (dispatch) {
    services.userCountDetail(params).then(
        res => {
            callback(res);
            dispatch({
                type: actionType.USER_COUNT_DETAIL,
                data: res.data
            });
        }
    ).catch(err => {
        console.log(err);
    });
};

export const getAllRoles = callback => function (dispatch) {
    services.getAllRoles().then(
        res => {
            callback(res);
            dispatch({
                type: actionType.ALL_ROLES,
                data: res.data
            });
        }
    );
};










