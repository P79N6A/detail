/**
 * @file header.jsx 首页
 * @author xueliqiang@baidu.com
 */
import {Avatar, Select, Dropdown, Menu, Icon, Modal, Button} from 'antd';
import React, {Component} from 'react';
import * as api from '../../api/api';
import common from '../common/common';
import './header.less';


export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            spacesList: [],
            spaceId: undefined,
            userInfor: {},
            permissionVisible: false,
            isShowTips: 'hidden'
        };
    }

    componentDidMount() {
        this.getUserInfor();
        this.getSpaces();
    }

    // 获取用户信息
    getUserInfor() {
        api.getUserInfor().then(data => {
            this.setState({
                userInfor: data
            });
        });
    }

    // 获取空间列表
    getSpaces() {
        let oldSpaceId = common.getCookie('spaceId');
        api.getSpaces().then(data => {
            this.setState({
                spacesList: data,
                spaceId: data
                    && !data.some(item => oldSpaceId === item.spaceId.toString())
                    ? data[0].spaceId.toString() : oldSpaceId
            }, () => {
                api.getAuth({spaceId: this.state.spaceId}).then(data => {
                    if (!data) {
                        this.setState({
                            permissionVisible: true,
                            isShowTips: 'visible'
                        });
                    }
                });
            });
        });
    }
    // 改变空间
    handleChangeSpace = value => {
        this.setState({
            isShowTips: 'hidden'
        });
        api.getAuth({spaceId: value}).then(data => {
            if (data) {
                location.reload();
            }
            else {
                this.setState({
                    permissionVisible: true,
                    isShowTips: 'visible'
                });
            }
        });
        common.setCookie('spaceId', value, 7);
        this.setState({
            spaceId: value
        });
    }
    // 退出
    logOutClick = () => {
        const img = new Image();
        img.onload = function () {
            window.location.href = '/';

        };
        img.onerror = function () {
            window.location.href = '/';
        };
        img.src = this.state.userInfor.logoutUrl;
        common.setCookie('spaceId', '');
    }

    render() {
        // 初始化设置cookie值
        let oldSpaceId = common.getCookie('spaceId');
        this.state.spaceId
        && (!oldSpaceId || !this.state.spacesList.some(item => oldSpaceId === item.spaceId.toString()))
        && common.setCookie('spaceId', this.state.spaceId, 7);
        const menu = (
            <Menu>
              <Menu.Item key="0">
                <div className="drop">
                    <span className="userName">{this.state.userInfor.userName}</span>
                    <span onClick={this.logOutClick} className="logOut"><Icon type="logout" /> 登出</span>
                </div>
              </Menu.Item>
            </Menu>
        );
        let selectSpaceTpl = (
            <Select
                className="select-space"
                value = {this.state.spaceId}
                placeholder="请选择用户组"
                onChange={this.handleChangeSpace}
                style={{width: '170px'}}
            >
                {
                    this.state.spacesList && this.state.spacesList.map(item => {
                        return (
                            <Select.Option
                                value={item.spaceId.toString()}
                                key={item.spaceId}
                            >
                                {item.spaceName}
                            </Select.Option>
                        );
                    })
                }
            </Select>
        );
        let logoutButton = <Button style={{marginLeft: '10px'}} onClick={this.logOutClick}>切换账号</Button>;
        let permissionTpl = (
            <Modal
                visible={this.state.permissionVisible}
                footer={false}
                closable={false}
                width={330}
            >
                <div style={{textAlign: 'center'}}>
                    <p style = {{visibility: this.state.isShowTips}}>此空间无权限，请切换空间</p>
                    {selectSpaceTpl}
                    {logoutButton}
                </div>
            </Modal>
        );
        return (
            <div id="content">
                <div className="user">
                    <Dropdown overlay={menu} trigger={['click']}><div>
                        <Avatar className="portrait ant-dropdown-link">{this.state.userInfor.userName
                            && this.state.userInfor.userName.substr(0, 1).toUpperCase()}</Avatar>
                        <Icon type="down" /></div>
                    </Dropdown>
                </div>
                {selectSpaceTpl}
                {permissionTpl}
            </div>
        );
    }
}
