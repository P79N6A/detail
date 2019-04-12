/**
 * @file EPTemplateConfigList.jsx 端点模板列表
 * @author lujunhao@baidu.com
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import style from './EPTemplateConfigList.useable.less';
import PointListHearder from '../../components/pointListHearder/pointListHearder';
import {Table, notification, Tooltip, Icon} from 'antd';
import {getEndPointConfigList, deleteEndPointConfigList} from '../../api/api';
import {Link} from 'react-router-dom';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import common from '../../components/common/common';

class EPTemplateConfigList extends Component {
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
            pageNo: 1
        };
    }
    componentDidMount() {
        style.use();
        this.initData();
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
        this.getList({
            pageSize,
            pageNo: current,
            orderByKey: sorter.columnKey || null,
            order: sorter.order ? sorter.order.replace('end', '') : null,
            endpointConfigName: this.pageData.searchValue
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

    getList(params) {
        this.setState({
            loading: true
        });
        getEndPointConfigList({
            ...params
        }).then(data => {
            if (data) {
                let list = data.endpointConfigList;
                // 增加每列的key
                list.forEach((element, index) => {
                    element.key = 'ep-template' + index;
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
                }
            }
            // if (data) {
            //     console.log(data);
            //     let modelList = data.modelList;
            //     if (modelList) {
            //         // 增加每列的key
            //         modelList.forEach((element, index) => {
            //             element.key = index;
            //         });
            //         // 保存翻页信息，更新数据
            //         this.setState({
            //             modelList: data.modelList,
            //             loading: false,
            //             pagination: {
            //                 total: data.paginator.items,
            //                 pageSize: params.pageSize ? params.pageSize : this.state.pagination.pageSize
            //             }
            //         });
            //     }
            // }
        }).catch(error => {
            common.getErrorMsg(error || '获取数据失败，请稍候再试');
            this.setState({
                loading: false
            });
        });
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
            endpointConfigName: value
        });
        this.pageData.searchValue = value;
        this.setState({
            sortedInfo: null
        });
    }

    // 删除端点
    deleteEPTemplate(endpointConfigId) {
        deleteEndPointConfigList({
            endpointConfigId
        }).then(data => {
            notification.success({
                placement: 'bottomRight',
                bottom: 50,
                duration: 2,
                message: '操作成功',
                description: '端点模板已删除'
            });
            this.getList({
                pageSize: this.pageData.pageSize,
                pageNo: this.pageData.current
            });
        }).catch(error => {
            common.getErrorMsg(error || '获取数据失败，请稍候再试');
            this.setState({
                loading: false
            });
        });
    }
    onCopy = () => {
        notification.success({
            placement: 'topRight',
            bottom: 50,
            duration: 2,
            message: '复制成功'
        });
    }

    // 编辑端点模版
    editEPTemplate(endpointConfigId) {
        this.props.history.push(`/edit-ep-template?endpointConfigId=${endpointConfigId}`);
    }

    // 新建端点
    createEndpoint(endpointConfigId) {
        this.props.history.push(`/new-endpoint?endpointConfigId=${endpointConfigId}&origin=template`);
    }
    newCommand = () => {
        this.props.history.push('/new-ep-template');
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
                title: '端点模板名称/ID',
                dataIndex: 'endpointConfigName',
                key: 'endpointConfigName',
                sorter: true,
                sortOrder: sortedInfo.columnKey === 'endpointConfigName' && sortedInfo.order,
                render: (text, record) => {
                    return {
                        children: <div>
                            <Link to={`/edit-ep-template?endpointConfigId=${record.endpointConfigId}`}>{text}</Link>
                            <div>{record.endpointConfigId}
                                <CopyToClipboard text={record.endpointConfigId} onCopy={this.onCopy}>
                                    <Tooltip title="复制到剪切板">
                                        <span className="copy"><Icon type="copy" /></span>
                                    </Tooltip>
                                </CopyToClipboard>
                            </div>
                        </div>
                    };
                }
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                sorter: true,
                sortOrder: sortedInfo.columnKey === 'createTime' && sortedInfo.order
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <span className="mr10"><a href="javascript:;"
                                onClick={() => this.createEndpoint(record.endpointConfigId)}
                               >新建端点</a>
                        </span>
                        <span className="mr10"><a href="javascript:;"
                                onClick={() => this.editEPTemplate(record.endpointConfigId)}
                                >编辑</a>
                        </span>
                        <span className="mr10"><a href="javascript:;"
                                onClick={() => this.deleteEPTemplate(record.endpointConfigId)}>删除</a>
                        </span>
                    </span>
                )
            }
        ];
        return (
            <div id="listContent">
                <PointListHearder search={value => this.search(value)}
                    refresh={() => this.refresh()}
                    onSearch={value => this.search(value)}
                    headerName="端点模板"
                    newHeaderName="新建端点模板"
                    value={this.state.searchValue}
                    searchChange={this.searchChange}
                    newCommand={this.newCommand}
                    placeholderName="请输入端点模板名称进行搜索"
                />
                <Table
                    loading={this.state.loading}
                    dataSource={this.state.list}
                    columns={columns}
                    pagination={this.state.pagination}
                    onChange={(page, filters, sorter) => this.changePage(page, filters, sorter)}/>
            </div>);
    }
}

export default withRouter(EPTemplateConfigList);
