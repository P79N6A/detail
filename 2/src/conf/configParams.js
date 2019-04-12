/**
 * @file 后端约定参数
 * @author luoxiaolan@badu.com
 */

// 审批状态码
export const statusList = [
     {
         no: 11,
         name: '运行中'
     },
     {
         no: 12,
         name: '已通过'
     },
     {
         no: 13,
         name: '已拒绝'
     },
     {
         no: 15,
         name: '已撤回'
     },
     {
         no: 16,
         name: '非法状态'
     }
 ];

// 审批流程类型
export const bizTypeList = [
     {
         type: 'release',
         name: '发布'
     },
     {
         type: 'online',
         name: ' 上线'
     },
     {
         type: 'offline',
         name: '下线'
     }
];

// 审批结果映射
export const approvalResult = [
    {
        no: 0,
        name: ''
    },
    {
        no: 1,
        name: '通过'
    },
    {
        no: 2,
        name: '拒绝'
    }
];

// 银行映射
export const bankList = [
    {
        code: 'ABC',
        name: '农行'
    },
    {
        code: 'BAIXIN',
        name: '百信'
    }
];

// 数据源连接状态映射
export const status = [
    {
        code: 'I',
        name: '新建'
    },
    {
        code: 'S',
        name: '成功'
    },
    {
        code: 'F',
        name: '失败'
    }
];

// 数据库类型映射
export const type = [
    {
        code: 'MYSQL',
        name: 'mysql数据库'
    },
    {
        code: 'ORACLE',
        name: 'oracle数据库'
    },
    {
        code: 'HIVE',
        name: 'hive数据库'
    }
];
