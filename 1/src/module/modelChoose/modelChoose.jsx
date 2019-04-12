/**
 * @file 公共的模型详情页面
 * @author
 */
import React from 'react';
import config from '../../../config/project.config.jsx';
import common from '../../components/common.js';
import request from '../system/request.jsx';
import {message} from 'antd';
import jsonqueryjs from 'jsonqueryjs/json.js';
import DuTable from '../../components/antComponent/duTable/duTable.jsx';
import formatTableData from '../../components/antComponent/Integration/formatTableData.jsx';
import localTableData from '../localData/localTable.jsx';

export default class ModelDetailCommon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modelList: [],
            selectedInputKeys: []
        };
    }

    componentDidMount() {
        this.getModelList();
    }

    componentWillMount() {
        // 拷贝复制数据，后续对数据的操作都是对此数据进行操作
        this.originData = jsonqueryjs.toolUtil.deepCopy(this.props.origin);
        // 依据编辑项对originData进行修改
        this.editTag = this.props.editTag;
        // 新加/编辑规则对象, 如果是编辑-则为规则；如果为添加，则为规则或者模型
        this.activeData = jsonqueryjs.toolUtil.deepCopy(this.props.data);
        // origindata发生变化的时候触发
        this.onOriginDataChange = this.props.onChange;
    }

    // 获取模型列表
    getModelList() {
        var self = this;
        let params = {};
        request({
            isParallel: true,
            url: config.api.processModelList,
            data: params,
            success: data => {
                self.setState({
                    modelList: self.formatData(data.content)
                });
            }
        });
    }

    formatData(data) {
        var results = [];
        for (var i = 0; i < data.length; i++) {
            results.push({
                modelCode: data[i]['modelCode'],
                modelName: data[i]['modelName'],
                modelType: data[i]['modelType'] === 'REMOTE' ? '云端' : '本地',
                relateProcessCount: data[i]['relateProcessCount']
            });
        }
        return results;
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

    onInputsSelectChange = (value) => {
        this.setState({
            selectedInputKeys: value
        });
        var newModel = {
            tmpKey: common.guid(),
            tmpNewFlag: 'new',
            processType: 'MODEL',
            modelCode: value[0],
            modelName: this.getModelNameByModelCode(value[0]),
            ruleType: '',
            ruleList: []
        };
        if (!this.activeData) {
            // 说明进行流程的初始化操作
            this.originData = [];
            this.originData.push(newModel);
        } else {
            var activeItem = this.activeData;
            var activeItemKey = activeItem.tmpKey;
            // 说明用户单击了规则进行模型添加／或者模型编辑
            if (this.editTag === '1') {
                // 说明用户单击了规则进行下一步模型添加
                var queryResults = jsonqueryjs.queryParents({
                    data: this.originData,
                    key: 'tmpKey',
                    value: activeItemKey
                })[0];
                var lastModelList = queryResults[queryResults.length - 4];
                var lastModel = lastModelList[lastModelList.length - 1];
                if (lastModel.tmpNewFlag) {
                    this.originData = jsonqueryjs.replace2({
                        data: this.originData,
                        key: 'tmpKey',
                        value: lastModel.tmpKey,
                        target: {
                            key: 'ignore',
                            value: newModel
                        }
                    });
                } else {
                    this.originData = jsonqueryjs.insertAfter2({
                        data: this.originData,
                        key: 'tmpKey',
                        value: lastModel.tmpKey,
                        target: {
                            key: 'ignore',
                            value: newModel
                        }
                    });
                }
            } else if (this.editTag === '0') {
                // 说明进行原有模型替换
                newModel.tmpKey = activeItemKey; // 对当前编辑模型进行tmpKey保留
                this.originData = jsonqueryjs.replace2({
                    data: this.originData,
                    key: 'tmpKey',
                    value: activeItemKey,
                    target: {
                        key: 'ignore',
                        value: newModel
                    }
                });
                this.originData = jsonqueryjs.deleteAfterSiblings2({
                    data: this.originData,
                    key: 'tmpKey',
                    value: activeItemKey
                });
            }
        }
        this.onOriginDataChange(this.originData);
    }

    initDefault() {
        if (this.editTag === '1') {
            // 说明添加新模型
            this.state.selectedInputKeys = this.state.selectedInputKeys.length ? this.state.selectedInputKeys : [];
        } else if (this.editTag === '0') {
            // 说明进行原有模型替换
            var activeItem = this.activeData;
            this.state.selectedInputKeys = this.state.selectedInputKeys.length ? this.state.selectedInputKeys : [activeItem.modelCode];
        }
    }

    render() {
        this.initDefault();
        let resData = formatTableData({
            data: this.state.modelList,
            table: localTableData.flow['modelChoose']
        });
        return (
            <div>
                <DuTable tableWidth ={400}
                    keyName="modelCode"
                    listData={resData}
                    selectParams={{
                        selectedRowKeys: this.state.selectedInputKeys,
                        type: "radio",
                        onSelectChange: this.onInputsSelectChange
                    }}
                >
                </DuTable>
            </div>
        );
    }
}






