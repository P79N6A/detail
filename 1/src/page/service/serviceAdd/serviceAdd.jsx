/**
 * @file 任务列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Form, Modal} from 'antd';
// 系统
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
// 表单数据
import localForm from '../../../module/localData/localForm.jsx';
// 业务组件
import Crumb from '../../../module/crumb/crumb.jsx';
import AddCategory from '../../../module/AddCategory/AddCategory.jsx';
import ChooseFlow from '../../../module/chooseFlow/chooseFlow.jsx';
// 业务操作
import Integration from '../../../module/Integration/Integration.jsx';

class ServiceAdd extends Component {

    /**
     * 状态
     */
    state = {
        // 是否渲染
        isRender: false,
        processCode: '',
        // model状态
        categoryModelVisible: false,
        chooseFlowVisible: false
    }

    /**
     * 业务
     */
    pageData = {
        processName: ''
    }

    handleSubmit = () => {
        this.props.form.validateFields({force: true}, (err, fieldsValue) => {
            console.log('Received values of form11111111: ', fieldsValue);
            if (err) {
                return;
            }
            let postData = fieldsValue;
            postData.processCode = this.state.processCode;
            request({
                url: config.api.serviceAdd,
                data: postData,
                type: 'POST',
                contentType: 'application/json',
                success: data => {
                    console.log(data);
                    this.props.history.push(`/service/detail?id=${data.content.serviceCode}`);
                },
                error: errorObj => {
                    Modal.error({
                        title: '提交失败',
                        content: errorObj.msg,
                        onOk: () => this.props.history.push('/service/list')
                    });
                }
            });
        });
    }

    handleChooseFlow = () => {
        console.log('-- choose --');
        this.setState({
            chooseFlowVisible: true
        });
    }

    getCategoryCallback = data => {
        localForm.service.add.forEach((item, index, array) => {
            if (item.name === 'categoryCode') {
                item.options = data;
            }
        });
        this.setState({
            isRender: true
        });
    }

    handleOk = (id, item) => {
        this.pageData.processName = item.processName;
        this.setState({
            processCode: id
        });
    }

    handleCancel = () => {
        this.props.history.goBack();
    }

    render() {

        // 获取模块tpl
        let modelTpl = <AddCategory
                            visible={this.state.categoryModelVisible}
                            onCancel={() => this.setState({categoryModelVisible: false})}
                            form={this.props.form}
                            getCategoryCallback={this.getCategoryCallback}
                        />;
        let chooseFlowTpl = <ChooseFlow
                            visible={this.state.chooseFlowVisible}
                            onOk={this.handleOk}
                            title="请选择服务流程"
                            onCancel={() => this.setState({chooseFlowVisible: false})}
                        />;
        return (
            <Crumb
                page={this.props.title}
            >
                <div>
                    {
                        this.state.isRender ? Integration.getFormTpl.bind(this, localForm.service.add)() : null
                    }
                    {modelTpl}
                    {chooseFlowTpl}
                </div>
            </Crumb>
        );
    }
}

export default withRouter(Form.create()(ServiceAdd));
