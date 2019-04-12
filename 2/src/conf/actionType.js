/**
 * @file action type
 * @author luoxiaolan@badu.com
 */

// 获取用户信息
export const GET_USER_INFO = 'GET_USER_INFO';

// 获取 menu
export const GET_MENUS = 'GET_MENUS';
export const SET_PAGE_PERMISSION_INFO = 'SET_PAGE_PERMISSION_INFO';

// 用户角色管理
export const USER_COUNT_LIST = 'USER_COUNT_LIST';
export const USER_COUNT_ID = 'USER_COUNT_ID';
export const USER_COUNT_NAME = 'USER_COUNT_NAME';
export const USER_ROLE_LIST = 'USER_ROLE_LIST';
export const USER_COUNT_DETAIL = 'USER_COUNT_DETAIL';

// 业务分组管理
export const SPACE_LIST = 'SPACE_LIST';
export const SPACE_SEARCH = 'SPACE_SERACH';
export const USERS_LIST = 'USERS_LIST';
export const SPACE_DETAIL = 'SPACE_DETAIL';
export const SPACE_ID = 'SPACE_ID';
export const SPACE_MEMBERS_DETAIL = 'SPACE_MEMBERS_DETAIL';
export const ALL_ROLES = 'ALL_ROLES';
export const SPACE_HMSUSERLIST = 'SPACE_HMSUSERLIST';

// 角色权限管理
export const ROLE_GET_LIST = 'ROLE_GET_LIST';
export const ROLE_SHOW_ADD_MODAL = 'ROLE_SHOW_ADD_MODAL';
export const ROLE_HIDE_ADD_MODAL = 'ROLE_HIDE_ADD_MODAL';
export const ROLE_ADD_SUBMIT = 'ROLE_ADD_SUBMIT';
export const ROLE_SHOW_SET_MODAL = 'ROLE_SHOW_SET_MODAL';
export const ROLE_HIDE_SET_MODAL = 'ROLE_HIDE_SET_MODAL';
export const ROLE_SET_SUBMIT = 'ROLE_SET_SUBMIT';
export const ROLE_PERMISSION_DETAIL = 'ROLE_PERMISSION_DETAIL';
export const ROLE_SEARCH_LIST = 'ROLE_SEARCH_LIST';

// 角色权限管理-用户组设置
export const ROLE_GROUP_GET_USER_GROUP = 'ROLE_GROUP_GET_USER_GROUP';
export const ROLE_GROUP_GET_ROLE_LIST = 'ROLE_GROUP_GET_ROLE_LIST';
export const ROLE_GROUP_GET_USER_LIST = 'ROLE_GROUP_GET_USER_LIST';
export const ROLE_GROUP_GET_ROLE = 'ROLE_GROUP_GET_ROLE';
export const ROLE_GROUP_GET_MEMBERS = 'ROLE_GROUP_GET_MEMBERS';
export const ROLE_GROUP_GET_STATUS = 'ROLE_GROUP_GET_STATUS';

// 审批管理
export const SET_APPROVAL_GET_FLOW = 'SET_APPROVAL_GET_FLOW';


// 感知引擎
export const PERCEPT_ENGINE_LIST = 'PERCEPT_ENGINE_LIST';
export const PERCEPT_ENGINE_DETAIL = 'PERCEPT_ENGINE_DETAIL';
export const PERCEPT_ENGINE_DOWNLOAD = 'PERCEPT_ENGINE_DOWNLOAD';


// 待我审批
export const APPROVAL_LIST_QERUY_BY_STATUS = 'APPROVAL_LIST_QERUY_BY_STATUS';
export const APPROVAL_LIST_QERUY_BY_USER = 'APPROVAL_LIST_QERUY_BY_USER';
export const APPROVAL_LIST_QERUY = 'APPROVAL_LIST_QERUY';
export const APPROVAL_QUERY_HISTORY = 'APPROVAL_QUERY_HISTORY';


// 访问日志
export const ACCESS_LOG_DETAIL = 'ACCESS_LOG_DETAIL';


// 数据源管理
export const GET_DATASOURCE_LIST = 'GET_DATASOURCE_LIST';
export const GET_DATASOURCE_DETAIL = 'GET_DATASOURCE_DETAIL';
export const EDIT_DATASOURCE = 'EDIT_DETASOURCE';
export const ADD_DATASOURCE = 'ADD_DATASOURCE';
export const DELETE_DATASOURCE = 'DETETE_DATASOURCE';
export const EDIT_DATASOURCE_SPACERELATION = 'EDIT_DATASOURCE_SPACERELATION';
export const DATASOURCE_ID = 'DATASOURCE_ID';
export const START_LOADING_LIST = 'START_LOADING_LIST';