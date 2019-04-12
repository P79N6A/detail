/**
 * @file 应用入口文件
 * @author yangxiaoxu@baidu.com
 */
import React, {Component} from 'react';
import {render} from 'react-dom';
import Routers from './Routes.jsx';
import './module/global.less';

render(
    <Routers />
    , document.getElementById('root'));
