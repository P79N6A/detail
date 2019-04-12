/**
 * @file 数据源管理页面
 * @author chenling
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from './actions';
import {Popover, Modal, Spin} from 'antd';
import Layout from '../../common/components/layout/index.jsx';
import DataSourceForm from './components/dataSourceForm.jsx';
import AccessPermission from './components/accessPermission.jsx';
import {status, type} from '../../conf/configParams';
import './index.less';
const confirm = Modal.confirm;
class DataSourceManage extends Component {
    state = {
        addVisible: false,
        editVisible: false,
        accessPermissionVisible: false,
        spaceRelationList: []
    }
    columns = [
        {
            title: '数据库地址',
            dataIndex: 'address',
            key: 'address'
        },
        {
            title: '数据库端口',
            dataIndex: 'port',
            key: 'port'
        },
        {
            title: '数据库类型',
            dataIndex: 'type',
            key: 'type',
            render: record => (<span>{this.findName(type, record)}</span>)
        },
        {
            title: '数据库名称',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: '数据库描述',
            dataIndex: 'desc',
            key: 'desc',
            render: record => {
                if (record.length < 10) {
                    return <span>{record}</span>;
                }
                else {
                    return <Popover content={record}>
                        <span>{record.slice(0, 9)}</span>
                    </Popover>;
                }
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'usernmae'
        },
        {
            title: '密码',
            dataIndex: 'password',
            key: 'password'
        },
        {
            title: '数据库访问权限',
            dataIndex: 'acess',
            key: 'acess',
            render: (record, text) => (<a href="javascript:;" onClick={this.handleAccessPermission.bind(this, text.dataSourceId)}>权限配置</a>)
        },
        {
            title: '操作',
            dataIndex: 'handle',
            key: 'handle',
            render: (record, text) => (
                <span>
                    <a onClick={this.handleEditDataSource.bind(this, text.dataSourceId)} style={{marginRight: '5px'}}>修改</a>
                    <a href="javascript:;" onClick={this.handleDeleteDataSource.bind(this, text.dataSourceId)}>删除</a>
                </span>
            )
        },
        {
            title: '连接状态',
            dataIndex: 'status',
            key: 'status',
            render: record => (<span>{this.findName(status, record)}</span>)
        }
    ];

    componentDidMount() {
        this.props.actions.getDataSourceList();
    }

    findName = (data, code) => {
        if (data) {
            let findObj = data.find(item => item.code === code);

            if (findObj) {
                return findObj.name;
            }
        }
    }

    handleCloseModal = type => {
        this.setState({
            [type]: false
        });
    }

    handleAddDataSource = () => {
        this.setState({
            addVisible: true
        });
    }

    handleEditDataSource = dataSourceId => {
        this.props.actions.getDataSourceDetail({dataSourceId},
            () => this.setState({
                editVisible: true
            })
        );
    }

    handleDeleteDataSource = dataSourceId => {
        confirm({
            title: '提示',
            content: '确定要删除么?',
            onOk: () => {
                this.props.actions.deleteDataSource({dataSourceId}, this.props.pagination);
            }
        });
    }

    handleAccessPermission = dataSourceId => {
        this.props.actions.getSpaceRelation({dataSourceId}, content => {
            if (content && content.data.ret === 'SUCCESS') {
                this.setState({
                    spaceRelationList: content.data.content,
                    accessPermissionVisible: true
                });
            }
        });
        this.props.actions.getDataSourceId(dataSourceId);
    }

    render() {
        let {endFetching, dataSourceList, dataSourceDetail, pagination} = this.props;

        return (
            <div>
                <Spin tip="加载中..." spinning={!endFetching}>
                    <Layout
                        baseConfig={{button: true,
                        buttonText: '添加数据库',
                        serialNumber: true,
                        titleText: '数据库资源池'}}
                        columns={this.columns}
                        dataSource={dataSourceList}
                        addButtonClick={this.handleAddDataSource}
                        pagination={{
                            total: dataSourceList && pagination.totalCount,
                            pageSize: 20,
                            current: pagination.currentPage,
                            onChange: (page, pageSize) => {
                                this.props.actions.getDataSourceList({
                                    currentPage: page
                                });
                            }
                        }}
                    />
                    {
                        this.state.addVisible && <DataSourceForm
                            type = "add"
                            visible={this.state.addVisible}
                            closeModal = {this.handleCloseModal.bind(this, 'addVisible')}
                        />
                    }
                    {
                        this.state.editVisible && <DataSourceForm
                            type="edit"
                            visible={this.state.editVisible}
                            data = {dataSourceDetail}
                            closeModal={this.handleCloseModal.bind(this, 'editVisible')}
                            pagination={pagination}
                        />
                    }
                    {
                        this.state.accessPermissionVisible && <AccessPermission
                            visible={this.state.accessPermissionVisible}
                            data={this.state.spaceRelationList}
                            closeModal={this.handleCloseModal.bind(this, 'accessPermissionVisible')}
                        />
                    }
                </Spin>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    endFetching: state.dataSource.endFetching,
    dataSourceList: state.dataSource.dataSourceList,
    dataSourceDetail: state.dataSource.dataSourceDetail,
    pagination: state.dataSource.pagination
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
export default connect(mapStateToProps, mapDispatchToProps)(DataSourceManage);
