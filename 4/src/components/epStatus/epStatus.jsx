/**
 * @file pointBreadcrumb.jsx 端点面包屑
 * @author xueliqiang@baidu.com
 */
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Loading from '../loading/loading';
import './epStatus.less';

export default class EPStatus extends Component {
    constructor(props) {
        super(props);

        this.operationMap = {
            // 创建中
            0: {
                callback: this.getCreatingStatus,
                params: null
            },
            // 服务中
            1: {
                callback: this.getServingStatus,
                params: null
            },
            // 创建失败
            2: {
                callback: this.getFailedStatus,
                params: null
            },
            // 更新中
            3: {
                callback: this.getUpdatingStatus,
                params: null
            },
            // 更新失败
            4: {
                callback: this.getFailStatus,
                params: '更新失败'
            },
            // 回滚中
            5: {
                callback: this.getIngStatus,
                params: '回滚中'
            },
            // 删除中
            6: {
                callback: this.getDeletingStatus,
                params: null
            },
            // 已删除
            7: {
                callback: this.getFailStatus,
                params: '已删除'
            },
            // 已停止
            8: {
                callback: this.getStoppedStatus,
                params: null
            },
            // 删除失败
            9: {
                callback: this.getDeleteFailStatus,
                params: null
            },
            // 回滚失败
            10: {
                callback: this.getRollbackFailStatus,
                params: null
            },
            // 停止中
            11: {
                callback: this.getIngStatus,
                params: '停止中'
            },
            // 停止失败
            12: {
                callback: this.getFailStatus,
                params: '停止失败'
            },

            default: {
                callback: this.getDefaultStatus,
                params: null
            }
        }
    }

    /**
     * 创建中
     *
     * @return {jsx} jsx组件
     */
    getCreatingStatus = () => <div>
        <Loading /> <span className="yellow">创建中</span>
    </div>;

    /**
     * 服务中
     *
     * @return {jsx} jsx组件
     */
    getServingStatus = () => <div>
        <span className="dot bgc-green"></span> <span className="green">服务中</span>
    </div>;

    /**
     * 更新中
     *
     * @return {jsx} jsx组件
     */
    getUpdatingStatus = () => <div>
        <Loading /> <span className="yellow">更新中</span>
    </div>;

    /**
     * 删除中
     *
     * @return {jsx} jsx组件
     */
    getDeletingStatus = () => <div>
        <Loading /> <span className="yellow">删除中</span>
    </div>;

    /**
     * 已停止
     *
     * @return {jsx} jsx组件
     */
    getStoppedStatus = () => <div>
        <span className="dot bgc-red"></span> <span className="red">已停止</span>
    </div>;

    /**
     * 创建失败
     *
     * @return {jsx} jsx组件
     */
    getFailedStatus = () => <div>
        <span className="red">创建失败</span>
    </div>;


    /**
     * 删除失败
     *
     * @return {jsx} jsx组件
     */
    getDeleteFailStatus = () => <div>
        <span className="red">删除失败</span>
    </div>;

    /**
     * 回滚失败
     *
     * @return {jsx} jsx组件
     */
    getRollbackFailStatus = () => <div>
        <span className="red">回滚失败</span>
    </div>;

    /**
     * 失败状态
     *
     * @return {jsx} jsx组件
     */
    getFailStatus = text => <div>
        <span className="red"></span> <span className="red">{text}</span>
    </div>;

    /**
     * 中间状态
     *
     * @return {jsx} jsx组件
     */
    getIngStatus = text => <div>
        <Loading /> <span className="dot bgc-red"></span> <span className="red">{text}</span>
    </div>;

    /**
     * 默认状态
     *
     * @return {jsx} jsx组件
     */
    getDefaultStatus = text => <span>{text}</span>;

    /**
     * 根据端点状态码获取状态dom
     *
     * @param {number} code 端点状态码
     * @return {jsx} jsx组件
     */
    getStatusByCode = (status, text) => {
        let operation = this.operationMap[status];
        if (!operation) {
            return this.operationMap.default.callback.apply(this, [text]);
        }
        return operation.callback.apply(this, [operation.params]);
    };

    render() {
        let {status, text} = this.props;
        let statusDom = this.getStatusByCode(status, text);
        return <div>{statusDom}</div>;
    }
}

EPStatus.propTypes = {
    status: PropTypes.number,
    text: PropTypes.string
};
