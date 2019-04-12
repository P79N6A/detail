/**
 * @file 访问日志
 * @author chenling
 */
import * as actionType from '../../conf/actionType';

export default (state = [], action) => {
    switch (action.type) {
        case actionType.ACCESS_LOG_DETAIL:
            return {
                state: action.data
            };
        default:
            return state;
    }
};

