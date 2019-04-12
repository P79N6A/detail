/**
 * @file 模型列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Collapse, Input, Icon, notification} from 'antd';
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
import style from './modelList.useable.less';

const Panel = Collapse.Panel;
class ModelList extends Component {

    state = {
        isRender: false, // 是否渲染页面
        queryKey: '',
        selectModelCode: ''
    };

    pageData = {
        modelList: {},
        queryKey: ''
    };

    componentWillMount() {
        this.getModelListData();
        style.use();
        this._isMounted = true;
        this.setState({
            selectModelCode: this.props.modelCode || ''
        });
    }
    componentWillUnmount() {
        style.unuse();
        this._isMounted = false;
    }
    // 获取列表数据
    getModelListData = queryKey => {
        let dataObj = {};
        dataObj.queryKey = queryKey ? queryKey : null;
        request({
            isParallel: true,
            url: config.api.modelList,
            data: dataObj,
            success: data => {
                if (data.ret === 'MIND_REQ_FAIL') {
                    notification.error({
                        message: '错误提示',
                        description: data.msg
                    });
                }
                if (this._isMounted) {
                    this.handleModelList(data.content);
                    this.setState({isRender: true});
                }
            }
        });
    }
    //模型列表数据处理
    handleModelList = data => {
        let headerArr = ['本地模型', '云端模型', '已下架模型'];
        this.pageData.modelList.header = headerArr;
        if (data) {
            const content = [];
            for (let i in data) {
                if (i === 'existList') {
                    content[0] = data[i];
                }
                else if (i === 'remoteList') {
                    content[1] = data[i];
                }
                else if (i === 'offList') {
                    content[2] = data[i];
                }
            }
            this.pageData.modelList.content = content;
        }
    }
    // 搜索
    timer = null;
    handleSearch = e => {
        let self = this;
        self.setState({
            queryKey: e.target.value
        }, () => {
            if (self.timer) {
                clearTimeout(self.timer);
            }
            self.timer = setTimeout(() => {
                self.getModelListData(self.state.queryKey);
            }, 500);
        });
    }

    // 清空搜索
    handleClear = () => {
        this.setState({
            queryKey: ''
        }, () => {
            this.getModelListData(this.state.queryKey);
        });
    }
    // 跳转到详情页
    reloadDetail = (item, type) => {
        if (item && type) {
            this.props.history.push(`/model/detail?type=${type}&code=${item.modelId}`);
        }
    }
    render() {
        let suffix = this.state.queryKey ? <Icon type="close" onClick={this.handleClear}/> : null;
        let modelListTpl = (
            this.state.isRender
            ? <Collapse
                    className="model-list-content"
                    defaultActiveKey={['0', '1', '2']}
                >
                {
                    Array.isArray(this.pageData.modelList.header)
                    && this.pageData.modelList.header.map((headerItem, key) => {
                        return <Panel header={headerItem} key={key}>
                            {
                                Array.isArray(this.pageData.modelList.content[key])
                                && this.pageData.modelList.content[key].map((item, key) => {
                                    let classNameS;
                                    if (this.state.selectModelCode === item.modelId) {
                                        classNameS = 'model-list-item model-list-item-select';
                                    }
                                    else {
                                        classNameS = 'model-list-item';
                                    }
                                    return (
                                        <div
                                            key={key}
                                            className={classNameS}
                                            onClick={this.reloadDetail.bind(this, item, headerItem)}
                                        >
                                            {item.modelName}
                                        </div>
                                    );
                                })
                            }
                        </Panel>;
                    })
                }
            </Collapse> : null
        );
        return (
            <div className="main-list">
                <div className="model-search-input">
                    <Input
                        placeholder="输入搜索内容"
                        size="large"
                        prefix={<Icon type="search" />}
                        onChange={this.handleSearch}
                        suffix={suffix}
                        value={this.state.queryKey}
                    />
                </div>
                {modelListTpl}
            </div>
        );
    }
}
export default withRouter(ModelList);

