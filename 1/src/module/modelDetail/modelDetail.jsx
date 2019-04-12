/**
 * @file 公共的模型详情页面
 * @author
 */
import React from 'react';
import config from '../../../config/project.config.jsx';
import request from '../system/request.jsx';
import ModelDetailBlock from '../modelDetailBlock/modelDetailBlock.jsx';

export default class ModelDetailCommon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modelDetailList: {}
        };
    }

    componentDidMount() {
        this.getListData();
    }

    // 获取模型详情数据
    getListData() {
        var self = this;
        let params = {isExist: true};
        params.modelId = this.props.data.modelCode;
        request({
            isParallel: true,
            url: config.api.modelDetail,
            data: params,
            success: data => {
                self.setState({
                    modelDetailList: data.content
                });
            }
        });
    }

    render() {
        return (
            <ModelDetailBlock data={this.state.modelDetailList} />
        );
    }
}






