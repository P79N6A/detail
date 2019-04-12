/**
 * @file 添加角色
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Input, Modal, Button, Select, Form, Checkbox} from 'antd';

class SetMembersForm extends Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.groupDetail !== this.props.groupDetail) {
            this.props.form.resetFields();
        }
    }

    render() {
        const getFieldDecorator = this.props.form.getFieldDecorator;

        return (
            <Form autoComplete="off">
                <Form.Item
                    label='组名称'
                >
                    {getFieldDecorator('groupName', {
                        initialValue: this.props.groupDetail.groupName,
                        rules: [{
                            required: true,
                            message: ' '
                        }, {
                            validator: (rule, value, callback) => {
                                if (!/^[a-zA-Z_0-9\u4e00-\u9faf]{3,20}$/.test(value)) {
                                    callback('请输入3-20个字符之间的字母、下划线、中文及数字');
                                } else if (!value) {
                                    callback('请输入组名称');
                                }
                                callback();
                            }
                        }]
                    })(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item
                    label='状态设置'
                >
                    {getFieldDecorator('status', {initialValue: this.props.statusList
                        && this.props.statusList.find(
                        item => item.statusName === this.props.groupDetail.status).statusCode})(
                        <Select>
                            {this.props.statusList && this.props.statusList.map(status => (
                                <Select.Option value={status.statusCode} key={status.statusCode}>{status.statusName}</Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            </Form>
        )
    }
}

const WrapperSetMembersForm = Form.create()(SetMembersForm);

export default class SetMembersFormM extends Component {
    saveAddFormRef = formRef => {
        this.formRef = formRef;
    }

    handleSubmit = () => {
        let me = this;
        const {validateFields, getFieldValue} = me.formRef.props.form;
        let status = getFieldValue('status');
        let groupName = getFieldValue('groupName');
        let groupId = this.props.groupDetail.groupId;

        validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit({
                    status,
                    groupId,
                    groupName
                });
            }
        });

    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                title="配置状态"
                onOk={this.handleSubmit}
                onCancel={this.props.onCancel}
                cancelText='取消'
                okText='确认'>
                <WrapperSetMembersForm
                    wrappedComponentRef={this.saveAddFormRef}
                    statusList={this.props.statusDetail && this.props.statusDetail.statusList}
                    groupDetail={this.props.groupDetail}/>
            </Modal>
        )
    }
}
