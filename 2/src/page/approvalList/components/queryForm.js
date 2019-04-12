/**
 * @file 添加角色
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Input, Button, Select, Form, DatePicker} from 'antd';
import moment from 'moment';
const RangePicker = DatePicker.RangePicker;

class AddRoleForm extends Component {
    state = {
        disabled: false
    }

    handleSubmit = e => {
        e.preventDefault();

        let data = this.props.form.getFieldsValue();

        // 防止重复提交
        this.setState({
            disabled: true
        });

        let updateData = {};
        for (let key in data) {
            if (data.hasOwnProperty(key) && data[key]) {
                if (key === 'submitTime') {
                    updateData.submitStartTime = data[key][0]._d.getTime();
                    updateData.submitEndTime = data[key][1]._d.getTime();
                    continue;
                }
                updateData[key] = data[key];
            }
        }

        this.props.onSubmit(updateData, () => {
            this.setState({
                disabled: false
            });
        });

        setTimeout(() => {
            this.setState({
                disabled: false
            });
        }, 10000);
    }

    handleReset = e => {
        e.preventDefault();
        this.props.form.resetFields();
    }

    render() {
        const getFieldDecorator = this.props.form.getFieldDecorator;

        return (
            <Form layout="inline"
                onSubmit={this.handleSubmit}
                style={{marginBottom: '20px'}}
                autoComplete="off">
                <Form.Item
                    label='操作单ID'>
                    {getFieldDecorator('taskId')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item
                    label='操作类型'>
                    {getFieldDecorator('bizType')(
                        <Select style={{width: 120}} placeholder="请选择">
                            {this.props.bizTypeList && this.props.bizTypeList.map(status => (
                                <Select.Option
                                    value={status.type}
                                    key={status.type}>{status.name}</Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item
                    label='提交人'>
                    {getFieldDecorator('submitPerson')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item
                    label='状态'>
                    {getFieldDecorator('status')(
                        <Select style={{width: 120}} placeholder="请选择">
                            {this.props.statusList && this.props.statusList.map(status => (
                                <Select.Option
                                    value={status.no}
                                    key={status.no}>{status.name}</Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <br/>
                <Form.Item
                    label='审批对象'>
                    {getFieldDecorator('acName')(
                        <Input/>
                    )}
                </Form.Item>
                <Form.Item
                    label='提交时间'>
                    {getFieldDecorator('submitTime')(
                        <RangePicker
                          ranges={{Today: [moment().startOf('day'), moment()],
                              'This Month': [moment().startOf('month'), moment()]}}
                          showTime
                          format="YYYY/MM/DD HH:mm:ss"
                          placeholder={['开始时间', '结束时间']}
                          disabledDate={current => (current && current >= moment().endOf('day'))}
                        />
                    )}
                </Form.Item>
                <Form.Item className="setApproval-submit">
                    <Button type="primary" htmlType="submit" disabled={this.state.disabled}>确定</Button>
                    <Button onClick={this.handleReset} className="cancel">重置</Button>
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddRoleForm);
