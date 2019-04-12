/**
 * @file 添加角色
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Input, Modal, Button, Select, Form, Checkbox} from 'antd';

class SetMembersForm extends Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.role !== this.props.role) {
            this.props.form.resetFields();
        }
    }

    getCheckedRoles = () => {
        let checkedArr = [];

        this.props.role && this.props.role.forEach(role => {
            if (role.owned) {
                checkedArr.push(role.roleId);
            }
        });

        return checkedArr;
    }

    render() {
        const getFieldDecorator = this.props.form.getFieldDecorator;

        return (
            <Form autoComplete="off">
                <Form.Item>
                    {getFieldDecorator('roles', {initialValue: this.getCheckedRoles()})(
                        <Checkbox.Group
                            disabled={this.props.setRoleOperation === 1}
                            className="role-checkbox-wrapper">
                            {this.props.role && this.props.role.map(item => {
                                return <Checkbox
                                value={item.roleId}
                                key={item.roleId}
                                checked={item.owned}
                                className="role-checkbox">{item.roleName}</Checkbox>;
                            })}
                        </Checkbox.Group>
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
        const {validateFields, getFieldsValue} = me.formRef.props.form;
        let data = getFieldsValue();

        let rolesArr = [];
        if (data.roles.length) {
            let newRoles = this.props.role.filter(role => (
                data.roles.indexOf(role.roleId) !== -1
            ));

            newRoles.forEach(item => {
                rolesArr.push({
                    roleId: item.roleId,
                    roleName: item.roleName
                });
            });
        }

        validateFields((err, values) => {
            if (!err) {
                this.props.onSubmit(rolesArr);
            }
        });

    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                title="角色设置"
                onOk={this.handleSubmit}
                onCancel={this.props.onCancel}
                cancelText='取消'
                okText='确认'
                okButtonProps={{
                    disabled: this.props.setRoleOperation === 1
                }}
                className="setRoleForm-wrapper">
                <WrapperSetMembersForm
                    wrappedComponentRef={this.saveAddFormRef}
                    role={this.props.role}
                    setRoleOperation={this.props.setRoleOperation}/>
            </Modal>
        )
    }
}
