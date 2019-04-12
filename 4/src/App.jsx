/**
 * @file 应用主文件
 * @author xueliqiang@baidu.com
 */
import React from 'react';
import {LocaleProvider} from 'antd';
import {Provider} from 'react-redux';
import zhcn from 'antd/lib/locale-provider/zh_CN';
import AppRoute from './AppRoute';

$.ajaxSetup({
    cache: false
});
export default class App extends React.Component {
    render() {
        return (
            <LocaleProvider locale={zhcn}>
                <Provider store={this.props.store}>
                    <AppRoute/>
                </Provider>
            </LocaleProvider>
        );
    }
}
