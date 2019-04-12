/**
 * @file EPConfigList.jsx 端点列表
 * @author lujunhao@baidu.com
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import style from './EPConfigList.useable.less';
import PointListHearder from '../../components/pointListHearder/pointListHearder';
import EPStatus from '../../components/epStatus/epStatus';
import {Table, notification, Tooltip, Icon} from 'antd';
import {getEndPoint, deleteEndPoint, handelEndpointOper} from '../../api/api';
import {Link} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import common from '../../components/common/common';

const statuesMap = [
    {
        code: 0,
        statue: '创建中',
        oper: ['']
    },
    {
        code: 1,
        statue: '服务中',
        oper: [{
            update: '更新',
            stop: '停止'
        }]
    },
    {
        code: 2,
        statue: '创建失败',
        oper: [{
            restart: '重新创建',
            delete: '删除'
        }]
    },
    {
        code: 3,
        statue: '更新中',
        oper: []
    },
    {
        code: 4,
        statue: '更新失败',
        oper: [{
            rollback: '回滚',
            stop: '停止',
            retry: '重试'
        }]
    },
    {
        code: 5,
        statue: '回滚中',
        oper: []
    },
    {
        code: 6,
        statue: '删除中',
        oper: []
    },
    {
        code: 7,
        statue: '已删除',
        oper: []
    },
    {
        code: 8,
        statue: '已停止',
        oper: [{
            restart: '重新创建',
            delete: '删除'
        }]
    },
    {
        code: 9,
        statue: '删除失败',
        oper: [{
            delete: '删除'
        }]
    },
    {
        code: 10,
        statue: '回滚失败',
        oper: [{
            rollback: '回滚',
            stop: '停止'
        }]
    },
    {
        code: 11,
        statue: '停止中',
        oper: []
    },
    {
        code: 12,
        statue: '停止失败',
        oper: [{
            delete: '删除',
            stop: '停止'
        }]
    }
];

class EPConfigList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            list: [],
            orderByCreateTime: '',
            orderByName: '',
            pagination: {
                showSizeChanger: true,
                pageSize: 20,
                total: 0,
                defaultCurrent: 1,
                current: 1,
                showQuickJumper: true
            },
            sortedInfo: null,
            searchValue: null
        };
        this.pageData = {
            pageSize: 20,
            pageNo: 1,
            poller: null
        };
    }
    componentWillMount() {
        style.use();
        this.initData();
    }

    componentWillUnmount() {
        style.unuse();
        this.pageData.poller && clearTimeout(this.pageData.poller);
    }

    initData() {
        this.getList({
            pageSize: 10,
            pageNo: 1
        });
    }

    changePage(page, filters, sorter) {
        this.setState({
            sortedInfo: sorter
        });
        // let status = filters.status || this.state.statusFilter;
        // let modelSource = filters.modelSource || this.state.modelSource;
        // let orderByCreateTime = sorter.order ? sorter.order.replace('end', '') : this.state.orderByCreateTime;
        let {pageSize, current} = page;
        // this.setState({
        //     statusFilter: status,
        //     sourceFilter: modelSource,
        //     orderByCreateTime
        // });
        this.pageData.pageNo = current;
        this.pageData.pageSize = pageSize;
        clearTimeout(this.pageData.poller);
        this.getList({
            pageSize,
            pageNo: current,
            orderByKey: sorter.columnKey || null,
            order: sorter.order ? sorter.order.replace('end', '') : null,
            endpointName: this.pageData.searchValue
        });
        // this.getList({
        //     pageSize,
        //     currentPage: current,
        //     statusList: status,
        //     sourceList: modelSource,
        //     orderByCreateTime,
        //     // modelSource: '3',
        //     ...this.pageData.searchParms
        // });
    }

    getList(params, isShowloading = true) {
        clearTimeout(this.pageData.poller);
        let count;
        count = isShowloading ? 0 : 5000;
        this.pageData.poller = setTimeout(() => {
            this.setState({
                loading: isShowloading
            });
            getEndPoint({
                ...params
            }).then(data => {
                if (data) {
                    let list = data.endpointList;
                    // 增加每列的key
                    list.forEach((element, index) => {
                        element.key = 'ep' + index;
                    });
                    if (list) {
                        this.setState({
                            loading: false,
                            list,
                            pagination: {
                                total: data.totalCount,
                                pageSize: params.pageSize ? params.pageSize : this.state.pagination.pageSize,
                                current: params.pageNo ? params.pageNo : this.state.pagination.current
                            }
                        });
                        let isNeedPoll = list && list.some(cur => {
                            return [0, 3, 5, 6, 11].includes(cur.status);
                        });
                        if (isNeedPoll) {
                            this.getList(params, false);
                        }
                    }
                }
            }).catch(error => {
                common.getErrorMsg(error);
                this.setState({
                    loading: false
                });
            });
        }, count);
    }

    refresh() {
        this.getList({
            pageSize: 10,
            pageNo: 1
        });
        this.setState({
            sortedInfo: null,
            searchValue: null
        });
        this.pageData.searchValue = '';
    }

    search(value) {
        this.getList({
            pageSize: this.pageData.pageSize,
            pageNo: 1,
            endpointName: value
        });
        this.pageData.searchValue = value;
        this.setState({
            sortedInfo: null,
            searchValue: value
        });
    }

    // 删除端点
    handleDeleteModelConfig(endpointId) {
        deleteEndPoint({
            endpointId
        }).then(data => {
            notification.success({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作成功',
                description: '端点已删除'
            });
            this.getList({
                pageSize: this.pageData.pageSize,
                pageNo: this.pageData.current
            });
        }).catch(error => {
            common.getErrorMsg(error || '操作失败，请稍候再试');
            this.setState({
                loading: false
            });
        });
    }

    // 新建端点
    createEndpoint() {
        this.props.history.push('/new-endpoint?origin=endpoint');
    }

    // 编辑端点
    updateEndpoint(endpointId) {
        this.props.history.push(`/endpoint-compile?endpointId=${endpointId}`);
    }

    onCopy = () => {
        notification.success({
            placement: 'topRight',
            bottom: 50,
            duration: 2,
            message: '复制成功'
        });
    }
    // 处理端点操作
    handleEPOper(urlName, showName, params) {
        // update端点跳转至编辑页面
        if (urlName === 'update') {
            this.updateEndpoint(params.endpointId);
            return;
        }
        handelEndpointOper(urlName, params).then(data => {
            this.getList({
                pageSize: this.pageData.pageSize,
                pageNo: this.pageData.pageNo
            });
            notification.success({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作成功',
                description: `端点${showName}中`
            });
        }).catch(error => {
            notification.error({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作失败',
                description: `${error}`
            });
        });
    }
    searchChange = e => {
        this.setState({
            searchValue: e.target.value
        });
    }
    render() {
        let sortedInfo = this.state.sortedInfo || {};
        const columns = [
            {
                title: '端点名称/ID',
                dataIndex: 'endpointName',
                key: 'endpointName',
                sorter: true,
                sortOrder: sortedInfo.columnKey === 'endpointName' && sortedInfo.order,
                render: (text, record) => {
                    return {
                        children: <div>
                            <Link to={`/endpoint-compile?endpointId=${record.endpointId}`}>{text}</Link>
                            <div>{record.endpointId}
                                <CopyToClipboard text={record.endpointId} onCopy={this.onCopy}>
                                    <Tooltip title="复制到剪切板">
                                        <span className="copy"><Icon type="copy" /></span>
                                    </Tooltip>
                                </CopyToClipboard>
                            </div>
                        </div>
                    };
                }
            }, {
                title: '端点URL',
                dataIndex: 'entry',
                key: 'entry',
                width: 250,
                render: (text, record) => {
                    return {
                        children:
                            <div>
                                <div className="entryWrap">{record.entry}
                                </div>
                                <CopyToClipboard text={record.entry} onCopy={this.onCopy}>
                                    <Tooltip title="复制到剪切板">
                                        <span className="copy"><Icon type="copy" /></span>
                                    </Tooltip>
                                </CopyToClipboard>
                            </div>
                    };
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (text, record) => {
                    return <div>
                        <EPStatus status={record.status} text={statuesMap[record.status].statue}></EPStatus>
                        <div>更新时间：{record.modifyTime}</div>
                    </div>;
                }
            }, {
                title: '生成时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => (
                    statuesMap[record.status].oper.length ? statuesMap[record.status].oper.map(opers => {
                        let contentArray = [];
                        for (let key in opers) {
                            contentArray.push(<span key={key} className="mr10"><a
                            onClick={() => this.handleEPOper(key, opers[key], {endpointId: record.endpointId})}
                            >{opers[key]}</a></span>);
                        }
                        console.log(contentArray.length);
                        return contentArray.length ? contentArray : '--';
                    })
                        : <span>--</span>
                )
            }
        ];
        return (
            <div id="listContent">
                <PointListHearder search={value => this.search(value)}
                    refresh={() => this.refresh()}
                    onSearch={value => this.search(value)}
                    headerName="端点"
                    newHeaderName="新建端点"
                    value={this.state.searchValue}
                    searchChange={this.searchChange}
                    newCommand={() => this.createEndpoint()}
                    placeholderName="请输入端点名称进行搜索"
                />
                <Table
                    loading={this.state.loading}
                    dataSource={this.state.list}
                    columns={columns}
                    rowKey={record => record.endpointId}
                    pagination={this.state.pagination}
                    onChange={(page, filters, sorter) => this.changePage(page, filters, sorter)}/>
            </div>);
    }
}

export default withRouter(EPConfigList);
