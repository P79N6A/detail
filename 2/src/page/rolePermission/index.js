/**
 * @file 角色管理入口
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from './actions';
import {Input, Table, Modal, Button, Select, Form, Popover} from 'antd';
import './index.less';
import AddRoleForm from './components/addRoleForm';
import SetRoleForm from './components/setRoleForm-1';
import RoleTab from '../../common/components/roleTab';

class RolePermission extends Component {
    key = null;
    pageSize = 20;

    state = {
        disabledSearchButton: false
    };

    handleSearchRole = value => {
        this.key = value;
        this.setState({
            disabledSearchButton: true
        });
        this.props.actions.fetch({
            pageSize: this.pageSize,
            currentPage: 1,
            key: value
        }, () => {
            this.setState({
                disabledSearchButton: false
            });
        });

        setTimeout(() => {
            this.setState({
                disabledSearchButton: false
            });
        }, 10000);
    }

    componentDidMount() {
        this.props.actions.fetch();
    }

    showAddModal = () => {
        this.props.actions.showAddModal();
    }

    handleAddCancel = () => {
        this.props.actions.hideAddModal();
    }

    handleAddRole = () => {
        let me = this;
        const {validateFields, getFieldsValue} = me.formRef.props.form;

        validateFields((err, values) => {
            if (!err) {
                me.props.actions.submitAddForm(getFieldsValue());
                this.props.actions.hideAddModal();
            }
        });
    }

    saveAddFormRef = formRef => {
        this.formRef = formRef;
    }

    showRoleSetModal = roleDetail => {
        this.props.actions.getRolePermissions(roleDetail.roleId);
        this.roleDetail = roleDetail;
    }

    handleRoleSetCancel = () => {
        this.props.actions.hideRoleSetModal();
    }

    submitRoleSet = data => {
        let roleId = this.roleDetail.roleId;
        let roleName = this.roleDetail.roleName;
        const currentPage  = this.props.rolePermission && this.props.rolePermission.currentPage;

        this.props.actions.submitSetForm({
            roleId,
            roleName,
            permissions: data
        }, {
            currentPage
        });

        this.handleRoleSetCancel();
    }

    render () {
        const rolePermission = this.props.rolePermission;

        rolePermission.list && rolePermission.list.forEach((item, index) => {
            item.roleIndex = (rolePermission.currentPage - 1) * this.pageSize + index + 1;
        });

        let pagePermissionInfo = this.props.pagePermissionInfo
            && this.props.pagePermissionInfo.find(
                item => (item.pageCode === 'userManager-roleManager'));

        pagePermissionInfo = pagePermissionInfo ? pagePermissionInfo.children : null;

        const canAdd = (pagePermissionInfo && pagePermissionInfo.find(item => (
            item.pageCode === 'userManager-rolePermission-add'
        )).operation);

        const setOperation = (pagePermissionInfo && pagePermissionInfo.find(item => (
            item.pageCode === 'userManager-rolePermission-setRole'
        )).operation);

        const columns = [
            {
                title: '序号',
                dataIndex: 'roleIndex',
                key: 'roleIndex',
                width: 100,
                align: 'center'
            },
            {
                title: '用户角色',
                dataIndex: 'roleName',
                key: 'roleName',
                width: 200,
                align: 'center'
            },
            {
                title: '权限范围',
                dataIndex: 'privileges',
                key: 'privileges',
                render: (text, record) => (<Popover
                    content={record.privileges.join('、')}>
                    <p className="show-area">{record.privileges.join('、')}</p>
                </Popover>),
                align: 'center',
                width: 500
            },
            {
                title: '操作',
                key: 'operate',
                render: (text, record) => (
                    <a href="javascript:void(0);"
                        onClick={e => setOperation !== 0 && this.showRoleSetModal(record)}
                        disabled={setOperation === 0}>权限设置
                    </a>
                ),
                align: 'center'
            }
        ];

        return (
            <div className="rolePermission-wrapper">
                <RoleTab type="rolePermission"/>
                <div className="role-table-header">
                    <Input.Search
                        placeholder="输入角色名称"
                        enterButton="搜索"
                        style={{width: 300}}
                        onSearch={this.handleSearchRole}
                        disabled={this.state.disabledSearchButton}/>
                    <Button
                        type="primary"
                        icon="plus"
                        className="add-role"
                        onClick={this.showAddModal}
                        disabled={!canAdd}>新增角色</Button>
                </div>
                {rolePermission.endFetching && <Table
                    columns={columns}
                    dataSource={rolePermission.list}
                    rowKey={record=> record.roleId}
                    size="small"
                    pagination={
                        {
                            defaultCurrent: 1,
                            total: rolePermission.totalCount,
                            pageSize: this.pageSize,
                            current: rolePermission.currentPage,
                            onChange: (page, pageSize) => {
                                this.props.actions.fetch({
                                    currentPage: page,
                                    pageSize,
                                    key: this.key
                                });
                            }
                        }
                    }
                    />}
                {
                    rolePermission.showAddModal && <AddRoleForm
                        wrappedComponentRef={this.saveAddFormRef}
                        visible={rolePermission.showAddModal}
                        onAddRole={this.handleAddRole}
                        onCancel={this.handleAddCancel}/>
                }
                {
                    rolePermission.showRoleSetModal
                    && rolePermission.roleDetail
                    && rolePermission.roleDetail.length
                    && <SetRoleForm
                        visible={rolePermission.showRoleSetModal}
                        onCancel={this.handleRoleSetCancel}
                        onSubmit = {this.submitRoleSet}
                        data={rolePermission.roleDetail}
                        setOperation={setOperation}/>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    rolePermission: state.rolePermission,
    pagePermissionInfo: state.menus.pagePermissionInfo
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RolePermission);
