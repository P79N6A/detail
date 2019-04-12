/**
 * @file reducer
 * @author luoxiaolan@baidu.com
 * @date 2018/10/24
 */
import * as actionTypes from '../../../conf/actionType';

const init = {
    endFetching: false,
    userInfo: {}
};

export default function userInfo(state = init, action) {
    switch (action.type) {
        case actionTypes.GET_USER_INFO:
            return {
                ...state,
                endFetching: true,
                userInfo: action.data.content
            };
        default:
            return state;
    }
}
