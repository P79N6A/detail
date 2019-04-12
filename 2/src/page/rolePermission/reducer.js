/**
 * @file reducer
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */
import * as actionTypes from '../../conf/actionType';

const init = {
    endFetching: false,
    list: [],
    showAddModal: false,
    showRoleSetModal: false,
    roleDetail: null,
    pageCount: 0,
    totalCount: 0,
    currentPage: 1
};

export default function RolePermission(state = init, action) {
    switch (action.type) {
        case actionTypes.ROLE_GET_LIST:
            return action.data.content ? {
                ...state,
                endFetching: true,
                list: action.data.content.pageContent,
                pageCount: action.data.content.pageCount,
                totalCount: action.data.content.totalCount,
                currentPage: action.currentPage
            } : {
                ...state,
                endFetching: true,
                list: [],
                pageCount: 0,
                totalCount: 0,
                currentPage: 0
            };
        case actionTypes.ROLE_SHOW_ADD_MODAL:
            return {
                ...state,
                showAddModal: true
            };
        case actionTypes.ROLE_HIDE_ADD_MODAL:
            return {
                ...state,
                showAddModal: false
            };
        case actionTypes.ROLE_SHOW_SET_MODAL:
            return {
                ...state,
                showRoleSetModal: true
            };
        case actionTypes.ROLE_HIDE_SET_MODAL:
            return {
                ...state,
                showRoleSetModal: false
            };
        case actionTypes.ROLE_PERMISSION_DETAIL:
            return {
                ...state,
                roleDetail: action.data.content
            }
        default:
            return state;
    }
}
