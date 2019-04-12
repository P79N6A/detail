/**
 * @file newEndpoint.jsx 创建端点
 * @author xueliqiang@baidu.com
 */
import {Layout, Button, Form, Input, Select, notification} from 'antd';
import React, {Component} from 'react';
import style from './newEndpoint.useable.less';
import Breadcrumb from '../../components/breadcrumb/breadcrumb';
import common from '../../components/common/common';
import * as api from '../../api/api';

const {TextArea} = Input;
const Option = Select.Option;
const {Content} = Layout;
const breadBrumbText = {
    endpoint: '返回端点列表',
    template: '返回端点模板列表'
};
class NewEndpoint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 端点配置下拉框
            endpointConfigList: []
        };
    }

    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }

    componentDidMount() {
        let endpointConfigId = common.getQueryString('endpointConfigId', this.props.location.search);
        // 获取入口路径
        let origin = common.getQueryString('origin', this.props.location.search);
        this.setState({
            origin
        });
        api.getEndPointConfigList({
            pageSize: 999
        }).then(data => {
            this.setState({
                endpointConfigList: data.endpointConfigList,
                endpointConfigId
            });
        });
    }

    /**
     * 返回主页
     */
    navBack = () => {
        this.props.history.push('/?nav=endpoint');
    };

    /**
     * 保存端点
     */
    createEndpoint = () => {
        this.props.form.validateFields(['endpointName', 'endpointDescription', 'endpointConfigId'], (error, values) => {
            if (error) {
                return;
            }
            let params = values;
            api.createEndpoint({
                ...params
            }).then(data => {
                this.navBack();
            }).catch(error => {
                common.getErrorMsg(error || '保存端点失败');
            });
        });
    }

    getValueFromEvent = e => common.getInputValue(e);

    render() {
        const {getFieldDecorator} = this.props.form;
        const {endpointConfigList, endpointConfigId, origin} = this.state;

        const formItemLayout = common.getFormItemLayout();
        const templateNameRules = common.getTemplateNameRules();
        const descRules = [
            {
                pattern: /^.{0,200}$/,
                message: '不能超过200个字符'
            }
        ];
        const configRules = [
            {
                required: true,
                message: '端点配置不能为空'
            }
        ];


        // 面包屑
        const breadcrumb = <Breadcrumb nav={'/?nav=' + origin} breadBrumbText={breadBrumbText[origin]} text="新建端点" />;

        // 端点名称
        const endpointName = <Form.Item
           label="端点名称"
           {...formItemLayout}
        >
            {getFieldDecorator('endpointName', {
                initialValue: '',
                rules: templateNameRules,
                getValueFromEvent: this.getValueFromEvent
            })(
                <div>
                    <Input />
                    <div className="remind">只能包含大小写字母，数字和-_ ；必须以字母开头,长度1-65</div>
                </div>
            )}
        </Form.Item>;

        // 备注
        const descDom = <Form.Item
           label="备注"
           {...formItemLayout}
        >
            {getFieldDecorator('endpointDescription', {
                initialValue: '',
                rules: descRules,
                getValueFromEvent: this.getValueFromEvent
            })(
                <div>
                    <TextArea autosize={{minRows: 4, maxRows: 8}}/>
                    <div className="remind">不能超过200个字符</div>
                </div>
            )}
        </Form.Item>;

        // 端点配置
        const configDom = <div>
            <Form.Item
               label="端点配置"
               {...formItemLayout}
            >
                {getFieldDecorator('endpointConfigId', {
                    rules: configRules,
                    getValueFromEvent: this.getValueFromEvent,
                    initialValue: endpointConfigId
                })(
                    <Select style={{width: '300px'}}>
                        {
                            endpointConfigList.map(config =>
                                <Option key={config.endpointConfigId} value={config.endpointConfigId}>
                                    {config.endpointConfigName}
                                </Option>)
                        }
                    </Select>
                )}
            </Form.Item>
        </div>;

        const footer = <footer className="footer">
            <Button type="primary" onClick={this.createEndpoint}>确定</Button>
            <Button type="primary" onClick={this.navBack} style={{marginLeft: '20px'}}>取消</Button>
        </footer>;

        const baseInfo = <div className="base-info-container">
            <h4 className="base-Info-header">基本信息</h4>
            {endpointName} {descDom} {configDom}
        </div>;

        const content = <section className="form">
            <div className="form-wrapper">
                {baseInfo} {footer}
            </div>
        </section>;

        return <Layout>
            <Content>
                <div className="container">
                    {breadcrumb} {content}
                </div>
            </Content>
        </Layout>;
    }
}

export default Form.create()(NewEndpoint);
