/**
 * @file
 */
import * as actionTypes from '../../conf/actionType';
import * as services from './services';

export const getDataSourceList = (data = {
    pageSize: 20,
    currentPage: 1
}) => dispatch => {
    if (!data.pageSize) {
        data.pageSize = 20;
    }
    if (!data.currentPage) {
        data.currentPage = 1;
    }
    dispatch({
        type: actionTypes.START_LOADING_LIST
    });

    services.getDataSourceList(data).then(
        res => {
            res && res.data && res.data.content && dispatch({
                type: actionTypes.GET_DATASOURCE_LIST,
                data: res.data.content,
                currentPage: data.currentPage
            });
        }
    ).catch(err => {
        console.log(err);
    });
};

export const getDataSourceDetail = (data, callback) => dispatch => {
    services.getDataSourceDetail(data).then(
        res => {
            dispatch({
                type: actionTypes.GET_DATASOURCE_DETAIL,
                data: res.data.content
            });
            callback();
        }
    ).catch(err => {
        console.log(err);
    });
};

export const checkConnect = (data, successCallback, callback) => async function (dispatch) {
    await services.checkConnect(data).then(
        res => {
            res && res.data && successCallback(res.data.content);
        }
    ).catch(err => {
        console.log(err);
    });

    callback();
};

export const editDataSource = (data, pagination) => dispatch => {
    services.editDataSource(data).then(
        res => {
            const currentPage = pagination ? pagination.currentPage : 1;
            res && res.data.ret === 'SUCCESS' && getDataSourceList({
                currentPage
            })(dispatch);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const addDataSource = data => dispatch => {
    services.addDataSource(data).then(
        res => {
            res && res.data.ret === 'SUCCESS' && getDataSourceList()(dispatch);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const deleteDataSource = (data, pagination) => dispatch => {
    services.deleteDataSource(data).then(
        res => {
            const currentPage = pagination ? pagination.currentPage : 1;
            res && res.data.ret === 'SUCCESS' && getDataSourceList({
                currentPage
            })(dispatch);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const getSpaceRelation = (data, callback) => dispatch => {
    services.getSpaceRelation(data).then(
        res => {
            callback(res);
        }
    ).catch(err => {
        console.log(err);
    });
};

export const editSpaceRelation = data => dispatch => {
    services.editSpaceRelation(data).then(
        res => {
            dispatch({
                type: 'EDIT_DATASOURCE_SPACERELATION',
                data: res.data.content
            });
        }
    ).catch(err => {
        console.log(err);
    });
};

export const getDataSourceId = dataSourceId => ({
    type: 'DATASOURCE_ID',
    dataSourceId
});
