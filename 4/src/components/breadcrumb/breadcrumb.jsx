/**
 * @file pointBreadcrumb.jsx 端点面包屑
 * @author xueliqiang@baidu.com
 */
import React, {Component} from 'react';
import {withRouter} from 'react-router';
import PropTypes from 'prop-types';
import {Menu, Icon} from 'antd';
import './breadcrumb.less';

class Breadcrumb extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    navBack = () => {
        let url = this.props.nav;
        this.props.history.push(url);
    };

    render() {
        const {breadBrumbText, text} = this.props;
        return <header className="header">
            <span onClick={this.navBack} className="nav-back"><Icon type="left" />{breadBrumbText}</span>
            <span>{text}</span>
        </header>;
    }
}

Breadcrumb.propTypes = {
    nav: PropTypes.string,
    breadBrumbText: PropTypes.string,
    text: PropTypes.string
};

export default withRouter(Breadcrumb);
