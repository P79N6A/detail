/**
 * @file
 */
import * as actionType from '../../conf/actionType';
let init = {
    spaceList: {},
    userList: [],
    spaceDetail: {},
    spaceId: null,
    spaceMembers: [],
    pagination: {},
    hmsUserList: []
};
export default (state = init, action) => {
    switch (action.type) {
        case actionType.SPACE_LIST:
            return {
                ...state,
                spaceList: action.data.content,
                pagination: action.pagination
            };
        case actionType.SPACE_SEARCH:
            return {
                ...state,
                spaceList: action.data.content
            };
        case actionType.USERS_LIST:
            return {
                ...state,
                userList: action.data.content
            };
        case actionType.SPACE_DETAIL:
            return {
                ...state,
                spaceDetail: action.data.content
            };
        case actionType.SPACE_ID:
            return {
                ...state,
                spaceId: action.spaceId
            };
        case actionType.SPACE_MEMBERS_DETAIL:
            return {
                ...state,
                spaceMembers: action.data.content
            };
        case actionType.SPACE_HMSUSERLIST:
            return {
                ...state,
                hmsUserList: action.data.content
            };
        default: {
            return {
                ...state
            };
        }
    }
};
