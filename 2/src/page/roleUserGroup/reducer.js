/**
 * @file reducer
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */
import * as actionTypes from '../../conf/actionType';

const init = {
    endFetching: false,
    list: null,
    roleList: null,
    statusDetail: null,
    userList: null,
    role: null,
    members: null
};

export default function RoleUserGroup(state = init, action) {
    switch (action.type) {
        case actionTypes.ROLE_GROUP_GET_USER_GROUP:
            return {
                ...state,
                endFetching: true,
                list: action.data.content
            }
        case actionTypes.ROLE_GROUP_GET_ROLE_LIST:
            return {
                ...state,
                roleList: action.data.content
            };
        case actionTypes.ROLE_GROUP_GET_ROLE:
            return {
                ...state,
                role: action.data.content
            };
        case actionTypes.ROLE_GROUP_GET_STATUS:
            return {
                ...state,
                statusDetail: action.data.content
            }
        case actionTypes.ROLE_GROUP_GET_USER_LIST:
            return {
                ...state,
                userList: action.data.content
            };
        case actionTypes.ROLE_GROUP_GET_MEMBERS:
            return {
                ...state,
                members: action.data.content
            }
        default:
            return state;
    }
}
