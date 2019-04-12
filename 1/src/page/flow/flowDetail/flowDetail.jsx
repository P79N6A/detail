/**
 * @file 任务列表
 * @author
 */

import React, {Component} from 'react';
import {Button, Icon, Form, Modal} from 'antd';
// 系统
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
// 组件
import formatMergeData from '../../../components/antComponent/Integration/formatMergeData.jsx';
// 表单数据
import localForm from '../../../module/localData/localForm.jsx';
// 业务组件
import Crumb from '../../../module/crumb/crumb.jsx';
import AddCategory from '../../../module/AddCategory/AddCategory.jsx';
// 业务操作
import Integration from '../../../module/Integration/Integration.jsx';
import getQueryString from '../../../module/Integration/getQueryString.jsx';
// 流程图
import FlowChart from '../../../module/flowChart/flowChart.jsx';
import jsonqueryjs from 'jsonqueryjs/json.js';
import ModelDetail from '../../../module/modelDetail/modelDetail.jsx';
import RuleDetail from '../../../module/ruleDetail/ruleDetail.jsx';
import IntegrateFlow from '../../../module/Integration/integrateFlow.jsx';
class flowDetail extends Component {

    /**
     * 状态
     */
    state = {
        // 是否渲染
        isRender: false,
        pageState: true,
        // model状态
        modelLoading: false,
        categoryModelVisible: false,
        modelDetailVisible: false,
        ruleDetailVisible: false

    }

    /**
     * 业务
     */
    pageData = {
        processCode: getQueryString('id'),
        data: null,
        flowItemData: {}
    }
    
    getListData = () => {
        request({
            url: config.api.processDetail,
            data: {
                processCode: this.pageData.processCode
            },
            success: data => {
                this.pageData.data = IntegrateFlow.formatData(data.content);
                this.setState({
                    isRender: true
                });
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
            postData.processCode = this.pageData.processCode;
            request({
                url: config.api.processUpdate,
                data: postData,
                type: 'POST',
                contentType: 'application/json',
                success: data => {
                    this.setState({
                        pageState: true
                    }, () => {
                        this.getListData();
                    });
                }
            });
        });
    }

    handleCancel = () => {
        this.setState({
            pageState: true
        });
    }

    getCategoryCallback = data => {
        localForm.flowDetail.edit.forEach((item, index, array) => {
            if (item.name === 'categoryCode') {
                item.options = data;
            }
        });
    }
    // 流程图点击事件
    handleItemClick = options => {
        const itemData = jsonqueryjs.queryNodes({
            data: this.pageData.data.processContent,
            key: 'tmpKey',
            value: options.tmpKey
        });
        this.pageData.flowItemData = itemData[0];
        const modalType = options.processType === 'MODEL' ? 'modelDetailVisible' : 'ruleDetailVisible';
        this.setState({
            [modalType]: true
        });
    }
    
    componentDidMount() {
        this.getListData();
    }

    render() {
        let state = this.state.pageState ? 'detail' : 'edit';
        let formData = this.pageData.data
            && formatMergeData(localForm.flowDetail[state], this.pageData.data);

        let buttonNode = (
            <div>
                <Button
                    type="primary"
                    size="large"
                    onClick={Integration.handleChangeStatus.bind(this)}
                >
                    <Icon type="edit" />
                    编辑
                </Button>
            </div>
        );
        // 获取模块tpl
        let modelTpl = <AddCategory
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
                        <div className="flow-detail">
                            <h2 className="page-slide">基本信息</h2>
                            {Integration.getTextTpl(formData)}
                            <h2 className="page-slide">任务流程</h2>
                            <FlowChart
                                data= {this.pageData.data.processContent}
                                handleItemClick = {this.handleItemClick}
                            />
                        </div>
                    ) : (
                        <div className="flow-detail">
                            <h2 className="page-slide">流程编辑</h2>
                            <Form>
                                {Integration.getFormTpl.bind(this, formData)()}
                            </Form>
                        </div>
                    ) : null
                }
                {modelTpl}
                {flowViewTpl}
                </div>
            </Crumb>
        );
    }
}

export default Form.create()(flowDetail);
