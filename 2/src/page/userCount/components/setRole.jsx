/**
 * @file 角色设置
 * @author chenling
 */
import React from 'react';
import {Modal, Checkbox} from 'antd';
import * as actions from '../action';
import {connect} from 'react-redux';
const CheckboxGroup = Checkbox.Group;

class SetRole extends React.Component {

    state = {
        values: []
    }

    componentDidMount() {
        this.setState({
            values: this.handleRolelist(this.props.data)
        });
    }

    handleRolelist = data => {
        let newData = [];
        data && Array.isArray(data) && data.forEach(item => {
            item.owned === true && newData.push(item.roleId);
        });
        return newData;
    }

    handleSubmitParams = data => {
        let newData = [];
        data && data.forEach(dataItem => {
            this.props.data.forEach(item => {
                if (dataItem === item.roleId) {
                    newData.push({
                        roleId: item.roleId,
                        roleName: item.roleName
                    });
                }
            });
        });
        return newData;
    }

    handleChange = values => {
        this.setState({
            values
        });
    }

    handleCheckboxSubmit = () => {
        let params;
        params = {
            userId: this.props.userCountId,
            userName: this.props.userCountName,
            roles: this.handleSubmitParams(this.state.values)
        };
        this.props.setUserRole(params, this.props.pagination || {});
        this.props.handleCloseModal();
    }

    handleHideModal = () => {
        this.props.handleCloseModal && this.props.handleCloseModal();
    }

    render() {
        let userRoleList = this.props.data;
        return (
            <Modal
                title = "角色设置(非必填)"
                visible = {this.props.isShow}
                okText = "确认"
                cancelText = "取消"
                onOk = {this.handleCheckboxSubmit}
                onCancel = {this.handleHideModal.bind(this)}
            >
            <div>
                <CheckboxGroup
                    value = {this.state.values}
                    onChange = {this.handleChange}
                    className = "page-checkbox"
                >
                    {
                        Array.isArray(userRoleList)
                        && userRoleList.map((item, key) => {
                            return (
                                <Checkbox key={key} value={item.roleId}>
                                {item.roleName}
                                </Checkbox>
                            );
                        })
                    }
                </CheckboxGroup>
            </div>
            </Modal>
        );
    }
}

const mapStateToProps =  state => {
    let {userCountId, userCountName, pagination} = state.userCount;
    return {userCountId, userCountName, pagination};
};

const mapDispatchToProps = dispatch => ({
    setUserRole: (params, pagination) => dispatch(actions.setUserRole(params, pagination))
});

export default connect(mapStateToProps, mapDispatchToProps)(SetRole);
