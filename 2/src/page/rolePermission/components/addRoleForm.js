/**
 * @file 添加角色
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Input, Table, Modal, Button, Select, Form} from 'antd';

class AddRoleForm extends Component {
    render() {
        const getFieldDecorator = this.props.form.getFieldDecorator;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18}
            }
        };

        return (
            <Modal
                visible={this.props.visible}
                title="新增角色"
                onOk={this.props.onAddRole}
                onCancel={this.props.onCancel}
                cancelText='取消'
                okText='确认'>
                <Form autoComplete="off">
                    <Form.Item
                        {...formItemLayout}
                        label='角色名称'
                    >
                        {getFieldDecorator('roleName', {
                            rules: [{
                                required: true,
                                message: ' '
                            }, {
                                validator: (rule, value, callback) => {
                                    if (!/^[a-zA-Z_0-9\u4e00-\u9faf]{3,20}$/.test(value)) {
                                        callback('请输入3-20个字符之间的字母、下划线、中文及数字');
                                    } else if (!value) {
                                        callback('请输入角色名称');
                                    }
                                    callback();
                                }
                            }]
                        })(
                            <Input/>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

export default Form.create()(AddRoleForm);
