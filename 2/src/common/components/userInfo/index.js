/**
 * @file 用户信息
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Select, Avatar} from 'antd';
import * as actionTypes from '../../../conf/actionType';
import request from '../../js/request';
import './index.less';

class UserInfo extends Component {
    componentDidMount() {
        this.props.actions.getUserInfo();
    }

    logout = () => {
        // 跨域刷新
        const img = new Image();
        img.onload = function () {
            window.location.href = '/';
        };
        img.onerror = function () {
            window.location.href = '/';
        };
        img.src = this.props.userInfo.userInfo.logoutUrl;
    }

    render() {
        const userInfo = this.props.userInfo.userInfo;
        userInfo.spaces
            && userInfo.spaces[0]
            && (!sessionStorage.AuthSpaceId || !userInfo.spaces.some(space =>
                space.spaceId == sessionStorage.AuthSpaceId))
            && sessionStorage.setItem('AuthSpaceId', userInfo.spaces[0].spaceId);
        return <header className="userInfo-wrapper">
            <span><Avatar icon="user" style={{marginRight: '10px'}}/>{userInfo.userName}</span>
            {userInfo.logoutUrl && <span onClick={this.logout} style={{cursor: 'pointer'}}>退出</span>}
        </header>;
    }
}

const mapStateToProps = state => ({
    userInfo: state.userInfo
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        getUserInfo: () => function (dispatch) {
            request('/console/web/getUserInfo', {
                method: 'get'
            }).then(
                res => {
                    dispatch({
                        type: actionTypes.GET_USER_INFO,
                        data: res.data
                    });
                }
            );
        }
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
