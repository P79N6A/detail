import './login.less';
import React, { Component } from 'react';
import getQueryString from '../../module/Integration/getQueryString.jsx';

export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        // 实例化登录框
        // 登录成功后跳转地址
        var redirectUrl = getQueryString('u') || (window.location.origin + '/model/index');
        window.ucCommonLogin.init({
            container: 'login', // DOM节点ID
            appid: 518,  // UClogin中申请的产品线id
            staticPage: window.location.origin + window.UCV3JumpUrl, // 登录页
            fromu: window.location.origin + '/api/jump?u=' + encodeURIComponent(redirectUrl), // 登录成功后跳转目标地址
            registerUcLink: window.UCRegUrl + '&nexturl=' + encodeURIComponent(window.location.origin + '/login')// 注册完成之后跳转至登录页面
        });
    }

    render() {
        return (
            <div className="login-bg-box">
                <div className="login-header">
                    <div className="login-header-content">
                        <div className="login-header-logo"></div>
                    </div>
                </div>
                <div className="login-content">
                    <div className="login-content-left login-bg-img"></div>
                    <div id="loginContentBox" className="login-content-form">
                        <div className="login-title-mine">决策平台登录系统</div>
                        <div id="login"></div>
                        <div className="login-tips">
                            <span className="tip-subtitle">温馨提示</span><br/>
                            <span className="tip-subcontent">使用百度推广帐号或新注册的帐号可直接登录</span>
                        </div>
                    </div>
                </div>
                <div className="login-footer">© 2018 Baidu 使用百度前必读    增值电信业务经营许可证：B1.B2-20100266    京ICP证030173号    隐私政策</div>
            </div>
        )
    }
}