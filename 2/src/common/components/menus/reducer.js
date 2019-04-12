/**
 * @file reducer
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */
import * as actionTypes from '../../../conf/actionType';

const init = {
    endFetching: false,
    menus: null,
    pagePermissionInfo: null
};

export default function menus(state = init, action) {
    switch (action.type) {
        case actionTypes.GET_MENUS:
            return {
                ...state,
                endFetching: true,
                menus: action.data.content
            };
        case actionTypes.SET_PAGE_PERMISSION_INFO:
            return {
                ...state,
                pagePermissionInfo: action.data
            };
        default:
            return state;
    }
}
