/**
 * @file PointListHearder.jsx 端点模板列表公共头部
 * @author lujunhao@baidu.com
 */
import React, {Component} from 'react';
import style from './pointListHearder.useable.less';
import {withRouter} from 'react-router';
import {Button, Input} from 'antd';
import {Link} from 'react-router-dom';
const Search = Input.Search;

class PointListHearder extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        style.use();
    }

    // 新建端点/端点模版
    execNew = () => {
        const {newCommand} = this.props;
        newCommand && newCommand();
    }

    render() {
        return (
            <div className="listTop">
                <div className="listHeader"><h2>{this.props.headerName}</h2></div>
                <div className="listOper">
                    <Button onClick={this.execNew} icon="plus" type="primary">{this.props.newHeaderName}</Button>
                    <div className="oper">
                        <Search
                            value={this.props.value}
                            placeholder={this.props.placeholderName}
                            onChange={value => this.props.searchChange(value)}
                            onSearch={value => this.props.search(value)}
                            style={{width: 240}}/>
                        <Button icon="reload" className="ml10"
                            onClick={() => this.props.refresh()}></Button>
                    </div>
                </div>
            </div>);
    }
}
export default withRouter(PointListHearder);