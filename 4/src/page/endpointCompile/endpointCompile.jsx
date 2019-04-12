/**
 * @file header.jsx 首页
 * @author v_changrenjie@baidu.com
 */
import {message, Tooltip, notification, Input, Button, Form, Table, InputNumber, Spin} from 'antd';
import React, {Component} from 'react';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import EPStatus from '../../components/epStatus/epStatus';
import ExtendModal from './extendModal';
import style from './endpointCompile.useable.less';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as api from '../../api/api';
import common from '../../components/common/common';
const {TextArea} = Input;
const FormItem = Form.Item;

class EndpointCompile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseData: {},
            compileState: false,
            compileTemplateState: false,
            columns: [],
            visible: false,
            tableData: [],
            status: null,
            loading: true
        };
        notification.config({
            placement: 'bottomRight',
            message: '提示：',
            duration: 2.5
        });
    }

    componentWillMount() {
        style.use();
        let endpointId = common.getQueryString('endpointId', this.props.location.search);
        // 获取端点信息
        this.getEndpointDetail(endpointId);
    }
    setColumns = () => {
        let columns = [{
            title: '版本名称',
            dataIndex: 'variantConfigName',
            key: 'variantConfigName'
        }, {
            title: '模型文件',
            dataIndex: 'modelConfigName',
            key: 'modelConfigName'
        }, {
            title: '资源套餐',
            dataIndex: 'resourceConfigName',
            key: 'resourceConfigName'
        }, {
            title: '比重（所占百分比）',
            dataIndex: 'currentWeight',
            key: 'currentWeight',
            render: (value, record) => {
                let weight = value || 0;
                let content = this.state.compileTemplateState ? <div><Input type="number"  defaultValue={weight}
                        onChange={this.handleEdit.bind(this, 'currentWeight', record.variantConfigName)}
                        value={this.state[record.variantConfigName + 'currentWeight']}
                        style={{width: '120px'}}
                        />
                        ≈ {((weight / this.state.sumWidth) * 100).toFixed(0)}%</div>
                    : weight + '(' + ((weight / this.state.sumWidth) * 100).toFixed(0) + '%)';
                return content;
            }
        }, {
            title: '期望运行实例数量',
            dataIndex: 'desiredInstanceCount',
            key: 'desiredInstanceCount',
            render: (text, record) => {
                let content = this.state.compileTemplateState ? <Input type="number" min={1} max={10} defaultValue={text}
                    onChange={this.handleEdit.bind(this, 'desiredInstanceCount', record.variantConfigName)}
                    value={this.state[record.variantConfigName + 'desiredInstanceCount']}
                    style={{width: '120px'}}
                /> : text;
                return content;
            }
        }, {
            title: '实际运行实例数量',
            dataIndex: 'currentInstanceCount',
            key: 'currentInstanceCount'
        }
        ];
        this.setState({
            columns
        });
    }
    handleEdit = (att, key, e) => {
        let columns = this.state.columns;
        let value = parseInt(e.target.value, 10);
        if (value < 0) {
            value = 0;
        }

        let sumWidth = 0;
        const tableData = [...this.state.tableData];
        for (let index = 0; index < tableData.length; index++) {
            if (tableData[index].variantConfigName === key) {
                tableData[index][att] = value;
            }
        }
        for (let i of tableData) {
            i.currentWeight = i.currentWeight || 0;
            sumWidth += i.currentWeight;
        }
        columns.splice(5, 1);
        this.setState({
            tableData,
            [key + att]: value,
            columns,
            sumWidth
        }, this.setColumns());
    }
    onCopy = () => {
        notification.open({
            message: '复制成功'
        });
    }
    componentWillUnmount() {
        style.unuse();
    }
    compileClick = () => {
        let compileState = !this.state.compileState;
        this.setState({
            compileState
        });
    }
    // 获取端点信息
    getEndpointDetail = value => {
        let self = this;
        let params = {
            endpointId: value
        };
        api.getEndpointDetail(params).then(data => {
            let sumWidth = 0;
            for (let index in data.variants) {
                sumWidth += data.variants[index].currentWeight;
                let variantConfigName = data.variants[index].variantConfigName;
                this.setState({
                    [variantConfigName + 'currentWeight']: data.variants[index].currentWeight,
                    [variantConfigName + 'desiredInstanceCount']: data.variants[index].desiredInstanceCount
                });
            }
            let originalTableData = $.extend(true, [], data.variants);
            // [key]: value,
            self.setState({
                sumWidth: sumWidth,
                baseData: data,
                tableData: data.variants,
                originalTableData: originalTableData,
                status: data.status,
                endpointId: data.endpointId,
                loading: false
            });
            this.setColumns();
        });
    }

    configButton = operation => {
        let {columns, tableData, baseData, originalTableData} = this.state;
        console.log(originalTableData,'originalTableData')
        let variantWeightCapacities = [];
        for (let i = 0; i < tableData.length; i++) {
            let index = {
                variantId: tableData[i].variantId,
                weight: tableData[i].currentWeight,
                instanceCount: tableData[i].desiredInstanceCount
            };
            variantWeightCapacities.push(index);
        }
        let params = {
            endpointId: baseData.endpointId,
            variantWeightCapacities: variantWeightCapacities
        };
        let practicalNumber = {
            title: '实际运行实例数量',
            dataIndex: 'currentInstanceCount',
            key: 'currentInstanceCount'
        };

        let sumWidth = 0;
        switch (operation) {
            // 编辑当前端点模板
            case 'compileTemplate':
                columns.splice(5, 1);
                this.setState({
                    compileTemplateState: true,
                    columns
                });
                break;
            // 更换端点模板
            case 'changeTemplate':
                this.setState({visible: true});
                break;
            // 保存按钮
            case 'hold':
                if (!this.validateEPVersion()) {
                    return;
                }
                columns.push(practicalNumber);
                this.setState({
                    compileTemplateState: false,
                    columns,
                    originalTableData: tableData // 点击确定时 让原始数据变为已经变更的数据
                });
                api.endpointPartialUpdate(params).then(data => {
                    message.success('请求发起成功');
                    this.setState({
                        status: 3
                    });
                }).catch(error => {
                    common.getErrorMsg(error);
                });
                break;
            // 取消按钮
            case 'cancel':
                originalTableData.forEach(origEpVersion => {
                    origEpVersion.currentWeight = origEpVersion.currentWeight || 0;
                    if (!origEpVersion.desiredInstanceCount || origEpVersion.desiredInstanceCount <=1) {
                        origEpVersion.desiredInstanceCount = 1;
                    }
                    sumWidth += origEpVersion.currentWeight;
                    let variantConfigName = origEpVersion.variantConfigName;
                    this.setState({
                        [variantConfigName + 'currentWeight']: origEpVersion.currentWeight,
                        [variantConfigName + 'desiredInstanceCount']: origEpVersion.desiredInstanceCount
                    });
                });
                columns.push(practicalNumber);
                this.setState({
                    compileTemplateState: false,
                    columns,
                    sumWidth,
                    tableData: $.extend(true, [], originalTableData) // 点击取消时 让经变更的数据变为原始数据
                });
                break;
            default:
                break;
        }
    }

    // 模板版本字段提交前验证
    validateEPVersion = () => {
        let {tableData} = this.state;
        for (let epVersion of tableData) {
            if (!epVersion.currentWeight) {
                notification.error({
                    description: '比重必须大于0'
                });
                return false;
            }

            if (!epVersion.desiredInstanceCount || epVersion.desiredInstanceCount < 1) {
                notification.error({
                    description: '期望运行实例数量应大于0'
                });
                return false;
            }
        }
        return true;
    }
    // 备注编辑保存
    confirmRemind = () => {
        let compileState = !this.state.compileState;
        this.setState({
            compileState
        });
        let endpointConfigId = this.state.baseData.endpointConfigId;
        let variantConfigs = this.state.tableData;
        api.updateEPTemplate();
    };

    // 编辑取消
    cancelRemind = () => {
        let compileState = !this.state.compileState;
        this.setState({
            compileState
        });
    };

    callbackCancel = () => {
        this.setState({
            visible: false
        });
    };

    // 重新创建
    recreate = () => {
        let endpointId = common.getQueryString('endpointId', this.props.location.search);
        api.endpointRecreate().then(data=>{
            this.setState({
                status: 0
            }, this.getEndpointDetail(endpointId));
        });
    };

    // 编辑change事件   
    textAreaChange = e => {

    };

    statusDom = status => {
        return <EPStatus status={status}></EPStatus>;
    };

    callbackHandleOk = endpointConfigId => {
        const {baseData} = this.state;
        let modelConfigIds = baseData.variants.map(v => v.modelConfigId);
        let params = {
            endpointConfigId,
            endpointId: baseData.endpointId,
            modelConfigIds
        };
        this.setState({
            visible: false,
            loading: true
        });
        api.endpointUpdate(params).then(data => {
            this.setState({
                status: 3,
                loading: false
            });
        }).catch(error => {
            common.getErrorMsg(error);
            this.setState({loading: false});
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        let {compileState, columns, compileTemplateState, visible, loading} = this.state;
        let {baseData, tableData, status} = this.state;
        let {endpointName, endpointId, endpointDescription, entry} = baseData;
        let prohibit = status !== 1;
        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 20}
        };
        const header = <Breadcrumb nav="/?nav=endpoint" breadBrumbText="返回端点列表" text={endpointName} />;
        const baseInfo =  <div className="base-info">
            <h4 className="base-Info-header">基本信息</h4>
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                {...formItemLayout}
                label="名称">
                    {getFieldDecorator('endpointName', {
                    })(
                        <div>{endpointName}</div>
                    )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="ID">
                    {getFieldDecorator('endpointId', {
                    })(
                        <div>{endpointId}
                            <CopyToClipboard text={endpointId} onCopy={this.onCopy}>
                                <Tooltip title="复制到剪切板">
                                    <span className="copy">复制</span>
                                </Tooltip>
                            </CopyToClipboard>
                        </div>
                    )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="状态">
                    {getFieldDecorator('state', {
                    })(
                        <div>
                            {this.statusDom(status)}
                        </div>
                    )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="备注">
                    {getFieldDecorator('endpointDescription', {
                        // rules: remarkRules
                    })(
                        // <div>{compileState ? <div >
                        //     <TextArea className="remind" onChange={this.textAreaChange} style={{width: '300px'}} />
                        //     <div className="remind" style={{width: '300px'}}>不能超过200个字符</div>
                        //     <div className="remind">
                        //         <Button onClick={this.confirmRemind}>保存</Button>
                        //         <Button onClick={this.cancelRemind}>取消</Button>
                        //     </div>
                        // </div>
                        //     : <div>
                        //         {endpointDescription === '' ? '--' : endpointDescription}<span className="copy"
                        //             onClick={this.compileClick}>编辑</span>
                        //     </div>
                        // }
                        // </div>
                        <div>
                            {endpointDescription === '' ? '--' : endpointDescription}
                        </div>
                    )}
                </FormItem>
                <FormItem
                {...formItemLayout}
                label="URL">
                    {getFieldDecorator('entry', {
                    })(
                        <div>{entry}
                            <CopyToClipboard text={entry} onCopy={this.onCopy}>
                                <Tooltip title="复制到剪切板">
                                    <span className="copy">复制</span>
                                </Tooltip>
                            </CopyToClipboard></div>
                    )}
                </FormItem>
            </Form>
        </div>;
        const configurationInfo =  <div className="base-info">
            <h4 className="base-Info-header">配置信息</h4>
            <div className="body-content">
                <div className= "alignment-top">模板配置：</div>
                <div className= "compile">
                    {compileTemplateState ? <div className="compile-button">
                        <Button className="button-style" type="primary"
                        onClick={this.configButton.bind(this, 'hold')}>保存</Button>
                        <Button className="button-style button-color" disabled={false}
                            onClick={this.configButton.bind(this, 'cancel')}>取消</Button>
                        <span className="warnTip">当前每个用户在创建端点时最多可调用10个实例资源</span>
                    </div> : <div className="compile-button">
                        <Button className="button-style" icon="form" type="primary" disabled={prohibit}
                            onClick={this.configButton.bind(this, 'compileTemplate')}>编辑当前端点模板</Button>
                        <Button icon="sync" className="button-style" type="primary"
                        disabled={prohibit}
                            onClick={this.configButton.bind(this, 'changeTemplate')}>更换端点模板</Button>
                        <span className="warnTip">当前每个用户在创建端点时最多可调用10个实例资源</span>
                    </div>}
                    <Table rowKey={record => record.variantConfigName} dataSource={tableData} columns={columns} pagination={false}/>
                </div>
            </div>
        </div>;
        const content = <section className="form">
            <div className="form-wrapper">
                {baseInfo}
            </div>
            <div className="form-wrapper partition-line">
                {configurationInfo}
            </div>
            {visible ? <ExtendModal
                callbackHandleOk={this.callbackHandleOk}
                callbackCancel={this.callbackCancel}
                visible={visible}/> : null}
        </section>;
        const loadingDom = <div className="loading-bgc">
            <Spin size="large" className="Spin"/>
        </div>;
        return (
            <Spin size="large" className="Spin" spinning={loading}>
                <div className="content">
                    {header} {content}
                </div>
            </Spin>
        );
    }
}

export default Form.create()(EndpointCompile);
