/**
 * @file 任务列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal, Button, Form} from 'antd';
// 系统
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
// 组件
import Table from '../../../components/antComponent/duTable/duTable.jsx';
import formatTableData from '../../../components/antComponent/Integration/formatTableData.jsx';
import formatMergeData from '../../../components/antComponent/Integration/formatMergeData.jsx';
import tableOperate from '../../../module/Integration/tableOperate.jsx';
// 表单数据
import localTable from '../../../module/localData/localTable.jsx';
import localForm from '../../../module/localData/localForm.jsx';
// 业务组件
import Crumb from '../../../module/crumb/crumb.jsx';
import ChartDetail from '../../../module/chartDetail/chartDetail.jsx';
// 业务操作
import getQueryString from '../../../module/Integration/getQueryString.jsx';
import Integration from '../../../module/Integration/Integration.jsx';

class TaskLogDetail extends Component {

    /**
     * 状态
     */
    state = {
        isMounting: true,
        // 是否渲染
        isTableRender: false,
        tableLoading: false,
        queryData: {
            queryKey: '',
            pageNo: 1,
            pageSize: 10
        },
        modelVisible: false,
        chartData: null
    }

    /**
     * 业务
     */
    pageData = {
        logId: getQueryString('id'),
        tableData: null
    }

    /**
     * 数据层 - 查询
     *
     * @param {Function} callback 传入的回调函数
     * @return {void}
     */
    getListData = callback => {
        let postData = this.state.queryData;
        postData.logId = this.pageData.logId;
        request({
            url: config.api.taskListSample,
            data: postData,
            success: data => {
                this.pageData.tableData = formatTableData({
                    data: data.content.list,
                    table: localTable.task.logDetail,
                    page: data.content.paginator
                });

                this.state.isMounting && this.setState({
                    isTableRender: true,
                    tableLoading: false
                });
            },
            complete: () => {
                callback && callback();
            }
        });
    }

    /**
     * 数据层 - 查询
     *
     * @param {Function} callback 传入的回调函数
     * @return {void}
     */
    getChartData = () => {
        request({
            url: config.api.taskLogStat,
            data: {
                logId: this.pageData.logId
            },
            success: data => {
                this.setState({
                    chartData: data.content.result
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
        if (type === 'view') {
            this.handleGetReport(id);
        }
    }

    handleGetReport = id => {
        request({
            url: config.api.taskReport,
            data: {
                sampleId: id
            },
            success: data => {
                this.pageData.reportData = data.content;
                this.state.isMounting && this.setState({
                    modelVisible: true
                });
            }
        });
    }

    handleCancel = () => {
        this.setState({
            modelVisible: false
        });
    }

    componentDidMount() {
        this.getChartData();
        this.getListData();
    }

    componentWillUnmount() {
        this.state.isMounting = false;
    }

    render() {
        let reportFormData = this.pageData.reportData
            && formatMergeData(localForm.task.report, this.pageData.reportData);


        let colorArray = {};
        let {chartData} = this.state;
        // 获取对比饼图的颜色
        chartData && chartData.forEach((key, i) => {
            colorArray[key.name] = colorArray[key.name] || config.echartColor[i];
        });


        let modelTpl = this.pageData.reportData ? (
            <Modal
                title={this.pageData.reportData.title}
                visible={this.state.modelVisible}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="submit" size="large" type="primary" onClick={this.handleCancel}>确定</Button>
                ]}
            >
                <div className="page-by-side">
                    {
                        Array.isArray(reportFormData) && reportFormData.map((report, index) => {
                            // 业务部分（非通用）(入参出参部分)
                            if (report.type === 'text_array') {
                                return Array.isArray(report.defaultValue) && report.defaultValue.map((items, i) => {
                                    return (
                                        <div key={i} className="page-overflow-hidden">
                                            <h3 className="page-sub-slide">{items.modelName}</h3>
                                            {
                                                // 入参出参内容
                                                items.modelParam.map((item, j) => (
                                                    <div key={j} className="page-by-side-item">
                                                        <p
                                                            style={{width: '9em'}}
                                                            className="page-by-side-title"
                                                        >
                                                            {item.paramName}
                                                        </p>
                                                        <p style={{marginLeft: '11em'}}>{item.paramValue}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    );
                                });
                            }
                            // 通用
                            return Integration.getTextItemTpl(report, index, 9);
                        })
                    }
                </div>
            </Modal>
        ) : null;
        return (
            <Crumb
                page={this.props.title}
            >
                <div id="task-chart">
                    <h2 className="page-slide">饼图展示</h2>
                    {
                        chartData && <ChartDetail data={chartData} id="echart-pie" colorArray={colorArray} />
                    }
                </div>
                {
                    this.state.isTableRender ? (
                        <div>
                            <h2 className="page-slide">任务日志</h2>
                            <Table
                                keyName="sampleId"
                                tableWidth={600}
                                onClick={this.handleTableClick}
                                pageSizeOptions={['10', '50', '100', '150', '200']}
                                onChangePage={tableOperate.handleChangePage.bind(this)}
                                listData={this.pageData.tableData}
                            />
                        </div>
                    ) : null
                }
                {modelTpl}
            </Crumb>
        );
    }
}
export default withRouter(Form.create()(TaskLogDetail));
