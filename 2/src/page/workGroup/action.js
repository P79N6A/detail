/**
 * @file
 * @author chenling
 */
import * as actionType from '../../conf/actionType';
import * as services from './services';

const getList = params => function (dispatch) {
    services.spaceList(params).then(
        res => {
            dispatch({
                type: actionType.SPACE_LIST,
                data: res.data,
                pagination: params
            });
        }
    ).catch(err => {
        console.log(err);
    });
};

export const spaceList = params => {
    return getList(params);
};


export const spaceSearch = params => function (dispatch) {
    services.spaceSearch(params).then(
        res => {
            dispatch({
                type: actionType.SPACE_SEARCH,
                data: res.data
            });
        }
    ).catch(err => {
        console.log(err);
    });
};

export const usersList = params => function (dispatch) {
    services.usersList(params).then(
        res => {
            dispatch({
                type: actionType.USERS_LIST,
                data: res.data
            });
        }
    ).catch(err => {
        console.log(err);
    });
};

export const spaceDuplicate = (params, callback) => function (dispatch) {
    services.spaceDuplicate(params).then(
        res => {
            if (res && res.data.ret === 'SUCCESS') {
                callback(res.data.content);
            };
        }
    ).catch(err => {
        console.log(err);
    });
};

export const spaceAdd = (params, pagination) => function (dispatch) {
    services.spaceAdd(params).then(
        res => {
            res && res.data.ret === 'SUCCESS' && getList(pagination)(dispatch);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const spaceDetail = (params, callback) => function (dispatch) {
    services.spaceDetail(params).then(
        res => {
            callback(res);
            dispatch({
                type: actionType.SPACE_DETAIL,
                data: res.data
            });
        }
    ).catch(err => {
        console.log(err);
    });
};

export const spaceId = spaceId => {
    return {
        type: actionType.SPACE_ID,
        spaceId
    };
};

export const spaceEdit = (params, pagination) => function (dispatch) {
    services.spaceEdit(params).then(
        res => {
            res && res.data.ret === 'SUCCESS' && getList(pagination)(dispatch);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const spaceMembersDetail = (params, callback) => function (dispatch) {
    services.spaceMembersDetail(params).then(
        res => {
            callback(res);
            dispatch({
                type: actionType.SPACE_MEMBERS_DETAIL,
                data: res.data
            });
        }
    ).catch(err => {
        console.log(err);
    });
};

export const spaceMembersEdit = (params, pagination) => function (dispatch) {
    services.spaceMembersEdit(params).then(
        res => {
            res && res.data.ret === 'SUCCESS' && getList(pagination)(dispatch);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const getHmsUserList = callback => function (dispatch) {
    services.getHmsUserList().then(
        res => {
            dispatch({
                type: actionType.SPACE_HMSUSERLIST,
                data: res.data
            });
        }
    ).catch(err => {
        console.log(err);
    });
};
