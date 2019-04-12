import React, { Component } from 'react';
import './flowNew.less';
import { Modal, Button,Steps, Popover, Icon, notification, Input, Select } from 'antd';
const Option = Select.Option;
const Step = Steps.Step;
const { TextArea } = Input;
import {withRouter} from 'react-router-dom';
import jsonqueryjs from 'jsonqueryjs/json.js';
import common from '../../../components/common.js';
import request from '../../../module/system/request.jsx';

import ModelDetail from '../../../module/modelDetail/modelDetail.jsx';

import config from '../../../../config/project.config.jsx';
import Crumb from '../../../module/crumb/crumb.jsx';
const confirm = Modal.confirm;
const warning = Modal.warning;



class FlowNew extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryType: undefined, // 流程类型
            categoryTypeList: [],
            newCategoryModalVisible: false
        };
        this.NEW = 'category_00000';
    }

    componentDidMount() {
        this.getCategoryTypeList();
    }

    getCategoryTypeList() {
        var self = this;
        let params = {
            categoryType: 'PROCESS'
        };
        request({
            isParallel: true,
            url: config.api.categoryList,
            data: params,
            success: data => {
                self.setState({
                    categoryTypeList: data.content
                });
            }
        });
    }

    handleCategoryTypeSelectChange = (value) => {
        this.clearError('rule-form-error-type');
        if (value === this.NEW) {
            // 新建决策
            this.setState({
                newCategoryModalVisible: true
            });
        } else {
            this.setState({
                categoryType: value
            });
        }
    }
    
    // 新建决策提交
    createNewCategory = () => {
        var newCategory = this.refs.newCategoryInput.refs.input.value;
        if (!newCategory) {
            notification.error({
                message: '错误提示',
                description: '请输入类型名称'
            });
            return;
        }
        var self = this;
        var params = {
            categoryName: newCategory,
            categoryType: 'PROCESS'
        };
        if (window.isloading) {
            return;
        }
        window.isloading = true;
        request({
            isParallel: true,
            url: config.api.categoryAdd,
            data: params,
            type: 'POST',
            contentType: 'application/json',
            success: data => {
                window.isloading = false;
                self.setState({
                    categoryTypeList: [{
                        categoryCode: data.content.categoryCode,
                        categoryName: data.content.categoryName}].concat(this.state.categoryTypeList),
                    categoryType: data.content.categoryCode,
                    newCategoryModalVisible: false
                });
            },
            error: err => {
                window.isloading = false;
                notification.error({
                    message: '错误提示',
                    description: err.msg
                });
            }
        });
    }

    saveProcessInfo = () => {
        var self = this;
        var processCategory = this.state.categoryType,
                processName = $('.process-name').val(),
                processDesc = $('.process-desc').val();
        // 首先需要验证参数
        if (!processName) {
            $('.process-name').parents('.rule-form-input').children('.rule-form-error').text('请输入流程名称!');
            return;
        }
        // 流程名字重复
        if (this.flowNameRepeat) {
            return;
        }
        if (!processCategory) {
            $('.process-type').parents('.rule-form-input').children('.rule-form-error').text('请选择流程类型!');
            return;
        }
        if (!processDesc) {
            $('.process-desc').parents('.rule-form-input').children('.rule-form-error').text('请输入流程描述!');
            return;
        }
        // 然后进行提交
        request({
            isParallel: true,
            url: config.api.processAdd,
            type: 'POST',
            contentType: 'application/json',
            data: {
                processName: processName,
                categoryCode: processCategory,
                processDesc: processDesc || ''
            },
            success: data => {
                var processCode = data.content.processCode;
                self.props.history.push('/flow/edit?code=' + processCode);
            }
        });
    }

    valiteProcessName = () => {
        var _this = this;
        var processName = $('.process-name').val();
        if (!processName) {
            return;
        }
        request({
            isParallel: true,
            url: config.api.validateName,
            data: {
                name: processName,
                module: 'PROCESS'
            },
            success: data => {
                if (data.content.exists) {
                    $('.process-name').parents('.rule-form-input').children('.rule-form-error').text('输入的名称已存在，请重新输入!');
                    _this.flowNameRepeat = true;
                }
            }
        });
    }

    // 晴空form表单中错误信息
    clearError = (type) => {
        $('.' + type).text('');
        if (type === 'rule-form-error-name') {
            this.flowNameRepeat = false;
        }
    }

    render() {
        let buttonNode = (
            <div className="flow-new-step">
                <Steps current={0} size="small">
                    <Step title="基本信息" />
                    <Step title="流程编辑" />
                </Steps>
            </div>
        );
        return (
            <Crumb
                page={this.props.title}
                buttonNode={buttonNode}
            >
                <div id="flowNewBox" className="flow-new-box">
                    <div className="rule-form">
                        <div className="rule-form-item">
                            <label className="rule-form-label rule-form-label-required">流程名称</label>
                            <div className="rule-form-input">
                                <Input style={{width: 430, height: 30}} onChange={this.clearError.bind(this, 'rule-form-error-name')} className="process-name" placeholder="流程中文名称" onBlur={this.valiteProcessName}/>
                                <i className="rule-form-error rule-form-error-name"></i>
                            </div>
                        </div>
                        <div className="rule-form-item rule-form-item-desc">
                            <label className="rule-form-label rule-form-label-required">流程类型</label>
                            <div className="rule-form-input">
                                <Select
                                    style={{width: 430, height: 30}}
                                    placeholder="类型选择"
                                    className="process-type"
                                    defaultActiveFirstOption={true}
                                    value={this.state.categoryType}
                                    getPopupContainer={() => document.getElementById('flowNewBox')}
                                    onChange={this.handleCategoryTypeSelectChange}
                                >
                                   {this.state.categoryTypeList.map(function (item, index) {
                                       return <Option key={index} value={item.categoryCode}>{item.categoryName}</Option>
                                   })}
                                </Select>
                                <i className="rule-form-error rule-form-error-type"></i>
                            </div>
                        </div>
                        <div className="rule-form-item rule-form-item-desc">
                            <label className="rule-form-label rule-form-label-desc rule-form-label-required">流程描述</label>
                            <div className="rule-form-input text-area-desc">
                                <TextArea style={{width: 430, height: 90}} onChange={this.clearError.bind(this, 'rule-form-error-desc')} className="process-desc" placeholder="流程描述" />
                                <i className="rule-form-error rule-form-error-desc"></i>
                            </div>
                        </div>
                        <div style={{marginBottom: '10px', textAlign: 'left', paddingLeft: '110px', marginTop: '20px'}}>
                            <Button key="submit" type="primary" onClick={this.saveProcessInfo}>下一步</Button>
                        </div>
                    </div>
                    <Modal
                        title="新建类型"
                        width="500px"
                        wrapClassName="flow-new-box"
                        maskClosable={false}
                        style={{marginTop: "80px"}}
                        visible={this.state.newCategoryModalVisible}
                        onCancel={() => {this.setState({newCategoryModalVisible: false})}}
                        onOk={this.createNewCategory}
                        getPopupContainer={() => document.getElementById('flowNewBox')}
                    >
                        <div className="rule-form-item">
                            <label className="rule-form-label rule-form-label-required">类型名</label>
                            <div className="rule-form-input">
                                <Input style={{width: 300}} ref="newCategoryInput" className="category-input" placeholder="输入类型名称" defaultValue=""/>
                            </div>
                        </div>
                    </Modal>
                </div>
            </Crumb>
        )
    }
}
export default withRouter(FlowNew);