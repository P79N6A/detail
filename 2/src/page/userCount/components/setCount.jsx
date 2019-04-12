/**
 * @file 账号设置
 * @author chenling
 */
import React from 'react';
import {Modal, Form, Select, Button, Input} from 'antd';
import {connect} from 'react-redux';
import * as actions from '../action';
import hyphenate from '../../../common/js/hyphenate';
const FormItem = Form.Item;
const Option = Select.Option;

class SetCount extends React.Component {

    handleHideModal = () => {
        this.props.handleCloseModal && this.props.handleCloseModal();
    }

    validatorNuptial = (rule, value, callback) => {
        if (value) {
            if (value.length < 6 || value.length > 18 || !/^[a-zA-Z0-9]+$/.test(value)) {
                callback('仅支持6-18位的英文大小写字母、数字');
            }
            else {
                callback();
            }
        }
        else {
            callback();
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.password = values.password ? hyphenate.setEncryption(values.password) : '';
                values = Object.assign(values, {
                    userId: this.props.userCountId
                });
                this.props.userCountUpdate(values, this.props.pagination || {});
                this.props.handleCloseModal();
            }
        });
    }

    render() {
        let {getFieldDecorator} = this.props.form;
        let {userDetail} = this.props;
        return (
            <Modal
                title = "账号设置"
                visible = {this.props.isShow}
                onCancel = {this.handleHideModal}
                footer={[
                    <Button
                        key="cancel"
                        type="default"
                        onClick={this.handleHideModal}
                    >
                        取消
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        onClick={this.handleSubmit}
                    >
                     确认
                    </Button>
                ]}
            >
                <Form autoComplete="off">
                    <FormItem>
                        <span>状态设置</span>
                            {
                                getFieldDecorator('status', {
                                    initialValue: userDetail.status
                                })(
                                    <Select>
                                        {userDetail.statusList && userDetail.statusList.map((item, index) => {
                                            return (
                                                <Option value={item.statusCode} key={index}>{item.statusName}</Option>
                                            );
                                        })}
                                    </Select>
                                )
                            }
                    </FormItem>
                    <FormItem>
                        <span>重置密码</span>
                            {
                                getFieldDecorator('password', {
                                    rules: [{
                                        validator: this.validatorNuptial
                                    }]
                                }
                            )(
                                   <Input placeholder = "请输入密码" type="password"/>
                                )
                            }
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps =  state => {
    let {userCountId, userDetail, pagination} = state.userCount;
    return {userCountId, userDetail, pagination};
};

const mapDispatchToProps = dispatch => ({
    userCountUpdate: (params, pagination) => dispatch(actions.userCountUpdate(params, pagination))
});
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(SetCount));
