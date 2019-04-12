import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Modal, Button,Steps, Popover, Icon, notification} from 'antd';
import jsonqueryjs from 'jsonqueryjs/json.js';
import common from '../../../components/common.js';
import ModelDetail from '../../../module/modelDetail/modelDetail.jsx';
import request from '../../../module/system/request.jsx';
import ModelChoose from '../../../module/modelChoose/modelChoose.jsx';
import RuleDetail from '../../../module/ruleDetail/ruleDetail.jsx';
import EditScoreRule from '../../../module/editScoreRule/editScoreRule.jsx';
import EditHitRule from '../../../module/editHitRule/editHitRule.jsx';
import EditWhiteRule from '../../../module/whiteRule/whiteRule.jsx';
import FlowChart from '../../../module/flowChart/flowChart.jsx';
import config from '../../../../config/project.config.jsx';
import Crumb from '../../../module/crumb/crumb.jsx';
import getQueryString from '../../../module/Integration/getQueryString.jsx';

import './flowEdit.less';

const confirm = Modal.confirm;
const warning = Modal.warning;
const Step = Steps.Step;


class FlowEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            popupTipsVisible: false,
            modelDetailVisible: false,
            modelChooseVisible: false,
            ruleDetailVisible: false,
            ruleScoreEditVisible: false,
            ruleHitEditVisible: false,
            editItemTag: '1',  // ‘1’代表添加下一步规则/模型，‘-1’代表添加上一步规则，‘0’代表编辑当前规则／模型
            originData: [], // 总数据
            activeItem: null,
            activeModelCode: '', // 单击选中模型／规则需要设置此值
            ruleWhiteVisible: false  // 白名单规则
        };
        this.CONTINUECODE = 'resulttype_00002';
    }

    componentDidMount() {
        this.getProcessDetail();
    }

    getProcessDetail() {
        var self = this;
        let params = {
            processCode: getQueryString('code') || '',
        };
        request({
            isParallel: true,
            url: config.api.processDetail,
            data: params,
            success: data => {
                self.setState({
                    originData: self.formatData(data.content.processContent || []),
                    loading: false
                });
            }
        });
    }

    // 为每一个json数据添加唯一标记tmpKey，便于后续jsonqueryjs进行处理
    formatData(data) {
        var result = jsonqueryjs.toolUtil.isJson(data) ? {} : [],
              type = jsonqueryjs.toolUtil.isJson(data) ? 'json' : 'other';
        if (type === 'json') {
            result['tmpKey'] = common.guid();
        }
        for (var key in data) {
            if(typeof data[key]=='object') {
                result[key] =  this.formatData(data[key]);
            } else {
                result[key] = data[key];
            }
        }
        return result;
    }

    // 浮层关闭事件
    handleModalCancel = (type) => {
        this.setState({
            [type]: false, 
        });
        this.modifyData = null; // 浮层关闭之后，需要将临时修改数据删除
    }

    // 流程图的点击事件
    handleItemClick = (options) => {
        var itemTmpKey = options.tmpKey, 
           itemModelCode = options.modelCode,
           processType = options.processType, 
           eventType = options.type;
        var processItem = jsonqueryjs.queryNodes({
            data: this.state.originData,
            key: 'tmpKey',
            value: itemTmpKey
        });
        var targetItems = {
            activeItem: processItem[0],
            activeModelCode: itemModelCode
        };
        switch (eventType) {
            case 'change':
                // 模型更换
                var self = this;
                confirm({
                    title: '原模型参数与后续流程关联，更换后，后续流程将失效，是否确定更换？',
                    onOk() {
                        self.setState(Object.assign(targetItems, {
                            editItemTag: '0',  // ‘1’代表添加下一步规则/模型，‘-1’代表添加上一步规则，‘0’代表编辑当前规则／模型
                            modelChooseVisible: true
                        }));
                    }
                });
            break;
            case 'edit':
                // 规则
                if (processItem[0].ruleType === 'SCORE') {
                    // 分数规则编辑
                    this.setState(Object.assign(targetItems, {
                        editItemTag: '0',
                        ruleScoreEditVisible: true
                    }));
                } else if (processItem[0].ruleType === 'HIT') {
                    this.setState(Object.assign(targetItems, {
                        editItemTag: '0',
                        ruleHitEditVisible: true
                    }));
                } else {
                    this.setState(Object.assign(targetItems, {
                        editItemTag: '0',
                        ruleWhiteVisible: true
                    }));
                }
            break;
            case 'view':
                // 规则
                var modalType = processType === 'MODEL' ? 'modelDetailVisible' : 'ruleDetailVisible';
                this.setState(Object.assign(targetItems, {
                    [modalType]: true
                }));
            break;
            case 'delete':
                // 规则
                var self = this;
                if (processType === 'MODEL') {
                    confirm({
                        title: '原模型参数与后续流程关联，删除后，后续流程将失效，是否确定删除？',
                        onOk() {
                            // 模型删除
                            var preTmpOriginData = jsonqueryjs.deleteAfterSiblings2({
                                data: self.state.originData,
                                key: 'tmpKey',
                                value: itemTmpKey
                            });
                            var tmpOriginData = jsonqueryjs.delete2({
                                data: preTmpOriginData,
                                key: 'tmpKey',
                                value: itemTmpKey
                            });
                            self.setState({
                                activeItem: null,
                                activeModelCode: '',
                                originData: tmpOriginData
                            }, function () {
                                self.onOriginDataChange();
                            });
                        }
                    });
                } else {
                    confirm({
                        title: '此条规则下所有子规则将被删除，是否确定删除？',
                        onOk() {
                             // 规则删除
                            var preTmpOriginData = self.state.originData;
                            var querySiblings2 = jsonqueryjs.querySiblings2({
                                data: self.state.originData,
                                key: 'tmpKey',
                                value: itemTmpKey
                            })[0];
                            if (!querySiblings2.length) {
                                // 说明当前模型下只有一条规则，如果此规则删除，则需要进行后续模型删除
                                var queryParents = jsonqueryjs.queryParents({
                                    data: self.state.originData,
                                    key: 'tmpKey',
                                    value: itemTmpKey
                                })[0];
                                var lastModelParent = queryParents[queryParents.length - 3];
                                // 首先进行后续模型兄弟节点的删除
                                preTmpOriginData = jsonqueryjs.deleteAfterSiblings2({
                                    data: self.state.originData,
                                    key: 'tmpKey',
                                    value: lastModelParent.tmpKey
                                });
                            }
                            var tmpOriginData = jsonqueryjs.delete2({
                                data: preTmpOriginData,
                                key: 'tmpKey',
                                value: itemTmpKey
                            });
                            self.setState({
                                activeItem: null,
                                activeModelCode: '',
                                originData: tmpOriginData
                            }, function () {
                                self.onOriginDataChange();
                            });
                        }
                    });
                }
            break;
            case 'prevHit':
                // 添加上一步命中规则
                this.setState(Object.assign(targetItems, {
                    editItemTag: '-1',
                    ruleHitEditVisible: true
                }));
            break;
            case 'nextHit':
                // 添加下一步命中规则
                this.setState(Object.assign(targetItems, {
                    editItemTag: '1',
                    ruleHitEditVisible: true
                }));
            break;
            case 'nextWhite':
                // 添加下一步白名单规则
                this.setState(Object.assign(targetItems, {
                    editItemTag: '1',
                    ruleWhiteVisible: true
                }));
            break;
            case 'prevWhite':
                // 添加上一步白名单规则
                this.setState(Object.assign(targetItems, {
                    editItemTag: '-1',
                    ruleWhiteVisible: true
                }));
            break;
            case 'prevScore':
                // 添加上一步分数规则
                this.setState(Object.assign(targetItems, {
                    editItemTag: '-1',
                    ruleScoreEditVisible: true
                }));
            break;
            case 'nextScore':
                // 添加下一步分数规则
                this.setState(Object.assign(targetItems, {
                    editItemTag: '1',
                    ruleScoreEditVisible: true
                }));
            break;
            case 'nextModel':
                // 添加下一步模型
                var modelsLength = this.getProcessModelsLength();
                if (modelsLength && modelsLength >= 2) {
                    warning({
                        title: '流程中模型数量不能大于 2 个'
                    });
                    return;
                }
                this.setState(Object.assign(targetItems, {
                    editItemTag: '1',
                    modelChooseVisible: true
                }));
            break;
        }
    }
    

    getProcessModelsLength = () => {
        var processModelList = jsonqueryjs.queryNodes({
            data: this.state.originData,
            key: 'processType',
            value: 'MODEL'
        });
        return processModelList.length;
    }

    // (暂时不用) 在添加下一步（规则／模型）需要首先进行当前节点
    checkContinueConditionsBeforeAddNext = (item) => {
        if (item.processType === 'MODEL') {
            // 如果单击模型添加规则，此时不需要进行条件验证
            return true;
        }
        // 如果是规则，添加下一步（规则／模型）
        var ruleToList = item.toList || [];
        for (var i = 0; i < ruleToList.length; i++) {
            if (ruleToList[i].condition.resCode === this.CONTINUECODE) {
                return true;
            }
        }
        return false;
    }

    onOriginDataChange = () => {
        // 数据变化之后 浮层提示是否需要显示
        this.handlePopupTipsVisible();
        // 提交数据至后台(暂存)
        this.saveProcessContent('STASH', function () {
            notification.success({
                message: '提示',
                description: '自动保存成功'
            });
        }, function () {
            notification.error({
                message: '错误提示',
                description: '自动保存失败'
            });
        });
    }

    // 保存数据
    saveProcessContent(status, success, error) {
        var self = this;
        let params = {
            processStatus: status,
            processCode: common.getQueryString('code') || '',
            processContent: jsonqueryjs.delete({
                data: this.state.originData,
                rule: '"tmpKey"='
            })
        };
        // console.log(JSON.stringify(params));
        request({
            isParallel: true,
            url: config.api.processAddContent,
            data: params,
            type: 'POST',
            contentType: 'application/json',
            success: data => {
                console.log('stash save success');
                success && success(data);
            },
            error: err => {
                console.log('stash save fail');
                error && error(err);
            }
        });
    }

    // 点击完成进行最终数据保存
    saveCompleteContent = () => {
        var self = this;
        confirm({
            title: '流程提交后将不能进行修改，是否确认提交？',
            onOk() {
                self.saveProcessContent('COMPLETE', function () {
                    self.props.history.push('/flow/detail?id=' + (getQueryString('code') || ''));
                }, function (err) {
                    notification.error({
                        message: '错误提示',
                        description: err.msg || '保存失败'
                    });
                });
            }
        });
    }

    // 浮层提示更多操作 是否展示
    handlePopupTipsVisible = () => {
        var userDefineShouleVisible = common.getCookie('popupvisible') ? false : true;
        var isInit = this.initOriginData;
        this.setState({
            popupTipsVisible: isInit && userDefineShouleVisible
        });
    }
    // 浮层关闭触发事件
    handlePopupTipsHide = () => {
        this.setState({
            popupTipsVisible: false
        });
        common.setCookie('popupvisible', '1', 365);
    }

    // 当浮层中数据产生变化时进行实时保存，在点击‘确认’时进行更新
    setNewOriginData = (value) => {
        // 删除tmpNewFlag
        var newData = jsonqueryjs.delete({
            data: value,
            rule: '"tmpNewFlag"='
        });
        this.modifyData = newData; // 临时存储修改数据
    }
    // 将修改后的数据正式应用于真实数据
    applyModifyDataToFormal = (value) => {
        var self = this;
        if (self.modifyData) {
            self.setState({
                originData: self.modifyData
            }, function () {
                self.onOriginDataChange();
                self.initOriginData = false;
            });
        } else {
            self.initOriginData = false;
        }
        self.handleModalCancel(value);
    }

    // 首次‘添加模型’触发事件
    handleModelChooseInit = () => {
        this.initOriginData = true; // 用来标记是否是初始化流程第一步操作
        this.setState({
            editItemTag: '1',  // ‘1’代表添加下一步规则/模型，‘-1’代表添加上一步规则，‘0’代表编辑当前规则／模型
            originData: [],    // 总数据
            activeItem: null,
            modelChooseVisible: true
        });
    }

    render() {
        let buttonNode = (
            <div className="flow-edit-step">
                <Steps current={1} size="small">
                    <Step title="基本信息" />
                    <Step title="流程编辑" />
                </Steps>
            </div>
        );
        if (this.state.loading) {
            return null;
        }
        return (
            <Crumb
                page={this.props.title}
                buttonNode={buttonNode}
            >
                <div><div className="flow-edit-box">
                    <div className="flow-edit-m" id="flowEditM">
                        {this.state.originData.length ? 
                            <div><FlowChart
                                data = {this.state.originData}
                                status = "edit"
                                onMenuClick={this.handlePopupTipsHide}
                                handleItemClick = {this.handleItemClick}
                            ></FlowChart><Popover
                                placement="bottom"
                                getPopupContainer={() => document.getElementById('flowEditM')}
                                content={<span >点击之后可进行更多操作&nbsp;&nbsp;<Icon  className="init-tooltip" type="close" onClick={this.handlePopupTipsHide}/></span>}
                                visible={this.state.popupTipsVisible}
                              ><span className="popup-tips"></span></Popover>
                            </div>
                            : <span className="flow-edit-add-model" onClick={this.handleModelChooseInit}>添加模型</span>
                        }
                    </div>
                    {this.state.modelDetailVisible
                        ? <Modal title="模型详情" maskClosable={false} visible={true} footer={null}
                            onCancel={this.handleModalCancel.bind(this, 'modelDetailVisible')}
                        >
                            <ModelDetail data={this.state.activeItem}/>
                        </Modal> : null
                    }
                    {this.state.modelChooseVisible
                        ? <Modal title="从模型库中选择" maskClosable={false} visible={true}
                            onCancel={this.handleModalCancel.bind(this, 'modelChooseVisible')}
                            onOk={this.applyModifyDataToFormal.bind(this, 'modelChooseVisible')}
                        >
                            <ModelChoose onChange={this.setNewOriginData} editTag={this.state.editItemTag} data={this.state.activeItem} origin={this.state.originData} />
                        </Modal> : null
                    }
                    {this.state.ruleDetailVisible
                        ? <Modal title="规则详情" maskClosable={false} visible={true} footer={null}
                            onCancel={this.handleModalCancel.bind(this, 'ruleDetailVisible')}
                        >
                            <RuleDetail data={this.state.activeItem}/>
                        </Modal> : null
                    }
                    {this.state.ruleScoreEditVisible
                        ? <Modal
                            title={this.state.editItemTag === '0' ? '编辑分数规则' : '添加分数规则'}
                            maskClosable={false} visible={true}
                            onCancel={this.handleModalCancel.bind(this, 'ruleScoreEditVisible')}
                            onOk={this.applyModifyDataToFormal.bind(this, 'ruleScoreEditVisible')}
                        >
                            <EditScoreRule onChange={this.setNewOriginData} editTag={this.state.editItemTag} data={this.state.activeItem} origin={this.state.originData} modelcode={this.state.activeModelCode}/>
                        </Modal> : null
                    }
                    {this.state.ruleHitEditVisible
                        ? <Modal
                            title={this.state.editItemTag === '0' ? '编辑命中规则' : '添加命中规则'}
                            maskClosable={false} visible={true}
                            onCancel={this.handleModalCancel.bind(this, 'ruleHitEditVisible')}
                            onOk={this.applyModifyDataToFormal.bind(this, 'ruleHitEditVisible')}
                        >
                            <EditHitRule onChange={this.setNewOriginData} editTag={this.state.editItemTag} data={this.state.activeItem} origin={this.state.originData} modelcode={this.state.activeModelCode}/>
                        </Modal> : null
                    }
                    {
                        this.state.ruleWhiteVisible
                        ? <Modal
                            title={this.state.editItemTag === '0' ? '编辑白名单规则' : '添加白名单规则'}
                            maskClosable={false} visible={true}
                            onCancel={this.handleModalCancel.bind(this, 'ruleWhiteVisible')}
                            onOk={this.applyModifyDataToFormal.bind(this, 'ruleWhiteVisible')}
                        >
                            <EditWhiteRule onChange={this.setNewOriginData} editTag={this.state.editItemTag} data={this.state.activeItem} origin={this.state.originData} modelcode={this.state.activeModelCode}/>
                        </Modal> : null
                    }
                </div>
                    <div className="page-add-bottom">
                        <Button size="large" style={{marginRight: '10px'}} type="primary" onClick={this.saveCompleteContent}>完成</Button>
                        <Button size="large" onClick={()=>{this.props.history.push('/flow/list');}}>取消</Button>
                    </div>
                </div>
            </Crumb>
        )
    }
}
export default withRouter(FlowEdit);