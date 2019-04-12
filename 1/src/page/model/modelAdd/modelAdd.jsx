/**
 * 模型添加
 */
import React from 'react';
import {Button, Select, Modal, notification} from 'antd';
import {withRouter} from 'react-router-dom';
// 公共功能组件
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
// 公共模块
import Crumb from '../../../module/crumb/crumb.jsx';
import ModelDetailBlock from '../../../module/modelDetailBlock/modelDetailBlock.jsx';
import ModelEdit from '../../../module/modelEdit/modelEdit.jsx';

import style from './modelAdd.useable.less';

const confirm = Modal.confirm;
class ModelAdd extends React.Component {
    state = {
        modelListData: [],
        isRenderDetail: false,
        disabled: true,
        status: 'Select',   // Selec为选择状态，Confirm为确认状态
        cache: {}
    }
    pageData = {
        modelDetailData: {},
        text: {
            cancel: '取消',
            confirm: '下一步'
        },
        modelCode: undefined
    }
    componentWillMount() {
        this.handleGetAddList();
        style.use();
    }
    componentWillUnmount() {
        style.unuse();
    }
    // 获取已添加模型列表
    handleGetAddList = () => {
        request({
            isParallel: true,
            url: config.api.modelList,
            success: data => {
                this.setState({
                    modelListData: data.content.newList
                });
            }
        });
    }
    // 获取已添加模型详情
    handleGetAddDetail = value => {
        if (value) {
            request({
                isParallel: true,
                url: config.api.modelDetail,
                data: {
                    modelId: value,
                    isExist: false
                },
                success: data => {
                    this.pageData.modelDetailData = data.content;
                    this.pageData.modelCode = value;
                    this.setState({
                        cache: {},
                        disabled: false,
                        isRenderDetail: true
                    });
                }
            });
        }
    }
    // 按钮的状态切换
    handleChangeStatus = () => {
        if (this.state.status === 'Select') {
            // 下一步操作
            this.pageData.text.cancel = '上一步';
            this.pageData.text.confirm = '完成';
            this.setState({
                status: 'Confirm'
            });
        } else if (this.state.status === 'Confirm') {
            // 完成操作
            let {modelId, modelFormat, extInfo} = this.pageData.modelDetailData;
            confirm({
                title: '请确保调试结果符合模型预期，否则会影响后续流程决策结果',
                okText: '调试完毕，添加',
                cancelText: '返回继续调试',
                onOk: () => {
                    request({
                        url: config.api.modelAdd,
                        data: Object.assign(this.requestOptions, {extInfo, modelFormat, repoModelId: modelId}),
                        type: 'POST',
                        contentType: 'application/json',
                        success: data => {
                            notification.success({
                                message: '提示',
                                description: '保存成功'
                            });
                            if (data.content.modelCode) {
                                this.props.history.push(`/model/detail?type=本地模型&code=${data.content.modelCode}`);
                            }
                        }
                    });
                }
            });
        }
    }
    // 按钮取消事件
    handleCancel = () => {
        if (this.state.status === 'Select') {
            // 取消操作
            this.props.history.go(-1);
        } else if (this.state.status === 'Confirm') {
            // 上一步操作
            this.pageData.text.cancel = '取消';
            this.pageData.text.confirm = '下一步';
            this.setState({
                status: 'Select',
                cache: this.editorChild.getFiledsValues()
            });
        }
    }

    handleOptions = options => {
        this.requestOptions = options;
    }

    handleChild = ref => {
        this.editorChild = ref;
    }

    render() {
        let SelectTpl = (
            <div>
                <div className={[
                        'model-add-select',
                        this.state.isRenderDetail && 'model-add-active'
                    ].join(' ')}>
                    <p>选择模型</p>
                    <Select
                        placeholder="请选择模型"
                        onChange={this.handleGetAddDetail}
                        defaultValue={this.pageData.modelCode}
                    >
                        {
                            Array.isArray(this.state.modelListData)
                            && this.state.modelListData.map((item, index) => {
                                return (
                                    <Select.Option value={item.modelId} key={index}>
                                        {item.modelName}
                                    </Select.Option>
                                );
                            })
                        }
                    </Select>
                </div>
                {this.state.isRenderDetail
                ? (<ModelDetailBlock
                        data={this.pageData.modelDetailData}
                        type="add"
                        width={870}/>)
                : null}
            </div>
        );
        let ConfirmTpl = (<ModelEdit
                type="add"
                data={this.pageData.modelDetailData}
                code={this.pageData.modelCode}
                cache={this.state.cache}
                onChange={this.handleOptions}
                onRef={this.handleChild}
                width={870}
            />);
        let ButtonTpl = (
            <div>
                <Button
                    onClick={this.handleCancel}
                    size="large"
                >
                    {this.pageData.text.cancel}
                </Button>
                <Button
                    type="primary"
                    disabled={this.state.disabled}
                    onClick={this.handleChangeStatus}
                    size="large"
                >
                    {this.pageData.text.confirm}
                </Button>
            </div>);
        return (
            <Crumb page={this.props.title}>
                <div className="page-model-add">
                    <div className="model-add-content">
                        {this.state.status === 'Select' ? SelectTpl : ConfirmTpl}                        
                    </div>
                    <div className="model-add-button">
                        {ButtonTpl}
                    </div>
                </div>
            </Crumb>
        );
    }
}
export default withRouter(ModelAdd);
