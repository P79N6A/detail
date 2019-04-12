/**
 * @file 访问权限配置
 * @author chenling
 */
import React, {Component} from 'react';
import {Modal, Input, Checkbox} from 'antd';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions';
const Search = Input.Search;
const CheckboxGroup = Checkbox.Group;
class AccessPermission extends React.Component {
    state = {
        checkedValues: [],
        list: [],
        searchCheckedValues: []
    }

    componentDidMount() {
        this.setState({
            list: this.props.data,
            checkedValues: this.initCheckboxValue(this.props.data)
        });
    }

    initCheckboxValue = data => {
        let result = data
        && Array.isArray(data)
        && data.filter(dataItem => dataItem.hasPerm === true).map(item => item.spaceId);
        return result;
    }

    handleCloseModal = () => {
        this.props.closeModal && this.props.closeModal();
    }

    getSearchCheckedValues = data => {
        return data && Array.isArray(data) &&
            data.filter(item => this.state.checkedValues.indexOf(item.spaceId) !== -1).map(item => item.spaceId);
    }

    isSearch = false;
    handleSearch = (value, event) => {
        this.isSearch = !!value;
        let params = Object.assign({key: value}, {dataSourceId: this.props.dataSourceId});
        this.props.actions.getSpaceRelation(params, content => {
            if (content && content.data.ret === 'SUCCESS') {
                // 从 this.state.checkedValues 中比对出 searchCheckedValues的值，不从搜索结果中获取，防止在前面有值的修改
                this.setState({
                    list: content.data.content,
                    searchCheckedValues: this.getSearchCheckedValues(content.data.content)
                });
            }
        });
    }

    compare(arr1, arr2) {
        let len = arr1.length;
        for (let i = 0; i < len; i++) {
            if (arr2.indexOf(arr1[i]) === -1) {
                return arr1[i];
            }
        }
        return false;
    }

    handleChange = values => {
        // 如果是 search 的列表则不能直接操作change 结果
        if (this.isSearch) {
            // 找到当前 change 的checkbox 的 id
            let searchCheckedValues = this.state.searchCheckedValues;
            let changeId;
            if (values.length > searchCheckedValues.length) {
                changeId = this.compare(values, this.state.searchCheckedValues);
            } else {
                changeId = this.compare(this.state.searchCheckedValues, values);
            }

            this.setState({
                searchCheckedValues: values
            });

            // 手动从总集中修正选中的项
            let index = this.state.checkedValues.indexOf(changeId)
            if (index !== -1) {
                this.state.checkedValues.splice(index, 1);
            } else {
                this.state.checkedValues.push(changeId);
            }
        } else {
            this.setState({
                checkedValues: values
            });
        }
    }

    handleSubmit = () => {
        let spaceInfos = this.state.checkedValues.map(valuesItem => {
            return this.props.data.find(spacesItem => spacesItem.spaceId === valuesItem);
        });
        let params = {dataSourceId: this.props.dataSourceId, spaceInfos};
        this.props.actions.editSpaceRelation(params);
        this.handleCloseModal();
    }

    render() {
        let {list} = this.state;

        return (
            <Modal
                title="访问权限配置"
                visible={this.props.visible}
                onCancel={this.handleCloseModal}
                onOk={this.handleSubmit}
                width={350}
            >
                <div className="page-space-relation">
                    <Search placeholder="请输入用户组名称" onSearch={this.handleSearch}/>
                    <CheckboxGroup
                        onChange={this.handleChange}
                        value={this.isSearch ? this.state.searchCheckedValues : this.state.checkedValues}
                    >
                    {
                        list && Array.isArray(list)
                        && list.map(item => {
                            return <Checkbox value={item.spaceId} key={item.spaceId}>
                                        {item.spaceName}
                                    </Checkbox>;
                        })
                    }
                    </CheckboxGroup>
                </div>
            </Modal>
        );
    }
}
const mapStataToProps = state =>({
    dataSourceId: state.dataSource.dataSourceId
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStataToProps, mapDispatchToProps)(AccessPermission);
