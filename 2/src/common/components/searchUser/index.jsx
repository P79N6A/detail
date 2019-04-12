/**
 * @file 添加角色
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Input, AutoComplete} from 'antd';

export default class SearchUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: null
        };
    }

    inCompositionEvent = false;

    componentWillReceiveProps(nextProps) {
        if (nextProps.userList !== this.props.userList) {
            this.setState({
                userList: nextProps.userList
            });
        }
    }

    handleSelect = value => {
        setTimeout(() => $('.ant-select-selection__clear').click(), 100);
        this.props.onSelect(value);
    }

    search = value => {
        this.props.onSearch(value);
    }

    handleCompositionEnd = e => {
        this.inCompositionEvent = false;
        this.search(e.target.value);
    }

    handleCompositionStart = () => {
        this.inCompositionEvent = true;
    }

    handleSearch = value => {
        if (!this.inCompositionEvent) {
            this.search(value);
        }
    }

    render() {
        return (
            <div>
                <AutoComplete
                    allowClear
                    labelInValue
                    onSearch = {this.handleSearch}
                    onSelect = {this.handleSelect}
                    dataSource={this.state.userList && this.state.userList.map(data =>
                        <AutoComplete.Option key={data.userId}>
                            {data.userName}
                        </AutoComplete.Option>
                    )}>
                    <Input onCompositionStart={this.handleCompositionStart}
                        onCompositionEnd={this.handleCompositionEnd}
                        style={this.state.userList && !this.state.userList.length && {borderColor: 'red'} || {}}/>
                </AutoComplete>
                {this.state.userList
                    && !this.state.userList.length
                    && <p style={{color: 'red'}}>没有匹配用户，请重新输入</p>}
            </div>
        )
    }
}
