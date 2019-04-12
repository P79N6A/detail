/**
 * @file 访问明细
 * @author chenling
 */
import React from 'react';
import {Table, Breadcrumb} from 'antd';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import './index.less';
class LogDetail extends React.Component {
    columns = [
        {
            dataIndex: 'createTime',
            key: 'createTime',
            title: '访问时间',
            align: 'center'
        },
        {
            dataIndex: 'createBy',
            key: 'createBy',
            title: '用户',
            align: 'center'
        },
        {
            dataIndex: 'operatContent',
            key: 'operatContent',
            title: '访问内容',
            align: 'center'
        }
    ];

    // 时间戳转化为时间格式
    stampToDate = data => {
        const date = new Date(data);
        const minutes = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes();
        const second = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds();
        return date.getHours() + ':' + minutes + ':' + second;
    }

    // 数据转化时间格式
    formatData = data => {
        Array.isArray(data) && data.forEach(item => {
            item.createTime = item.createTime && this.stampToDate(Number(item.createTime));
        });
        return data;
    }

    render() {
        let dataSource = this.props.log ? this.props.log.state : null;
        let pageTotal = dataSource.length;
        dataSource = this.formatData(dataSource);
        return (
            <div>
                <Breadcrumb className="access-log-title">
                    <Breadcrumb.Item><Link to="/accessLog">访问日志</Link></Breadcrumb.Item>
                    <Breadcrumb.Item>访问明细</Breadcrumb.Item>
                </Breadcrumb>
                <Table
                    columns={this.columns}
                    dataSource={dataSource}
                    rowKey={record => record.id}
                    pagination={{pageSize: 20, total: pageTotal}}
                    style={{marginTop: '30px'}}
                    size="small"
                />
            </div>
        );
    }
}
export default connect(state => ({
    log: state.log
}))(LogDetail);
