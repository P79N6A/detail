/**
 * @file 框架
 * @author
 */

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import config from '../../../config/project.config.jsx';
import request from '../system/request.jsx';
import common from '../../components/common';
import Nav from './navigation.jsx';
import './layout.less';
// antd
import {Layout, Breadcrumb, Popover, Select, Modal, Button} from 'antd';
const {Header, Content} = Layout;

export default class LayoutContent extends Component {
    state = {
        loginName: '--', // 用户名
        spacesList: [],
        spaceId: undefined,
        permissionVisible: false,
        isShowSpace: 'hidden'
    }
    /**
     *
     * 面包屑
     * @return {Object} breadcrumbItems 代码块
     */
    getBreadCrumb = () => {
        let route = this.props.route;
        let UrlParam = location.search;

        let breadcrumbItems = Array.isArray(route.parent) ? route.parent.map((item, i) =>
            (
                <Breadcrumb.Item key={i}>
                {
                    item.path ? (
                        <Link to={item.path + UrlParam}>
                            {item.name}
                        </Link>
                    ) : item.name
                }
                </Breadcrumb.Item>
            )
        ) : [];

        breadcrumbItems.push(
            <Breadcrumb.Item key={route.path}>
                <Link to={route.path + UrlParam}>
                    {route.name}
                </Link>
            </Breadcrumb.Item>
        );
        return breadcrumbItems;
    }


    componentDidMount() {
        this.getUserInfo();
        this.getSpaces();
    }

    // 获取用户信息
    getUserInfo() {
        let self = this;
        let params = {};
        request({
            isParallel: true,
            url: config.api.userInfo,
            data: params,
            success: data => {
                self.setState({
                    loginName: data.content.loginName
                });
            }
        });
    }

    // 获取空间信息
    getSpaces() {
        let self = this;
        let oldSpaceId = common.getCookie('spaceId');
        request({
            isParallel: true,
            url: config.api.spacesList,
            success: data => {
                self.setState({
                    spacesList: data.content,
                    spaceId: oldSpaceId ? oldSpaceId : data.content[0].spaceId.toString()
                }, () => {
                    request({
                        isParallel: true,
                        url: config.api.auth,
                        data: {
                            spaceId: this.state.spaceId
                        },
                        success: data => {
                            if (!data.content) {
                                this.setState({
                                    permissionVisible: true,
                                    isShowSpace: 'visible'
                                });
                            }
                            common.setCookie('spaceId', this.state.spaceId, 7);
                        }
                    });
                });
            }
        });
    }

    // 选择空间
    handleSelectSpace = value => {
        this.setState({isShowSpace: 'hidden'});
        request({
            isParallel: true,
            url: config.api.auth,
            data: {
                spaceId: value
            },
            success: data => {
                let tmpArr = ['model', 'flow', 'task', 'service'];
                if (data.content) {
                    tmpArr.forEach(item => {
                        if (window.location.href.indexOf(item) > 0) {
                            window.location.href = `/${item}/list`;
                        }
                    });
                }
                else {
                    this.setState({
                        permissionVisible: true,
                        isShowSpace: 'visible'
                    });
                }
                common.setCookie('spaceId', value, 7);
                this.setState({
                    spaceId: value
                });
                
            }
        });
    }

    handleLogout() {
        if (window.CASLogoutUrl) {
            const img = new Image();
            img.onload = function () {
                window.location.href = '/model/index';
            };
            img.onerror = function () {
                window.location.href = '/model/index';
            };
            img.src = window.CASLogoutUrl;
            common.setCookie('spaceId', '');
        }
    }

    render() {
        let route = this.props.route;

        let AsyncComponent = require(`../../page/${route.page}`).default;

        let loginData = (
            <div className="user-info-detail">
                <div className="user-info-t">
                    <span className="user-login-first">{this.state.loginName[0].toUpperCase()}</span>
                    <div className="user-login-tr">
                        <span>{this.state.loginName}</span>
                    </div>
                </div>
                <div className="user-info-b">
                    <a href="javascript:void(0);" onClick={this.handleLogout}>
                        退出账号
                    </a>
                </div>
            </div>
        );

        let selectTpl = (
            <Select
                placeholder="请选择用户组"
                onChange={this.handleSelectSpace}
                value ={this.state.spaceId}
                className="select_group spaces-select"
                style={{width: 130}}
            >
                {
                    this.state.spacesList && this.state.spacesList.map(item => {
                        return (
                            <Select.Option
                                value={item.spaceId.toString()}
                                key={item.spaceId}
                            >{item.spaceName}</Select.Option>
                        );
                    })
                }
            </Select>
        );

        let logoutButton = <Button style={{marginLeft: '10px'}} onClick={this.handleLogout}>切换账号</Button>;

        let permissionTpl = (
            <Modal
                visible={this.state.permissionVisible}
                footer={false}
                closable={false}
                width={330}
            >
                <div className="permission_modal">
                    <p style={{'visibility': this.state.isShowSpace}}>此空间无权限，请切换空间</p>
                    {selectTpl}
                    {logoutButton}
                </div>
            </Modal>
        );

        return (
            <Layout style={{minHeight: '100vh', marginLeft: 120}}>
                <Nav />
                <Layout>
                    <Header className="page-header">
                        <div className="page-header-content">
                            {selectTpl}
                            <div className="page-header-item">
                                <Link to="/qa">帮助文档</Link>
                            </div>
                            <div className="page-header-item">
                                <Popover overlayClassName="page-login-box" content={loginData} placement="bottomRight">
                                    <p>
                                        {this.state.loginName}
                                        <span className="user-login-first-sub">{this.state.loginName[0].toUpperCase()}</span>
                                    </p>
                                </Popover>
                            </div>
                        </div>
                    </Header>
                    <Content className="page-content">
                    <div>
                        <Breadcrumb style={{padding: '15px'}}>
                            {this.getBreadCrumb()}
                        </Breadcrumb>
                        <AsyncComponent title={route.name} />
                        {permissionTpl}
                    </div>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
