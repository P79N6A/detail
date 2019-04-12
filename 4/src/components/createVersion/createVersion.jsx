/**
 * @file 新建版本
 * @author chenling
 */
import React from 'react';
import {Modal, Input, Form, Select, Button, Icon} from 'antd';
import * as api from '../../api/api';
import style from './createVersion.useable.less';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
const Option = Select.Option;

class CreateVersion extends React.Component {

    state = {
        // 实例数量值
        value: 2,
        // 比重百分比
        percentage: 0,
        // 是否可点击reduce按钮
        reduceButtonDisable: false,
        // 是否可点击add按钮
        addButtonDisable: false,
        // 模型类型(暂定)
        modelType: 'user',
        // 资料列表
        resourceList: [],
        // 模型列表
        modelList: [],
        // 用户模型列表
        userModelList: [],
        // 端点模板列表,便于计算比重比例
        endpointList: []
    }
    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        this.getResourceList();
        this.getModelList();
        this.initFormatData();
    }

    // 初始化赋值校验
    initFormatData = () => {
        let {data, endpointList} = this.props;
        this.setState({
            data: data || null,
            endpointList: endpointList || []
        }, () => {
            // 初始化设置value值
            this.setState({
                value: data ? data.instanceCount : this.state.value
            }, () => {
                if (Number(this.state.value) <= 1) {
                    this.setState({
                        reduceButtonDisable: true
                    });
                }
                let percentage = this.calPercentage(data ? data.weight : 0);
                this.setState({percentage});
            });
        });
    }

    // 版本名称校验
    validatorName = (rule, value, callback) => {
        let reg = !/^[a-zA-Z][a-zA-Z0-9_-]{0,65}$/.test(value);
        if (value && reg) {
            callback('只能包含大小写字母，数字和-_ ；必须以字母开头,长度1-65');
        }

        // data为空则为新建版本,否则为编辑版本
        const {data, endpointList} = this.props;
        let isDuplicated = data ? endpointList.some(ep => ep.varConfigName === value && data.key !== ep.key)
            : endpointList.some(ep => ep.varConfigName === value);
        isDuplicated && callback('版本名称重复');

        callback();
    }

    // 选择模型类型
    handleSelectModel = value => {
        if (value === 'user') {
            this.setState({
                modelList: this.state.userModelList
            });
        }
        else {
            this.setState({
                modelList: []
            });
        }
        const {form} = this.props;
        form.setFieldsValue({
            modelConfigId: undefined
        });
    }

    // 获取资源套餐列表
    getResourceList() {
        api.getResourceList().then(data => {
            this.setState({
                resourceList: data && data.resourceConfigList
            }, () => {
                const resourceList = this.state.resourceList;
                this.props.data && this.props.form.setFieldsValue({
                    resourceConfigId: resourceList.find(r => r.resourceConfigId === this.props.data.resourceConfigId).resourceConfigId
                });
            });
        });
    }

    // 获取系统模型列表
    getModelList() {
        api.getModelList().then(data => {
            this.setState({
                userModelList: data && data.modelList,
                modelList: this.state.modelType === 'user' && data && data.modelList
            }, () => {
                const modelList = this.state.modelList;
                this.props.data && this.props.form.setFieldsValue({
                    modelConfigId: modelList.find(m => m.modelConfigId === this.props.data.modelConfigId).modelConfigId
                });
            });
        });
    }

    // 改变比重
    handleChangeAccount = e => {
        let currentValue = Number(e.target.value);
        let percentage = this.calPercentage(currentValue);
        this.setState({percentage});
    }

    // 计算比重
    calPercentage = currentValue => {
        let {endpointList} = this.state;
        let {data} = this.props;

        let accumulator = (currentValue, ep) => ep.weight + currentValue;

        let count = data ? endpointList.filter(ep => ep.key !== data.key).reduce(accumulator, currentValue) :
            endpointList.reduce(accumulator, currentValue);

        return count > 0 ? (100 * currentValue/count).toFixed(0) : 0;
    };

    // 按钮添加
    handleAddNumber = () => {
        let value = Number(this.state.value);
        if (value >= 10) {
            this.setState({
                addButtonDisable: true
            });
            return;
        }
        this.setState({
            value: (value + 1)
        }, () => {
            this.state.value > 1 && this.setState({
                reduceButtonDisable: false
            });
        });
    }

    // 按钮减少
    handleReduceNumber = () => {
        let value = Number(this.state.value);
        this.setState({
            value: (value - 1)
        }, () => {
            this.state.value < 10 && this.setState({
                addButtonDisable: false
            });
            this.state.value <= 1 && this.setState({
                reduceButtonDisable: true
            });
        });
    };

    // 确认提交
    handleSubmit = e => {
        e.preventDefault();
        const {value, resourceList} = this.state;
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let params = this.props.data ? Object.assign(this.props.data, values) : values;
                params.instanceCount = Number(value);
                params.weight = Number(values.weight);

                let resourceConfigId = values.resourceConfigId;
                let resourceConfigDescription = resourceList.find(r => r.resourceConfigId === resourceConfigId).resourceConfigDescription;
                params.resourceConfigDescription = resourceConfigDescription;

                this.props.onSubmit && this.props.onSubmit(params);

                // 重置表单
                this.props.form.resetFields();
            }
        });
    }

    // 取消
    handleCloseModal = () => {
        this.props.onCancel && this.props.onCancel();
        // 重置表单
        this.props.form.resetFields();
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const data = this.props.data ? this.props.data : {};
        let title = this.props.title || '新建版本';

        const formItemLayout = {
            labelCol: {
                sm: {span: 3}
            },
            wrapperCol: {
                xs: {span: 20, offset: 1}
            }
        };
        return (
            <Modal
                title = {title}
                visible = {this.props.visible}
                onCancel = {this.handleCloseModal}
                onOk={this.handleSubmit}
                okText = "确定"
                cancelText = "取消"
                width= "800px"
            >
                <Form className="page-create-version">
                    <FormItem className="varConfigName"
                        {...formItemLayout}
                        label="版本名称"
                    >
                        {
                            getFieldDecorator('varConfigName', {
                                rules: [
                                    {required: true, message: '版本名称必填'},
                                    {validator: this.validatorName}
                                ],
                                initialValue: data.varConfigName
                            })(
                                <Input placeholder="版本名称" style={{width: '300px'}}/>
                            )
                        }
                        <div>只能包含大小写字母，数字和-_ ；必须以字母开头,长度1-65</div>
                    </FormItem>
                    <div className="page-model-file">
                        <FormItem
                            {...formItemLayout}
                            label="模型文件"
                        >
                            {
                                getFieldDecorator('modelConfigType', {
                                    rules: [{required: true, message: '模型文件必填'}],
                                    initialValue: this.state.modelType
                                })(
                                    <Select
                                        placeholder="请选择"
                                        onChange={this.handleSelectModel}
                                        className="page-model-type"
                                    >
                                        <Option value="system">系统模型</Option>
                                        <Option value="user">用户模型</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        <FormItem>
                            {
                                getFieldDecorator('modelConfigId', {
                                    rules: [{required: true, message: '模型文件必填'}]
                                })(<Select placeholder="请选择">
                                    {
                                        Array.isArray(this.state.modelList) && this.state.modelList.map(item => (
                                            <Option value={item.modelConfigId} key={item.modelConfigId}>
                                                {item.modelName}
                                            </Option>
                                        ))
                                    }
                                </Select>)
                            }
                        </FormItem>
                    </div>
                    <FormItem
                        {...formItemLayout}
                        label="资源套餐"
                        className="resourceConfig"
                    >
                        {
                            getFieldDecorator('resourceConfigId', {
                                rules: [{required: true, message: '资源套餐必填'}]
                            })(
                                <Select placeholder="请选择" style={{width: '300px'}}
                                >
                                    {
                                        this.state.resourceList && this.state.resourceList.map(item => {
                                            return (
                                                <Option
                                                    className="select-option"
                                                    value={item.resourceConfigId}
                                                    key={item.resourceConfigId}
                                                >
                                                    {item.resourceConfigName}
                                                </Option>
                                            );
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <div className="accountNumber">
                        <FormItem className="weight-style"
                            {...formItemLayout}
                            label="比重"
                        >
                            {
                                getFieldDecorator('weight', {
                                    rules: [{required: true, message: '比重必填'}],
                                    initialValue: data.weight
                                })(
                                    <Input type="number" onChange={this.handleChangeAccount} min={0}/>
                                )
                            }
                            <span>≈<span>{this.state.percentage}</span>% （所占百分比）</span>
                            <div>系统会根据您设定的比重，分配所有版本的百分比</div>
                        </FormItem>
                    </div>
                    <FormItem
                        {...formItemLayout}
                        label="运行实例数量"
                    >
                        {
                            getFieldDecorator('instanceCount', {
                                rules: [{required: true, message: ' '}, {validator: (rule, values, callback) => {
                                    if (!this.state.value) {
                                        callback('实例数量必填');
                                    }
                                    callback();
                                }}],
                                initialValue: this.state.value
                            })(
                                <div className="instanceNumber">
                                    <Button
                                        type="primary"
                                        onClick={this.handleReduceNumber}
                                        disabled={this.state.reduceButtonDisable}
                                    >
                                        <Icon type="minus"/>
                                    </Button>
                                    <span className="number-text">{this.state.value}</span>
                                    <Button
                                        type="primary"
                                        onClick={this.handleAddNumber}
                                        disabled={this.state.addButtonDisable}
                                    >
                                        <Icon type="plus"/>
                                    </Button>
                                </div>
                            )
                        }
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
export default Form.create()(CreateVersion);

CreateVersion.propTypes = {
    // 弹框标题
    title: PropTypes.string,
    // 待编辑版本数据 (为null说明是新建版本)
    data: PropTypes.object,
    // 所有版本信息（计算权重用）
    endpointList: PropTypes.array
};
