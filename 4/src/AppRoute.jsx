/**
 * @file 路由
 * @author xueliqiang@baidu.com
 */
import React from 'react';
import {hot} from 'react-hot-loader';
import Loadable from 'react-loadable';
import {connect} from 'react-redux';
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import HomePage from './page/homePage/homePage';
import NewEPTemplate from './page/newEPTemplate/newEPTemplate';
import EditEPTemplate from './page/editEPTemplate/editEPTemplate';
import NewEndpoint from './page/newEndpoint/newEndpoint';
import EndpointCompile from './page/endpointCompile/endpointCompile';

class AppRoute extends React.Component {
    render() {
        return (
            <Router>
                <div style={{height: '100%'}}>
                    <Switch>
                        <Route exact path="/" component={HomePage}/>
                        <Route path="/new-ep-template" component={NewEPTemplate}/>
                        <Route path="/edit-ep-template" component={EditEPTemplate}/>
                        <Route path="/new-endpoint" component={NewEndpoint}/>
                        <Route path="/endpoint-compile" component={EndpointCompile}/>
                        <Route>
                            <Redirect to="/"/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default hot(module)(connect()(AppRoute));
