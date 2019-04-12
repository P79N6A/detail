/**
 * @file 组成员配置
 * @author chenling
 */
import React from 'react';
import {Modal} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../action';
import Layout from '../../../common/components/layout/index.jsx';
import SearchUser from '../../../common/components/searchUser/index.jsx';
class EditMembers extends React.Component {

    state = {
        membersShowList: []
    }

    getUsersList = key => {
        key && this.props.actions.usersList({
            key
        });
    }

    handleHideModal = () => {
        this.props.handleCloseModal && this.props.handleCloseModal();
    }

    // 设置管理员
    handleSetAdmin = record => {
        if (record.admin === true) {
            return;
        }
        let index = record.key - 1;
        this.state.membersShowList[index].admin = true;
        this.setState({
            membersShowList: this.state.membersShowList
        });
    }
    // 取消设置管理员
    handleCancelSet = record => {
        if (record.admin === false) {
            return;
        }
        let index = record.key - 1;
        this.state.membersShowList[index].admin = false;
        this.setState({
            membersShowList: this.state.handleCancelSet
        });
    }
    // 删除某一项
    handleDeleteUsers = record => {
        let index = record.key - 1;
        this.state.membersShowList.splice(index, 1);
        this.setState({
            membersShowList: this.state.membersShowList
        });
    }
    // 添加组成员
    handleSelect = value => {
        // 如果是已经添加的，则不能再添加,通过id来判断
        let isExist = false;
        let userName = value && value.label;
        this.state.membersShowList.forEach(item => {
            if (item.userId === this.valueSwitchId(userName)) {
                isExist = true;
            }
        });
        if (isExist) {
            Modal.info({
                content: (<span>该成员已经存在,请重新选择</span>)
            });
            return;
        }
        else {
            userName && this.state.membersShowList.push({
                userId: this.valueSwitchId(userName),
                admin: false,
                userName
            });
            this.setState({
                membersShowList: this.state.membersShowList
            }, () => {
                this.scrollToEnd(('.page-edit-members .ant-table-content'), ('.page-edit-members .ant-table-body'));
            });
        }
    }
    
    handleSubmit = () => {
        let members = [];
        let admins = [];
        this.state.membersShowList.forEach(item => {
            members.push(item.userId);
            if (item.admin) {
                admins.push(item.userId);
            }
        });
        let params = {
            spaceId: this.props.spaceId,
            members,
            admins
        };
        this.props.actions.spaceMembersEdit(params, this.props.pagination);
        this.props.handleCloseModal();
    }

    valueSwitchId = value => {
        let userId = null;
        if (value && this.props.userList) {
            this.props.userList.forEach(item => {
                if (value === item.userName) {
                    userId = item.userId;
                }
            });
            return userId;
        }
    }

    scrollToEnd = (outer, inner) => {
        let h = $(inner).height() - $(outer).height();
        $(outer).scrollTop(h);
    }

    render() {
        let columns = [
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName',
                width: '30%'
            },
            {
                title: '操作',
                dataIndex: 'handle',
                key: 'handle',
                width: '28%',
                render: (text, record) => (
                    <div>
                        <span
                            onClick={this.handleSetAdmin.bind(this, record)}
                            className = {record.admin ? 'page-color-black' : 'page-color-blue'}
                        >
                            {record.admin ? '管理员' : '设置为管理员'}
                        </span>
                        <span className="page-table-interval"></span>
                        <span
                            onClick={this.handleCancelSet.bind(this, record)}
                            className = {record.admin ? 'page-color-blue' : 'page-color-gray'}
                        >
                            取消
                        </span>
                        <span className="page-table-interval"></span>
                        <a href="javascript:;" onClick={this.handleDeleteUsers.bind(this, record)}>删除</a>
                    </div>
                )
            }
        ];
        this.state.membersShowList = this.props.spaceMembers;
        return (
            <Modal
                title = "组成员配置"
                visible = {this.props.isShow}
                onCancel = {this.handleHideModal}
                onOk = {this.handleSubmit}
                okText = "确认"
                cancelText = "取消"
            >
                <div className = "page-edit-members">
                    <Layout
                        baseConfig = {{serialNumber: true}}
                        columns={columns}
                        dataSource={this.state.membersShowList}
                    />
                    <div className="page-edit-members-add">
                        <span>添加组成员</span>
                        <SearchUser
                            userList = {this.props.userList}
                            onSearch = {this.getUsersList}
                            onSelect = {this.handleSelect}
                        />
                    </div>
                </div>
            </Modal>
        );
    }
}


const mapStateToProps =  state => {
    let {spaceId, spaceMembers, userList, pagination} = state.workGroup;
    return {spaceId, spaceMembers, userList, pagination};
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(EditMembers);
