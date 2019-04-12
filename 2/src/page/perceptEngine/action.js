/**
 * @file
 * @author chenling
 */
import * as actionType from '../../conf/actionType';
import request from '../../common/js/request';
import {Modal} from 'antd';
export const perceptEngineList = data => function (dispatch) {
    return request('/tongji/apiquery', {
        method: 'get',
        body: data
    }).then(
        res => {
            dispatch({
                type: actionType.PERCEPT_ENGINE_LIST,
                data: res.data.content
            });
        }
    );
};

export const perceptEngineDetail = data => function (dispatch) {
    return request('/tongji/apiappquery', {
        method: 'get',
        body: data
    }).then(
        res => {
            dispatch({
                type: actionType.PERCEPT_ENGINE_DETAIL,
                data: res.data.content
            });
        }
    );
};

export const perceptEngineDownLoad = data => function (dispatch) {
    return request('/tongji/apiappquery_download', {
        method: 'post',
        body: data
    }).then(
        res => {
            if (res && res.data.ret === 'SUCCESS') {
                Modal.success({
                    title: '下载成功'
                });
            }
            else {
                Modal.error({
                    title: '下载失败'
                });
            }
        }
    );
};

