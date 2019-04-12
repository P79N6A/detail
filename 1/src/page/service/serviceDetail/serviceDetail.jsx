/**
 * @file 服务列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Form, Modal} from 'antd';
// 系统
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
// 组件
import Table from '../../../components/antComponent/duTable/duTable.jsx';
import formatTableData from '../../../components/antComponent/Integration/formatTableData.jsx';
import formatMergeData from '../../../components/antComponent/Integration/formatMergeData.jsx';
// 表单数据
import localForm from '../../../module/localData/localForm.jsx';
import localTable from '../../../module/localData/localTable.jsx';

// 业务组件
import Crumb from '../../../module/crumb/crumb.jsx';
import AddCategory from '../../../module/AddCategory/AddCategory.jsx';
// 业务操作
import Integration from '../../../module/Integration/Integration.jsx';
import getQueryString from '../../../module/Integration/getQueryString.jsx';
import downloadFile from '../../../module/Integration/downloadFile.jsx';
// 流程图
import FlowChart from '../../../module/flowChart/flowChart.jsx';
import jsonqueryjs from 'jsonqueryjs/json.js';
import ModelDetail from '../../../module/modelDetail/modelDetail.jsx';
import RuleDetail from '../../../module/ruleDetail/ruleDetail.jsx';
import IntegrateFlow from '../../../module/Integration/integrateFlow.jsx';
import OPTIONS from '../../../module/localData/options.jsx';
const confirm = Modal.confirm;
const FormItem = Form.Item;

class ServiceDetail extends Component {

    /**
     * 状态
     */
    state = {
        // 是否渲染
        isRender: false,
        pageState: true,
        categoryModelVisible: false,
        modelDetailVisible: false,
        ruleDetailVisible: false
    }

    /**
     * 业务
     */
    pageData = {
        serviceCode: getQueryString('id'),
        data: null,
        serviceReqData: [],
        flowItemData: {},
        processData: null
    }

    /**
     * 数据层 - 查询
     *
     * @return {void}
     */
    getListData = () => {
        request({
            url: config.api.serviceDetail,
            data: {
                serviceCode: this.pageData.serviceCode
            },
            success: data => {
                this.pageData.data = data.content;
                this.pageData.processData = IntegrateFlow.formatData(this.pageData.data.process);

                this.pageData.serviceReqData = Array.isArray(data.content.serviceReqParam)
                    && data.content.serviceReqParam.map(item => {
                        return {
                            key: item.modelName,
                            code: item.modelCode,
                            list: formatTableData({
                                data: item.modelParam,
                                table: localTable.service.detailReq
                            })
                        };
                    });

                this.setState({
                    isRender: true
                });
            }
        });
    }

    handleDelete = () => {
        let self = this;
        confirm({
            title: `确认删除服务【${self.pageData.serviceCode}】`,
            onOk() {
                self.handleDeleteSure(self.pageData.serviceCode);
            }
        });
    }

    handleDeleteSure = id => {
        request({
            url: config.api.serviceDelete,
            type: 'POST',
            contentType: 'application/json',
            data: {
                serviceCode: id
            },
            success: data => {
                this.props.history.push('/service/list');
            }
        });
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            console.log('Received values of form: ', fieldsValue);
            if (err) {
                return;
            }
            let postData = fieldsValue;
            postData.serviceCode = this.pageData.serviceCode;
            request({
                url: config.api.serviceUpdate,
                data: postData,
                type: 'POST',
                contentType: 'application/json',
                success: data => {
                    this.setState({pageState: true});
                    this.getListData();
                }
            });
        });
    }

    handleCancel = () => {
        this.setState({
            pageState: true
        });
    }

    handleAjust = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            console.log('Received values of form: ', fieldsValue);
            if (err) {
                return;
            }
            let paramMap = {};

            Object.keys(fieldsValue).map(key => {
                let modelName = key.split('-')[0];
                let keyName = key.split('-')[1];
                if (!paramMap[modelName]) {
                    paramMap[modelName] = {};
                }

                paramMap[modelName][keyName] = fieldsValue[key];
            });

            let postData = {
                paramMap,
                serviceCode: this.pageData.serviceCode
            };
            request({
                url: config.api.serviceAdjust,
                data: postData,
                contentType: 'application/json',
                type: 'POST',
                success: data => {
                    this.setState({adjustResult: `${data.content}`});
                }
            });
        });
    }

    handleDownload = () => {
        downloadFile(config.api.serviceApiDownload, {
            serviceCode: this.pageData.serviceCode
        }, 'GET');
    }

    getCategoryCallback = data => {
        localForm.service.edit.forEach((item, index, array) => {
            if (item.name === 'categoryCode') {
                item.options = data;
            }
        });
        this.setState({
            isRender: true
        });
    }

    // 流程图点击事件
    handleItemClick = options => {
        const itemData = jsonqueryjs.queryNodes({
            data: this.pageData.processData,
            key: 'tmpKey',
            value: options.tmpKey
        });
        this.pageData.flowItemData = itemData[0];
        const modalType = options.processType === 'MODEL' ? 'modelDetailVisible' : 'ruleDetailVisible';
        this.setState({
            [modalType]: true
        });
    }

    // option转换
    handleOptionToValue = (options, data) => {
        data && data.forEach(item => {
            options && options.forEach(optionItem => {
                if (item.defaultValue === optionItem.value) {
                    item.defaultValue = optionItem.displayName;
                }
            });
        });
        return data;
    }

    componentDidMount() {
        this.getListData();
    }

    render() {
        let state = this.state.pageState ? 'detail' : 'edit';
        // 服务模块信息
        let serviceData = this.pageData.data && formatMergeData(localForm.service[state], this.pageData.data);
        serviceData = this.handleOptionToValue(OPTIONS.SERVICE_STATUS, serviceData);

        // 请求参数表格信息
        let detailReqTpl = this.pageData.serviceReqData.map((item, index) => {
            return (
                <div key={index}>
                    <h3 className="page-sub-slide">{item.key}</h3>
                    <Table
                        tableWidth={600}
                        tableHeight={300}
                        listData={item.list}
                    />
                </div>
            );
        });
        // 返回参数表格信息
        let detailRespTpl = <Table
            tableWidth={600}
            // tableHeight={300}
            listData={localTable.service.detailResp}
        />;
        // 接口调试表单信息
        let adjustData = Array.isArray(this.pageData.serviceReqData)
            && this.pageData.serviceReqData.map((item, i) => {
                return Integration.getDynamicParams(this.pageData.data.serviceReqParam[i].modelParam, item.code);
            });

        let buttonNode = (
            <div>
                {
                    this.pageData.data && this.pageData.data.status !== 'OFF' ? (
                        <Button
                            size="large"
                            onClick={() => this.props.history.push('/task/list')}
                        >
                            {this.pageData.data.status === 'INIT' ? '沙盒测试' : '在线测试'}
                        </Button>
                    ) : null
                }
                <Button
                    size="large"
                    onClick={this.handleDelete}
                >
                    删除
                </Button>
                <Button
                    size="large"
                    onClick={Integration.handleChangeStatus.bind(this)}
                >
                    编辑
                </Button>
                <Button
                    type="primary"
                    size="large"
                    onClick={this.handleDownload}
                >
                    下载接口文档
                </Button>
            </div>
        );
        // 获取模块tpl
        let categoryModelTpl = <AddCategory
                            visible={this.state.categoryModelVisible}
                            onCancel={() => this.setState({categoryModelVisible: false})}
                            form={this.props.form}
                            getCategoryCallback={this.getCategoryCallback}
                        />;
        let flowViewTpl = (
            <div>
                {
                    this.state.modelDetailVisible
                    ? <Modal title = "模型详情"
                        maskClosable={false} visible={true} footer={null}
                        onCancel={IntegrateFlow.handleModalCancel.bind(this, 'modelDetailVisible')}
                    >
                    <ModelDetail data={this.pageData.flowItemData}></ModelDetail>
                    </Modal>
                    : null
                }
                {
                    this.state.ruleDetailVisible
                    ? <Modal title = "规则详情"
                        maskClosable={false} visible={true} footer={null}
                        onCancel={IntegrateFlow.handleModalCancel.bind(this, 'ruleDetailVisible')}
                        >
                        <RuleDetail data={this.pageData.flowItemData}></RuleDetail>
                    </Modal> : null
                }
            </div>
        );
        return (
            <Crumb
                page={this.props.title}
                buttonNode={buttonNode}
            >
                <div>
                {
                    this.state.isRender ? this.state.pageState ? (
                        <div className="service-detail">
                            {Integration.getTextTpl(serviceData)}
                            <h2 className="page-slide">查看流程</h2>
                            <FlowChart
                                data= {this.pageData.processData}
                                handleItemClick = {this.handleItemClick}
                            ></FlowChart>
                            <h2 className="page-slide">请求参数</h2>
                            {detailReqTpl}
                            <h2 className="page-slide">返回参数</h2>
                            {detailRespTpl}
                            <h2 className="page-slide">接口调试</h2>
                            {
                                this.pageData.serviceReqData.length ? (
                                    <Form>
                                        {
                                            this.pageData.serviceReqData.map(
                                                (item, index) => (
                                                    <div key={index}>
                                                        <h3 className="page-sub-slide">{item.key}</h3>
                                                        <div style={{maxHeight: '300px', overflowY: 'scroll'}}>
                                                        {Integration.getFormTpl.bind(this, adjustData[index])()}
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        }
                                        <FormItem {...{wrapperCol: {span: 10, offset: 5}}}>
                                            <Button
                                                type="primary"
                                                size="large"
                                                onClick={this.handleAjust}
                                            >
                                                调试接口
                                            </Button>
                                        </FormItem>
                                        <FormItem {...{wrapperCol: {span: 10, offset: 5}}}>
                                            <p>{this.state.adjustResult}</p>
                                        </FormItem>
                                    </Form>
                                ) : null
                            }
                        </div>
                    ) : (
                        <div className="service-detail">
                            <Form>
                                {Integration.getFormTpl.bind(this, serviceData)()}
                            </Form>
                        </div>
                    ) : null
                }
                {categoryModelTpl}
                {flowViewTpl}
                </div>
            </Crumb>
        );
    }
}

export default withRouter(Form.create()(ServiceDetail));
