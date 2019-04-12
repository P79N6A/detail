/**
 * @file 角色管理入口
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from './actions';
import {Input, Button, Select, Tabs, Icon, Table, Modal} from 'antd';
import QueryForm from './components/queryForm';
import {statusList, bizTypeList, approvalResult} from '../../conf/configParams';
import './index.less';
const TabPane = Tabs.TabPane;
const myAppro = 'myAppro';
const mySubmit = 'mySubmit';
const queryAppro = 'queryAppro';

class ApprovalList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showHistoryModal: false
        }
    }

    componentDidMount() {
        this.props.actions.fetch();
    }

    handleChange = type => {
        this.handleRequestList(type);
    }

    handleRequestList = (type, data) => {
        switch (type) {
            case myAppro:
                this.props.actions.fetch(data);
                break;
            case mySubmit:
                this.props.actions.queryByUser(data);
                break;
            case queryAppro:
                this.props.actions.query(data);
                break;
            default:
                return;
        }
    }

    queryHistory = id => {
        this.props.actions.queryHistory({
            taskId: id
        });
        this.setState({
            showHistoryModal: true
        });
    }

    getStatus = status => {
        let statusItem = statusList.find(item => (item.no === status));
        return statusItem ? statusItem.name : '未知状态';
    }

    getResultName = no => {
        const result = approvalResult.find(result => result.no === no);
        return result ? result.name : '未定义';
    }

    submitAppro = (data, type) => {
        this.props.actions.submitAppro({
            taskId: data.taskId,
            activityId: data.activityId,
            approvalResult: type,
            approvalPerson: this.props.userInfo.userName,
            approvalTime: new Date().getTime()
        });
    }

    submitQueryAppro = (data, callback) => {
        this.queryData = data;
        this.props.actions.query(data, callback);
    }

    cancelAppro = taskId => {
        this.props.actions.cancelAppro({
            taskId,
            cancelPerson: this.props.userInfo.userName,
            cancelTime: new Date().getTime()
        });
    }

    renderTable = (key, data) => {
        const columns = [
            {
                title: 'ID',
                dataIndex: 'taskId',
                key: 'taskId',
                align: 'center',
                width: 110
            },
            {
                title: '类型',
                key: 'bizType',
                render: (record) => {
                    let type = bizTypeList.find(item => (item.type === record.bizType));
                    return type ? type.name : '未知类型';
                },
                align: 'center',
                width: 80
            },
            {
                title: '审批对象',
                key: 'acName',
                render: (record) => {
                    return (<a href={record.acUrl} target='_blank'>{record.acName}</a>);
                },
                align: 'center'
            },
            {
                title: '提交人',
                dataIndex: 'submitPerson',
                key: 'submitPerson',
                align: 'center',
                width: 80
            },
            {
                title: '提交时间',
                dataIndex: 'submitTime',
                key: 'submitTime',
                align: 'center',
                width: 100
            },
            {
                title: '待处理环节',
                dataIndex: 'todoActivity',
                key: 'todoActivity',
                align: 'center'
            },
            {
                title: '历史处理记录',
                key: 'roleName',
                render: (record) => {
                    return (<a href='javascript:void(0);' onClick={e => this.queryHistory(record.taskId)}>历史处理记录</a>)
                },
                align: 'center',
                width: 110
            },
            {
                title: '状态',
                key: 'status',
                render: record => {
                    return this.getStatus(record.status);
                },
                align: 'center',
                width: 80
            },
            {
                title: '操作',
                key: 'operate',
                render: (text, record) => {
                    if (key === myAppro) {
                        return <span>
                            <a
                                href='javascript:void(0);'
                                onClick={e => this.submitAppro(record, 1)}>通过</a>
                            <a
                                href='javascript:void(0);'
                                onClick={e => this.submitAppro(record, 2)}
                                style={{marginLeft: '10px'}}>拒绝</a>
                        </span>
                    } else if (key === mySubmit) {
                        return (<a
                            href='javascript:void(0);'
                            onClick={e => this.cancelAppro(record.taskId)}
                            disabled={this.getStatus(record.status) !== '运行中'}>撤销</a>);
                    } else {
                        return '--'
                    }
                },
                align: 'center',
                width: 100
            }
        ];
        return (
            <Table
                columns={columns}
                dataSource={data}
                rowKey={record=> record.taskId}
                size="small"
                pagination={
                    {
                        defaultCurrent: 1,
                        total: this.props.approvalList.totalCount,
                        pageSize: 20,
                        onChange: (page, pageSize) => {
                            let data = {
                                currentPage: page,
                                pageSize
                            };

                            if (this.queryData) {
                                Object.assign(data, this.queryData);
                            }

                            this.handleRequestList(key, data);
                        }
                    }
                }
                />
        )
    }


    render() {
        const approvalList = this.props.approvalList;

        return (
            <div className="approvalList-wrapper">
                <Tabs className='setApproval-wrapper' defaultActiveKey={myAppro} onChange={this.handleChange}>
                    <TabPane tab="待我审批" key={myAppro}>
                        {this.renderTable(myAppro, approvalList.queryByStatus)}
                    </TabPane>
                    <TabPane tab="我提交的" key={mySubmit}>
                        {this.renderTable(mySubmit, approvalList.queryByUser)}
                    </TabPane>
                    <TabPane tab="审计查询" key={queryAppro}>
                        <QueryForm statusList={statusList}
                            bizTypeList={bizTypeList}
                            onSubmit={this.submitQueryAppro}/>
                        {this.renderTable(queryAppro, approvalList.queryList)}
                    </TabPane>
                </Tabs>
                <Modal
                    visible={this.state.showHistoryModal}
                    onCancel={e => {
                        this.setState({
                            showHistoryModal: false
                        });
                    }}
                    footer={null}
                    title='历史处理记录'>
                    <div className='approvalList-history-wrap'>
                        {approvalList.queryHistory ? approvalList.queryHistory.map((item, index) => (
                            <p key={index}>
                                {item.approvalTime}，
                                {item.approvalPerson}&nbsp;
                                {item.activityName}{this.getResultName(item.approvalResult)}
                            </p>
                        )) : <p className="no-prompt">暂无历史处理记录</p>}
                    </div>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    approvalList: state.approvalList,
    userInfo: state.userInfo.userInfo
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ApprovalList);
