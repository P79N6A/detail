/**
 * @file 角色管理入口
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from './actions';
import {Input, Button, Select, Form, Tabs, Icon, Modal} from 'antd';
import './index.less';
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class FlowForm extends Component {
    uuid = 0;

    state = {
        disabled: (this.props.setOperation !== 2)
    }

    initialValue = [];

    remove = (key) => {
        const { form } = this.props;
        const flow = form.getFieldValue('flow');
        if (flow.length === 1) {
            return;
        }

        form.setFieldsValue({
            flow: flow.filter(item => (
                item.key !== key
            ))
        });
    }

    add = () => {
        const { form } = this.props;
        const flow = form.getFieldValue('flow');

        this.uuid += 1;

        flow.push({
            key: this.uuid
        });

        form.setFieldsValue({
            flow
        });
    }

    handleSubmit = e => {
        e.preventDefault();

        // 0级不能提交、不能重名、点击取消内容恢复、名称字符长度限制、超时恢复高亮
        this.props.form.validateFields((err, values) => {
            let names = values.names;
            if (!err && names) {
                // 判断重名
                if (names.length !== [...new Set(names)].length) {
                    Modal.error({
                        title: "审批流程不能同名"
                    });
                    return;
                }
                this.setState({
                    disabled: true
                });

                let activityList = [];
                names.forEach(name => {
                    activityList.push({
                        activityName: name
                    });
                });

                this.props.onSubmit({
                    bizType: this.props.type,
                    activityList: activityList
                }, () => {
                    this.setState({
                        disabled: false
                    });
                });

                setTimeout(() => {
                    this.setState({
                        disabled: false
                    });
                }, 30000)
            }
        });
    }

    validateName = (rule, value, callback) => {
        // 字符数限制
        if (value) {
            if (value.length > 30) {
                callback('流程名称不能大于30个字符！');
            }
        }

        callback();
    }

    handleReset = e => {
        this.props.form.setFieldsValue({
            flow: this.initialValue
        });
    }


    render() {
        const {getFieldDecorator, getFieldValue} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 4}
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 20}
            }
        };

        const formItemLayoutWithOutLabel = {
            wrapperCol: {
                xs: {span: 24, offset: 0},
                sm: {span: 20, offset: 4}
            }
        };

        this.initialValue = this.props.flow ? this.props.flow.map((item, index) => {
            this.uuid += index;
            item.key = index;
            return item;
        }) : [];


        getFieldDecorator('flow', {initialValue: this.initialValue});
        const flow = getFieldValue('flow');

        const formItems = flow.length ? flow.map((item, index) => {
            return (
                <FormItem
                    {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                    label={index === 0 ? '新增审批流程' : ''}
                    required={false}
                    key={item.key}
                    >
                    {getFieldDecorator(`names[${index}]`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "请输入审批流程名称或者删除"
                        },{
                            validator: this.validateName
                        }],
                        initialValue: item.activityName
                    })(
                        <Input placeholder="审批流程名称"
                            style={{width: '60%', marginRight: 8}}
                            disabled={this.props.setOperation !== 2}/>
                    )}
                    {flow.length > 1 && this.props.setOperation === 2 ? (
                        <Icon
                            className="dynamic-delete-button"
                            type="minus-circle-o"
                            disabled={flow.length === 1}
                            onClick={() => this.remove(item.key)}
                            />
                    ) : null}
                </FormItem>
            );
        }) : <p className="no-flow">暂无审批流程</p>;


        return (
            <Form onSubmit={this.handleSubmit} autoComplete="off">
                {formItems}
                {this.props.setOperation === 2 && <div>
                    <FormItem {...formItemLayoutWithOutLabel}>
                        <Button type="dashed" onClick={this.add} style={{width: '60%'}}>
                            <Icon type="plus" /> 新增审批
                        </Button>
                    </FormItem>
                    <FormItem {...formItemLayoutWithOutLabel} className="setApproval-submit">
                        <Button type="primary" htmlType="submit">确定</Button>
                        <Button onClick={this.handleReset} className="cancel">取消</Button>
                    </FormItem>
                </div>}
            </Form>
        )
    }
}

const FlowFormWrapper = Form.create()(FlowForm);

class SetApproval extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.actions.fetch({
            bizType: "release"
        });
    }

    handleChange = key => {
        this.props.actions.fetch({
            bizType: key
        });
    }

    onSubmit = (data, callback) => {
        this.props.actions.setApprovalFlow(data, callback);
    }

    render() {
        const setApproval = this.props.setApproval;

        let pagePermissionInfo = this.props.pagePermissionInfo
            && this.props.pagePermissionInfo.find(
                item => (item.pageCode === 'approvalManager-managerFlow'));

        // pagePermissionInfo = pagePermissionInfo ? pagePermissionInfo.children : null;
        //
        // const setOperation = (pagePermissionInfo && pagePermissionInfo.find(item => (
        //     item.pageCode === 'approvalManager-managerFlow-setFlow'
        // )).operation);

        const setOperation = pagePermissionInfo && pagePermissionInfo.operation;

        return (
            <Tabs className='setApproval-wrapper' defaultActiveKey="release" onChange={this.handleChange}>
                <TabPane tab="发布" key="release">
                    <FlowFormWrapper
                        flow={setApproval.flow}
                        type="release"
                        onSubmit={this.onSubmit}
                        setOperation={setOperation}/>
                </TabPane>
                <TabPane tab="上线" key="online">
                    <FlowFormWrapper
                        flow={setApproval.flow}
                        type="online"
                        onSubmit={this.onSubmit}
                        setOperation={setOperation}/>
                </TabPane>
                <TabPane tab="下线" key="offline">
                    <FlowFormWrapper
                        flow={setApproval.flow}
                        type="offline"
                        onSubmit={this.onSubmit}
                        setOperation={setOperation}/>
                </TabPane>
            </Tabs>
        )
    }
}

const mapStateToProps = state => ({
    setApproval: state.setApproval,
    pagePermissionInfo: state.menus.pagePermissionInfo
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SetApproval);
