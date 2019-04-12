/**
 * @file router.config 路由配置文件
 * @author yangxiaoxu@baidu.com
 * @description 注意页面路径去掉'./page/',再Routes.jsx文件中已经配置过了；其中parent为页面面包屑内容配置信息，如果没有可以忽略
 */
export default [
    {
        name: '登录页',
        exact: true,
        path: '/login',
        page: 'login/login.jsx'
    },
    {
        name: '帮助文档',
        exact: true,
        path: '/qa',
        page: 'qa/qa.jsx'
    },
    // 模型
    {
        name: '模型库',
        exact: true,
        path: '/model/index',
        page: 'model/index/index.jsx',
        parent: [
            {name: '模型'}
        ]
    },
    {
        name: '模型详情',
        exact: true,
        path: '/model/detail',
        page: 'model/modelDetail/modelDetails.jsx',
        parent: [
            {name: '模型'},
            {path: '/model/index', name: '模型库'}
        ]
    },
    {
        name: '新建模型',
        exact: true,
        path: '/model/add',
        page: 'model/modelAdd/modelAdd.jsx',
        parent: [
            {name: '模型'},
            {path: '/model/index', name: '模型库'}
        ]
    },
    // 流程
    {
        name: '流程列表',
        exact: false,
        path: '/flow/list',
        page: 'flow/flowList/flowList.jsx',
        parent: [
            {name: '流程'}
        ]
    },
    {
        name: '新建流程',
        exact: false,
        path: '/flow/new',
        page: 'flow/flowNew/flowNew.jsx',
        parent: [
            {name: '流程'},
            {path: '/flow/list', name: '流程列表'}
        ]
    },
    {
        name: '流程编辑',
        exact: false,
        path: '/flow/edit',
        page: 'flow/flowEdit/flowEdit.jsx',
        parent: [
            {name: '流程'},
            {path: '/flow/list', name: '流程列表'}
        ]
    },
    {
        name: '流程详情',
        exact: false,
        path: '/flow/detail',
        page: 'flow/flowDetail/flowDetail.jsx',
        parent: [
            {name: '流程'},
            {path: '/flow/list', name: '流程列表'}
        ]
    },
    // 任务
    {
        name: '任务列表',
        exact: false,
        path: '/task/list',
        page: 'task/taskList/taskList.jsx',
        parent: [
            {name: '任务'}
        ]
    },
    {
        name: '任务详情',
        exact: false,
        path: '/task/detail',
        page: 'task/taskDetail/taskDetail.jsx',
        parent: [
            {name: '任务'},
            {path: '/task/list', name: '任务列表'}
        ]
    },
    {
        name: '新建任务',
        exact: false,
        path: '/task/add',
        page: 'task/taskAdd/taskAdd.jsx',
        parent: [
            {name: '任务'},
            {path: '/task/list', name: '任务列表'}
        ]
    },
    {
        name: '批量上传',
        exact: false,
        path: '/task/batch',
        page: 'task/taskSampleFile/taskSampleFile.jsx',
        parent: [
            {name: '任务'},
            {path: '/task/list', name: '任务列表'},
            {path: '/task/detail', name: '任务详情'}
        ]
    },
    {
        name: '任务统计',
        exact: false,
        path: '/task/log/list',
        page: 'task/taskLogList/taskLogList.jsx',
        parent: [
            {name: '任务'}
        ]
    },
    {
        name: '统计详情',
        exact: false,
        path: '/task/log/detail',
        page: 'task/taskLogDetail/taskLogDetail.jsx',
        parent: [
            {name: '任务'},
            {path: '/task/log/list', name: '任务统计'}
        ]
    },
    {
        name: '结果比对',
        exact: false,
        path: '/task/log/contrast',
        page: 'task/taskLogContrast/taskLogContrast.jsx',
        parent: [
            {name: '任务'},
            {path: '/task/log/list', name: '任务统计'}
        ]
    },
    // 服务
    {
        name: '服务列表',
        exact: false,
        path: '/service/list',
        page: 'service/serviceList/serviceList.jsx',
        parent: [
            {name: '服务'}
        ]
    },
    {
        name: '新建服务',
        exact: false,
        path: '/service/add',
        page: 'service/serviceAdd/serviceAdd.jsx',
        parent: [
            {name: '服务'},
            {path: '/service/list', name: '服务列表'}
        ]
    },
    {
        name: '服务详情',
        exact: false,
        path: '/service/detail',
        page: 'service/serviceDetail/serviceDetail.jsx',
        parent: [
            {name: '服务'},
            {path: '/service/list', name: '服务列表'}
        ]
    }
];
