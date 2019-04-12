/**
 * @file 页面主体结构
 */
import React from 'react';
import {Input, Button, Table, Icon} from 'antd';
import './index.less';
const Search = Input.Search;
export default class Layout extends React.Component {
    state = {
        inputValue: '',
        baseConfig: {}
    }

    componentDidMount() {
        this.handleMergeConfig(this.props.baseConfig);
    }

    // 将外面传入的数据和默认数据合并
    handleMergeConfig = outsideConfig => {
        let defaultConfig = {
            button: false,
            buttonText: '',
            titleText: ''
        };
        this.setState({
            baseConfig: Object.assign(defaultConfig, outsideConfig)
        });

    }
    // 搜索框事件
    handleSearch = value => {
        this.props.onSearch && this.props.onSearch(value);
        this.setState({
            inputValue: ''
        });
    }
    handleChange = e => {
        this.setState({
            inputValue: e.target.value
        });
    }

    // 右侧按钮事件
    handleButtonClick = () => {
        this.props.addButtonClick && this.props.addButtonClick();
    }

    // 表格的数据处理
    handleDataSource = data => {
        let newData = [];
        if (data) {
            let cloneData = this.handleDeepCopy(data);
            Array.isArray(cloneData) && cloneData.forEach((item, key) => {
                let current = this.props.pagination && this.props.pagination.current;
                item.key = current ? (current - 1) * 20 + key + 1 : key + 1;
            });
            newData = cloneData;
        }
        return newData;
    }

    handleColumns = data => {
        let newData = [];
        let cloneData = this.handleDeepCopy(data);
        Array.isArray(cloneData) && cloneData.unshift({
            title: '序号',
            dataIndex: 'key',
            key: 'key',
            width: '7%'
        });
        cloneData.forEach(item => {
            item.align = 'center';
        });
        newData = cloneData;
        return newData;
    }

    handleDeepCopy = initObj => {
        let type = initObj && initObj.constructor === Array ? [] : {};
        for (let key in initObj) {
            if (typeof initObj[key] === 'object') {
                type[key] = this.handleDeepCopy(initObj[key]);
            }
            else {
                type[key] = initObj[key];
            }
        }
        return type;
    }

    handleChangePage = page => {
        this.props.onChangePage && this.props.onChangePage(page);
    }

    render() {
        let {dataSource, columns, pagination, buttonDisable, placeholder, search} = this.props;
        return (
            <div>
                <h3 className="page-header">{this.state.baseConfig.titleText}</h3>
                <div className="page-main">
                    <div className="page-main-title clear">
                            {
                                search
                                && <Search
                                    placeholder = {placeholder ? placeholder : '搜索'}
                                    enterButton = "搜索"
                                    value = {this.state.inputValue}
                                    onSearch = {this.handleSearch}
                                    onChange = {this.handleChange}
                                />
                            }
                            {
                                this.state.baseConfig && this.state.baseConfig.button
                                && <Button
                                    className = "page-main-button"
                                    onClick = {this.handleButtonClick}
                                    type = "primary"
                                    disabled = {buttonDisable ? buttonDisable : false}
                                    >
                                    <Icon type="plus"/>
                                    {this.state.baseConfig.buttonText}
                                </Button>
                            }
                        </div>
                    <div className="page-main-content">
                        <Table
                            dataSource={this.handleDataSource(dataSource)}
                            columns={this.handleColumns(columns)}
                            onChange = {this.handleChangePage}
                            pagination = {pagination ? pagination : false}
                            rowKey={record => record.key}
                            size="small"
                        />
                    </div>
                </div>
            </div>
        );
    }
}
