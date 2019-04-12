/**
 * @file nav.jsx 导航栏
 * @author xueliqiang@baidu.com
 */
import React, {Component} from 'react';
import {Menu, Icon} from 'antd';
import {withRouter} from 'react-router';
import './nav.less';

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const Location = {
    TEMPLATE: 'template',
    ENDPOINT: 'endpoint'
};

class Nav extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
            selectedKeys: [Location.TEMPLATE]
        };
    }

    static getDerivedStateFromProps(newProps, state) {
        if (newProps.search !== state.search) {
            return {
                search: newProps.search,
                selectedKeys: newProps.search.indexOf(Location.TEMPLATE) > 0
                    ? [Location.TEMPLATE] : [Location.ENDPOINT]
            };
        }
        return null;
    }

    navTerminalTemplate = () => {
        this.props.history.push(`?nav=${Location.TEMPLATE}`);
    };

    navEndPoint = () => {
        this.props.history.push(`?nav=${Location.ENDPOINT}`);
    };

    nav = e => {
        switch (e.key) {
            case Location.TEMPLATE:
                this.navTerminalTemplate();
                break;
            case Location.ENDPOINT:
                this.navEndPoint();
        }
    };

    render() {
        const {selectedKeys} = this.state;
        const navHeader = <div className="nav-header">AI开发平台Infinite</div>;
        const menu = (<Menu
            onClick={this.nav}
            className={this.props.className}
            selectedKeys={selectedKeys}
            defaultOpenKeys={['predict']}
            mode="inline"
        >
            {/* <SubMenu key="predict" title={<span>预测</span>}> */}
                <Menu.Item key={Location.TEMPLATE}>端点模板</Menu.Item>
                <Menu.Item key={Location.ENDPOINT}>端点</Menu.Item>
            {/* </SubMenu> */}
        </Menu>);

        return <div className="nav-container infinite-heard">
            {navHeader} {menu}
        </div>;
    }
}

export default withRouter(Nav);
