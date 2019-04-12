/**
 * @file loading.jsx  加载组件
 * @author v_changrenjie@baidu.com
 */
import React, {Component} from 'react';
import './loading.less';

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        return <div className="loading">
            <div className="red-ball"></div>
            <div className="blue-ball"></div>
        </div>;
    }
}


