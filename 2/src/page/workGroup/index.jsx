/**
 * @file 业务分组管理
 * @author chenling
 */
import React from 'react';
import {Popover} from 'antd';
import Layout from '../../common/components/layout/index.jsx';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from './action';
import AddGroup from './components/addGroup.jsx';
import EditGroup from './components/editGroup.jsx';
import ViewGroup from './components/viewGroup.jsx';
import EditMembers from './components/editMembers.jsx';
import './index.less';
class WorkGroup extends React.Component {

    state = {
        addGroupVisible: false,
        editGroupVisible: false,
        viewGroupVisible: false,
        editMembersVisible: false,
        value: ''
    }

    componentDidMount() {
        this.getSpaceList();
        this.props.actions.getHmsUserList();
    }

    getSpaceList = () => {
        this.props.actions.spaceList({
            key: '',
            currentPage: 1,
            pageSize: 20
        });
    }

    handleSearch = value => {
        this.setState({
            value
        }, () => {
            this.props.actions.spaceList({
                key: value,
                currentPage: 1,
                pageSize: 20
            });
        });
    }

    handleChangePage = page => {
        this.props.actions.spaceList({
            key: this.state.value,
            currentPage: page.current,
            pageSize: page.pageSize || 20
        });
    }

    handleShowModal = (type, record) => {
        this.setState({
            [type]: true
        });
        record && record.spaceId && this.props.actions.spaceId(record.spaceId);
    }

    handleCloseModal = type => {
        this.setState({
            [type]: false
        });
    }

    handleEditSpace = (record, canOperation) => {
        if (canOperation !== 2) {
            return;
        }
        record && record.spaceId && this.props.actions.spaceDetail({
            spaceId: record.spaceId
        }, res => {
            if (res && res.data && res.data.ret === 'SUCCESS') {
                this.setState({
                    editGroupVisible: true
                });
                this.handleShowModal('editGroupVisible', record);
            }
        });
    }

    handleEditMembers = (canSetMember, record) => {
        if (canSetMember === 0) {
            return;
        }
        let type;
        type = canSetMember === 1 ? 'viewGroupVisible' : 'editMembersVisible';
        record && record.spaceId && this.props.actions.spaceMembersDetail({
            spaceId: record.spaceId
        }, res => {
            if (res && res.data && res.data.ret === 'SUCCESS') {
                this.setState({
                    [type]: true
                });
                this.handleShowModal(type, record);
            }
        });
    }

    handleAddGroup = () => {
        this.handleShowModal('addGroupVisible');
    }

    render() {
        let {spaceList, pagePermissionInfo, pagination, hmsUserList} = this.props;

        // 节点权限判断
        let pagePermissionInfos = pagePermissionInfo && pagePermissionInfo.find(item =>
            (item.pageCode === 'userManager-workGroup'));

        pagePermissionInfos = pagePermissionInfos ? pagePermissionInfos.children : null;

        const canAdd = pagePermissionInfos && pagePermissionInfos.find(item =>
            (item.pageCode === 'userManager-workGroup-add')).operation;
        const canSetMember = pagePermissionInfos && pagePermissionInfos.find(item =>
            (item.pageCode === 'userManager-workGroup-setMembers')).operation;
        const canOperation = pagePermissionInfos && pagePermissionInfos.find(item =>
            (item.pageCode === 'userManager-workGroup-operation')).operation;

        // 表格头部数据
        const columns = [
            {
                title: '业务组名称',
                dataIndex: 'spaceName',
                key: 'spaceName',
                width: '15%'
            },
            {
                title: '业务组描述',
                dataIndex: 'spaceDesc',
                key: 'spaceDesc',
                width: '15%',
                render: (text, record) => {
                    if (record.spaceDesc.length > 5) {
                        return (
                            <Popover content={record.spaceDesc}>
                                <span>{record.spaceDesc.substr(0, 5) + '...'}</span>
                            </Popover>
                        );
                    }
                    else {
                        return <span>{record.spaceDesc}</span>;
                    }
                }
            },
            {
                title: '组成员',
                dataIndex: 'spaceMember',
                key: 'spaceMember',
                render: (text, record) => (<a href="javascript:;"
                        onClick = {this.handleEditMembers.bind(this, canSetMember, record)}
                        disabled = {!record.isNormal || (canSetMember === 0 ? true : false)}
                        >
                        组成员配置</a>)
            },
            {
                title: '组状态',
                dataIndex: 'status',
                key: 'status'
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key: 'handle',
                render: (text, record) => {
                    return (
                        <div>
                            <a href="javascript:;"
                                onClick = {this.handleEditSpace.bind(this, record, canOperation)}
                                disabled = {canOperation !== 2 ? true : false}
                            >
                                配置
                            </a>
                        </div>
                    );
                }
            }

        ];

        if (this.props.userInfo && this.props.userInfo.userInfo.bankCode !== 'ABC') {
            columns.splice(2, 0, {
                title: '大数据平台用户',
                dataIndex: 'bigDataUser',
                key: 'bigDataUser'
            },
            {
                title: 'yarn Queue',
                dataIndex: 'yarnQueue',
                key: 'yarnQueue'
            });
        }

        // 弹窗
        let AddGroupTpl = (
            this.state.addGroupVisible
            ? <AddGroup
                isShow={this.state.addGroupVisible}
                hmsUserList={hmsUserList}
                handleCloseModal= {this.handleCloseModal.bind(this, 'addGroupVisible')}
            />
            : null
        );
        let EditGroupTpl = (
            this.state.editGroupVisible
            ? <EditGroup
                isShow={this.state.editGroupVisible}
                hmsUserList={hmsUserList}
                handleCloseModal= {this.handleCloseModal.bind(this, 'editGroupVisible')}
            />
            : null
        );
        let ViewGroupTpl = (
            this.state.viewGroupVisible
            ? <ViewGroup
                isShow={this.state.viewGroupVisible}
                handleCloseModal= {this.handleCloseModal.bind(this, 'viewGroupVisible')}
            />
            : null
        );
        let EditMembersTpl = (
            this.state.editMembersVisible
            ? <EditMembers
                isShow={this.state.editMembersVisible}
                handleCloseModal= {this.handleCloseModal.bind(this, 'editMembersVisible')}
            />
            : null
        );
        return (
            <div>
                 <Layout
                    baseConfig = {{
                        button: true,
                        buttonText: '添加分组',
                        titleText: '分组列表'}}
                    search = {canAdd === 2 ? true : false}
                    placeholder='输入业务组名称'
                    onSearch = {this.handleSearch}
                    columns = {columns}
                    dataSource = {spaceList && spaceList.pageContent}
                    addButtonClick = {this.handleAddGroup}
                    buttonDisable = {canAdd === 2 ? false : true}
                    pagination={{
                        total: spaceList && spaceList.totalCount,
                        pageSize: 20,
                        current: pagination.currentPage
                    }}
                    onChangePage= {this.handleChangePage}
                />
                <div>
                    {AddGroupTpl}
                    {EditGroupTpl}
                    {ViewGroupTpl}
                    {EditMembersTpl}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    let {spaceList, pagination, hmsUserList} = state.workGroup;
    let pagePermissionInfo = state.menus.pagePermissionInfo;
    let userInfo = state.userInfo;

    return {spaceList, pagePermissionInfo, pagination, hmsUserList, userInfo};
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(WorkGroup);
