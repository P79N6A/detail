/**
 * @file 查看
 * @author chenling
 */
import React from 'react';
import {Modal} from 'antd';
import {connect} from 'react-redux';
import Layout from '../../../common/components/layout/index.jsx';
import * as actions from '../action';
class ViewGroup extends React.Component {

    handleHideModal = () => {
        this.props.handleCloseModal && this.props.handleCloseModal();
    }
    
    render() {
        let columns = [
            {
                title: '用户ID',
                dataIndex: 'userId',
                key: 'userId'
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName'
            },
            {
                title: '组身份',
                dataIndex: 'admin',
                key: 'admin',
                render: (text, record) => (<span>{record.admin ? '管理员' : '普通用户'}</span>)
            }
        ];
        let {spaceMembers} = this.props;
        return (
            <Modal
                title="组成员"
                visible={this.props.isShow}
                footer={null}
                onCancel = {this.handleHideModal}
            >
                <div className="page-edit-members">
                    <Layout
                        baseConfig = {{serialNumber: true}}
                        columns = {columns}
                        dataSource = {spaceMembers}
                    />
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    spaceMembers: state.workGroup.spaceMembers,
    spaceId: state.workGroup.spaceId
});

const mapDispatchToProps = dispatch => ({
    spaceMembersDetail: params => dispatch(actions.spaceMembersDetail(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewGroup);

