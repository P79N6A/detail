/**
 * @file 任务列表
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

class TaskList extends Component {

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

    /**
     * 数据层 - 查询
     *
     * @param {Function} callback 传入的回调函数
     * @return {void}
     */
    getListData = callback => {
        request({
            url: config.api.taskList,
            data: this.state.queryData,
            success: data => {
                this.pageData.tableData = formatTableData({
                    data: data.content.list,
                    table: localTable.task.list,
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
            url: config.api.taskDelete,
            type: 'POST',
            contentType: 'application/json',
            data: {
                taskCode: id
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
    handleTableClick = (id, type, data) => {
        console.log(id, type, data);
        let self = this;
        if (type === 'delete') {
            confirm({
                title: `确认删除任务【${id}】`,
                onOk() {
                    self.handleDelete(id);
                }
            });
        }
        else if (type === 'view') {
            this.props.history.push(`/task/detail?id=${id}`);
        }
    }

    componentDidMount() {
        this.getListData();
    }

    render() {
        let buttonNode = (
            <div>
                <Button size="large" onClick={() => this.props.history.push('/task/log/list')}>
                    <Icon type="line-chart" />任务统计
                </Button>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => this.props.history.push('/task/add')}
                >
                    <Icon type="plus" />添加任务
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
                            keyName="taskCode"
                            tableWidth={600}
                            onClick={this.handleTableClick}
                            pageSizeOptions={['10', '20', '30']}
                            onChangePage={tableOperate.handleChangePage.bind(this)}
                            listData={this.pageData.tableData}
                        />
                    </Spin>
                ) : null
            }
            </Crumb>
        );
    }
}
export default withRouter(TaskList);
