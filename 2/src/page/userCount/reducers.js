/**
 * @file
 */
import * as actionType from '../../conf/actionType';

let init = {
    userCountList: {},
    userCountId: null,
    userCountName: '',
    userDetail: {},
    allRoles: [],
    pagination: {}
};

export default (state = init, action) => {
    switch (action.type) {
        case actionType.USER_COUNT_LIST:
            return {
                ...state,
                userCountList: action.data,
                pagination: action.pagination
            };
        case actionType.USER_COUNT_ID:
            return {
                ...state,
                userCountId: action.userCountId
            };
        case actionType.USER_COUNT_NAME:
            return {
                ...state,
                userCountName: action.userCountName
            };
        case actionType.USER_COUNT_DETAIL:
            return {
                ...state,
                userDetail: action.data.content
            };
        case actionType.ALL_ROLES:
            return {
                ...state,
                allRoles: action.data.content
            };
        default:
            return {
                ...state
            };
    }
};
