/**
 * @file 通用方法
 * @author
 */

import React from 'react';
import {Button, Form, message} from 'antd';
import jsonqueryjs from 'jsonqueryjs/json.js';
// 系统
import request from '../system/request.jsx';
import config from '../../../config/project.config.jsx';
import duForm from '../../components/antComponent/duForm/duForm.jsx';

const FormItem = Form.Item;

let Integration = {

    /**
     * 按钮状态校验
     *
     * @param {*} code code
     * @param {*} rule rule
     * @param {*} value value
     * @param {*} callback callback
     */
    checkValidator(code, rule, value, callback) {
        if (!value) {
            callback();
            return;
        }
        // 获取当前module
        let moduleCode = Integration.getModule();
        request({
            url: config.api.validateName,
            data: {
                name: value,
                module: moduleCode,
                code
            },
            success: data => {
                if (!data.content.exists) {
                    callback();
                }
                else {
                    callback('输入的名称已存在，请重新输入');
                }
            }
        });
    },

    getModule() {
        let state = location.pathname.split('/').filter(i => i)[0];
        console.log(state);
        if (state === 'flow') {
            return 'PROCESS';
        }
        else if (state === 'task') {
            return 'TASK';
        }
        else if (state === 'service') {
            return 'SERVICE';
        }
        else if (state === 'model') {
            return 'MODEL';
        }
    },

    /**
     * 业务层 - 接口调试 - 处理生成动态参数测试框
     *
     * @param {Array} params 参数
     * @return {void}
     */
    getDynamicParams(params, key) {
        let keyName = key ? `${key}-` : '';
        return Array.isArray(params) && params.map((param, index) => {
            return {
                type: 'input',
                name: `${keyName}${param.name}`,
                displayName: param.name,
                defaultValue: '',
                placeholder: param.displayName || '',
                isRequire: param.isRequire,
                message: `请填写${param.displayName}`,
                disabled: false
            };
        });
    },


    /**
     * 数据处理层 - 获取表单数据
     *
     * @return {Object} data 表单数据
     */
    getEditData(isDelay) {
        if (isDelay) {
            return new Promise((resolve, reject) => {
                this.props.form.validateFields((err, fieldsValue) => {
                    console.log('Received values of form: ', fieldsValue);
                    if (err) {
                        return;
                    }
                    resolve(fieldsValue);
                });
            });
        }
        else {
            let data = null;
            this.props.form.validateFields((err, fieldsValue) => {
                console.log('Received values of form: ', fieldsValue);
                if (err) {
                    return;
                }
                data = fieldsValue;
            });
            return data;
        }
    },

    /**
     * 数据层 - 获取表单部分
     * @param {Object} formData 展示数据
     */
    getFormTpl(formData, dataCode) {
        let code = dataCode || null;
        const getFieldDecorator = this.props.form.getFieldDecorator;
        const options = {
            libs: {getFieldDecorator},
            params: {
                formItemLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 10, offset: 1}
                },
                formItemEmptyLabelLayout: {
                    wrapperCol: {span: 10, offset: 5}
                },
                selectStyle: {
                    marginBottom: 5,
                    width: '100%'
                }
            },
            events: {
                handleSelectChange: Integration.handleSelectChange.bind(this),
                checkValidator: Integration.checkValidator.bind(this, code)
            }
        };

        return Array.isArray(formData) && formData.map((item, index, array) => {
            // 业务部分
            if (item.type === 'button') {
                return (
                    <FormItem key={index} {...options.params.formItemEmptyLabelLayout}>
                    {
                        item.content.map((btnItem, btnIndex) => {
                            let handleClick = null;
                            if (btnItem.name === 'submit') {
                                handleClick = this.handleSubmit;
                            }
                            else if (btnItem.name === 'cancel') {
                                handleClick = this.handleCancel;
                            }
                            return (
                                <Button
                                    type="primary"
                                    size="large"
                                    key={btnIndex}
                                    onClick={handleClick}
                                    style={{'marginRight': '15px'}}
                                >
                                    {btnItem.displayName}
                                </Button>
                            );
                        })
                    }
                    </FormItem>
                );
            }
            else if (item.type === 'choose_flow') {
                let rule = [{
                    validator: Integration.checkIsChooseFlow.bind(this)
                }];
                return (
                    <FormItem
                        style={options.params.titleStyle}
                        key={index}
                        label={item.displayName}
                        {...options.params.formItemLayout}
                    >
                        {
                            getFieldDecorator(item.name, {
                                rules: rule
                            })(
                                <p>
                                    {
                                        this.pageData.processName ? (
                                            <span className="ant-form-text">{this.pageData.processName}</span>
                                        ) : null
                                    }
                                    <a href="javascript:void(0);"
                                        className="ant-form-text"
                                        onClick={this.handleChooseFlow}
                                    >{this.pageData.processName ? '重新选择' : '添加流程'}</a>
                                </p>
                            )
                        }
                        
                    </FormItem>
                );
            }
            // 通用部分
            return duForm(item, index, options);
        });
    },

    getTextTpl(data, width) {
        return <div className="page-by-side">
            {Array.isArray(data) && data.map((item, index) => Integration.getTextItemTpl(item, index, width))}
        </div>;
    },

    getTextItemTpl(item, index, width) {
        if (item.type === 'title') {
            return <h2 key={index} className="global-model-h2 page-slide">{item.displayName}</h2>;
        }
        return (
            <div key={index} className="page-by-side-item">
                <p style={{width: `${width}em`}} className="page-by-side-title">{item.displayName}</p>
                <p style={{marginLeft: `${width + 2}em`}}>{item.defaultValue}</p>
            </div>
        );
    },

    /**
     * checkIsChooseFlow 表单校验 - 是否选择流程
     * @param {Object} rule rule
     * @param {string} value value
     * @param {Function} callback callback
     */
    checkIsChooseFlow(rule, value, callback) {
        console.log('checkIsChooseFlow: ', this.pageData.processName);
        if (!this.pageData.processName) {
            callback('请选择服务流程');
        }
        else {
            callback();
        }
    },

    /**
     * select的change事件
     *
     * @param {string} value value
     */
    handleSelectChange(value) {
        // 新建
        if (value === 'category_00000') {
            this.setState({
                categoryModelVisible: true
            });
        }
    },

    /**
     * 切换状态
     */
    handleChangeStatus() {
        let pageState = !this.state.pageState;
        this.setState({
            pageState
        });
    }
};

export default Integration;
