/**
 * @file 添加用户
 * @author chenling
 */
import React from 'react';
import {Modal, Form, Button, Input, Checkbox} from 'antd';
import * as actions from '../action';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import hyphenate from '../../../common/js/hyphenate';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
class AddUserCount extends React.Component {

    handleHideModal = () => {
        this.props.handleCloseModal && this.props.handleCloseModal();
    }

    validatorNuptial = (rule, value, callback) => {
        if (!value) {
            callback('请输入3-20个字符之间的字母及数字');
            return;
        }
        else if (value && !/^[a-zA-Z0-9]{3,20}$/.test(value)) {
            callback('请输入3-20个字符之间的字母及数字');
            return;
        }
        else if (value && /^[a-zA-Z0-9]{3,20}$/.test(value)) {
            this.props.actions.userCountDuplicate({
                userName: value
            }, content => {
                if (content) {
                    callback('用户名称重复，请重新输入');
                }
                else {
                    callback();
                }
            });
        }
    }

    validatorConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('确认密码与输入的密码不一致');
        }
        else {
            callback();
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.password = hyphenate.setEncryption(values.password);
                values.confirmedPass = hyphenate.setEncryption(values.confirmedPass);
                this.props.actions.addUserCount(values, {key: '', currentPage: 1, pagesize: 20});
                this.props.handleCloseModal();
            }
        });
    }

    render() {
        let {getFieldDecorator} = this.props.form;
        return (
            <Modal
                title = "新建用户"
                visible = {this.props.isShow}
                onCancel = {this.handleHideModal}
                footer={[
                    <Button
                        key="cancel"
                        type="default"
                        onClick={this.handleHideModal}
                    >
                        取消
                    </Button>,
                    <Button
                    key="submit"
                    type="primary"
                    onClick={this.handleSubmit}
                >
                    添加
                </Button>
                ]}
            >
                <Form autoComplete="off">
                    <FormItem
                        label="用户姓名"
                    >
                        {
                            getFieldDecorator('userName', {
                                rules: [{
                                    required: true,
                                    message: ' '
                                }, {
                                    validator: this.validatorNuptial
                                }]
                            })(
                                <Input placeholder="请输入用户名"/>
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="电话号码"
                    >
                        {
                            getFieldDecorator('phone', {
                                rules: [{
                                    required: true,
                                    pattern: /^\d{11}$/,
                                    message: '请输入11位数字'
                                }]
                            })(
                                <Input placeholder="请输入电话号码"/>
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="邮箱"
                    >
                        {
                            getFieldDecorator('email', {
                                rules: [{
                                    required: true,
                                    type: 'email',
                                    message: '请输入邮箱格式'
                                }]
                            })(
                                <Input placeholder="请输入邮箱"/>
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="设置密码"
                    >
                        <Input className="hidden-input"/>
                        {
                            getFieldDecorator('password', {
                                rules: [{
                                    required: true,
                                    message: '仅支持长度为6-18位的英文大小写字母、数字',
                                    pattern: /^[a-zA-Z0-9]{6,18}$/
                                }]
                            })(
                                <Input
                                    placeholder="请输入密码"
                                    type="password"
                                    autoComplete="new-password"
                                />
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="确认密码"
                    >
                        {
                            getFieldDecorator('confirmedPass', {
                                rules: [{
                                    required: true,
                                    message: '确认密码与输入的密码不一致'
                                },
                                    {validator: this.validatorConfirm}]
                            })(
                                <Input
                                    placeholder="请输入确认密码"
                                    type="password"
                                    autoComplete="new-password"
                                />
                            )
                        }
                    </FormItem>
                    {
                        this.props.allRoles && this.props.allRoles.length > 0
                        ? (
                            <FormItem>
                                <div>角色配置(非必填)</div>
                                {
                                    getFieldDecorator('roles')(
                                        <CheckboxGroup
                                            className = "page-checkbox"
                                        >
                                            {
                                                this.props.allRoles.map(item => {
                                                    return (
                                                        <Checkbox key={item.roleId} value={item.roleId}>{item.roleName}</Checkbox>
                                                    );
                                                })
                                            }
                                        </CheckboxGroup>
                                    )
                                }
                            </FormItem>
                        ) : null
                    }
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    allRoles: state.userCount.allRoles
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddUserCount));
