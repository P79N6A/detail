/**
 * @file 入口
 * @author simotophs@gmail.com
 * @date    2017-11-22 16:42:35
 * @description 主入口模块
 */
import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './rootReducer';
import App from './page/app';
import './index.less';

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunkMiddleware)
    )
);
if (module.hot) {
    module.hot.accept('./rootReducer', () => {
        store.replaceReducer(module.default);
    });
}

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);
