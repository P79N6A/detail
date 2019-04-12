/**
 * @file 访问日志
 */
import React from 'react';
import {Table, DatePicker, Input, Button, Select} from 'antd';
import {connect} from 'react-redux';
import request from '../../common/js/request';
import * as actionType from '../../conf/actionType';
import moment from 'moment';
import './index.less';
const {RangePicker} = DatePicker;
const Option = Select.Option;
class AccessLog extends React.Component {

    // moment格式转化为字符串时间格式
    dateForamt = time => {
        return JSON.stringify(moment().startOf('day').subtract(time, 'days')).slice(1, 11);
    }

    state = {
        dataSource: [],
        createBy: '',
        startDate: this.dateForamt(6),
        endDate: this.dateForamt(0),
        projectList: [],
        systemProject: '管理后台',
        current: 1
    }

    columns = [
        {
            dataIndex: 'createTime',
            key: 'createTime',
            title: '日期',
            align: 'center'
        },
        {
            dataIndex: 'createBy',
            key: 'createBy',
            title: '用户',
            align: 'center'
        },
        {
            dataIndex: 'accessTimes',
            key: 'accessTimes',
            title: '访问次数',
            align: 'center'
        },
        {
            dataIndex: 'detail',
            key: 'detail',
            title: '访问明细',
            align: 'center',
            render: (text, record) => (<a
                href="javascript:;"
                onClick={this.handleLogDetail.bind(this, record.logModels)}>查看明细</a>)
        }
    ];

    componentDidMount() {
        this.getLogList();
        // this.getProjectList();
    }

   
    getLogList = () => {
        let {createBy, startDate, endDate, systemProject} = this.state;
        let data = {
            createBy,
            startDate,
            endDate,
            systemProject
        };
        request('/console/audit/log/queryStatisticLog', {method: 'POST', body: data}).then(res => {
            if (res.data && res.data.ret === '0') {
                this.setState({
                    dataSource: res.data.content && res.data.content.logStatisticInfos
                });
            }
        });
        this.setState({
            current: 1
        });
    }

    getProjectList = () => {
        request('/console/audit/log/querySystemProjects', {method: 'POST'}).then(res => {
            if (res.data && res.data.ret === '0') {
                this.setState({
                    projectList: res.data.content
                });
            }
        });
    }

    handleLogDetail = logModels => {
        this.props.getLogDetail(logModels);
        this.props.history.push('/logDetail');
    }

    // 选择时间
    selectDate = (date, dateString) => {
        this.setState({
            startDate: dateString[0] || undefined,
            endDate: dateString[1] || undefined
        });
    }
    handleChangeValue = e => {
        this.setState({
            createBy: e.target.value
        });
    }
    handleChangeType = value => {
        this.setState({
            systemProject: value,
            createBy: '',
            startDate: this.dateForamt(6),
            endDate: this.dateForamt(0)
        }, () => {
            this.getLogList();
        });
    }
    // 查询
    handleSearch = () => {
        this.getLogList();
    }

    // 修改页码
    handleChangePage = page => {
        this.setState({
            current: page.current
        });
    }
    
    render() {
        let paginationTotal = this.state.dataSource && this.state.dataSource.length;
        const format = '"YYYY-MM-DD' || undefined;
        return (
            <div className="page-access-log">
                <div className="access-log-title">
                    <h3>筛选条件</h3>
                    <Select
                        className="select-type"
                        placeholder="请选择"
                        onChange={this.handleChangeType}
                        value={this.state.systemProject}
                    >
                        {/* {
                            Array.isArray(this.state.projectList) && this.state.projectList.map(item => {
                                return (
                                    <Option value={item} key={item}>{item}</Option>
                                );
                            })
                        } */}
                    </Select>
                </div>
                <div className="access-log-main">
                    <div className="main-date">
                        <span>时间范围</span>
                        <RangePicker
                            onChange={this.selectDate}
                            value = {(this.state.startDate === undefined
                                || this.state.endDate === undefined)
                                ? null
                                : [moment(this.state.startDate, format), moment(this.state.endDate, format)]}
                        />
                    </div>
                    <div className="main-user">
                        <span>用户</span>
                        <Input
                            placeholder="请输入用户名"
                            value={this.state.createBy}
                            onChange={this.handleChangeValue}
                        />
                    </div>
                    <Button type="primary" onClick={this.handleSearch}>查询</Button>
                </div>
                <Table
                    columns={this.columns}
                    dataSource={this.state.dataSource}
                    rowKey={record => record.createTimeStr}
                    pagination={{pageSize: 20, total: paginationTotal, current: this.state.current}}
                    onChange={this.handleChangePage}
                    size="small"
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    log: state.log
});
const mapDispatchToProps = dispatch => ({
    getLogDetail: content => dispatch({
        type: actionType.ACCESS_LOG_DETAIL,
        data: content
    })
});

export default connect(mapStateToProps, mapDispatchToProps)(AccessLog);
