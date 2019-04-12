/**
 * @file 角色管理入口
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from './actions';
import {Input, Table, Modal, Button, Select, Form} from 'antd';
import './index.less';
import AddUserGroupForm from './components/addUserGroupForm';
import SetMembersForm from './components/setMembersForm';
import SetRoleForm from './components/setRoleForm';
import SetStatusForm from './components/setStatusForm';
import RoleTab from '../../common/components/roleTab';

class RoleUserGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddModal: false,
            showRoleSetModal: false,
            showGroupMembersModal: false,
            showStatusSetModal: false
        }
    }

    componentDidMount() {
        this.props.actions.fetch();
    }

    showAddModal = () => {
        this.setState({
            showAddModal: true
        });

        this.props.actions.getRoleList();
    }

    showRoleSetModal = groupId => {
        this.groupId = groupId;
        this.setState({
            showRoleSetModal: true
        });
        this.props.actions.getRole(groupId);
    }

    showStatusSetModal = (groupDetail) => {
        this.groupDetail = groupDetail;
        this.setState({
            showStatusSetModal: true
        });

        this.props.actions.getStatus({
            groupId: groupDetail.groupId
        });
    }

    showGroupMembersModal = groupDetail => {
        this.groupDetail = groupDetail;
        this.setState({
            showGroupMembersModal: true
        });
        this.props.actions.getMembers({
            groupId: groupDetail.groupId
        });
    }

    submitAddForm = data => {
        this.props.actions.addUserGroup(data);
        this.setState({
            showAddModal: false
        });
    }

    submitRoleSet = data => {
        this.props.actions.setGroupRole({
            roles: data,
            groupId: this.groupId
        });
        this.setState({
            showRoleSetModal: false
        });
    }

    submitMembers = data => {
        this.props.actions.setGroupMembers(data);
        this.setState({
            showGroupMembersModal: false
        });
    }

    submitStatus = data => {
        this.props.actions.setGroupStatus(data);
        this.setState({
            showStatusSetModal: false
        });
    }

    handleSearch = value => {
        this.props.actions.getUserList({
            key: value
        });
    }

    render() {
        const roleUserGroup = this.props.roleUserGroup;
        roleUserGroup.list && roleUserGroup.list.forEach((item, index) => {
            return item.groupIndex = index + 1;
        });

        let pagePermissionInfo = this.props.pagePermissionInfo
            && this.props.pagePermissionInfo.find(
                item => (item.pageCode === 'userManager-roleManager'));

        pagePermissionInfo = pagePermissionInfo ? pagePermissionInfo.children : null;

        const canAdd = (pagePermissionInfo && pagePermissionInfo.find(item => (
            item.pageCode === 'userManager-roleManager-userGroup-add'
        )).operation);

        const setRoleOperation = (pagePermissionInfo && pagePermissionInfo.find(item => (
            item.pageCode === 'userManager-roleManager-userGroup-setRole'
        )).operation);

        const setMemberOperation = (pagePermissionInfo && pagePermissionInfo.find(item => (
            item.pageCode === 'userManager-roleManager-userGroup-setMembers'
        )).operation);

        const setStatusOperation = (pagePermissionInfo && pagePermissionInfo.find(item => (
            item.pageCode === 'userManager-roleManager-userGroup-setStatus'
        )).operation);

        const columns = [
            {
                title: '序号',
                dataIndex: 'groupIndex',
                key: 'groupIndex',
                align: 'center',
                width: 100
            },
            {
                title: '组名',
                dataIndex: 'groupName',
                key: 'groupName',
                align: 'center',
                width: 200
            },
            {
                title: '角色',
                key: 'roleSet',
                render: (text, record) => (<a
                    onClick={e => !(setRoleOperation === 0 || !record.isNormal)
                        && this.showRoleSetModal(record.groupId)}
                    disabled={setRoleOperation === 0 || !record.isNormal}>配置角色</a>),
                align: 'center'
            },
            {
                title: '用户组',
                key: 'groupSet',
                render: (text, record) => (<a
                    onClick={e => !(setMemberOperation === 0 || !record.isNormal)
                        && this.showGroupMembersModal(record)}
                    disabled={setMemberOperation === 0 || !record.isNormal}>组成员配置</a>),
                align: 'center'
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                align: 'center'
            },
            {
                title: '操作',
                key: 'operate',
                render: (text, record) => (<a href='javascript:void(0);'
                    onClick={e => setStatusOperation === 2 && this.showStatusSetModal(record)}
                    disabled={setStatusOperation !== 2}>配置</a>),
                align: 'center'
            }
        ];

        return (
            <div className='roleUserGroup-wrapper'>
                <RoleTab type="roleUserGroup"/>
                <div className='role-table-header'>
                    <Button type='primary' icon='plus' className='add-role'
                        onClick={this.showAddModal}
                        disabled={!canAdd}>新增用户组</Button>
                </div>
                {roleUserGroup.endFetching && <Table
                    columns={columns}
                    dataSource={roleUserGroup.list}
                    rowKey={record=> record.groupId}
                    pagination={false}
                    size='small'
                    />}
                {
                    this.state.showAddModal && <AddUserGroupForm
                        visible={this.state.showAddModal}
                        onCancel={e => {
                            this.setState({
                                showAddModal: false
                            });
                        }}
                        roleList={roleUserGroup.roleList}
                        onSubmit = {this.submitAddForm}
                        handleSearch={this.handleSearch}
                        userList={roleUserGroup.userList}
                        />
                }
                {this.state.showRoleSetModal && <SetRoleForm
                    visible={this.state.showRoleSetModal}
                    onCancel={e => {
                        this.setState({
                            showRoleSetModal: false
                        });
                    }}
                    role={roleUserGroup.role}
                    onSubmit = {this.submitRoleSet}
                    setRoleOperation={setRoleOperation}
                    />}
                {this.state.showGroupMembersModal && <SetMembersForm
                    visible={this.state.showGroupMembersModal}
                    onCancel={e => {
                        this.setState({
                            showGroupMembersModal: false
                        });
                    }}
                    onSubmit = {this.submitMembers}
                    groupDetail={this.groupDetail}
                    members={roleUserGroup.members}
                    handleSearch={this.handleSearch}
                    userList={roleUserGroup.userList}
                    setMemberOperation={setMemberOperation}
                    />}
                {this.state.showStatusSetModal && <SetStatusForm
                    visible={this.state.showStatusSetModal}
                    onCancel={e => {
                        this.setState({
                            showStatusSetModal: false
                        });
                    }}
                    onSubmit = {this.submitStatus}
                    statusDetail={roleUserGroup.statusDetail}
                    groupDetail={this.groupDetail}
                    />}
            </div>
        )
    }
}

const mapStateToProps = state => ({
    roleUserGroup: state.roleUserGroup,
    pagePermissionInfo: state.menus.pagePermissionInfo
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleUserGroup);
