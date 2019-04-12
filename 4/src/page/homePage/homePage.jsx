/**
 * @file homePage.jsx 首页
 * @author xueliqiang@baidu.com
 */
import {Layout, Button} from 'antd';
import React, {Component} from 'react';
import Nav from '../../components/nav/nav';
import HeaderComponent from '../../components/header/header.jsx';
import EPTemplateConfigList from '../../page/EPTemplateConfigList/EPTemplateConfigList';
import EPConfigList from '../../page/EPConfigList/EPConfigList';

import './homePage.less';

const {Header, Sider, Content} = Layout;

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    componentDidMount() {
    }
    createNewTemplate = () => {
        this.props.history.push('/edit-ep-template');
    };

    createNewEndpoint = () => {
        this.props.history.push('/new-endpoint');
    };

    newTemplate = () => {
        this.props.history.push('/new-ep-template');
    }
    // table中的跳转
    compileInfo = () => {
        console.log(this.state.queryData);
        let queryData = this.state.queryData;
        let path = {
            pathname: '/endpoint-compile',
            // 跳转需要的参数
            endpointId: 'id12345'
        };
        this.props.history.push(path);

    }
    render() {
        const {search} = this.props.location;
        let ContentPage = null;
        switch (search) {
            case '?nav=template': {
                ContentPage = EPTemplateConfigList;
                break;
            }
            case '?nav=endpoint': {
                ContentPage = EPConfigList;
                break;
            }
            default: {
                ContentPage = EPTemplateConfigList;
                break;
            }
        }
        // let contentPage = <Button onClick={this.createNewTemplate}>端点模板</Button>;
        // if (search === '?nav=endpoint') {
        //     contentPage = <div>
        //         <Button onClick={this.createNewEndpoint}>端点</Button>
        //         <Button onClick={this.compileInfo}>test</Button>
        //     </div>;
        // }

        return (<Layout style={{height: '100%'}}>
            <Header className="homePage-header">
                {/*TODO: Header Component*/}
                <HeaderComponent/>
            </Header>
            <Layout style={{height: '100%'}}>
                <Sider className="homePage-sider" >
                    <Nav className="nav" search={search}/>
                </Sider>
                {/*端点模板/端点*/}
                <Content><ContentPage /></Content>
            </Layout>
        </Layout>);
    }
}
