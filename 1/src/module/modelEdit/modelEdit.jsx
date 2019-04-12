/**
 * @file 公共的模型详情页面
 * @author
 */
import React from 'react';
import {Form, Button, Input, Row, Col, notification} from 'antd';
import jsonqueryjs from 'jsonqueryjs/json.js';

// 系统
import request from '../system/request.jsx';
import config from '../../../config/project.config.jsx';

import localFormData from '../localData/localForm.jsx';
import localTableData from '../localData/localTable.jsx';
import Integration from '../Integration/Integration.jsx';
import DuTable from '../../components/antComponent/duTable/duTable.jsx';
import formatMergeData from '../../components/antComponent/Integration/formatMergeData.jsx';
import formatTableData from '../../components/antComponent/Integration/formatTableData.jsx';
import duForm from '../../components/antComponent/duForm/duForm.jsx';
// import OPTIONS from '../localData/options.jsx';
import './modelEdit.less';
const {TextArea} = Input;

class ModelDetailCommon extends React.Component {
    constructor(props) {
        super(props);
        this.renderInfo = {
            baseInforData: [],
            reqData: [],
            resData: []
        };
        this.state = {
            editorModelDesc: ''
        };
    }
    componentWillMount() {
        this.originData = jsonqueryjs.toolUtil.deepCopy(this.props.data);
        this.cache = this.props.cache || {};  // 缓存数据
        this.state.editorType = this.props.type; // 编辑类型（是对现有已添加模型的编辑还是新增模型的编辑）edit || add
        // 初始化赋值模型描述信息
        this.state.editorModelCode = this.props.code; // 模型code
        this.state.editorModelName = this.originData.modelName; // 模型名称
        this.state.editorModelDesc = this.cache.modelDesc || this.originData.modelDesc; // 模型描述
        this.state.editorModelPublishTime = this.originData.publishTime || ''; // 模型发布时间
        this.state.editorReqParams = this.cache.reqParams || this.originData.reqParams;       // 请求参数
        this.state.editorRespParams = this.cache.respParams || this.originData.respParams;     // 返回参数
        var options = this.getRequestOptions();
        this.props.onChange && this.props.onChange(options);
        this.props.onRef && this.props.onRef(this);
    }
    // 数据处理
    formatData() {
        this.originData.modelDesc = this.cache.modelDesc || this.originData.modelDesc;  // 重写desc
        this.originData.reqParams = this.cache.reqParams || this.originData.reqParams; // 重写params
        this.originData.respParams = this.cache.respParams || this.originData.respParams; // 重写params

        let baseInforData = formatMergeData(localFormData.modelDetail.BASEINFOREDIT, this.originData);
        let reqData = formatTableData({
            data: this.originData.reqParams,
            table: localTableData.modelDetail.REQUESTEDIT
        });
        let resData = formatTableData({
            data: this.originData.respParams,
            table: localTableData.modelDetail.RESPOSEEDIT
        });
        // let fieldInputs = this.getModelDebugHeaders(this.originData.reqParams);
        this.cache.reqMethod = this.originData.reqMethod;
        this.cache.reqUrl = this.originData.reqUrl;
        let modelAdjustData = formatMergeData(Integration.getDynamicParams(this.originData.reqParams), this.cache);
        let modelAdjustResult = formatMergeData(localFormData.modelDetail.ADJUST, this.cache);
        this.renderInfo = {
            baseInforData,
            reqData,
            resData,
            modelAdjustData,
            modelAdjustResult
        };
    }

    getModelDebugHeaders(params) {
        return localFormData.modelDetail.PORT.concat(Integration.getDynamicParams(params)).concat(localFormData.modelDetail.ADJUST);
    }

    handleContentChange = (type, text, record) => {
        if (record.isRequire) {
            record.isRequire = (record.isRequire === 'true');
        }
        var newParams = jsonqueryjs.replace2({
            data: type === 'req' ? this.state.editorReqParams : this.state.editorRespParams,
            key: 'name',
            value: record.name,
            target: {
                key: 'name',
                value: record
            }
        });
        if (type === 'req') {
            this.state.editorReqParams = newParams;
        } else {
            this.state.editorRespParams = newParams;
        }
        var options = this.getRequestOptions();
        this.props.onChange && this.props.onChange(options);
    }

    handleSubmit = () => {
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            for (var key in fieldsValue) {
                if (!fieldsValue[key]) {
                    fieldsValue[key] = '';
                }
            }
            let paramMap = jsonqueryjs.delete({
                data: fieldsValue,
                rule: '"modelDesc"=, "result"='
            });
            let {modelFormat, modelId, extInfo} = this.originData;
            let postData = {
                modelId: this.state.editorModelCode,
                isExist: this.state.editorType === 'edit' ? true : false,
                paramMap,
                paramNames: this.state.editorReqParams,
                modelFormat,
                repoModelId: modelId,
                extInfo
            };
            request({
                url: config.api.modelAdjust,
                data: postData,
                type: 'POST',
                contentType: 'application/json',
                success: data => {
                    this.props.form.setFieldsValue({
                        result: (typeof data.content === 'object') ? JSON.stringify(data.content) : data.content
                    });
                }
            });
        });
    }
    
    // getRequestParamNames = () => {
    //     var params = this.state.editorReqParams;
    //     var result = [];
    //     for (var i = 0; i < params.length; i++) {
    //         result.push(params[i]['name']);
    //     }
    //     return result;
    // }

    getFiledsValues = () => {
        var values = this.props.form.getFieldsValue();
        for (var key in values) {
            if (!values[key]) {
                values[key] = '';
            }
        }
        values.reqParams = this.state.editorReqParams;
        values.respParams = this.state.editorRespParams;
        return values;
    }

    /**
     * 数据层 - 获取表单部分
     * @param {Object} formData 展示数据
     */
    getFormTpl = (formData) => {
        var self = this;
        const getFieldDecorator = this.props.form.getFieldDecorator;
        const options = {
            libs: {getFieldDecorator},
            params: {
                formItemLayout: {
                    labelCol: {span: 4},
                    wrapperCol: {span: 10, offset: 1}
                },
                formItemEmptyLabelLayout: {
                    wrapperCol: {span: 10, offset: 5}
                },
                selectStyle: {
                    marginBottom: 5,
                    width: '100%'
                }
            },
            events: {
                handleInputChange: this.handleInputChange
            }
        };
        return Array.isArray(formData) && formData.map((item, index, array) => {
            // 通用部分
            return duForm(item, index, options);
        });
    }

    // 模型描述内容发生变化时
    handleInputChange = (e) => {
        if (e.target.id == 'modelDesc') {
            this.state.editorModelDesc = e.target.value;
            var options = this.getRequestOptions();
            this.props.onChange && this.props.onChange(options);
        }
    }


    getRequestOptions() {
        let postData = {
            modelDesc: this.state.editorModelDesc,        // re
            reqParams: this.state.editorReqParams,   // re
            respParams: this.state.editorRespParams // re
        };

        if (this.state.editorType === 'edit') {
            // 说明是对现有模型的编辑
            postData.modelCode = this.state.editorModelCode;
        } else {
            // 说明是模型添加
            postData.modelName = this.state.editorModelName;
            postData.modelId = this.state.editorModelCode;
            postData.publishTime = this.state.editorModelPublishTime;
        }
        return postData;
    }

    saveOrUpdateModelInfo = () => {
        let self = this;
        let postData = this.getRequestOptions();
        request({
            url: config.api.modelUpdate,
            data: postData,
            type: 'POST',
            contentType: 'application/json',
            success: data => {
                notification.success({
                    message: '提示',
                    description: '保存成功'
                });
                self.props.onCancel && self.props.onCancel(data);
            }
        });
    }

    cancelModelInfo = () => {
        this.props.onCancel && this.props.onCancel();
    }

    render() {
        this.formatData();
        // 基本信息
        return (
            <div>
                <p className="page-slide">基本信息</p>
                <Form>
                    {this.getFormTpl(this.renderInfo.baseInforData)}
                </Form>
                <p className="page-slide">请求参数</p>
                <DuTable
                    onChange={this.handleContentChange.bind(this, 'req')}
                    tableWidth={this.props.width || 400} tableHeight={288} listData={this.renderInfo.reqData}></DuTable>
                <p className="page-slide">返回参数</p>
                <DuTable
                    onChange={this.handleContentChange.bind(this, 'resp')}
                    tableWidth={this.props.width || 400} listData={this.renderInfo.resData}></DuTable>
                <p className="page-slide">模型调试</p>
                <div>
                    <Row style={{marginBottom: '10px'}}>
                        <Col style={{maxHeight: '297px', overflowY: 'auto'}} span={24}>
                            <Form>
                                {Integration.getFormTpl.bind(this, this.renderInfo.modelAdjustData)()}
                            </Form>
                        </Col>
                    </Row>
                    <Form>
                        {Integration.getFormTpl.bind(this, this.renderInfo.modelAdjustResult)()}
                    </Form>
                </div>
                {this.state.editorType === 'edit' ?
                    <Row>
                        <Col span={4}></Col>
                        <Col span={10} offset={1}>
                            <Button type="primary" size="large" onClick={this.saveOrUpdateModelInfo}>保存</Button>
                            <Button style={{marginLeft: '15px'}} type="default" size="large" onClick={this.cancelModelInfo}>取消</Button>
                        </Col>
                    </Row>
                    : null
                }
            </div>
        );
    }
}



export default Form.create()(ModelDetailCommon);



