/**
 * @file 感知引擎页面
 * @author chenling
 */
import React from 'react';
import {Select, Table, DatePicker, Button} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {columnsData} from './columnsData';
import Echart from './components/echarts.jsx';
import TableCell from './components/tableCell.jsx';
import ApiList from './components/apiList.jsx';
import * as actions from './action';
import './index.less';

const Option = Select.Option;
const {RangePicker} = DatePicker;
class PerceptEngine extends React.Component {

    state = {
        role: '感知引擎',
        appId: null,
        startDate: null,
        endDate: null,
        listApiId: null,
        detailApiId: null,
        currentPage: 1,
        pageSize: 10,
        isEchart: false,
        listApiName: '',
        detailApiName: '',
        detailAppName: '掌银'
    }

    componentDidMount() {
        this.getList();
        this.getDetail();
    }

    getList = () => {
        let {listApiId, role, listApiName} = this.state;
        this.props.actions.perceptEngineList({
            role,
            apiId: listApiId,
            tongjiDate: listApiName
        });
    }

    getDetail = () => {
        let {appId, detailApiId, startDate, endDate, role, currentPage, pageSize} = this.state;
        this.props.actions.perceptEngineDetail({
            appId, startDate, endDate, role, currentPage, pageSize,
            apiId: detailApiId
        });
    }

    handleListItem = item => {
        this.setState({
            listApiId: item.apiId,
            listApiName: item.apiName
        }, () => {
            this.getList();
        });
    }

    handleDetailItem = item => {
        item && item.apiId && this.setState({
            apiId: item.apiId,
            isEchart: true,
            detailApiName: item.apiName
        }, () => {
            this.getDetail();
        });
    }

    handleChangeDate = (date, dateStrings) => {
        dateStrings && dateStrings.length !== 0 && this.setState({
            startDate: dateStrings[0],
            endDate: dateStrings[1]
        }, () => {
            this.getDetail();
        });
    }

    handleChangeSelect = (type, value) => {
        value && this.setState({
            [type]: value,
            detailAppName: type === 'appId' ? this.handleIdToName(value) : this.state.detailApiName
        }, () => {
            if (type === 'role') {
                this.getList();
                this.getDetail();
            }
            else {
                this.getDetail();
            }
        });
    }

    handleIdToName = id => {
        let name = '';
        if (id) {
            this.props.detail && this.props.detail.appList
            && this.props.detail.appList.forEach(item => {
                if (item.appId === id) {
                    name = item.appName;
                }
            });
        }
        return name;
    }

    handleDownLoad = () => {
        let {appId, detailApiId, startDate, endDate, role, currentPage, pageSize} = this.state;
        this.props.actions.perceptEngineDownLoad({
            appId, startDate, endDate, role, currentPage, pageSize,
            apiId: detailApiId
        });
    }

    render() {
        let {list, detail, endList, endDetail} = this.props;
        let ApiTongjiListTpl = (
            <div className="page-table-cell">
                {
                    list.apiTongjiList && list.apiTongjiList.map((item, index) => {
                        return (
                            <TableCell data={item} key={index}/>
                        );
                    })
                }
            </div>
        );
        
        return (
            <div className="page-percept-engine">
                <div className="page-header">
                    <div>线上服务监控</div>
                    <Select
                        className="page-select"
                        defaultValue={this.state.role}
                        onChange={this.handleChangeSelect.bind(this, 'role')}
                    >
                        <Option key="1" value="ganzhi">感知引擎</Option>
                        <Option key="2" value="siwei">思维引擎</Option>
                    </Select>
                </div>
                <div className="page-main-content">
                    <div className="page-title">昨日监控：{new Date().getTime()}</div>
                    {
                        endList ? (
                            <div className="page-content">
                                <div className="page-content-title">
                                    <ApiList data={list} type="list" onClick ={this.handleListItem}/>
                                </div>
                                {ApiTongjiListTpl}
                            </div>
                        ) : null
                    }
                    
                </div>
                <div className="page-main-content">
                    <div className="page-title">
                        <div>每日服务监控明细</div>
                        <div>
                            <span className="page-margin-right">时间范围</span>
                            <RangePicker onChange={this.handleChangeDate}/>
                        </div>
                    </div>
                    {
                        endDetail ? (
                            <div className="page-content">
                                <div className="page-content-title">
                                    <ApiList data={detail} type="detail" onClick={this.handleDetailItem}/>
                                    <div>
                                        <span className="page-margin-right">使用方</span>
                                        <Select
                                            className="page-select"
                                            onChange = {this.handleChangeSelect.bind(this, 'appId')}
                                            defaultValue = {detail.appList[0].appId}
                                        >
                                            {
                                                detail.appList && detail.appList.map(item => {
                                                    return (
                                                        <Option key={item.appId} value={item.appId}>{item.appName}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </div>
                                </div>
                                <Table
                                    columns={columnsData}
                                    dataSource={detail.detailList}
                                    rowKey={record => record.appId}
                                />
                                <Button type="primary" onClick={this.handleDownLoad}>下载</Button>
                                {this.state.isEchart ? (
                                    <Echart
                                        data={detail.detailList}
                                        detailApiName={this.state.detailApiName}
                                        detailAppName = {this.state.detailAppName}
                                    />
                                ) : null}
                            </div>
                        ) : null
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    list: state.perceptEngine.list,
    detail: state.perceptEngine.detail,
    endList: state.perceptEngine.endList,
    endDetail: state.perceptEngine.endDetail
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PerceptEngine);
