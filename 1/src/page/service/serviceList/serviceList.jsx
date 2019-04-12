/**
 * @file 服务列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Spin, Modal, Button, Icon} from 'antd';
// 系统
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
// 组件
import Table from '../../../components/antComponent/duTable/duTable.jsx';
import QueryForm from '../../../components/antComponent/queryForm/queryForm.jsx';
import formatTableData from '../../../components/antComponent/Integration/formatTableData.jsx';
import tableOperate from '../../../module/Integration/tableOperate.jsx';
// 表单数据
import localTable from '../../../module/localData/localTable.jsx';
import localQuery from '../../../module/localData/queryForm.jsx';
// 业务组件
import Crumb from '../../../module/crumb/crumb.jsx';

const confirm = Modal.confirm;

class ServiceList extends Component {

    /**
     * 状态
     */
    state = {
        // 是否渲染
        isRender: false,
        tableLoading: false,
        queryData: {
            queryKey: '',
            pageNo: 1,
            pageSize: 10
        }
    }

    /**
     * 业务
     */
    pageData = {
        tableData: null
    }

    handleOnlineTpl = (status, serviceCode) => {
        if (status === 'INIT') {
            return (<div>
                <a onClick={this.handleTableClick.bind(this, 'test')} style={{marginRight: '8px'}}>沙盒测试</a>
                <a onClick={this.handleTableClick.bind(this, 'start', serviceCode)}>上线</a>
            </div>);
        }
        else if (status === 'ON') {
            return (
                <div>
                    <a onClick={this.handleTableClick.bind(this, 'test')} style={{marginRight: '8px'}}>在线测试</a>
                    <a onClick={this.handleTableClick.bind(this, 'stop', serviceCode)}>下线</a>
                </div>
            );
        }
        else if (status === 'OFF') {
            return (
                <a onClick={this.handleTableClick.bind(this, 'start', serviceCode)}>上线</a>
            );
        }
    }

    columns = [
        {
            key: 'serviceCode',
            dataIndex: 'serviceCode',
            title: '服务编码',
            fixed: false
        },
        {
            key: 'serviceName',
            dataIndex: 'serviceName',
            title: '服务名称',
            fixed: false
        },
        {
            key: 'categoryName',
            dataIndex: 'categoryName',
            title: '服务类型',
            fixed: false
        },
        {
            key: 'serviceStatus',
            dataIndex: 'status',
            title: '服务状态',
            fixed: false,
            render: record => {
                if (record === 'INIT') {
                    return '待发布';
                }
                else if (record === 'ON') {
                    return '服务中';
                }
                else if (record === 'OFF') {
                    return '已下线';
                }
            }
        },
        {
            key: 'createTime',
            dataIndex: 'createTime',
            title: '创建时间',
            fixed: false
        },
        {
            key: 'lastReqTime',
            dataIndex: 'lastReqTime',
            title: '最后调用时间',
            fixed: false
        },
        {
            key: 'handle',
            dataIndex: 'handle',
            title: '操作',
            width: '16%',
            render: (text, record) => {
                return (
                    <div className="page-table-handle">
                        <a onClick={this.handleTableClick.bind(this, 'view', record.serviceCode)}>查看</a>
                        <a onClick={this.handleTableClick.bind(this, 'delete', record.serviceCode)}>删除</a>
                        <div>
                            {this.handleOnlineTpl(record.status, record.serviceCode)}
                        </div>
                    </div>
                );
            }
        }
    ]

    /**
     * 数据层 - 查询
     *
     * @param {Function} callback 传入的回调函数
     * @return {void}
     */
    getListData = callback => {
        request({
            url: config.api.serviceList,
            data: this.state.queryData,
            success: data => {
                this.pageData.tableData = formatTableData({
                    data: data.content.list,
                    table: localTable.service.list,
                    page: data.content.paginator
                });
                this.setState({
                    isRender: true,
                    tableLoading: false
                });
            },
            complete: () => {
                callback && callback();
            }
        });
    }

    handleDelete = id => {
        request({
            url: config.api.serviceDelete,
            type: 'POST',
            contentType: 'application/json',
            data: {
                'serviceCode': id
            },
            success: data => {
                this.setState({
                    tableLoading: true
                }, () => {
                    this.getListData();
                });
            }
        });
    }

    /**
     * 事件层 - 表格事件
     *
     * @param   {string} id code
     * @param   {string} type 处理
     * @return {void}
     */
    handleTableClick = (type, id, data) => {
        console.log(id, type, data);
        let self = this;
        if (type === 'delete') {
            confirm({
                title: `确认删除服务【${id}】`,
                onOk() {
                    self.handleDelete(id);
                }
            });
        }
        else if (type === 'test') {
            this.props.history.push('/task/list');
        }
        else if (type === 'start') {
            this.handleOnline(config.api.serviceStart + '/' + id);
        }
        else if (type === 'stop') {
            this.handleOnline(config.api.serviceStop + '/' + id);
        }
        else if (type === 'view') {
            this.props.history.push(`/service/detail?id=${id}`);
        }
    }

    // 发送上线和下线请求
    handleOnline = (url, id) => {
        request({
            url,
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            success: data => {
                this.getListData();
            }
        });
    }

    componentDidMount() {
        this.getListData();
    }

    render() {
        let buttonNode = (
            <div>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => this.props.history.push('/service/add')}
                >
                    <Icon type="plus" />添加服务
                </Button>
            </div>
        );
        return (
            <Crumb
                page={this.props.title}
                buttonNode={buttonNode}
            >
            {
                this.state.isRender ? (
                    <Spin tip="加载中..." spinning={this.state.tableLoading} className="page-spin" size="large">
                        <QueryForm
                            className="page-query-form"
                            data={localQuery.searchQuery}
                            onSubmit={tableOperate.handleQuerySubmit.bind(this)}
                            defaultItem={this.state.queryData.pageSize}
                        />
                        <Table
                            keyName="serviceCode"
                            tableWidth={600}
                            onClick={this.handleTableClick}
                            pageSizeOptions={['10', '20', '30']}
                            onChangePage={tableOperate.handleChangePage.bind(this)}
                            listData={this.pageData.tableData}
                            columns = {this.columns}
                        />
                    </Spin>
                ) : null
            }
            </Crumb>
        );
    }
}
export default withRouter(ServiceList);
