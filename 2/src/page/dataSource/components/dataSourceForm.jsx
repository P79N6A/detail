/**
 * @file 数据源管理表单，添加和编辑状态共用一个表单
 * @author chenling
 */
import React, {Component} from 'react';
import {Form, Modal, Input, Select, Spin} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions';
const FormItem = Form.Item;
const Option = Select.Option;
class DataSourceForm extends Component {
    state = {
        status: this.props.data ? this.props.data.status : 'I',
        oldValues: this.props.data,
        isConnecting: false
    }

    handleCloseModal = () => {
        this.props.closeModal && this.props.closeModal();
    }
    handleCheckConnect = () => {
        // 兼容 a 标签 disable 无效情况
        if (this.state.isConnecting) {
            return false;
        }

        let {validateFields, getFieldsValue} = this.props.form;
        validateFields((err, values) => {
            if (!err) {
                this.setState({
                    isConnecting: true
                });

                this.props.actions.checkConnect(values, content => {
                    this.setState({
                        status: content ? 'S' : 'F'
                    }, () => {
                        this.setState({
                            oldValues: getFieldsValue()
                        });
                    });
                    Modal.info({
                        title: content ? '连接成功!' : '连接失败!'
                    });
                }, () => {
                    this.setState({
                        isConnecting: false
                    });
                });
            }
        });
    }

    hasChange = (values, oldValues) => {
        for (let key in values) {
            if (key !== 'status' && oldValues[key] !== values[key]) {
                return true;
            }
        }
    }

    handleSubmit = () => {
        let {validateFields} = this.props.form;
        let {oldValues} = this.state;

        validateFields((err, values) => {
            if (!err) {
                values.status = this.state.status;
                // 第一步 检验值是否发生变化，只要值变化，状态就变成了新建
                if (oldValues) {
                    if (this.hasChange(values, oldValues)) {
                        values.status = 'I';
                    }
                }

                // 添加上 dataSourceId
                this.props.data && Object.assign(values, {
                    dataSourceId: this.props.data.dataSourceId
                });

                // 第二步 提交表单
                this.props.type === 'edit' ? this.props.actions.editDataSource(values, this.props.pagination) : this.props.actions.addDataSource(values);
                // 第三步 关闭弹窗
                this.props.closeModal && this.props.closeModal();
            }
        });
    }

    render() {
        let {getFieldDecorator, getFieldValue} = this.props.form;
        let {type, visible} = this.props;
        const data = this.props.data ? this.props.data : {};

        const formItemLayout = {
            labelCol: {
                sm: {span: 5}
            },
            wrapperCol: {
                sm: {span: 18}
            }
        };
        return (
            <Modal
                title = {type === 'add' ? '添加数据库' : '修改数据库'}
                visible = {visible}
                onCancel={this.handleCloseModal}
                onOk={this.handleSubmit}
            >
                <Spin tip="连接中..." spinning={this.state.isConnecting}>
                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="数据库地址"
                        >
                            {
                                getFieldDecorator('address', {
                                    rules: [{required: true, message: '请输入数据库地址'}],
                                    initialValue: data.address || undefined
                                })(
                                    <Input/>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="数据库端口"
                        >
                            {
                                getFieldDecorator('port', {
                                    rules: [{required: true, message: ' 请输入数据库端口'}],
                                    initialValue: data.port || undefined
                                })(
                                    <Input/>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="数据库类型"
                        >
                            {
                                getFieldDecorator('type', {
                                    rules: [{required: true, message: '请选择数据库类型'}],
                                    initialValue: data.type || undefined
                                })(
                                    <Select>
                                        <Option value="MYSQL">mysql数据库</Option>
                                        <Option value="ORACLE">oracle数据库</Option>
                                        <Option value="HIVE">hive数据库</Option>
                                    </Select>
                                )
                            }
                        </FormItem>
                        {
                            getFieldValue('type') === 'ORACLE'
                            && (<FormItem
                                    {...formItemLayout}
                                    label="数据库名称"
                                >
                                    {
                                        getFieldDecorator('name', {
                                            rules: [{required: true, message: '请输入数据库名称'}],
                                            initialValue: data.name || undefined
                                        })(
                                            <Input/>
                                        )
                                    }
                                </FormItem>)
                        }
                        <FormItem
                            {...formItemLayout}
                            label="数据库描述"
                        >
                            {
                                getFieldDecorator('desc', {
                                    initialValue: data.desc || undefined
                                })(
                                    <Input/>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="用户名"
                        >
                            {
                                getFieldDecorator('username', {
                                    rules: [{required: true, message: '请输入用户名'}],
                                    initialValue: data.username || undefined
                                })(
                                    <Input/>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="密码"
                        >
                            {
                                getFieldDecorator('password', {
                                    initialValue: data.password || undefined
                                })(
                                    <Input/>
                                )
                            }
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="数据库验证"
                        >
                            {
                                getFieldDecorator('status', {
                                    initialValue: data.status ? data.status : this.state.status
                                })(
                                    <a href="javascript:;"
                                        onClick={this.handleCheckConnect}
                                        disabled={this.state.isConnecting}>
                                        {this.state.isConnecting ? '连接中' : '测试连通性'}
                                    </a>
                                )
                            }
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
export default connect(null, mapDispatchToProps)(Form.create()(DataSourceForm));
