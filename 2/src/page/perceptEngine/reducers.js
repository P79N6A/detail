/**
 * @file
 * @author chenling
 */
import * as actionType from '../../conf/actionType';
let init = {
    list: {},
    detail: {},
    endList: false,
    endDetail: false
};
export default (state = init, action) => {
    switch (action.type) {
        case actionType.PERCEPT_ENGINE_LIST:
            return {
                ...state,
                list: action.data,
                endList: true
            };
        case actionType.PERCEPT_ENGINE_DETAIL:
            return {
                ...state,
                detail: action.data,
                endDetail: true
            };
        default: {
            return {
                ...state
            };
        }
    }
};
