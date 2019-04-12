/**
 * @file 用户信息
 * @author luoxiaolan@baidu.com
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Menu, Icon, Select, Modal} from 'antd';
import {Link} from 'react-router-dom';
import * as actionTypes from '../../../conf/actionType';
import request from '../../js/request';
import {menuInfo} from '../../../conf/menuConfig';
import './index.less';
import clientImg from './imgs/logo.svg';
import {bankList} from '../../../conf/configParams';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

class Menus extends Component {
    state = {
        selectedKeys: '',
        openKeys: []
    }

    componentDidMount() {
        this.props.actions.getMenus();
    }

    handleChangeSpace = value => {
        sessionStorage.setItem('AuthSpaceId', value);
        this.props.actions.getMenus();
        location.hash = '/';
    }

    getPageInfo = data => {
        const info = menuInfo.find(item => (
            item.pageCode === data.pageCode
        ));

        Object.assign(data, info);
    }

    isPage = data => {
        // 如果在 menuInfo 中能找到对应的 pageCode，且其子元素不存在或者子元素存在，但是子元素的 pageCode 在 menuinfo 中找不到，则是 page
        if (!data.isNode) {
            return !data.children
                || !data.children.every(
                    child => menuInfo.some(info => info.pageCode === child.pageCode)
                );
        }
    }

    isNode = data => {
        return !menuInfo.some(info => info.pageCode === data.pageCode);
    }

    setPageInfo = data => {
        data.forEach(item => {
            this.isNode(item) && (item.isNode = true);
            this.isPage(item) && (item.isPage = true);

            if (!item.isNode) {
                this.getPageInfo(item);
                item.children && this.setPageInfo(item.children);
            }
        });
    }

    getOpenKey = (childrencode, data) => {
        let openkey;
        if (data.some(item => {
            if (item.children && item.children.some(child => child.pageCode === childrencode)) {
                this.openKeys.push(item.pageCode);
                openkey = item.pageCode;
                return true;
            }
            return false;
        })) {
            return openkey;
        } else {
            let len = data.length;

            for (let i = 0; i < len; i++) {
                if (data[i].children) {
                    openkey = this.getOpenKey(childrencode, data[i].children);

                    if (openkey) {
                        return openkey;
                    }
                }
            }
        }
    }

    getOpenKeys = (childrencode, data) => {
        let openkey = this.getOpenKey(childrencode, data);

        openkey && this.getOpenKeys(openkey, data);
    }

    hasWarn = false;

    getDefaultKeys = data => {
        let hash = location.hash.substr(2);
        if (hash === 'roleUserGroup') {
            hash = 'rolePermission';
        }

        let currentItem = menuInfo.find(item => (item.link && (item.link.substr(1) === hash)));

        this.selectedKeys = currentItem ? currentItem.pageCode : '';
        this.openKeys = [];

        // 如果能够在 menu 中找到对应的节点则表示有访问权限，否则没有权限
        if (this.selectedKeys
            && data && !this.isInMenu(data, this.selectedKeys) && !this.hasWarn) {
            this.hasWarn = true;
            Modal.warning({
                 title: '无权限，请找管理员添加权限',
                 onOk: () => {
                     location.hash = '/';
                 }
             });
        }

        this.getOpenKeys(this.selectedKeys, data);
    }

    isInMenu = (data, key) => {
        if (data.find(item => item.pageCode === key)) {
            return true;
        } else {
            return data.some(item => {
                if (item.children) {
                    return this.isInMenu(item.children, key);
                }
                return false;
            });
        }
    }

    componentWillReceiveProps (nextProps) {
        const me = this;
        if (nextProps.menus !== me.props.menus && nextProps.menus.menus) {
            this.setPageInfo(nextProps.menus.menus);
            this.getDefaultKeys(nextProps.menus.menus);

            this.setState({
                openKeys: this.openKeys,
                selectedKeys: this.selectedKeys
            });
        }
    }

    renderMenusItem = data => {
        return data.map(item => {
            if (!item.isPage && !item.isNode) {
                return <SubMenu title={item.title} key={item.pageCode} className={`submenu ${item.pageCode}`}>
                    {item.children && this.renderMenusItem(item.children)}
                </SubMenu>
            } else if (item.isPage) {
                return <MenuItem key={item.pageCode}>
                    <Link to={item.link}>
                        <span><i className="circle"></i>{item.title}</span>
                    </Link>
                </MenuItem>
            }
            return false;
        });
    }

    renderMenus = () => {
        return this.renderMenusItem(this.props.menus.menus);
    }

    handleSelect = ({item, key, selectedKeys}) => {
        this.setState({
            selectedKeys: key
        });
    }

    handleOpen = openKeys => {
        this.setState({
            openKeys
        });
    }

    findBankName = code => {
        const bankObj = bankList.find(item => item.code === code);

        if (bankObj) {
            return bankObj.name;
        }
    }

    render() {
        const menus = this.props.menus;
        const userInfo = this.props.userInfo.userInfo;

        return <div className="menus-wrapper">
            <header className="space-select-wrapper">
                <h5>
                    <img src={clientImg}/>{userInfo && userInfo.bankCode && this.findBankName(userInfo.bankCode)}AI工程平台管理后台</h5>
                <Select
                    size="small"
                    className="select-wrapper"
                    defaultValue={userInfo
                        && userInfo.spaces
                        && (userInfo.spaces.some(space =>
                            space.spaceId == sessionStorage.AuthSpaceId)
                            ? sessionStorage.AuthSpaceId : `${userInfo.spaces[0].spaceId}`)}
                    onChange={this.handleChangeSpace}>
                    {userInfo && userInfo.spaces && userInfo.spaces.map(item =>
                        <Select.Option value={`${item.spaceId}`} key={item.spaceId}>{item.spaceName}</Select.Option>)}
                </Select>
            </header>
            {menus.endFetching && <Menu
                mode="inline"
                theme="dark"
                selectedKeys={[this.state.selectedKeys]}
                openKeys={this.state.openKeys}
                onClick={this.handleSelect}
                onOpenChange={this.handleOpen}>
                {this.renderMenus()}
            </Menu>}
        </div>;
    }
}

const mapStateToProps = state => ({
    menus: state.menus,
    userInfo: state.userInfo
});

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        getMenus: () => function (dispatch) {
            request('/console/web/getMenus', {
                method: 'get'
            }).then(
                res => {
                    dispatch({
                        type: actionTypes.GET_MENUS,
                        data: res.data
                    });

                    let pageCodeList = [];

                    const getPageInfo = data => {
                        data.forEach(item => {
                            if (menuInfo.some(info => info.pageCode === item.pageCode)
                                && !item.children
                                || !item.children.every(
                                    child => menuInfo.some(
                                        info => info.pageCode === child.pageCode)
                                    )
                                ) {
                                pageCodeList.push(item);
                            } else {
                                item.children && getPageInfo(item.children);
                            }
                        })
                    };

                    getPageInfo(res.data.content);

                    dispatch({
                        type: actionTypes.SET_PAGE_PERMISSION_INFO,
                        data: pageCodeList
                    });
                }
            );
        }
    }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Menus);
