/**
 * @file 配置文件
 * @author xueliqiang@baidu.com
 */

const GLOBAL_CONFIG = {
    requestUrl: {
        // 获取用户信息
        userInfor: '/predict/web/getUserInfo',
        // 校验权限
        auth: '/predict/auth',
        // 登出
        logOut: '/model/logout',
        // 端点模板detail
        getEndpointConfigDetail: '/predict/endpointConfig/detail',
        // 更新端点模板
        updateEPTemplate: '/predict/endpointConfig/update',
        // 更新端点模板 /api/infinite/endpointConfig/update
        updateTemplate: '/predict/update/template',
        // 创建端点模板 predict/endpointConfig/create
        createTemplate: '/predict/endpointConfig/create',
        // 创建新端点
        createEndpoint: '/predict/endpoint/create',
        // 端点模板配置列表
        getEndPointConfigList: '/predict/endpointConfig/list',
        // 端点配置列表
        getEndPoint: '/predict/endpoint/list',
        // 删除模板配置列表
        deleteEndPointConfigList: '/predict/endpointConfig/delete',
        // 删除端点
        deleteEndPoint: '/predict/endpoint/delete',
        // 获取端点配置详情 /predict/endpoint/detail
        getEndpointDetail: '/predict/endpoint/detail',
        // 部分更新端点 /predict/endpoint/partialUpdate
        endpointPartialUpdate: '/predict/endpoint/partialUpdate',
        // 端点-重新创建 /predict/endpoint/recreate
        endpointRecreate: '/predict/endpoint/recreate',
        // 全量更新端点 /predict/endpoint/update
        endpointUpdate: '/predict/endpoint/update',
        // 选择空间
        getSpacesList: '/predict/getSpaces',
        // 获取资源套餐列表
        getResourceList: '/predict/resourceConfig/list',
        // 获取系统文件模型列表
        getModelList: '/predict/model/list'
    }
};

module.exports = GLOBAL_CONFIG;
