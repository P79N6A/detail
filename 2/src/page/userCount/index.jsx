/**
 * @file 用户账号管理页面
 * @author chenling
 */
import React from 'react';
import {Popover} from 'antd';
import Layout from '../../common/components/layout/index.jsx';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from './action';
import AddUserCount from './components/addUserCount.jsx';
import SetCount from './components/setCount.jsx';
import SetRole from './components/setRole.jsx';
import './index.less';
class UserCount extends React.Component {

    state = {
        addUserCountVisible: false,
        setCountVisible: false,
        setRoleVisible: false,
        value: '',
        userRoleList: []
    }

    componentDidMount() {
        this.getUserCountList();
    }

    getUserCountList = () => {
        this.props.actions.getUserCountList({
            key: '',
            currentPage: 1,
            pageSize: 20
        });
    }

    handleChangePage = page => {
        if (page.current && page.pageSize) {
            this.props.actions.getUserCountList({
                currentPage: page.current || 1,
                pageSize: page.pageSize || 20,
                key: this.state.value
            });
        }
    }

    handleSearch = value => {
        this.setState({
            value,
            current: 1
        }, () => {
            this.props.actions.getUserCountList({
                key: value,
                currentPage: 1,
                pageSize: 20
            });
        });
    }

    handleShowModal = record => {
        record && record.userId && this.props.actions.userCountId(record.userId);
        record && record.userName && this.props.actions.userCountName(record.userName);
    }

    handleCloseModal = type => {
        this.setState({
            [type]: false
        });
    }

    handleFormatRoles = data => {
        let roleList = [];
        Array.isArray(data) && data.forEach(item => {
            if (item.group) {
                item.roleName = item.roleName + '(组)';
            }
            item.roleName && roleList.push(item.roleName);
        });
        return roleList.join(', ');
    }

    handleAddUser = () => {
        this.props.actions.getAllRoles(res => {
            if (res && res.data && res.data.ret === 'SUCCESS') {
                this.setState({
                    addUserCountVisible: true
                });
            }
        });
    }

    handleSetCount = (record, canSetCount) => {
        if (canSetCount !== 2) {
            return;
        }
        record && record.userId && this.props.actions.userCountDetail({
            userId: record.userId
        }, res => {
            if (res && res.data && res.data.ret === 'SUCCESS') {
                this.setState({
                    setCountVisible: true
                });
                this.handleShowModal(record);
            }
        });
    }

    handleSetRole = (record, canSetRole) => {
        if (canSetRole !== 2) {
            return;
        }
        record && record.userId && this.props.actions.getUserRoleList({
            userId: record.userId
        }, res => {
            if (res && res.data && res.data.ret === 'SUCCESS') {
                this.setState({
                    setRoleVisible: true,
                    userRoleList: res.data.content
                }, () => {
                    this.handleShowModal(record);
                });
            }
        });
    }

    render() {
        let {userCountList, pagePermissionInfo} = this.props;

        // 节点权限判断
        let pagePermissionInfos = pagePermissionInfo && pagePermissionInfo.find(item =>
            (item.pageCode === 'userManager-userCount'));

        pagePermissionInfos = pagePermissionInfos ? pagePermissionInfos.children : null;

        const canAdd = pagePermissionInfos && pagePermissionInfos.find(item =>
            (item.pageCode === 'userManager-userCount-add')).operation;
        const canSetCount = pagePermissionInfos && pagePermissionInfos.find(item =>
            (item.pageCode === 'userManager-userCount-setCount')).operation;
        const canSetRole = pagePermissionInfos && pagePermissionInfos.find(item =>
            (item.pageCode === 'userManager-userCount-setRole')).operation;

        // 表头数据
        const columns = [{
                title: '用户姓名',
                dataIndex: 'userName',
                key: 'userName',
                width: '10%'
            },
            {
                title: '电话',
                dataIndex: 'phone',
                key: 'phone',
                width: '12%'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                key: 'email',
                width: '12%'
            },
            {
                title: '业务分组',
                dataIndex: 'spaceList',
                key: 'spaceList',
                width: '10%',
                render: record => {
                    if (record.join(', ').length > 6) {
                        return (
                            <Popover content={record.join(', ')}>
                                <span className="user-role">{record.join(', ').substr(0, 6) + '...'}</span>
                            </Popover>
                        );
                    }
                    else {
                        return (<span>{record}</span>);
                    }
                }
            },
            {
                title: '角色',
                dataIndex: 'roleList',
                key: 'roleList',
                width: '10%',
                render: record => {
                    let roleList = this.handleFormatRoles(record);
                    if (roleList.length > 6) {
                        return (
                            <Popover content={roleList}>
                                <span className="user-role">{roleList.substr(0, 6) + '...'}</span>
                            </Popover>
                        );
                    }
                    else {
                        return (
                            <span>{roleList}</span>
                        );
                    }
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: '6%'
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key: 'handle',
                render: (text, record) => {
                    return (
                        <div>
                            <a
                                style={{display: 'block'}}
                                onClick={this.handleSetCount.bind(this, record, canSetCount)}
                                disabled = {canSetCount !== 2 ? true : false}
                            >
                                账号设置
                            </a>
                            <a
                                style={{display: 'block'}}
                                onClick={this.handleSetRole.bind(this, record, canSetRole)}
                                disabled = {canSetRole !== 2 ? true : false}
                            >
                                角色设置
                            </a>
                        </div>
                    );
                },
                width: '10%'
            }
        ];

        // 弹窗
        let AddUserCountTpl = (
            this.state.addUserCountVisible
            ? <AddUserCount
                isShow = {this.state.addUserCountVisible}
                handleCloseModal = {this.handleCloseModal.bind(this, 'addUserCountVisible')}
            />
            : null
        );

        let SetCountTpl = (
            this.state.setCountVisible
            ? <SetCount
                isShow = {this.state.setCountVisible}
                handleCloseModal = {this.handleCloseModal.bind(this, 'setCountVisible')}
            />
            : null
        );

        let SetRoleTpl = (
            this.state.setRoleVisible
            ? <SetRole
                isShow = {this.state.setRoleVisible}
                data = {this.state.userRoleList}
                handleCloseModal = {this.handleCloseModal.bind(this, 'setRoleVisible')}
            />
            : null
        );

        return (
            <div className="page-user-count">
                <Layout
                    baseConfig={{
                        button: true,
                        buttonText: '添加用户',
                        serialNumber: true,
                        titleText: '用户列表'}}
                    search = {true}
                    placeholder="输入用户姓名"
                    onSearch = {this.handleSearch}
                    addButtonClick = {this.handleAddUser}
                    buttonDisable = {canAdd === 2 ? false : true}
                    dataSource = {userCountList.pageContent ? userCountList.pageContent : []}
                    columns = {columns}
                    pagination = {{total: userCountList.totalCount,
                        current: this.props.pagination.currentPage,
                        pageSize: 20}}
                    onChangePage = {this.handleChangePage}
                />
                <div >
                    {AddUserCountTpl}
                    {SetCountTpl}
                    {SetRoleTpl}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    let {userCountList, pagination} = state.userCount;
    let pagePermissionInfo = state.menus.pagePermissionInfo;
    return {userCountList, pagePermissionInfo, pagination};
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserCount);
