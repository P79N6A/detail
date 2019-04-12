/**
 * @file 公共的模型详情页面
 * @author
 */
import React from 'react';
import './editScoreRule.less';
import jsonqueryjs from 'jsonqueryjs/json.js';
import common from '../../components/common.js';
import config from '../../../config/project.config.jsx';
import request from '../system/request.jsx';
import { Button, Input, Select, Popover, notification, Modal } from 'antd';
const Option = Select.Option;
import DuTable from '../../components/antComponent/duTable/duTable.jsx';
import formatTableData from '../../components/antComponent/Integration/formatTableData.jsx';
import localTableData from '../localData/localTable.jsx';

class RuleEditCommon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newDecisionModalVisible: false, // 新建决策弹出层
            popoverVisible: false, // 参数选择浮层开关控制
            selectedInputKeys: [], // 标记参数选择的选中项
            ruleScoreDetail: {},
            expandedRowKeys: [],
            showEditBox: false,
            decisionList: [],
            modelList: [], // 模型列表，跳转至新模型 进行模型选择需要
            modelDetail: {}, // 规则对应的模型详情数据，此模块主要为获取模型的参数列表
            showModelChoose: false,  // 控制规则编辑  模型选择item展示与否
            formModelCode: undefined,
            formResCode: undefined,
            conditionType: ''  // 编辑当前的condition是编辑状态还是add状态
        };
        this.JUMPTOCODE = 'resulttype_00001'; // 跳转至新模型code
        this.NEW = 'resulttype_00000'; // 新建决策code
    }
    componentWillMount() {
        // 拷贝复制数据，后续对数据的操作都是对此数据进行操作
        this.originData = jsonqueryjs.toolUtil.deepCopy(this.props.origin);
        // 获取当前流程的模型数量
        this.modelsNumber = this.getProcessModelsLength();
        // 依据编辑项对originData进行修改
        this.editTag = this.props.editTag;
        // 新加/编辑规则对象, 如果是编辑-则为规则；如果为添加，则为规则或者模型
        this.activeData = jsonqueryjs.toolUtil.deepCopy(this.props.data);
        // origindata发生变化的时候触发
        this.onOriginDataChange = this.props.onChange;
    }

    getProcessModelsLength = () => {
        var processModelList = jsonqueryjs.queryNodes({
            data: this.originData,
            key: 'processType',
            value: 'MODEL'
        });
        return processModelList.length;
    }

    componentDidMount() {
        this.getDecisionList();
        this.getModelDetail();
        this.getModelList();
    }

    getDecisionList() {
        var self = this;
        let params = {};
        request({
            isParallel: true,
            url: config.api.processDecisionList,
            data: params,
            success: data => {
                self.setState({
                    decisionList: data.content
                });
            }
        });
    }
   
    getModelDetail() {
        var self = this;
        let params = {isExist: true};
        params.modelId = this.props.modelcode;
        request({
            isParallel: true,
            url: config.api.modelDetail,
            data: params,
            success: data => {
                self.setState({
                    modelDetail: data.content
                });
            }
        });
    }

    getModelList() {
        var self = this;
        let params = {};
        request({
            isParallel: true,
            url: config.api.processModelList,
            data: params,
            success: data => {
                self.setState({
                    modelList: data.content
                });
            }
        });
    }

    formatData() {
        var activeItem = this.activeData;
        var activeItemKey = activeItem.tmpKey;
        if (this.editTag === '1') {
            // 添加下一步规则
            if (activeItem.processType === 'MODEL') {
                var queryResult = jsonqueryjs.queryNodes({
                    data: this.originData,
                    key: 'tmpKey',
                    value: activeItemKey
                })[0];
                var data = (queryResult.ruleList[0] && queryResult.ruleList[0]['tmpNewFlag'] ? queryResult.ruleList[0] : []);
            } else {
                var queryResult = jsonqueryjs.queryAfterSibling2({
                    data: this.originData,
                    key: 'tmpKey',
                    value: activeItemKey
                })[0];
                var data = (queryResult[0] && queryResult[0]['tmpNewFlag'] ? queryResult[0] : []);
            }
        } else if (this.editTag === '-1') {
            // 添加上一步规则
            var queryResult = jsonqueryjs.queryPreSibling2({
                data: this.originData,
                key: 'tmpKey',
                value: activeItemKey
            })[0];
            var data = (queryResult[0] && queryResult[0]['tmpNewFlag'] ? queryResult[0] : []);
        } else {
            // 当前项编辑
            var queryResult = jsonqueryjs.queryNodes({
                data: this.originData,
                key: 'tmpKey',
                value: activeItemKey
            })[0];
            var data = queryResult
        }
        var conditions = data.toList || [];
        var ruleType = data.ruleType;
        var results = [];
        for (var i = 0; i < conditions.length; i++) {
            var tmpCondition = conditions[i];
            if (ruleType === 'SCORE') {
                results.push({
                    tmpKey: tmpCondition.tmpKey,
                    input: tmpCondition.condition.input,
                    minValue: tmpCondition.condition.value[0],
                    maxValue: tmpCondition.condition.value[1],
                    resCode: tmpCondition.condition.resCode,
                    resName: tmpCondition.condition.resName || '',
                    to: tmpCondition.to || []
                });
            } else {
                results.push({
                    tmpKey: tmpCondition.tmpKey,
                    input: tmpCondition.condition.input,
                    opName: tmpCondition.condition.opName || (tmpCondition.condition.op === 'EQUAL' ? '命中' : '非命中'),
                    value: tmpCondition.condition.value,
                    resCode: tmpCondition.condition.resCode,
                    resName: tmpCondition.condition.resName || '',
                    to: tmpCondition.to || []
                });
            }
        }
        return results;
    }
    // 编辑／删除按钮单击事件
    handleTableClick = (id, type, data) => {
        var self = this;
        if (type === 'edit') {
            self.resetFormItems();
            self.setState({
                showEditBox: false,
                expandedRowKeys: [id],
                showModelChoose: true,
                conditionType: 'edit'
            });
        } else if (type === 'delete') {
            self.originData = jsonqueryjs.delete2({
                data: self.originData,
                key: 'tmpKey',
                value: id
            });
            self.resetFormItems();
            self.setState({
                expandedRowKeys: [],
                showModelChoose: false
            });
            self.onOriginDataChange(self.originData);
            this.modelsNumber = this.getProcessModelsLength();
        }
    }
    // 添加新规则
    addNewSubRule = () => {
        var self = this;
        self.resetFormItems();
        self.setState({
            expandedRowKeys: [],
            showEditBox: true,
            showModelChoose: false,
            conditionType: 'add'
        });
    }

    // 重置表单中相关参数
    resetFormItems() {
        this.setState({
            formResCode: undefined,
            formModelCode: undefined
        })
    }

    // 取消编辑
    cancelEdit = () => {
        this.setState({
            expandedRowKeys: [],
            showEditBox: false
        });
    }

    // 保存／更新子规则
    saveOrUpdateSubRule = (e) => {
        this.clearError();
        var tmpKey = $('.rule-form-key').val(),
        inputValue = $('.score-input').text(),
              minValue = $('.score-minValue').val(),
              maxValue = $('.score-maxValue').val(),
               resCode = this.state.formResCode,
               modelCode = this.state.formModelCode;
        // 首先需要验证参数
        if (!inputValue) {
            $('.score-input').parents('.rule-form-input').children('.rule-form-error').text('请选择参数!');
            return;
        }
         if (!minValue || !/^-?[0-9]+.?[0-9]*$/g.test(minValue)) {
            $('.score-minValue').parents('.rule-form-input').children('.rule-form-error').text('请输入准确数值!');
            return;
        }
         if (!maxValue || !/^-?[0-9]+.?[0-9]*$/g.test(maxValue)) {
            $('.score-maxValue').parents('.rule-form-input').children('.rule-form-error').text('请输入准确数值!');
            return;
        }
        if ((maxValue * 1) < (minValue * 1)) {
            $('.score-maxValue').parents('.rule-form-input').children('.rule-form-error').text('该数值不能小于最小值!');
            return;
        }
        if (!resCode) {
            $('.score-resCode').parents('.rule-form-input').children('.rule-form-error').text('请选择决策类型!');
            return;
        }
        if (resCode === this.JUMPTOCODE && !modelCode) {
            $('.score-modelCode').parents('.rule-form-input').children('.rule-form-error').text('请选择决策类型!');
            return;
        }
        // 对数据this.editRuleData进行修改
        var ruleCondition = {
            tmpKey: tmpKey ? tmpKey : common.guid(),
            condition: {
                tmpKey: common.guid(),
                input: inputValue,
                op: 'BETWEEN',
                value: [minValue * 1, maxValue * 1],
                resName: this.getResNameWithCode(resCode),
                resCode: resCode
            },
            to: resCode === this.JUMPTOCODE ?
                [{
                    tmpKey: common.guid(),
                    processType: 'MODEL',
                    modelCode: modelCode,
                    modelName: this.getModelNameByModelCode(modelCode),
                    ruleType: '',
                    ruleList: []
                }]
                : []
        };
        if (tmpKey) {
            // 说明存在此condition,直接进行替换即可
            this.originData = jsonqueryjs.replace2({
                data: this.originData,
                key: 'tmpKey',
                value: tmpKey,
                target: {
                    key: 'ignore',
                    value: ruleCondition
                }
            });
        } else {
            var activeItem = this.activeData;
            var activeItemKey = activeItem.tmpKey;
            var newRule = {
                tmpKey: common.guid(),
                processType: 'RULE',
                tmpNewFlag: 'new', // 标记此规则在数据中已添加
                modelCode: '',
                ruleType: 'SCORE',
                toList: [ruleCondition]
            };
            // 不存在，说明进行条件添加，进行条件添加之前需要首选判断规则是否已添加
            if (this.editTag === '1') {
                // 下一步分数规则添加
                if (this.activeData.processType === 'MODEL') {
                    var queryResult = jsonqueryjs.queryNodes({
                        data: this.originData,
                        key: 'tmpKey',
                        value: activeItemKey
                    })[0];
                    var isRuleAdded = queryResult.ruleList[0] && queryResult.ruleList[0]['tmpNewFlag'] ? true : false;
                    if (isRuleAdded) {
                        // 说明规则已添加，此时直接添加condition条件即可
                        queryResult.ruleList[0].toList.push(ruleCondition);
                    } else {
                        queryResult.ruleList.splice(0, 0, newRule);
                    }
                } else {
                    var queryResult = jsonqueryjs.queryAfterSibling2({
                        data: this.originData,
                        key: 'tmpKey',
                        value: activeItemKey
                    })[0];
                    var isRuleAdded= queryResult[0] && queryResult[0]['tmpNewFlag'] ? true : false;
                    if (isRuleAdded) {
                        // 说明规则已添加，此时直接添加condition条件即可
                        queryResult[0].toList.push(ruleCondition);
                    } else {
                        this.originData = jsonqueryjs.insertAfter2({
                            data: this.originData,
                            key: 'tmpKey',
                            value: activeItemKey,
                            target: {
                                key: 'ignore',
                                value: newRule
                            }
                        });
                    }
                }
            } else if (this.editTag === '-1') {
                var queryResult = jsonqueryjs.queryPreSibling2({
                    data: this.originData,
                    key: 'tmpKey',
                    value: activeItemKey
                })[0];
                var isRuleAdded= queryResult[0] && queryResult[0]['tmpNewFlag'] ? true : false;
                if (isRuleAdded) {
                    // 说明规则已添加，此时直接添加condition条件即可
                    queryResult[0].toList.push(ruleCondition);
                } else {
                    this.originData = jsonqueryjs.insertBefore2({
                        data: this.originData,
                        key: 'tmpKey',
                        value: activeItemKey,
                        target: {
                            key: 'ignore',
                            value: newRule
                        }
                    });
                }
            } else {
                // 当前规则编辑
                var queryResult = jsonqueryjs.queryNodes({
                    data: this.originData,
                    key: 'tmpKey',
                    value: activeItemKey
                })[0];
                queryResult.toList.push(ruleCondition);
            }
        }
        this.onOriginDataChange(this.originData);
        this.modelsNumber = this.getProcessModelsLength();
        this.cancelEdit();
    }

    getModelNameByModelCode = (modelCode) => {
        var modelList = this.state.modelList || [];
        for (var i = 0; i < modelList.length; i++) {
            if (modelList[i]['modelCode'] === modelCode) {
                return modelList[i]['modelName'];
            }
        }
        return '';
    }

    // 晴空form表单中错误信息
    clearError() {
        $('.rule-form-error').text('');
    }

    // 新建决策‘’确定
    createNewDecision = () => {
        var newDecision = this.refs.newDecisionInput.refs.input.value;
        if (!newDecision) {
            notification.error({
                message: '错误提示',
                description: '请输入决策名称'
            });
            return;
        }
        var self = this;
        var params = {
            resultDesc: newDecision
        };
        request({
            isParallel: true,
            url: config.api.processDecisionAdd,
            data: params,
            type: 'POST',
            contentType: 'application/json',
            success: data => {
                self.setState({
                    decisionList: [{
                        resultCode: data.content.resultCode,
                        resultDesc: data.content.resultDesc}].concat(this.state.decisionList),
                    newDecisionModalVisible: false,
                    formResCode: data.content.resultCode,
                    showModelChoose: false
                });
            }
        });
    }

    // 根据决策的code获取决策对应的name中文名
    getResNameWithCode(code) {
        var items = this.state.decisionList;
        var results = items.filter(function (item) {
            return item.resultCode === code;
        });
        return results[0]['resultDesc'];
    }

    // 决策下拉列表展示区域
    handleDecisionListSelectChange = (value) => {
        this.clearError();
        if (value === this.NEW) {
            // 新建决策
            this.setState({
                newDecisionModalVisible: true
            });
        } else {
            this.setState({
                formResCode: value,
                showModelChoose: (value === this.JUMPTOCODE) ? true: false
            });
        }
    }

    // 模型选择需要
    handleModelListSelectChange = (value) => {
        this.clearError();
        this.setState({
            formModelCode: value
        })
    }

    // 参数选择单选框按钮触发
    onInputsSelectChange = (value) => {
        this.setState({
            selectedInputKeys: value
        })
    }

    // 获取参数选择列表框区域
    getInputsContentTpl() {
        let resData = formatTableData({
            data: this.state.modelDetail.respParams,
            table: localTableData.flow['modelRespParam']
        });
        return (<div>
            <div className="rule-form-input-table">
            <DuTable tableWidth ={550} 
                keyName="name"
                listData={resData}
                selectParams={{
                    selectedRowKeys: this.state.selectedInputKeys,
                    type: "radio",
                    onSelectChange: this.onInputsSelectChange
                }}
            >
            </DuTable></div>
            <div style={{marginBottom: '5px', textAlign: 'center', marginTop: '10px'}}>
                <Button key="cancel" style={{marginRight: '20px'}} onClick={this.cancelPopover}>取消</Button>
                <Button key="submit" type="primary" onClick={this.setInputValuePover}>确定</Button>
            </div>
        </div>);
    }
    cancelPopover = () => {
        this.setState({
            popoverVisible: false
        });
    }
    // 参数选择浮层 确定按钮
    setInputValuePover = () => {
        if (!this.state.selectedInputKeys.length) {
            notification.error({
                message: '错误提示',
                description: '请选择参数'
            });
            return;
        }
        $('.score-input').text(this.state.selectedInputKeys[0]);
        this.cancelPopover();
    }
    // 控制参数选择浮层，事件监听
    handlePopoverVisibleChange = (visible) => {
        this.clearError();
        var inputValue = $('.score-input').text();
        this.setState({
            popoverVisible: visible,
            selectedInputKeys: inputValue ? [inputValue] : []
        });
    }
    // 参数添加／编辑区域
    handleExpandedRender = (editItem) => {
        var self = this;
        // 设置决策类型选择
        this.state.formResCode = this.state.formResCode ? 
                                   this.state.formResCode 
                                   : (editItem ? editItem.resCode : undefined);
        this.state.formModelCode = this.state.formModelCode ? 
                                   this.state.formModelCode 
                                   : ((editItem && editItem.to[0]) ? editItem.to[0].modelCode : undefined);
        // 设置模型选择
        return <div className="rule-form">
            <Input className="rule-form-key" type="hidden" defaultValue={editItem ? editItem.tmpKey : ''}/>
            <div className="rule-form-item">
                <label className="rule-form-label rule-form-label-required">参数：</label>
                <div className="rule-form-input">
                    <span ref="scoreinput" className="score-input">{editItem ? editItem.input : ''}</span>
                    <Popover title="选择参数" trigger="click" content={this.getInputsContentTpl()} 
                        getPopupContainer={() => document.getElementById('editRuleScoreBox')}
                        visible={this.state.popoverVisible}
                        onVisibleChange={this.handlePopoverVisibleChange}
                    >
                        <span className="rule-form-choose" >{editItem ? '重新选择' : '参数选择'}</span>
                    </Popover>
                    <i className="rule-form-error"></i>
                </div>
            </div>
            <div className="rule-form-item">
                <label className="rule-form-label rule-form-label-required">最小值：</label>
                <div className="rule-form-input">
                    <Input style={{width: 150}} onChange={this.clearError} className="score-minValue" placeholder="输入数字，包含最小值" defaultValue={editItem ? editItem.minValue : ''}/>
                    <i className="rule-form-error"></i>
                </div>
            </div>
            <div className="rule-form-item">
                <label className="rule-form-label rule-form-label-required">最大值：</label>
                <div className="rule-form-input">
                    <Input style={{width: 150}} onChange={this.clearError} className="score-maxValue" placeholder="输入数字，包含最大值" defaultValue={editItem ? editItem.maxValue : ''}/>
                    <i className="rule-form-error"></i>
                </div>
            </div>
            <div className="rule-form-item">
                <label className="rule-form-label rule-form-label-required">决策：</label>
                <div className="rule-form-input">
                    <Select
                        style={{width: 150}}
                        placeholder="选择决策"
                        className="score-resCode"
                        defaultActiveFirstOption={true}
                        value={this.state.formResCode}
                        getPopupContainer={() => document.getElementById('editRuleScoreBox')}
                        onChange={this.handleDecisionListSelectChange}
                    >
                       {this.state.decisionList.map(function (item, index) {
                            if (self.modelsNumber >= 2 && self.state.formResCode !== self.JUMPTOCODE && item.resultCode === self.JUMPTOCODE) {
                                return null;
                            }
                            return <Option key={index} value={item.resultCode}>{item.resultDesc}</Option>
                       })}
                    </Select>
                    <i className="rule-form-error"></i>
                </div>
            </div>
            {(((this.state.formResCode === this.JUMPTOCODE) || !editItem) && this.state.showModelChoose) ?
                <div className="rule-form-item">
                    <label className="rule-form-label rule-form-label-required">模型：</label>
                    <div className="rule-form-input">
                        <Select
                            style={{width: 150}}
                            placeholder="选择模型"
                            className="score-modelCode"
                            value={this.state.formModelCode}
                            getPopupContainer={() => document.getElementById('editRuleScoreBox')}
                            onChange={this.handleModelListSelectChange}
                        >
                           {this.state.modelList.map(function (item, index) {
                               return <Option key={index} value={item.modelCode}>{item.modelName}</Option>
                           })}
                        </Select>
                        <i className="rule-form-error"></i>
                    </div>
                </div>
                : null
            }
            <div style={{marginBottom: '10px', textAlign: 'left', paddingLeft: '90px', marginTop: '10px'}}>
                <Button key="cancel" style={{marginRight: '20px'}} onClick={this.cancelEdit}>取消</Button>
                <Button key="submit" type="primary" onClick={this.saveOrUpdateSubRule}>确定</Button>
            </div>
        </div>;
    }
    render() {
        var formatData = this.formatData();
        let resData = formatTableData({
            data:  formatData,
            table: localTableData.flow['ruleScoreEdit']
        });
        return (
            <div id="editRuleScoreBox" className="rule-edit-score-box">
                {resData.data.length ? <DuTable
                    keyName="tmpKey"
                    tableWidth ={400}
                    listData={resData}
                    onClick={this.handleTableClick}
                    expandedRowKeys={this.state.expandedRowKeys}
                    onExpandedRowRender={this.handleExpandedRender}
                >
                </DuTable> : null}
                {(this.state.showEditBox  || !resData.data.length) ? 
                    <div className="score-rule-add-box">{this.handleExpandedRender()}</div>
                    : <Button className="score-rule-add" type="primary" onClick={this.addNewSubRule}>添加子规则</Button>
                }
                <Modal
                    title="新建决策"
                    width="500px"
                    wrapClassName="rule-edit-score-box"
                    maskClosable={false}
                    style={{marginTop: "80px"}}
                    visible={this.state.newDecisionModalVisible}
                    onCancel={() => {this.setState({newDecisionModalVisible: false})}}
                    onOk={this.createNewDecision}
                    getPopupContainer={() => document.getElementById('editRuleScoreBox')}
                >
                    <div className="rule-form-item">
                        <label className="rule-form-label rule-form-label-required">决策名</label>
                        <div className="rule-form-input">
                            <Input style={{width: 330}} ref="newDecisionInput" className="decision-input" placeholder="输入决策名称" defaultValue=""/>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

module.exports = RuleEditCommon;



