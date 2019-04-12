/**
 * @file 配置
 * @author chenling
 */
import React from 'react';
import {Modal, Select, Input, Form, Button, AutoComplete} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../action';
const FormItem = Form.Item;
const Option = Select.Option;
class EditGroup extends React.Component {

    handleHideModal = () => {
        this.props.handleCloseModal && this.props.handleCloseModal();
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Modal.confirm({
                    title: '确认修改分组信息',
                    onOk: () => {
                        this.props.actions.spaceEdit(Object.assign(values, {
                            spaceId: this.props.spaceId
                        }), this.props.pagination);
                        this.props.handleCloseModal();
                    }
                });
            }
        });
    }

    render() {
        let {getFieldDecorator} = this.props.form;
        let {spaceDetail} = this.props;
        let data = this.props.hmsUserList.length ? this.props.hmsUserList.map(item => item.userName) : [];

        return (
            <Modal
                title = "编辑分组"
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
                    <span>状态设置</span>
                    <FormItem>
                        {getFieldDecorator('status', {
                            initialValue: spaceDetail.status
                        })(
                            <Select>
                                {
                                    spaceDetail.statusList && spaceDetail.statusList.map((item, index) => {
                                        return (
                                            <Option value={item.statusCode} key={index}>{item.statusName}</Option>
                                        );
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem>
                        <span>业务组名称</span>
                        {getFieldDecorator('spaceName', {
                            initialValue: spaceDetail.spaceName
                        })(
                            <Input disabled/>
                        )}
                    </FormItem>
                    <FormItem>
                        <span>组描述</span>
                        {getFieldDecorator('spaceDesc', {
                            initialValue: spaceDetail.spaceDesc
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    {
                        this.props.userInfo && this.props.userInfo.userInfo.bankCode !== 'ABC' && <FormItem
                            label="大数据平台用户"
                        >
                            {
                                getFieldDecorator('bigDataUser', {
                                    initialValue: spaceDetail.bigDataUser
                                })(
                                    <AutoComplete dataSource={data} placeholder="请输入用户"/>
                                )
                            }
                        </FormItem>
                    }
                    {
                        this.props.userInfo && this.props.userInfo.userInfo.bankCode !== 'ABC' && <FormItem
                            label="yarn queue"
                        >
                            {
                                getFieldDecorator('yarnQueue', {
                                    initialValue: spaceDetail.yarnQueue
                                })(
                                    <Input placeholder="请输入yarn queue"/>
                                )
                            }

                        </FormItem>
                    }
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = state => ({
    spaceId: state.workGroup.spaceId,
    spaceDetail: state.workGroup.spaceDetail,
    pagination: state.workGroup.pagination,
    userInfo: state.userInfo
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(EditGroup));
