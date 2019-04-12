/**
 * @file 添加分组
 * author chenling
 */
import React from 'react';
import {Modal, Form, Button, Input, Select, Icon, Radio, AutoComplete} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../action';
import SearchUser from '../../../common/components/searchUser/index.jsx';
import hyphenate from '../../../common/js/hyphenate';
const FormItem = Form.Item;
const Option = Select.Option;
class AddGroup extends React.Component {

    state = {
        userSelectList: [],
        compositionStatus: false
    }

    getUsersList = key => {
        key && this.props.actions.usersList({
            key
        });
    }

    handleHideModal = () => {
        this.props.handleCloseModal && this.props.handleCloseModal();
    }

    // 添加选中的项，但是必须判断是否重复
    handleSelect = value => {
        let isExist = false;
        let userName = value && value.label;
        this.state.userSelectList.forEach(item => {
            if (this.valueSwitchId(userName) === item.userId) {
                isExist = true;
            }
        });
        if (isExist) {
            Modal.info({
                content: (<span>该成员已经存在, 请重新选择</span>)
            });
            return;
        }
        else {
            userName && this.state.userSelectList.unshift({
                userName,
                userId: this.valueSwitchId(userName),
                admin: false
            });
            this.setState({
                userSelectList: this.state.userSelectList
            });
        }
    }

    valueSwitchId = value => {
        let userId = null;
        if (value && this.props.userList) {
            this.props.userList.forEach(item => {
                if (value === item.userName) {
                    userId = item.userId;
                }
            });
            return userId;
        }
    }

    // 删除某一项
    handleDeleteUsers = index => {
        this.state.userSelectList.splice(index, 1);
        this.setState({
            userSelectList: this.state.userSelectList
        });
    }

    // 设置管理员
    handleSetAdmins = index => {
        this.state.userSelectList[index].admin = true;
        this.setState({
            userSelectList: this.state.userSelectList
        });
    }

    // 取消设置管理员
    handleCancelSet = index => {
        this.state.userSelectList[index].admin = false;
        this.setState({
            userSelectList: this.state.userSelectList
        });
    }

    // 添加分组
    handleSubmit = e => {
        e.preventDefault();
        let members = [];
        let admins = [];
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.state.userSelectList.forEach(item => {
                    members.push({
                        userId: item.userId,
                        userName: item.userName
                    });
                    if (item.admin) {
                        admins.push({
                            userId: item.userId,
                            userName: item.userName
                        });
                    }
                });
                // values.hmsPassword = hyphenate.setEncryption(values.hmsPassword);
                this.props.actions.spaceAdd(Object.assign(values, {members, admins}), {
                    key: '',
                    currentPage: 1,
                    pageSize: 20
                });
                this.props.handleCloseModal();
            }
        });
    }

    // 业务组名重名校验
    validatorNuptial = (rule, value, callback) => {
        if (!value) {
            callback('请输入3-20个字符之间的字母、下划线、中文及数字');
            return;
        }
        else if (value && !/^[a-zA-Z0-9_\u4e00-\u9faf]{3,20}$/.test(value)) {
            callback('请输入3-20个字符之间的字母、下划线、中文及数字');
            return;
        }
        else if (value && /^[a-zA-Z0-9_\u4e00-\u9faf]{3,20}$/.test(value)) {
            this.props.actions.spaceDuplicate({
                key: value
            }, content => {
                if (content) {
                    callback('业务组名称重复，请重新输入');
                }
                else {
                    callback();
                }
            });
        }
    }

    // 选择大数据平台用户显示密码
    // handleChange = () => {
    //     this.setState({
    //         passwordVisible: true
    //     });
    // }

    render() {
        let {getFieldDecorator} = this.props.form;
        let data = this.props.hmsUserList.length ? this.props.hmsUserList.map(item => item.userName) : [];

        return (
            <Modal
                title = "添加分组"
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
                        添加
                    </Button>
                ]}
            >
                <Form autoComplete="off">
                    <FormItem
                        label="组名称"
                    >
                        {
                            getFieldDecorator('spaceName', {
                                validateTrigger: this.state.compositionStatus ? 'onCompositionEnd' : 'onChange',
                                rules: [{
                                    required: true,
                                    message: ' '
                                }, {
                                    validator: this.validatorNuptial
                                }]
                            })(
                                <Input
                                    placeholder="请输入组名"
                                    onCompositionStart={() => this.setState({composiitonStatus: true})}
                                />
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="大数据平台用户"
                    >
                        {
                            getFieldDecorator('bigDataUser')(
                                <AutoComplete dataSource = {data} placeholder="请输入用户"/>
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="yarn queue"
                    >
                        {
                            getFieldDecorator('yarnQueue')(
                                <Input placeholder="请输入yarn queue"/>
                            )
                        }

                    </FormItem>
                    <FormItem
                        label="组描述"
                    >
                        {
                            getFieldDecorator('spaceDesc')(
                                <Input.TextArea
                                    placeholder="请输入组描述，字数限制500以内"
                                    style={{width: '100%', height: '80px'}}
                                />
                            )
                        }
                    </FormItem>
                    <FormItem
                        label="添加组成员"
                    >
                        <SearchUser
                            userList = {this.props.userList}
                            onSearch = {this.getUsersList}
                            onSelect = {this.handleSelect}
                        />
                        <div className="page-add-user">
                            <div className="page-add-inner">
                                {
                                    Array.isArray(this.state.userSelectList) && this.state.userSelectList.map((item, index) => {
                                        return (
                                            <div key={index} className="add-user-cell">
                                                <span>
                                                    {item.userName}&nbsp;&nbsp;
                                                    <Icon
                                                        type="close"
                                                        onClick={this.handleDeleteUsers.bind(this, index)}
                                                        style={{fontSize: '12px'}}
                                                    />
                                                </span>
                                                <span
                                                    onClick={this.handleSetAdmins.bind(this, index)}
                                                    className={item.admin ? 'page-black' : 'page-blue'}
                                                >
                                                    { item.admin ? '管理员' : '设置管理员'}
                                                </span>
                                                <span
                                                    onClick = {this.handleCancelSet.bind(this, index)}
                                                    className={item.admin ? 'page-blue' : 'page-grey'}
                                                >
                                                    取消
                                                </span>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}
const mapStateToProps = state => ({
    userList: state.workGroup.userList
});
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});
export default Form.create()(connect(mapStateToProps, mapDispatchToProps)(AddGroup));
