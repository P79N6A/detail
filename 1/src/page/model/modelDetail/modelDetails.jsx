/**
 * @file 模型详情页
 * @author
 * @reviewer yangxiaoxu@baidu.com
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Modal, Form, Spin, Icon} from 'antd';
// 公共功能组件
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
import common from '../../../components/common.js';
// 公共模块
import ModelList from '../modelList/modelList.jsx';
import Crumb from '../../../module/crumb/crumb.jsx';
import ModelDetailBlock from '../../../module/modelDetailBlock/modelDetailBlock.jsx';
import ModelEdit from '../../../module/modelEdit/modelEdit.jsx';

import style from './modelDetail.useable.less';

const confirm = Modal.confirm;
const error = Modal.error;

class ModelDetails extends Component {
    constructor(props) {
        super(props);
        let modelCode = common.getQueryString('code');
        this.state = {
            isRender: false,
            modelCode: modelCode || '',
            isEditModel: false,
            modelDetailList: {}
        };
    }

    componentWillMount() {
        this.getListData();
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
    }
    // 获取模型详情数据
    getListData() {
        let params = {};
        if (this.state.modelCode) {
            params.modelId = this.state.modelCode;
            params.isExist = true;
        }
        request({
            isParallel: true,
            url: config.api.modelDetail,
            data: params,
            success: data => {
                this.setState({
                    isRender: true,
                    modelDetailList: data.content
                });
            }
        });
    }
    // 模型删除
    handleDeleteModel = () => {
        confirm({
            title: '确认删除模型名称 ' + this.state.modelCode + '？',
            maskClosable: true,
            onOk: () => {
                this.handleConfirmDelete();
            }
        });
    }
    // 确定删除
    handleConfirmDelete = () => {
        request({
            url: config.api.modelDelete,
            data: {
                modelCode: this.state.modelCode
            },
            type: 'POST',
            contentType: 'application/json',
            success: data => {
                if (data.content.relateProcessCount === 0) {
                    this.props.history.push('/model/index');
                } else {
                    error({
                        content: '该模型已应用于流程，不可删除',
                        maskClosable: true
                    });
                }
            }
        });
    }
    // 如果存在data参数，说明是回调执行
    handleCancel = data => {
        this.setState({
            isEditModel: false
        });
        if (data) {
            this.getListData();
        }
    }
    render() {
        // 右侧添加按钮
        let buttonNode = (
            <Button
                type="primary"
                size="large"
                onClick={() => this.props.history.push('/model/add')}>
                <Icon type="plus" />添加模型
            </Button>
        );
        //  右侧删除和编辑的差别展示
        let buttonTpl = (
            common.getQueryString('type') !== '云端模型' ? (
                <div>
                    {
                        common.getQueryString('type') === '本地模型' ? (
                            <Button
                                onClick={() => this.setState({isEditModel: true})}
                                disabled={this.state.isEditModel}
                            >
                            编辑
                            </Button>
                        ) : null
                    }
                    <Button onClick={this.handleDeleteModel}>删除</Button>
                </div>
            ) : null
        );
        // 详情和编辑状态的展示
        let contentTpl = (
            this.state.isEditModel
            ? <ModelEdit
                type="edit"
                code={this.state.modelCode}
                data={this.state.modelDetailList}
                onCancel={this.handleCancel}
            />
            : <ModelDetailBlock
                type="edit"
                data={this.state.modelDetailList}
            />
        );
        return (
            <Crumb
                page={this.props.title}
                buttonNode={buttonNode}
            >
                <Spin
                    tip="加载中"
                    size="large"
                    className="page-loading"
                    spinning={!this.state.isRender}
                >
                    <div className="model-layout">
                        <div className="model-list">
                            <ModelList modelCode={this.state.modelCode}/>
                        </div>
                        <div className="model-main">
                            <div className="model-detail-wrapper">
                                <div className="model-detail-title">
                                    <h2>{this.state.modelDetailList.modelName}</h2>
                                    {buttonTpl}
                                </div>
                                <div>
                                    {contentTpl}
                                </div>
                            </div>
                        </div>
                    </div>
                </Spin>
            </Crumb>
        );
    }
}
export default withRouter(Form.create()(ModelDetails));
