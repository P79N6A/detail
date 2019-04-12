/**
 * @file 程序主入口
 * @author luoxiaolan@badu.com
 */

import React from 'react';
import {Route, HashRouter} from 'react-router-dom';
import {Layout, LocaleProvider} from 'antd';
import zh_cn from 'antd/lib/locale-provider/zh_CN';
import {connect} from 'react-redux';
import {hot} from 'react-hot-loader';
import UserCount from './userCount/index.jsx';
import RolePermission from './rolePermission';
import WorkGroup from './workGroup/index.jsx';
import RoleUserGroup from './roleUserGroup';
import SetApproval from './setApproval';
// import PerceptEngine from './perceptEngine/index.jsx';
import ApprovalList from './approvalList';
import AccessLog from './accessLog/index.jsx';
import LogDetail from './accessLog/detail.jsx';
import DataSource from './dataSource/index.jsx';
import '../common/css/mixins.less';
import UserInfo from '../common/components/userInfo';
import Menus from '../common/components/menus';
import Home from './home';

const {Header, Content, Sider} = Layout;

class App extends React.Component {
    render() {
        let userInfo = this.props.userInfo;

        return (
            <LocaleProvider locale={zh_cn}>
                <HashRouter>
                    <Layout style={{height: '100%'}}>
                        <UserInfo/>
                        {userInfo.endFetching
                            && !!userInfo.userInfo.spaces
                            && !!userInfo.userInfo.spaces.length
                            && <div className="content-wrapper">
                            <div
                                className="layout-sider-area">
                                <Menus/>
                            </div>
                            <div className="layout-right-area">
                                {this.props.menus && !!this.props.menus.length && <Content>
                                    <div className="right-box">
                                        <Route path="/userCount" component={UserCount}/>
                                        <Route path="/workGroup" component={WorkGroup}/>
                                        <Route path="/accessLog" component={AccessLog}/>
                                        <Route path="/logDetail" component={LogDetail}/>
                                        <Route path="/dataSource" component={DataSource}/>
                                    </div>
                                    <Route path="/rolePermission" component={RolePermission}/>
                                    <Route path="/roleUserGroup" component={RoleUserGroup}/>
                                    <Route path="/setApproval" component={SetApproval}/>
                                    <Route path="/approvalList" component={ApprovalList}></Route>
                                    <Route path='/' exact component={Home}></Route>
                                </Content>}
                                {this.props.menus && !this.props.menus.length && <Content>
                                    <p style={{textAlign: 'center', marginTop: '20%'}}>无权限，请找管理员添加权限</p>
                                </Content>}
                            </div>
                        </div>}
                        {(userInfo.endFetching
                            && !(userInfo.userInfo.spaces && userInfo.userInfo.spaces.length))
                            && <p style={{textAlign: 'center', marginTop: '20%'}}>无权限，请找管理员添加权限</p>}
                    </Layout>
                </HashRouter>
            </LocaleProvider>
        );
    }
}

export default hot(module)(connect(state => ({
    userInfo: state.userInfo,
    menus: state.menus.menus
}))(App));
