/**
 * @file 添加角色
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Input, Modal, Button, Form, Select, Checkbox} from 'antd';

export default class AddRoleForm extends Component {
    constructor (props) {
        super(props);

        let checkedList = [];

        this.props.data.forEach(item => {
            let resources = [];
            this.getOwnList(item.resources, resources);

            checkedList.push({
                operationCode: item.operationCode,
                resources
            });
        });

        this.state = {
            checkedList
        }
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
            // 如果父元素被选中就不再寻找子元素是否被选中
            if (this.state.checkedList.find(item =>
                item.operationCode === operationCode).resources.indexOf(item.resourceId) !== -1) {
                submitData.push(item.resourceId);
            } else {
                if (item.children) {
                    this.filterCheckedList(item.children, operationCode, submitData);
                }
            }
        });
    }

    handleClick = (e, col, row) => {
        $(`.col${col + 1}`).hide();
        $(`.row${row}.col${col + 1}`).show();

        // 清除选中的节点下游节点的样式
        $(`.col${col} .active-line`).removeClass('active-line');

        // 清除后续节点的选择，都选中第一项
        let len = col + 2;
        for (let i = len; $(`.col${i}`).length; i++) {
            $(`.col${i}`).hide();
            $(`.row1.col${i}`).show();
        }

        // 下划线
        $('.active-item').removeClass('active-item');
        $(e.target).addClass('active-item');

        // 字体颜色
        $(e.target).parent().addClass('active-line');

        $(e.target).parent().find('.row').children('li:first-child').addClass('active-line');
    }

    handleChange = (e, children, item, checkedListObj) => {
        let checked = e.target.checked;
        let value = e.target.value;

        let operationCode = checkedListObj.operationCode;
        let checkedList = checkedListObj.resources;

        if (checked) {
            checkedList.push(value);

            // 如果有子元素，则子元素全部选中
            if (children) {
                this.checkedChildValue(children, checkedList)
            }

            // 判断其父元素下面的子元素是否全部选中，如果是则将父元素选中
            // let parentValues = [];
            //
            // this.props.data.forEach(item => {
            //     this.findParents(item.resources, value, parentValues);
            // });
            //
            // parentValues = [...new Set(parentValues)];
            //
            // let parentNode = [];
            //
            // // 根据 parentValue 来找到对应树中的节点
            // let dataObj = this.props.data.find(item => item.operationCode === operationCode);
            // if (dataObj) {
            //     parentValues.length && parentValues.forEach(value => {
            //         this.findNodeWithValue(dataObj.resources, value, parentNode);
            //     });
            // }
            //
            // // parentNode需要能保证子-父的顺序
            // parentNode.forEach(node => {
            //     // 如果子节点全部被选中就选中父节点
            //     if (node.children.every(item => checkedList.some(id => id === item.resourceId))) {
            //         checkedList.push(node.resourceId);
            //     }
            // });
        } else {
            let index = checkedList.indexOf(value);
            checkedList.splice(index, 1);

            // 将其父元素和子元素都置为不选中状态
            this.unCheckedParensValue(value, checkedList);

            if (children) {
                this.unCheckedChildValue(children, checkedList);
            }
        }

        const newChecklist = this.state.checkedList.filter(item =>
            item.operationCode !== operationCode);

        newChecklist.push({
            operationCode: operationCode,
            resources: checkedList
        });

        this.setState({
            checkedList: newChecklist
        });
    }

    // 根据 value 的值查找树结构上的节点
    findNodeWithValue = (list, value, parentNode) => {
        let findItem = list.find(item => item.resourceId === value);
        if (!findItem) {
            list.find(item => {
                item.children && this.findNodeWithValue(item.children, value, parentNode);
            });
        } else {
            parentNode.push(findItem);
            return true;
        }
    }

    checkedChildValue = (children, checkedList) => {
        children.forEach(item => {
            (checkedList.indexOf(item.resourceId) === -1) && checkedList.push(item.resourceId);

            if (item.children) {
                this.checkedChildValue(item.children, checkedList);
            }
        });
    }

    unCheckedChildValue = (children, checkedList) => {
        children.forEach(item => {
            let index = checkedList.indexOf(item.resourceId);
            if (index !== -1) {
                checkedList.splice(index, 1);

                item.children && this.unCheckedChildValue(item.children, checkedList);
            }
        });
    }

    findParent = (list, value) => {
        let parentValue;

        let find = list.find(item => {
            if (item.children && item.children.find(child => {
                return child.resourceId === value;
            })) {
                parentValue = item.resourceId
                return true;
            }
        });

        if (find) {
            return parentValue;
        } else {
            let len = list.length;

            for (let i = 0; i < len; i++) {
                if (list[i].children) {
                    parentValue = this.findParent(list[i].children, value);

                    if (parentValue) {
                        return parentValue;
                    }
                }
            }
        }
    }

    findParents = (list, value, parentValues = []) => {
        let parentValue = this.findParent(list, value);

        if (parentValue) {
            parentValues.push(parentValue)
            this.findParents(list, parentValue, parentValues);
        }

        return parentValues;
    }

    unCheckedParensValue = (value, checkedList) => {
        let parentValues = [];

        this.props.data.forEach(item => {
            this.findParents(item.resources, value, parentValues);
        });

        parentValues.forEach(item => {
            let index = checkedList.indexOf(item);

            if (index !== -1) {
                checkedList.splice(index, 1);
            }
        });
    }

    renderCheckboxUl = (list, checkedList, col = 0, row = 1) => {
        col += 1;

        return <ul className={`col${col} row${row} row`}
            ref={
                el => {
                    if (!$(el).find('ul').length) {
                        $(el).addClass('last-ul');
                    }
                }
            }>
                {list.map((item, index) => {
                    let row = index + 1;
                    return <li key={item.resourceId}
                        className={`${(row === 1 && 'active-line' || '')} ${!item.children && 'last-line' || '' }`}>
                        <Checkbox
                            checked={checkedList && checkedList.resources.some(id => (
                                id === item.resourceId
                            ))}
                            value={item.resourceId}
                            key={item.resourceId}
                            onChange={e => this.handleChange(e, item.children, item, checkedList)}
                            disabled={this.props.setOperation === 1}
                            onClick={e => {
                                $(e.target).parents('label').siblings().click();
                            }}></Checkbox>
                        <span
                            onClick={e => this.handleClick(e, col, row)}
                            className="click-area">{item.resourceName}</span>
                        {item.children && this.renderCheckboxUl(item.children, checkedList, col, row)}
                    </li>;
                })}
        </ul>
    }

    getSelectedTree = (list, checkedListObj) => {
        let parentValues = [];
        checkedListObj && checkedListObj.resources.forEach(item => {
            this.findParents(list, item, parentValues);
        });

        return [...new Set(parentValues)];
    }

    renderSelectedUl = (list, checkedListObj) => {
        if (!checkedListObj) {
            return;
        }

        let parentValues = this.getSelectedTree(list, checkedListObj);

        return <ul>
            {list.map(item => {
                // 展示选中的节点的父节点
                if (parentValues.indexOf(item.resourceId) !== -1) {
                    return <li key={item.resourceId}>
                        {item.resourceName}
                        {item.children
                        && this.renderSelectedUl(item.children, checkedListObj)}</li>;
                } else if (checkedListObj.resources.indexOf(item.resourceId) !== -1) {
                    return <li key={item.resourceId}>{item.resourceName}</li>;
                }
            })}
        </ul>;
    }

    render() {
        const data = this.props.data;

        return (
            <Modal
                visible={this.props.visible}
                title="权限设置"
                onOk={this.handleSubmit}
                onCancel={() => this.props.onCancel()}
                className="setRoleModal1-wrapper"
                width={1000}
                cancelText='取消'
                okText='确认'
                okButtonProps={{
                    disabled: this.props.setOperation === 1
                }}>
                {data && <div>
                    <div className='operator-area'>
                        <div className='select-wrapper'>
                            <Select
                                defaultValue={data[0] && data[0].operationCode}
                                onChange={value => {
                                    $('.edit-type').hide();
                                    $(`.${value}`).show();
                                }}
                                className='select-header'>
                                {data.map((item, index) => (
                                    <Select.Option value={item.operationCode}
                                        key={item.operationCode}
                                        >{item.operationName}</Select.Option>
                                ))}
                            </Select>
                        </div>
                        <div className="edit-wrapper">
                            {data.map((list, index) => (
                                <div className={`edit-type ${list.operationCode}`} key={list.operationCode}>
                                    <div className="operation-wrapper">
                                        {this.renderCheckboxUl(list.resources,
                                            this.state.checkedList.find(
                                                item => item.operationCode === list.operationCode
                                            )
                                        )}
                                    </div>
                                    <h5 className='selected-header'>{`${list.operationName}权限`}</h5>
                                    <div className="selected-wrapper">
                                        {this.renderSelectedUl(list.resources,
                                            this.state.checkedList.find(
                                                item => item.operationCode === list.operationCode
                                            )
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>}
            </Modal>
        )
    }
}
