/**
 * @file reducer
 * @author luoxiaolan@badu.com
 */

import {combineReducers} from 'redux';

import userCount from './page/userCount/reducers';
import rolePermission from './page/rolePermission/reducer';
import workGroup from './page/workGroup/reducers';
import roleUserGroup from './page/roleUserGroup/reducer';
import setApproval from './page/setApproval/reducer';
import perceptEngine from './page/perceptEngine/reducers';
import approvalList from './page/approvalList/reducer';
import dataSource from './page/dataSource/reducers';
import userInfo from './common/components/userInfo/reducer';
import menus from './common/components/menus/reducer';
import log from './page/accessLog/reducers';

export default combineReducers({
    userCount,
    rolePermission,
    workGroup,
    roleUserGroup,
    setApproval,
    perceptEngine,
    approvalList,
    menus,
    userInfo,
    log,
    dataSource
});
