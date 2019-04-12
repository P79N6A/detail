/**
 * @file Config
 * @author
 * ------------------------------
 * @note 业务配置层
 */

export default {
    // 系统目录
    project: '',
    // API接口
    api: {
        // 空间
        spacesList: '/api/getSpaces',
        // 账户
        userInfo: '/api/account/getLoginName',  // getloginname - getLoginName
        // 权限
        auth: '/api/auth',
        // 模型
        modelDelete: '/api/model/delete',
        modelUpdate: '/api/mind/model/update',
        modelAddStatus: '/api/model/add/status',
        modelList: '/api/model/list',
        modelDetail: '/api/model/detail',
        modelAdd: '/api/mind/model/add',
        modelAdjust: '/api/mind/model/adjust',

        // 流程
        processAdd: '/api/process/add',
        processList: '/api/process/list',
        processDetail: '/api/process/detail',
        processDelete: '/api/process/delete',
        processUpdate: '/api/process/update',
        processModelList: '/api/process/list/model',
        processDecisionList: '/api/process/resultType/list', // resulttype - resultType
        processDecisionAdd: '/api/process/resultType/add', // resulttype - resultType
        processAddContent: '/api/process/addContent',  // addcontent - addContent
        // 任务
        taskList: '/api/task/list',
        taskDetail: '/api/task/detail',
        taskAdd: '/api/task/add',
        taskUpdate: '/api/task/update',
        taskDelete: '/api/task/delete',
        taskDownload: '/api/task/download/template',
        taskBatchAdd: '/api/task/batchadd/sample',
        taskListLog: '/api/task/list/log',
        taskLogStat: '/api/task/log/stat',
        taskListSample: '/api/task/list/sample',
        taskReport: '/api/task/report',
        // 服务
        serviceList: '/api/service/list',
        serviceDetail: '/api/service/detail',
        serviceDelete: '/api/service/delete',
        serviceAdd: '/api/service/add',
        serviceUpdate: '/api/service/update',
        serviceAdjust: '/api/mind/service/adjust',
        serviceApiDownload: '/api/service/downloadServiceApi',
        serviceStart: '/api/service/start',
        serviceStop: '/api/service/stop',
        // 通用
        validateName: '/api/validate/name',
        categoryAdd: '/api/category/add',
        categoryList: '/api/category/list'
    },
    // 未登录跳转
    apiLoginUrl: window.location.protocol + '//' + window.location.host + '/api/login',
    // 系统文案
    networkError: '网络连接失败，请稍后重试',
    systemError: '系统繁忙，请稍后重试',
    noLoginError: '您尚未登录',
    echartColor: ['#108CEE', '#EA2E2E', '#F38800', '#545FC8',
                  '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074',
                  '#546570', '#c4ccd3']
};
