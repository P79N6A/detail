/**
 * @file extendModal.jsx 模态框
 * @author v_changrenjie@baidu.com
 */
import {Table, Modal, message} from 'antd';
import React, {Component} from 'react';
import style from './extendModal.useable.less';
import * as api from '../../api/api';

export default class ExtendModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            endpointConfigId: null,
            list: [],
            selectedRowKeys: null,
            pagination: {
                showSizeChanger: true,
                pageSize: 20,
                total: 0,
                defaultCurrent: 1,
                current: 1,
                showQuickJumper: true
            }
        };
        this.pageData = {
            pageSize: 20,
            pageNo: 1
        };
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        this.getEPConfigList({...this.pageData});
    }

    // 获取端点模板列表
    getEPConfigList = params => {
        api.getEndPointConfigList(params).then(data => {
            let list = data.endpointConfigList;
            // 增加每列的key
            list.forEach((element, index) => {
                element.key = 'ep-template' + index;
            });
            if (Array.isArray(list)) {
                this.setState({
                    loading: false,
                    list,
                    selectedRowKeys: list[0].endpointConfigId,
                    endpointConfigId: list[0].endpointConfigId,
                    pagination: {
                        total: data.totalCount,
                        pageSize: params.pageSize ? params.pageSize : this.state.pagination.pageSize,
                        current: params.pageNo ? params.pageNo : this.state.pagination.current
                    }
                });
            }
        });
    };

    handleCancel =() => {
        this.props.callbackCancel();
    };

    handleOk = () => {
        let endpointConfigId = this.state.endpointConfigId;
        if (!endpointConfigId) {
            message.warning('请选择端点模板');
            return;
        }
        this.props.callbackHandleOk(endpointConfigId);
    };

    // 列表行选中回调
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            endpointConfigId: selectedRows[0].endpointConfigId,
            selectedRowKeys
        });
    };

    // 分页
    changePage = page => {
        let {pageSize, current} = page;
        this.pageData.pageNo = current;
        this.pageData.pageSize = pageSize;
        this.getEPConfigList({
            pageSize,
            pageNo: current
        });
    };

    render() {
        const {selectedRowKeys} = this.state;
        let columns = [
            {
                title: '端点模板名称',
                dataIndex: 'endpointConfigName',
                key: 'endpointConfigName'
            }, {
                title: 'ID',
                dataIndex: 'endpointConfigId',
                key: 'endpointConfigId'
            }, {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime'
            }
        ];
        const rowSelection = {
            type: 'radio',
            onChange: this.onSelectChange,
            selectedRowKeys: selectedRowKeys
        };
        const content = <section >
            <Modal id="Modals"
                title="更换端点模板"
                visible={this.props.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                >
                <p className="warm-prompt">温馨提示：更换端点模板将全部替换现有模板配置，重新分配资源，此操作不可撤销。</p>
                <p>请选择要更新的端点模板：</p>
                <Table
                    columns={columns}
                    rowKey={record => record.endpointConfigId}
                    rowSelection={rowSelection}
                    dataSource={this.state.list}
                    scroll={{y: 200}}
                    pagination={this.state.pagination}
                    onChange={page => this.changePage(page)}
                />
            </Modal>
        </section>;

        return <div className="modalContainer">
            {content}
        </div>;
    }
}

