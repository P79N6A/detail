/**
 * @file 流程列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal, Button} from 'antd';
// 系统
import request from '../system/request.jsx';
import config from '../../../config/project.config.jsx';
// 组件
import Table from '../../components/antComponent/duTable/duTable.jsx';
import formatTableData from '../../components/antComponent/Integration/formatTableData.jsx';
import tableOperate from '../Integration/tableOperate.jsx';
// 表单数据
import localTable from '../localData/localTable.jsx';

class ChooseFlow extends Component {

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
            isComplete: true
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
            url: config.api.processList,
            data: this.state.queryData,
            success: data => {
                this.pageData.tableData = formatTableData({
                    data: data.content.list,
                    table: localTable.flow.ModelChooseFlow,
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

    handleSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    }

    handleOk = () => {
        let {selectedRowKeys, selectedRows} = this.state;
        this.props.onOk(selectedRowKeys[0], selectedRows[0]);
        this.props.onCancel();
    }

    handleCancel = () => {
        this.props.onCancel();
    }

    componentDidMount() {
        this.getListData();
    }

    render() {
        let selectParams = {
            selectedRowKeys: this.state.selectedRowKeys,
            type: 'radio',
            onSelectChange: this.handleSelectChange
        };
        return this.state.isRender ? (
            <Modal
                title={this.props.title}
                visible={this.props.visible}
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        size="large"
                        onClick={this.handleOk}
                    >
                        确定
                    </Button>,
                    <Button key="cancel" onClick={this.handleCancel} size="large">取消</Button>
                ]}
            >
                <Table
                    keyName="processCode"
                    tableWidth={400}
                    onClick={this.handleTableClick}
                    listData={this.pageData.tableData}
                    selectParams={selectParams}
                    onChangePage={tableOperate.handleChangePage.bind(this)}
                />
            </Modal>
        ) : null;
    }
}

export default withRouter(ChooseFlow);
