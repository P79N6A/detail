/**
 * @file 添加角色
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Input, Table, Modal, Button, Select, Form, Checkbox} from 'antd';
import SearchUser from '../../../common/components/searchUser/index.jsx';

export default class SetMembersForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: null
        }
    }

    componentWillReceiveProps (nextProps) {
        const me = this;
        if (nextProps.members !== me.props.members) {
            this.setState({
                members: nextProps.members
            });
        }
    }

    handleSubmit = () => {
        let members = this.state.members;

        this.props.onSubmit({
            groupId: this.props.groupDetail.groupId,
            groupName: this.props.groupDetail.groupName,
            members
        });
    }

    handleDelete = userId => {
        let newMembers = this.state.members.filter(member => (
            member.userId !== userId
        ));

        this.setState({
            members: newMembers
        });
    }

    scrollToEnd = (outer, inner) => {
        var h = $(inner).height() - $(outer).height();

        $(outer).scrollTop(h);
    }

    handleSearchSelect = value => {
        let members = this.state.members;

        if (members.some(member => (member.userId == value.key))) {
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
        }, () => this.scrollToEnd('.table-area', '.members-table'));


    }

    render() {
        const columns = [
            {
                title: '用户ID',
                key: 'id',
                dataIndex: 'userId'
            },
            {
                title: '用户组',
                key: 'groupName',
                render: () => (<span>{this.props.groupDetail.groupName}</span>)
            },
            {
                title: '成员',
                dataIndex: 'userName',
                key: 'userId'
            },
            {
                title: '操作',
                key: 'operate',
                render: (text, record) => (<a href='javascript:void(0);'
                    onClick={e => this.props.setMemberOperation !== 1 && this.handleDelete(record.userId)}
                    disabled={this.props.setMemberOperation === 1}>删除</a>)
            }
        ];

        return (
            <Modal
                visible={this.props.visible}
                title="组成员配置"
                onOk={this.handleSubmit}
                onCancel={this.props.onCancel}
                cancelText='取消'
                okText='确认'
                className="setMembersForm-wrapper"
                okButtonProps={{
                    disabled: this.props.setMemberOperation === 1
                }}>
                <div className="table-area">
                    <Table
                        columns={columns}
                        dataSource={this.state.members}
                        rowKey={record=> record.userId}
                        pagination={false}
                        className="members-table"
                        size="small"
                        />
                </div>
                {this.props.setMemberOperation !== 1
                    && <div className="search-area">
                        <span>添加组成员</span>
                        <SearchUser
                            onSelect={this.handleSearchSelect}
                            userList={this.props.userList}
                            onSearch={this.props.handleSearch}/>
                    </div>}
            </Modal>
        )
    }
}
