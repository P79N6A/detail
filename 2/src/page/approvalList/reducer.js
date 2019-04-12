/**
 * @file reducer
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */
import * as actionTypes from '../../conf/actionType';

const init = {
    endFetching: false,
    queryByStatus: null,
    queryByUser: null,
    queryList: null,
    queryHistory: null,
    pageCount: 0,
    totalCount: 0
};

export default function approvalList(state = init, action) {
    switch (action.type) {
        case actionTypes.APPROVAL_LIST_QERUY_BY_STATUS:
            return action.data.content ? {
                ...state,
                endFetching: true,
                queryByStatus: action.data.content.pageContent,
                pageCount: action.data.content.pageCount,
                totalCount: action.data.content.totalCount
            } : {
                ...state,
                queryByStatus: null,
                pageCount: 0,
                totalCount: 0,
                endFetching: true
            };
        case actionTypes.APPROVAL_LIST_QERUY_BY_USER:
            return action.data.content ? {
                ...state,
                queryByUser: action.data.content.pageContent,
                pageCount: action.data.content.pageCount,
                totalCount: action.data.content.totalCount
            } : {
                ...state,
                queryByUser: null,
                pageCount: 0,
                totalCount: 0
            };
        case actionTypes.APPROVAL_LIST_QERUY:
            return action.data.content ? {
                ...state,
                queryList: action.data.content.pageContent,
                pageCount: action.data.content.pageCount,
                totalCount: action.data.content.totalCount
            } : {
                ...state,
                queryList: null,
                pageCount: 0,
                totalCount: 0
            };
        case actionTypes.APPROVAL_QUERY_HISTORY:
            return {
                ...state,
                queryHistory: action.data.content
            }
        default:
            return state;
    }
}
