/**
 * @file 添加角色
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Input, Modal, Button, Select, Form, Checkbox, Icon} from 'antd';
import SearchUser from '../../../common/components/searchUser/index.jsx';

class AddUserGroupForm extends Component {
    render() {
        const getFieldDecorator = this.props.form.getFieldDecorator;

        return (
            <Form autoComplete="off">
                <Form.Item
                    label='组名称'
                >
                    {getFieldDecorator('groupName', {
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
                {this.props.roleList && !!this.props.roleList.length && <Form.Item
                    label='组角色设置'
                >
                    {getFieldDecorator('roles')(
                        <Checkbox.Group className="role-checkbox-wrapper">
                            {this.props.roleList && this.props.roleList.map(item => {
                                return <Checkbox
                                    value={item.roleId}
                                    key={item.roleId}
                                    className="role-checkbox">{item.roleName}</Checkbox>;
                            })}
                        </Checkbox.Group>
                    )}
                </Form.Item>}
            </Form>
        )
    }
}

const WrapperAddUserGroupForm = Form.create()(AddUserGroupForm);

export default class AddUserGroupFormM extends Component {
    state = {
        members: []
    }

    saveAddFormRef = formRef => {
        this.formRef = formRef;
    }

    handleSubmit = () => {
        let me = this;
        const {validateFields, getFieldsValue} = me.formRef.props.form;

        validateFields((err, values) => {
            if (!err) {
                let data = getFieldsValue();
                let members = [];
                this.state.members.forEach(member => {
                    members.push({
                        userId: member.userId,
                        userName: member.userName
                    });
                });

                let rolesArr = [];
                if (data.roles && data.roles.length) {
                    let newRoles = this.props.roleList.filter(role => (
                        data.roles.indexOf(role.roleId) !== -1
                    ));

                    newRoles.forEach(item => {
                        rolesArr.push({
                            roleId: item.roleId,
                            roleName: item.roleName
                        });
                    });
                }
                this.props.onSubmit({
                    groupName: data.groupName,
                    roles: rolesArr,
                    members: members
                });
            }
        });

    }

    handleSearchSelect = value => {
        let members = this.state.members;

        if (members.length && members.some(member => (member.userId === value.key))) {
            Modal.warning({
                title: "已有该组成员"
            });
            return;
        }

        members.push({
            userId: value.key,
            userName: value.label
        });

        this.setState({
            members
        });

    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                title="添加用户组"
                onOk={this.handleSubmit}
                onCancel={this.props.onCancel}
                cancelText='取消'
                okText='确认'
                className="addUserGroupForm-wrapper">
                <WrapperAddUserGroupForm
                    wrappedComponentRef={this.saveAddFormRef}
                    roleList={this.props.roleList}/>
                <div className="search-area">
                    <p>添加组成员</p>
                    <SearchUser
                        onSelect={this.handleSearchSelect}
                        userList={this.props.userList}
                        onSearch={this.props.handleSearch}
                        />
                </div>
                <div className="members-area">
                    {this.state.members && this.state.members.map(member => (
                        <span key={member.userId}>{member.userName}
                            <Icon type="close" theme="outlined" onClick={
                                e => {
                                    let members = this.state.members;
                                    let newMembers = members.filter(item => item.userId !== member.userId);
                                    this.setState({
                                        members: newMembers
                                    })
                                }
                            }/>
                        </span>
                    ))}
                </div>
            </Modal>
        )
    }
}
