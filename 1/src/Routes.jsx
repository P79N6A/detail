/**
 * 路由处理
 * @file Routes.jsx
 * @author yangxiaoxu@baidu.com
 */
import React from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import LayoutContent from './module/layout/layout.jsx';
import RouteList from '../config/router.config.js';

const Main = () => (
    <Switch>
        {
            RouteList.map((route, index) =>
                (
                    <Route key={index}
                        exact={route.exact}
                        path={route.path}
                        component={() => <LayoutContent route={route} />}
                    />
                )
            )
        }
        <Route><Redirect to="/model/index" /></Route>
    </Switch>
);

const rootRouter = () => (
    <BrowserRouter>
        <Main />
    </BrowserRouter>
);

module.exports = rootRouter;
