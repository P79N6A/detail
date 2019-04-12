/**
 * @file endPointTemplate.jsx 创建端点模板
 * @author changrenjie@baidu.com
 */
import {Button, message, Form, Input, Table, Spin} from 'antd';
import React, {Component} from 'react';
import style from './newEPTemplate.useable.less';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import common from '../../components/common/common';
import * as api from '../../api/api';
import CreateVersion from '../../components/createVersion/createVersion';
const {TextArea} = Input;

class NewEPTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            variantConfigs: {},
            data: [],
            compileData: null,
            compileKey: null,
            loading: false
        };
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    /**
     * 创建请求
     * @param {Object} e [表单]
     * @return {void}        [无]
     */
    handleSubmit = e => {
        e.preventDefault();
        this.setState({loading: true});
        this.props.form.validateFields((err, values) => {
            if (err) {
                this.setState({loading: false});
                return;
            }

            let variantConfigs = this.state.variantConfigs;
            let data = this.state.data;
            let {endpointConfigName, endpointConfigDescription} = values;
            let params = {
                endpointConfigName,
                endpointConfigDescription,
                variantConfigs: data,
                endpointConfigGroup: ''
            };
            if (!variantConfigs.weight || variantConfigs.weight === '0') {
                this.setState({loading: false});
                return message.error('创建端点模板时比重总和不能为0');
            }
            api.createTemplate(params).then(
                data => {
                    this.setState({loading: false});
                    message.success('创建成功').then(this.props.history.push('/'));
                }
            ).catch(error => {
                this.setState({loading: false});
                common.getErrorMsg(error || '创建失败失败，请稍候再试');
            });
        });
    }

    /**
     * 取消按钮点击事件
     */
    cancelClick = () => {
        this.props.history.push('/');
    }


    getValueFromEvent = e => common.getInputValue(e);

    /**
     * 新建按钮点击事件
     * @return {void}        [无]
     */
    newConstruction = () => {
        this.setState({
            visible: true
        });
    }

    /**
     * 关闭弹框
     * @return {void}        [无]
     */
    onCancel = () => {
        this.setState({
            visible: false,
            compileData: null
        });
    }

    /**
     * 新建版本回调---表单提交
     * @param {Object} params [弹框表单内容]
     * @return {void}        [无]
     */
    onSubmit = params => {
        let data = this.state.data;
        if (this.state.compileKey === 0 || this.state.compileKey) {
            data.splice(this.state.compileKey, 1, params);
        } else {
            params.key = data.length;// 没有唯一可识别的属性所以这里添加个key
            data.push(params);
        }
        let sumWeight = 0;
        for (let index = 0; index < data.length; index++) {
            sumWeight += data[index].weight;
        }
        this.setState({
            sumWeight,
            visible: false,
            data,
            variantConfigs: params,
            compileKey: null,
            compileData: null
        });
    }

    /**
     * Table列表数据删除
     * @param {string} key [数据的key值]
     * @return {void}        [无]
     */
    handleDeleteModel = key => {
        const data = [...this.state.data];
        this.setState({
            data: data.filter(item => item.key !== key),
            compileData: null
        });
    }

    /**
     * Table列表数据编辑
     * @param {string} key [数据的key值]
     * @return {void}        [无]
     */
    handleEditModel = key => {
        const data = [...this.state.data];
        const compileData = data.filter(item => item.key === key)[0];
        this.setState({
            visible: true,
            compileData,
            compileKey: compileData.key
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const {visible, data, compileData, sumWeight, loading} = this.state;
        let title = compileData ? '编辑版本' : '新建版本';
        const formItemLayout = {
            labelCol: {span: 3},
            wrapperCol: {span: 18}
        };
        const templateNameRules = common.getTemplateNameRules();
        const remarkRules = common.getRemarkRules();
        const header = <Breadcrumb nav="/?nav=template" breadBrumbText="返回端点模板列表" text="新建端点模板" />;
        const columns = [
            {
                title: '版本名称',
                dataIndex: 'varConfigName',
                key: 'varConfigName'
            }, {
                title: '模型文件',
                dataIndex: 'modelConfigId',
                key: 'modelConfigId'
            }, {
                title: '资源套餐',
                dataIndex: 'resourceConfigDescription',
                key: 'resourceConfigDescription'
            }, {
                title: '比重（所占百分比）',
                dataIndex: 'weight',
                key: 'weight',
                render: (text, record) => {
                    let dom = <div>
                        {text} ({sumWeight ? ((text / sumWeight) * 100).toFixed(0) : null}%)
                    </div>;
                    return dom;
                }
            }, {
                title: '运行实例数量',
                dataIndex: 'instanceCount',
                key: 'instanceCount'
            }, {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (text, record) => (
                    <span>
                        <span className="mr10"><a href="javascript:;"
                                onClick={() => this.handleEditModel(record.key)}
                                >编辑</a>
                        </span>
                        <span className="mr10"><a href="javascript:;"
                                onClick={() => this.handleDeleteModel(record.key)}>删除</a>
                        </span>
                    </span>
                )
            }
        ];
        const baseInfo = <div className="base-info-container">
            <h4 className="base-Info-header">基本信息</h4>
            <Form.Item
               label="端点模板名称"
               {...formItemLayout}
            >
                {getFieldDecorator('endpointConfigName', {
                    initialValue: '',
                    rules: templateNameRules,
                    getValueFromEvent: this.getValueFromEvent
                })(
                    <div>
                        <Input style={{width: '300px'}}/>
                    </div>
                )}
                <div className="remind">只能包含大小写字母，数字和-_ ；必须以字母开头,长度1-65</div>
            </Form.Item>
            <Form.Item
                label="备注"
               {...formItemLayout}
               className="remarkStyle"
            >
                {getFieldDecorator('endpointConfigDescription', {
                    initialValue: '',
                    rules: remarkRules
                })(
                    <div>
                        <TextArea autosize={false} style={{width: '300px'}} />
                        <div className="remind">不能超过200个字符</div>
                    </div>
                )}
            </Form.Item>
        </div>;
        const configInfo = <div className="config-info-container">
            <h4 className="config-Info-header">配置信息</h4>
            <div>
                <div style={{width: '100px', display: 'inline-block', verticalAlign: 'middle'}}>端点模板：</div>
                <Button type="primary" onClick={this.newConstruction} icon="plus">新建版本</Button>
            </div>
            <Table
                style={{marginTop: '20px', marginLeft: '100px'}}
                columns={columns} dataSource={data} pagination={false}/>
        </div>;
        const bottnomSubmit = <div className="config-info-container">
            <div className="bottnom-submit">
                <div className="position">
                    <Button type="primary" htmlType="submit">确认</Button>
                    <Button onClick={this.cancelClick}>取消</Button>
                </div>
            </div>
        </div>;
        const editConfigModal = (
            visible
                ? <CreateVersion
                    title={title}
                    data = {compileData}
                    endpointList={data}
                    visible={visible}
                    onCancel={this.onCancel}
                    onSubmit={this.onSubmit}
                />
                : null
        );
        const content = <Form onSubmit={this.handleSubmit}>
            <section className="form">
                <div className="form-wrapper astrict-width">
                    {baseInfo}
                </div>
                <div className="form-wrapper">
                    {configInfo}
                </div>
                <div className="form-wrapper">
                    {bottnomSubmit}
                </div>
                {editConfigModal}
            </section>
        </Form>;

        return <Spin spinning={loading}>
            <div className="container">
                {header} {content}
            </div>
        </Spin>;
    }
}

export default Form.create()(NewEPTemplate);
