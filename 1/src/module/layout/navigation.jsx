/**
 * @file 导航
 * @author yangxiaoxu@baidu.com
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import './layout.less';

// antd
import {Layout, Menu} from 'antd';
const Sider = Layout.Sider;

export default class Nav extends Component {
    render() {
        let type = location.pathname.split('/').filter(i => i)[0];
        return (
            <Sider className="page-nav">
                <div className="page-logo"></div>
                <Menu
                    defaultSelectedKeys={[type]}
                    width={120}
                    mode="inline"
                    className="page-menu"
                >
                    <Menu.Item key="model">
                        <Link to="/model/index">
                            <span className="page-side-bar1">模型</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="flow">
                        <Link to="/flow/list">
                            <span className="page-side-bar2">流程</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="task">
                        <Link to="/task/list">
                            <span className="page-side-bar3">任务</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="service">
                        <Link to="/service/list">
                            <span className="page-side-bar4">服务</span>
                        </Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}
