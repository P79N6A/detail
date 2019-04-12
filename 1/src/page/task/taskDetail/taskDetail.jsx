/**
 * @file 任务列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Icon, Form, Modal, Radio} from 'antd';
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

const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

class TaskDetail extends Component {

    /**
     * 状态
     */
    state = {
        // 是否渲染
        isRender: false,
        pageState: true,
        // model状态
        categoryModelVisible: false,
        modelDetailVisible: false,
        ruleDetailVisible: false
    }

    /**
     * 业务
     */
    pageData = {
        taskCode: getQueryString('id'),
        data: null,
        sampleType: null,
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
            url: config.api.taskDetail,
            data: {
                taskCode: this.pageData.taskCode
            },
            success: data => {
                this.pageData.data = data.content;
                this.pageData.processData = IntegrateFlow.formatData(data.content.process);
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
            postData.taskCode = this.pageData.taskCode;
            request({
                url: config.api.taskUpdate,
                data: postData,
                type: 'POST',
                contentType: 'application/json',
                success: data => {
                    console.log(data);
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

    getCategoryCallback = data => {
        localForm.task.edit.forEach((item, index, array) => {
            if (item.name === 'categoryCode') {
                item.options = data;
            }
        });
    }

    handleAddSample = () => {
        this.props.history.push(`/task/batch?id=${this.pageData.taskCode}`);
    }

    handleDelete = () => {
        let self = this;
        confirm({
            title: `确认删除任务【${self.pageData.taskCode}】`,
            onOk() {
                self.handleDeleteSure(self.pageData.taskCode);
            }
        });
    }

    handleDeleteSure = id => {
        request({
            url: config.api.taskDelete,
            type: 'POST',
            contentType: 'application/json',
            data: {
                taskCode: id
            },
            success: data => {
                this.props.history.push('/task/list');
            }
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

    componentDidMount() {
        this.getListData();
    }

    render() {

        let state = this.state.pageState ? 'detail' : 'edit';
        // 任务模块信息
        let taskData = this.pageData.data && formatMergeData(localForm.task[state], this.pageData.data);

        let buttonNode = (
            <div>
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
                    onClick={this.handleAddSample}
                >
                    <Icon type="plus" />
                    样本添加
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
                        <div className="task-detail">
                            {Integration.getTextTpl(taskData)}
                            <h2 className="page-slide">查看流程</h2>
                            <FlowChart
                                data = {this.pageData.processData}
                                handleItemClick = {this.handleItemClick}
                            ></FlowChart>
                        </div>
                    ) : (
                        <div className="task-detail">
                            <Form>
                                {Integration.getFormTpl.bind(this, taskData)()}
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

export default withRouter(Form.create()(TaskDetail));
