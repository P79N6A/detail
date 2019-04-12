/**
 * @file 任务列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Spin, Button} from 'antd';
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
import getQueryString from '../../../module/Integration/getQueryString.jsx';
import style from './taskLogList.useable.less';

class TaskLogList extends Component {

    /**
     * 状态
     */
    state = {
        // 是否渲染
        isRender: false,
        tableLoading: false,
        selectedRowKeys: [],
        queryData: {
            queryKey: '',
            pageNo: 1,
            pageSize: 10,
            startTime: '',
            endTime: '',
            taskCode: getQueryString('id')
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
            url: config.api.taskListLog,
            data: this.state.queryData,
            success: data => {
                this.pageData.tableData = formatTableData({
                    data: data.content.list,
                    table: localTable.task.logList,
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

    /**
     * 事件层 - 表格事件
     *
     * @param   {string} id code
     * @param   {string} type 处理
     * @param   {Object} data 整条数据
     * @return {void}
     */
    handleTableClick = (id, type, data) => {
        if (type === 'view') {
            this.props.history.push(`/task/log/detail?id=${id}`);
        }
    }

    handleSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    }

    handleSelectAll = (selected, selectedRows) => {
        if (selected) {
            this.setState({
                selectedRowKeys: selectedRows.splice(0, 2).map(item => item.logId)
            }, () => {
                $('.ant-table-thead .ant-checkbox').removeClass('ant-checkbox-indeterminate');
            });
        }
        else {
            $('.ant-table-thead .ant-checkbox').removeClass('ant-checkbox-indeterminate');
        }
    }

    getCheckboxProps = record => {
        return ({
            disabled: !record.handle[0].value[1]
                || ((this.state.selectedRowKeys.length >= 2
                    && this.state.selectedRowKeys.indexOf(record.logId) < 0)
                        || this.pageData.tableData.data.length < 2)
        });
    }

    componentDidMount() {
        this.getListData();
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    render() {
        console.log(getQueryString('id'));
        let {selectedRowKeys} = this.state;

        let selectParams = {
            selectedRowKeys: selectedRowKeys,
            onSelectChange: this.handleSelectChange,
            getCheckboxProps: this.getCheckboxProps,
            onSelectAll: this.handleSelectAll
        };

        let contrastBtn = (
            <div className="task-log-list-btn">
                <Button
                    size="large"
                    type="primary"
                    disabled={selectedRowKeys.length !== 2}
                    onClick={() => this.props.history.push(
                        `/task/log/contrast?id1=${selectedRowKeys[0]}&id2=${selectedRowKeys[1]}`
                    )}
                >
                    {`对比（ ${selectedRowKeys.length} ）`}
                </Button>
            </div>
        );
        return (
            <Crumb
                page={this.props.title}
            >
            {
                this.state.isRender ? (
                    <Spin tip="加载中..." spinning={this.state.tableLoading} className="page-spin" size="large">
                        <QueryForm
                            className="page-query-form"
                            data={localQuery.searchTimeQuery}
                            onSubmit={tableOperate.handleQuerySubmit.bind(this)}
                            defaultItem={this.state.queryData.pageSize}
                            otherBtn={contrastBtn}
                        />
                        <Table
                            keyName="logId"
                            tableWidth={600}
                            onClick={this.handleTableClick}
                            pageSizeOptions={['10', '20', '30']}
                            selectParams={selectParams}
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
export default withRouter(TaskLogList);
