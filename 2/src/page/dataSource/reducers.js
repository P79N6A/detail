/**
 * @file
 */
import * as actionTypes from '../../conf/actionType';
const init = {
    endFetching: false,
    dataSourceList: [],
    dataSourceDetail: null,
    pagination: {},
    dataSourceId: 0
};

export default function datasource(state = init, action) {
    switch (action.type) {
        case actionTypes.START_LOADING_LIST:
            return {
                ...state,
                endFetching: false
            };
        case actionTypes.GET_DATASOURCE_LIST:
            return {
                ...state,
                endFetching: true,
                dataSourceList: action.data.pageContent,
                pagination: {
                    pageCount: action.data.pageCount,
                    totalCount: action.data.totalCount,
                    currentPage: action.currentPage
                }
            };
        case actionTypes.GET_DATASOURCE_DETAIL:
            return {
                ...state,
                dataSourceDetail: action.data
            };
        case actionTypes.DATASOURCE_ID:
            return {
                ...state,
                dataSourceId: action.dataSourceId
            };
        default:
            return {
                ...state
            };
    }
}
