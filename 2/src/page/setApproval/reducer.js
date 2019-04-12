/**
 * @file reducer
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */
import * as actionTypes from '../../conf/actionType';

const init = {
    endFetching: false,
    flow: null
};

export default function setApproval(state = init, action) {
    switch (action.type) {
        case actionTypes.SET_APPROVAL_GET_FLOW:
            return {
                ...state,
                endFetching: true,
                flow: action.data.content && action.data.content.activityList
            }
        default:
            return state;
    }
}
