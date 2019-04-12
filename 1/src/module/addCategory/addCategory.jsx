/**
 * @file 公共页眉
 * @author
 */
import React, {Component} from 'react';
import {Button, Modal, Input, notification} from 'antd';
import jsonqueryjs from 'jsonqueryjs/json.js';
// 系统
import request from '../system/request.jsx';
import Integration from '../Integration/Integration.jsx';
import config from '../../../config/project.config.jsx';

export default class AddCategory extends Component {
    state = {
        modelLoading: false,
        categoryType: Integration.getModule()
    }

    /**
     * 数据处理层 - 获取类型数据
     *
     * @param {string} categoryType 类型
     */
    getCategoryList = callback => {
        request({
            url: config.api.categoryList,
            data: {
                categoryType: this.state.categoryType
            },
            success: data => {
                let formatData = jsonqueryjs.replace({
                    data: data.content,
                    key: 'categoryCode',
                    value: 'ignore',
                    target: {
                        key: 'value', value: 'ignore'
                    }
                });
                formatData = jsonqueryjs.replace({
                    data: formatData,
                    key: 'categoryName',
                    value: 'ignore',
                    target: {
                        key: 'displayName', value: 'ignore'
                    }
                });
                this.props.getCategoryCallback(formatData);
                this.setState({modelLoading: false});
                callback && callback();
            }
        });
    }

    /**
     * 类型添加
     *
     * @param {string} categoryName 类型名称
     */
    setCategory = categoryName => {
        request({
            url: config.api.categoryAdd,
            data: {
                categoryType: this.state.categoryType,
                categoryName
            },
            type: 'POST',
            contentType: 'application/json',
            success: data => {
                this.getCategoryList(() => {
                    this.handleCancel();
                    this.props.form.setFieldsValue({
                        categoryCode: data.content.categoryCode
                    });
                });
            },
            error: data => {
                this.setState({modelLoading: false});
                notification.error({
                    message: '错误提示',
                    description: data.msg
                });
            }
        });
    }

    handleOk = () => {
        let categoryName = $('.model-input').val();
        if (!categoryName) {
            return;
        }
        this.setState({modelLoading: true});
        this.setCategory(categoryName);
    }

    handleCancel = () => {
        this.props.form.setFieldsValue({
            categoryCode: ''
        });
        this.setState({
            modelLoading: false
        });
        this.props.onCancel();
    }

    componentDidMount() {
        console.log('propsKey: ', Integration.getModule());
        this.getCategoryList();
    }

    render() {
        return (
            <Modal
                title="输入新建类型名称"
                visible={this.props.visible}
                maskClosable={false}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={[
                    <Button
                        key="submit"
                        type="primary"
                        size="large"
                        loading={this.state.modelLoading}
                        onClick={this.handleOk}
                    >
                        确定
                    </Button>,
                    <Button key="cancel" onClick={this.handleCancel} size="large">取消</Button>
                ]}
            >
                <Input className="model-input" />
            </Modal>
        );
    }
}


