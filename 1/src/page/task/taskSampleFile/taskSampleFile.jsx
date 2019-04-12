/**
 * @file 任务列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Icon, Form, Upload, Modal, notification} from 'antd';
// 系统
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
// 业务组件
import Crumb from '../../../module/crumb/crumb.jsx';
// 业务操作
import getQueryString from '../../../module/Integration/getQueryString.jsx';
import downloadFile from '../../../module/Integration/downloadFile.jsx';

const FormItem = Form.Item;

class TaskSampleFile extends Component {

    /**
     * 状态
     */
    state = {
        // 是否渲染
        isRender: false,
        fileList: [],
        uploadBtnStatus: 'start'
    }

    /**
     * 业务
     */
    pageData = {
        taskCode: getQueryString('id')
    }

    handleSubmit = () => {
        this.props.history.push(`/task/log/list?id=${this.pageData.taskCode}`);
    }

    handleDownload = () => {
        downloadFile(config.api.taskDownload, {
            taskCode: this.pageData.taskCode
        }, 'GET');
    }

    handleUploadChange = ({file, fileList, event}) => {
        if (file.status !== 'removed' && file.response && file.response.ret !== 'SUCCESS') {
            file.status = 'error';
        }

        if (file.status === 'done') {
            // 按钮禁止
            this.setState({
                uploadBtnStatus: 'done',
                fileList: [file]
            });
        }
        else if (file.status === 'removed') {
            this.setState({
                uploadBtnStatus: 'start',
                fileList: []
            });
        }
        else if (file.status === 'error' || file.status === 'uploading') {
            // 重新上传
            this.setState({
                uploadBtnStatus: 'again',
                fileList: [file]
            });
        }
    }

    handleBeforeUpload = file => {
        const isLt2M = file.size / 1024 / 1024 < 50;
        if (!isLt2M) {
            notification.error({
                message: '错误提示',
                description: '文件大小已超过50M'
            });
        }
        return isLt2M;
    }

    render() {
        const options = {
            params: {
                formItemLayout: {
                    labelCol: {span: 3},
                    wrapperCol: {span: 15, offset: 1}
                }
            }
        };
        let buttonNode = (
            <div>
                <Button
                    size="large"
                    type="primary"
                    onClick={this.handleDownload}
                >
                    <Icon type="download" />
                    下载模板
                </Button>
            </div>
        );
        // 组件需要
        let uploadData = {
            action: config.api.taskBatchAdd,
            data: {
                taskCode: getQueryString('id')
            },
            name: 'sampleFile',
            headers: {
                'X-Requested-With': null
            },
            disabled: this.state.uploadBtnStatus === 'done',
            fileList: this.state.fileList,
            beforeUpload: this.handleBeforeUpload,
            onChange: this.handleUploadChange
        };
        return (
            <Crumb
                page={this.props.title}
                buttonNode={buttonNode}
            >
                <Form className="page-bottom-100">
                    <FormItem
                        label="文件上传"
                        {...options.params.formItemLayout}
                        extra="请在页面右上角下载模板，按照格式填写，确保格式正确。Excel格式，文件大小不超过50M"
                    >
                        <Upload {...uploadData}>
                            <Button disabled={this.state.uploadBtnStatus === 'done'}>
                                {this.state.uploadBtnStatus === 'again' ? '重新上传' : '点击上传'}
                            </Button>
                        </Upload>
                    </FormItem>
                </Form>
                <div className="page-add-bottom">
                    <Button
                        type="primary"
                        size="large"
                        disabled={!this.state.fileList.length || this.state.uploadBtnStatus !== 'done'}
                        onClick={this.handleSubmit}
                    >
                        完成
                    </Button>
                </div>
            </Crumb>
        );
    }
}

export default withRouter(Form.create()(TaskSampleFile));
