/**
 * @file 添加角色
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Modal, Tree, Select, Icon} from 'antd';
const TreeNode = Tree.TreeNode;

export default class AddRoleForm extends Component {
    constructor(props) {
        super(props);

        // 选中节点的 list
        let checkedList = [];

        this.props.data.forEach(item => {
            let resources = [];
            this.getOwnList(item.resources, resources);

            checkedList.push({
                operationCode: item.operationCode,
                resources
            });
        });

        let renderTree = this.props.data[0];
        this.hideKey = 'hide-item';

        // 插入隐藏的数据，从而使子节点选中时父节点不选中
        this.insertHideData(renderTree.resources);

        this.state = {
            renderTree,
            checkedList
        };
    }

    insertHideData = data => {
        data.push({
            'resourceId': this.hideKey,
            'resourceName': '',
            'isOwned': false
        });

        data.forEach(item => {
            if (item.children && item.children.length) {
                this.insertHideData(item.children);
            }
        });
    }

    // 获取选中的节点
    getOwnList = (list, checkedList) => {
        let me = this;

        list.forEach(item => {
            if (item.isOwned) {
                checkedList.push(item.resourceId);
            }

            if (item.children) {
                me.getOwnList(item.children, checkedList);
            }
        });
    }

    addId = 0;

    renderTreeNode = (data, isDisplay) => data.map(item => {
        // 展示的数据用 newChildren
        if (isDisplay) {
            item.children = item.newChildren;
        }

        if (item.children) {
            return (
                <TreeNode title={item.resourceName}
                    key={item.resourceId}
                    dataRef={item}
                    className={item.resourceId}
                    icon={() =>
                        <Icon type="minus-square"/>
                    }>
                    {this.renderTreeNode(item.children, isDisplay)}
                </TreeNode>
            );
        }

        if (!isDisplay && item.resourceId === this.hideKey) {
            return <TreeNode title={item.resourceName}
                key={`${item.resourceId}${this.addId++}`}
                dataRef={item}
                className={item.resourceId}
            />;
        } else {
            return <TreeNode title={item.resourceName} key={item.resourceId} dataRef={item}
                icon={() =>
                    <Icon type="check-square"/>
                }
            />;
        }
    })

    changeTree = value => {
        let renderTree = this.props.data.find(item => item.operationCode === value);
        this.insertHideData(renderTree.resources);

        this.setState({
            renderTree
        });
    }

    handleSubmit = () => {
        let submitArr = [];

        this.props.data.forEach(data => {
            let resources = [];
            this.filterCheckedList(data.resources, data.operationCode, resources);

            submitArr.push({
                operationCode: data.operationCode,
                resources
            });
        });

        this.props.onSubmit(submitArr);
    }

    filterCheckedList = (data, operationCode, submitData) => {
        data.forEach(item => {
            let operateCheckedList = this.state.checkedList.find(item =>
                item.operationCode === operationCode);
            // 如果父元素被选中就不再寻找子元素是否被选中
            if (operateCheckedList && operateCheckedList.resources.find(resource => resource == item.resourceId)) {
                submitData.push(item.resourceId);
            } else {
                if (item.children) {
                    this.filterCheckedList(item.children, operationCode, submitData);
                }
            }
        });
    }

    displayTree = [];

    getDisplayTree = (tree, checkedKeys) => {
        this.displayTree = [];
        if (checkedKeys.length) {
            tree.forEach(item => {
                item = $.extend(true, {}, item);
                if (!checkedKeys.some(key => key == item.resourceId)) {
                    if (item.children && this.getChildDisplayTree(item, item.children, checkedKeys)) {
                        this.displayTree.push(item);
                    }
                } else {
                    this.displayTree.push(item);
                }
            });
        }
    }

    getChildDisplayTree = (parentTree, tree, checkedKeys) => {
        parentTree.newChildren = [];

        tree.forEach(item => {
            if (checkedKeys.some(key => key == item.resourceId)) {
                parentTree.newChildren.push(item);
            } else {
                item.children
                    && this.getChildDisplayTree(item, item.children, checkedKeys)
                    && parentTree.newChildren.push(item);
            }
        });

        // 返回是否有子孙节点被选中
        return this.hasChildrenChecked(parentTree, checkedKeys);
    }

    hasChildrenChecked = (item, checkedKeys) => {
        return checkedKeys.some(key => {
            if (key == item.resourceId) {
                return true;
            } else if (item.children && item.children.some(child => this.hasChildrenChecked(child, checkedKeys))) {
                return true;
            } else {
                return false;
            }
        });
    }

    render() {
        const data = this.props.data;

        // 缓存已经选中的树
        const tree = this.state.renderTree.resources;
        const checkedKeys = this.state.checkedList.find(
            item => item.operationCode === this.state.renderTree.operationCode
        ).resources;

        this.getDisplayTree(tree, checkedKeys);

        return (
            <Modal
                visible={this.props.visible}
                title="权限设置"
                onOk={this.handleSubmit}
                onCancel={() => this.props.onCancel()}
                className="setRoleModal-wrapper"
                width={1000}
                cancelText='取消'
                okText='确认'
                okButtonProps={{
                    disabled: this.props.setOperation === 1
                }}>
                {data && data.length && <div className="setRole-wrapper">
                    <div className="setRole-select-wrapper">
                        <Select value={this.state.renderTree.operationCode}
                            onChange={this.changeTree}
                            className="setRole-select">
                            {data.map(item => <Select.Option
                                value={item.operationCode}
                                key={item.operationCode}>
                                {item.operationName}
                            </Select.Option>)}
                        </Select>
                    </div>
                    <div className="setRole-tree-wrapper">
                        <div className="tree-check">
                            <Tree checkable
                                defaultExpandAll
                                key={this.state.renderTree.operationCode}
                                checkedKeys={this.state.checkedList.find(
                                        item => item.operationCode === this.state.renderTree.operationCode
                                    ).resources}
                                onCheck={checkedKeys => {
                                    // 过滤掉 key 为 hideKey的节点
                                    checkedKeys = checkedKeys.filter(key =>
                                        key.indexOf(this.hideKey) === -1
                                    );

                                    let checkedList = this.state.checkedList.map(item => {
                                        if (item.operationCode === this.state.renderTree.operationCode) {
                                            item.resources = checkedKeys;
                                        }

                                        return item;
                                    });

                                    this.setState({
                                        checkedList
                                    });
                                }}>
                                {this.renderTreeNode(this.state.renderTree.resources)}
                            </Tree>
                        </div>
                        <div className="tree-display">
                            <Tree
                                showIcon
                                defaultExpandAll
                                key={this.state.renderTree.operationCode}>
                                {this.renderTreeNode(this.displayTree, true)}
                            </Tree>
                        </div>
                    </div>
                </div>}
            </Modal>
        );
    }
}
