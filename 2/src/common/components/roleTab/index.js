/**
 * @file 用户信息
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import './index.less';

export default class UserInfo extends Component {
    render() {
        if (this.props.type === 'rolePermission') {
            $('.roleTab:first-child').addClass('active');
        } else {
            $('.roleTab:nth-child(2)').addClass('active');
        }

        return <header className="roleTab-wrapper">
            <Link to='/rolePermission' className="roleTab">角色及权限设置</Link>
            <Link to='/roleUserGroup' className="roleTab">角色用户组设置</Link>
        </header>;
    }
}
