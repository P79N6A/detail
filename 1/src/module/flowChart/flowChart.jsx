/**
 * @file 流程图
 * @author
 */
import React from 'react';
import {Menu, Dropdown, Popover} from 'antd';
import OPTIONS from '../localData/options.jsx';
import jsonqueryjs from 'jsonqueryjs/json.js';
import style from './flowChart.useable.less';

const SubMenu = Menu.SubMenu;

export default class FlowChart extends React.Component {
    // 状态层
    state = {
        isRender: false, // 是否显示编辑下拉框
        status: this.props.status, // 流程图是编辑还是查看状态
        popoverVisible: false // 是否显示超出部分
    }
    // 需要返回的参数
    options = {
        processType: '',
        modelCode: '',
        tmpKey: '',
        type: ''
    }
    // 页面数据
    pageData = {
        islastRule: false,
        isContainModel: false,
        activeTmpKey: null
    }
    // 划入的时候显示
    showPopover = e => {
        this.pageData.activeTmpKey = e.target.getAttribute('tmpkey');
        this.setState({popoverVisible: true});
    }
    // 流程规则的转化
    transformToValue = targetData => {
        OPTIONS.RULE_TYPE && OPTIONS.RULE_TYPE.forEach(item => {
            if (targetData === item.value) {
                targetData = item.displayName;
            }
        });
        return targetData;
    }
    // 划入获取元素属性,数据处理
    handleGetAttribute = e => {
        e.preventDefault();
        const tmpkey = e.target.getAttribute('tmpKey');
        if (!tmpkey) {
            return;
        }
        const itemData = jsonqueryjs.queryNodes({
            data: this.props.data,
            key: 'tmpKey',
            value: tmpkey
        });
        this.handleIsLastRule(tmpkey);
        this.handleIsContainModel(tmpkey);
        // 需要返回的参数
        this.options.tmpKey = tmpkey;
        this.options.processType = itemData[0].processType;
        this.options.modelCode = e.target.getAttribute('modelcode') || itemData[0].modelCode;
        this.setState({
            isRender: true,
            popoverVisible: false
        });
    }
    // 判断是否是最后一条规则
    handleIsLastRule = tmpkey => {
        const ruleResult = jsonqueryjs.queryAfterSibling2({
            data: this.props.data,
            key: 'tmpKey',
            value: tmpkey
        });
        this.pageData.islastRule = false;
        if (ruleResult[0].length === 0) {
            this.pageData.islastRule = true;
        }
    }
    // 判断规则里面是否有通过'下一步'创建的模型
    handleIsContainModel = tmpkey => {
        this.pageData.isContainModel = false;
        const queryResults = jsonqueryjs.queryParents({
            data: this.props.data,
            key: 'tmpKey',
            value: tmpkey
        })[0];
        const lastModelList = queryResults[queryResults.length - 3];
        if (lastModelList && lastModelList.tmpKey) {
            const modelResult = jsonqueryjs.queryAfterSibling2({
                data: this.props.data,
                key: 'tmpKey',
                value: lastModelList.tmpKey
            });
            this.pageData.isContainModel = modelResult[0].length !== 0 ? true : false;
        }
    }
    // item点击事件
    handleItemClick = e => {
        const type = e.item.props.type;
        this.options.type = type;
        if (type) {
            this.props.handleItemClick(this.options);
        }
    }
    handleMenu = () => {
        this.props.onMenuClick && this.props.onMenuClick();
    }
    // 获取高度
    getHeight = data => {
        let height = 0;
        let baseHeight = data => {
            Array.isArray(data) && data.forEach((item, index) => {
                if (item && item.processType) {
                    height += 30;
                    height += index !== 0 ? 30 : 0;
                    if (item.ruleList && item.ruleList.length) {
                        height += 80;
                        item.ruleList && item.ruleList.forEach(item => {
                            item.toList && item.toList.forEach(toItem => {
                                if (toItem.to && toItem.to.length) {
                                    height += 60;
                                    baseHeight(toItem.to);
                                }
                            });
                        });
                    }
                }
            });
        };
        baseHeight(data);
        return height;
    }

    componentWillMount() {
        style.use();
    }
    componentWillUnmount() {
        style.unuse();
    }

    render() {
          // 编辑的menu
            const menu = this.state.isRender && this.state.status === 'edit' ? (
                <Menu onClick={this.handleItemClick}>
                    <Menu.Item type="view">查看</Menu.Item>
                    <Menu.Item type="delete">删除</Menu.Item>
                    {
                        this.options.processType === 'MODEL'
                        ? (<Menu.Item type= "change">更换</Menu.Item>)
                        : <Menu.Item type= "edit">编辑</Menu.Item>
                    }
                    {
                        this.options.processType === 'RULE'
                        ? (
                            <SubMenu title = "添加上一步规则">
                                <Menu.Item type = "prevHit">命中规则</Menu.Item>
                                <Menu.Item type = "prevScore">分数规则</Menu.Item>
                                <Menu.Item type = "prevWhite">白名单规则</Menu.Item>
                            </SubMenu>
                        ) : null
                    }
                    {
                        this.options.processType === 'MODEL' ? (
                            <SubMenu title="添加下一步规则">
                                <Menu.Item type ="nextHit">命中规则</Menu.Item>
                                <Menu.Item type = "nextScore">分数规则</Menu.Item>
                                <Menu.Item type = "nextWhite">白名单规则</Menu.Item>
                            </SubMenu>
                        ) : null
                    }
                    {
                        this.options.processType === 'RULE' ? (
                            <SubMenu title = "添加下一步">
                                {
                                    this.options.processType === 'RULE' && this.pageData.islastRule && !this.pageData.isContainModel
                                    ? <Menu.Item type="nextModel">模型</Menu.Item>
                                    : null
                                }
                                <SubMenu title = "规则">
                                    <Menu.Item type ="nextHit">命中规则</Menu.Item>
                                    <Menu.Item type = "nextScore">分数规则</Menu.Item>
                                    <Menu.Item type = "nextWhite">白名单规则</Menu.Item>
                                </SubMenu>
                            </SubMenu>
                        ) : null
                    }
                </Menu>
            ) : (<Menu onClick={this.handleItemClick}>
                <Menu.Item type="view">查看</Menu.Item>
            </Menu>);


            // 流程图
            let data = this.props.data;
            let initLeft = 0;
            let initTop = 0;
            let continueType = false;
            let renderTemplate = ({initLeft, initTop, continueType, data}) => {
                let baseTemplate = Array.isArray(data) && data.map((firstItem, key) => {
                    // continue里面的模型
                    if (data.length > 1) {
                        continueType = true;
                        // 将原规则与通过下一步的模型再添加的规则进行区分
                        if (key === data.length - 1) {
                            continueType = false;
                        }
                    }
                    // 添加判断
                    if (!firstItem || !firstItem.processType || firstItem.processType === '') {
                        return false;
                    }
                    const dom = (
                        <div key={firstItem.tmpKey || firstItem.modelCode || key}>
                            <div
                                style = {{top: initTop, left: initLeft}}
                                className = {[
                                    'flow-chart-block',
                                    'flow-chart-model',
                                    firstItem.ruleList && firstItem.ruleList.length !== 0 && 'flow-chart-bottom'
                                ].join(' ')}
                            >
                                <Dropdown
                                    overlay = {menu}
                                    placement="bottomCenter"
                                    trigger ={['click']}
                                    onVisibleChange = {this.handleMenu}
                                >
                                    <Popover
                                        content = {firstItem.modelName}
                                        mouseEnterDelay = {0.3}
                                        overlayClassName="flow-chart-box-pop"
                                        visible = {this.state.popoverVisible && this.pageData.activeTmpKey === firstItem.tmpKey}                               
                                    >
                                        <p
                                            tmpkey = {firstItem.tmpKey}
                                            modelcode = {firstItem.modelCode}
                                            onClick={this.handleGetAttribute}
                                            onMouseEnter = {this.showPopover}
                                            onMouseLeave = {() => this.setState({popoverVisible: false})}
                                        >
                                            {firstItem.modelName}
                                        </p>
                                    </Popover>
                                </Dropdown>
                            </div>
                            {
                                firstItem.ruleList && firstItem.ruleList.map((item, key) => {
                                    // 模型里面的规则
                                    let tmp = false;
                                    item.toList.forEach(itemList => {
                                        if (itemList.to.length > 0) {
                                            tmp = true;
                                        }
                                    });
                                    return (<div
                                                key = {key}
                                                className = {[
                                                    'flow-chart-block',
                                                    'flow-chart-rule',
                                                    key !== firstItem.ruleList.length - 1 && 'flow-chart-left',
                                                    tmp && 'flow-chart-bottom',
                                                    key  === firstItem.ruleList.length - 1 && continueType && 'flow-chart-bottom'
                                                ].join(' ')}
                                                style={{left: initLeft + key * 150 + 'px', top: (initTop + 60) + 'px'}}>
                                                    <Dropdown
                                                        overlay = {menu}
                                                        placement="bottomCenter"
                                                        trigger = {['click']}
                                                    >
                                                        <p
                                                            tmpkey = {item.tmpKey}
                                                            modelcode = {firstItem.modelCode}
                                                            onClick={this.handleGetAttribute}
                                                        >
                                                            {this.transformToValue(item.ruleType)}
                                                        </p>
                                                    </Dropdown>
                                                    {item.toList && item.toList.map((itemList, key) => {
                                                        // jumpto 里面的模型
                                                        if (tmp) {
                                                            return (<div key={key}>
                                                                {renderTemplate({initLeft: 0, initTop: 60, data: itemList.to})}
                                                            </div>);
                                                        } else {
                                                            return null;
                                                        }
                                                    })}
                                            </div>);
                                })
                            }
                        </div>
                    );
                    initLeft += (firstItem.ruleList && firstItem.ruleList.length - 1) * 150;
                    initTop += 120;
                    return dom;
                });
                return baseTemplate;
            };
            let height = this.getHeight(data);
            return (
                <div className= "flow-chart" style={{height: height + 'px'}}>
                    {renderTemplate({initLeft, initTop, continueType, data})}
                </div>
            );
        }
}
