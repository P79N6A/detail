/**
 * @file actions
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */

import * as services from './services';
import * as actionTypes from '../../conf/actionType';

const getUserGroupList = () => (dispatch) => {
    services.getUserGroupList().then(
        res => {
            dispatch({
                type: actionTypes.ROLE_GROUP_GET_USER_GROUP,
                data: res.data
            });
        }
    );
}

export const fetch = () => {
    return getUserGroupList();
}

export const getRoleList = () => function (dispatch) {
    services.getRoleList().then(
        res => {
            dispatch({
                type: actionTypes.ROLE_GROUP_GET_ROLE_LIST,
                data: res.data
            });
        }
    );
}

export const getRole = groupId => function (dispatch) {
    services.getRole({
        groupId
    }).then(
        res => {
            dispatch({
                type: actionTypes.ROLE_GROUP_GET_ROLE,
                data: res.data
            });
        }
    );
}

export const getStatus = data => function (dispatch) {
    services.getStatus(data).then(
        res => {
            dispatch({
                type: actionTypes.ROLE_GROUP_GET_STATUS,
                data: res.data
            });
        }
    );
}

export const getUserList = data => function (dispatch) {
    services.getUserList(data).then(
        res => {
            dispatch({
                type: actionTypes.ROLE_GROUP_GET_USER_LIST,
                data: res.data
            });
        }
    );
}

export const getMembers = data => function (dispatch) {
    services.getMembers(data).then(
        res => {
            dispatch({
                type: actionTypes.ROLE_GROUP_GET_MEMBERS,
                data: res.data
            });
        }
    );
}

// export const setMembers = data => function (dispatch) {
//     services.setMembers(data);
// }


export const addUserGroup = data => function (dispatch) {
    services.addUserGroup(data).then(
        res => getUserGroupList()(dispatch));
}

export const setGroupStatus = data => function (dispatch) {
    services.setStatus(data).then(
        res => getUserGroupList()(dispatch)
    );
}

export const setGroupRole = data => function (dispatch) {
    services.setRole(data);
}

export const setGroupMembers = data => function (dispatch) {
    services.setMembers(data);
}
