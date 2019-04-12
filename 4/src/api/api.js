/**
 * @file 接口请求
 * @author xueliqiang@baidu.com
 */
import config from '../conf/conf';
import common from '../components/common/common';

/**
 * 登出
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const logOut = params => {
    return common.requestInPromise({
        url: config.requestUrl.logOut,
        type: 'POST',
        data: params
    });
};

/**
 * 创建端点 endpoint
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const createEndpoint = params => {
    return common.requestInPromise({
        url: config.requestUrl.createEndpoint,
        type: 'POST',
        data: params
    });
};

/**
 * 创建端点模板 endpoint template
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const createTemplate = params => {
    return common.requestInPromise({
        url: config.requestUrl.createTemplate,
        type: 'POST',
        data: params
    });
};

/**
 * 获取修改端点模板时的detail
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const getEndpointConfigDetail = params => {
    return common.requestInPromise({
        url: config.requestUrl.getEndpointConfigDetail,
        type: 'GET',
        data: params
    });
};

/**
 * 获取端点模板
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const updateEPTemplate = params => {
    return common.requestInPromise({
        url: config.requestUrl.updateEPTemplate,
        type: 'POST',
        data: params
    });
};

/**
* 获取端点详情
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const getEndpointDetail = params => {
    return common.requestInPromise({
        url: config.requestUrl.getEndpointDetail,
        type: 'GET',
        data: params
    });
};

/**
 * 部分更新 端点
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const endpointPartialUpdate = params => {
    return common.requestInPromise({
        url: config.requestUrl.endpointPartialUpdate,
        type: 'POST',
        data: params
    });
};

/**
 *端点 重新创建
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const endpointRecreate = params => {
    return common.requestInPromise({
        url: config.requestUrl.endpointRecreate,
        type: 'POST',
        data: params
    });
};

/**
 *全量更新端点
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const endpointUpdate = params => {
    return common.requestInPromise({
        url: config.requestUrl.endpointUpdate,
        type: 'POST',
        data: params
    });
};

/**
 * 获取空间
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const getSpaces = () => {
    return common.requestInPromise({
        url: config.requestUrl.getSpacesList,
        type: 'GET'
    });
};

/**
 * 获取资源套餐列表
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const getResourceList = () => {
    return common.requestInPromise({
        url: config.requestUrl.getResourceList,
        type: 'GET'
    });
};

/**
 * 获取端点配置列表
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const getEndPointConfigList = params => {
    return common.requestInPromise({
        url: config.requestUrl.getEndPointConfigList,
        type: 'GET',
        data: params
    });
};

/**
 * 获取端点列表
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const getEndPoint = params => {
    return common.requestInPromise({
        url: config.requestUrl.getEndPoint,
        type: 'GET',
        data: params
    });
};


/**
 * 删除端点配置
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const deleteEndPointConfigList = params => {
    return common.requestInPromise({
        url: config.requestUrl.deleteEndPointConfigList,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: params
    });
};

/**
 * 删除端点
 *
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const deleteEndPoint = params => {
    return common.requestInPromise({
        url: config.requestUrl.deleteEndPoint,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: params
    });
};

/**
 * 获取系统模型列表
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const getModelList = () => {
    return common.requestInPromise({
        url: config.requestUrl.getModelList,
        type: 'get'
    });
};

/**
 * 获取系统模型列表
 * @param {Object} urlName 操作名称
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const handelEndpointOper = (urlName, params) => {
    return common.requestInPromise({
        url: `/predict/endpoint/${urlName}`,
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: params
    });
};

/**
 * 获取用户信息
 * @param {Object} urlName 操作名称
 * @param {Object} params 请求参数
 * @return {Promise} request in Promise
 */
export const getUserInfor = () => {
    return common.requestInPromise({
        url: config.requestUrl.userInfor,
        type: 'get'
    });
};

/**
 * 校验是否有权限
 * @return {Promise} request in Promise
 */
export const getAuth = params => {
    return common.requestInPromise({
        url: config.requestUrl.auth,
        type: 'get',
        data: params
    });
};
