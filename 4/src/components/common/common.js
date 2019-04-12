/**
 * @file common.js 通用方法模块
 * @author xueliqiang@baidu.com
 */

import {notification} from 'antd';

export default {

    /**
     * 获取输入框的值并兼容IE
     *
     * @param {Object} e 输入框event对象
     * @return {string} 输入框值
     */
    getInputValue(e) {
        if (!e || !(e.target || e.currentTarget)) {
            return e;
        }
        return e.target.value !== undefined ? e.target.value : e.currentTarget.value;
    },

    /**
     * 获取端点模板名称规则
     * @param {string} requiredMsg 请求参数
     * @return {Array} 端点模板名称rule
     */
    getTemplateNameRules(requiredMsg) {
        const templateNameRules = [
            {
                pattern: /^[a-zA-Z][\w-_;]{0,64}$/,
                message: '只能包含大小写字母，数字和-_ ；必须以字母开头,长度1-65'
            },
            {
                required: true,
                message: requiredMsg || '端点模板名称必填'
            }
        ];
        return templateNameRules;
    },

    /**
     * 获取端点模板备注规则
     *
     * @return {Array} 端点模板名称rule
     */
    getRemarkRules() {
        const remarkRules = [
            {
                max: 200,
                min: 0,
                message: '不能超过200个字符'
            }
            // {
            //     required: true,
            //     message: '端点模板名称必填'
            // }
        ];
        return remarkRules;
    },

    /**
     * 获取Form Item的Layout信息
     *
     * @return {Object} Form Item Layout
     */
    getFormItemLayout() {
        return {
            labelCol: {span: 4},
            wrapperCol: {span: 18}
        };
    },

    /**
     * 发起http请求 in promise
     *
     * @param {Object} options 请求参数
     * @return {Promise} 请求
     */
    requestInPromise(options = {}) {
        const opt = Object.assign({}, {
            type: 'GET',
            contentType: 'application/json; charset=utf-8',
            data: {}
        }, options);
        let self = this;
        return new Promise(function (resolve, reject) {
            let data = opt.data;
            if (opt.type.toUpperCase() === 'POST'
                && opt.data
                && opt.contentType.indexOf('application/json') > -1) {
                data = JSON.stringify(opt.data);
            }
            $.ajax({
                type: opt.type,
                url: opt.url,
                data: data,
                dataType: 'json',
                contentType: opt.contentType,
                cache: false,
                success(data) {
                    if (data.ret === '0' || data.ret === 'SUCCESS') {
                        resolve(data.content);
                    }
                    else {
                        if (data.ret === 'NO_LOGIN') {
                            data.content && self.goLogin(data.content);
                        }
                        reject(data.msg);
                    }
                },
                error(xhr, type) {
                    reject('网络异常');
                }
            });
        });
    },

    /**
     * 登陆跳转
     */

    goLogin(loginPageUrl, url) {
        const currentUrl = url || window.location.href;
        const redirectUrl = window.location.protocol + '//' + window.location.host
            + '/predict/login' + '?redirect='
            + encodeURIComponent(currentUrl);
        window.location.href = `${loginPageUrl}?service=${encodeURIComponent(redirectUrl)}`;
    },

    /**
     * 获取url中的指定参数值
     *
     * @param {string} name [指定的查找字段]
     * @param {string=} search [指定的查找范围，不传则使用 window.location.search]
     * @return {void}        [无]
     */
    getQueryString(name, search = window.location.search) {
        const self = this;
        const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        const r = search.substr(1).match(reg);
        if (r !== null) {
            return self.filterStr(decodeURIComponent(r[2]));
        }
        return null;
    },

    /**
     * 特殊字符过滤
     *
     * @param {string} str 输入字符串
     * @return {string} 过滤后的字符串
     */
    filterStr(str) {
        str = str + '';
        str = str.replace(/&/g, '&amp;');
        str = str.replace(/</g, '&lt;');
        str = str.replace(/>/g, '&gt;');
        str = str.replace(/'/g, '&#39;');
        str = str.replace(/"/g, '&quot;');
        str = str.replace(/;/g, '');
        str = str.replace(/--/g, ' ');
        // 有参数内容是url, 不过滤'/'
        // str = str.replace(/\//g, '');
        return str;
    },

    /**
     * 设置cookie值
     */

    setCookie(name, value, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = `expires=${d.toUTCString()}`;
        document.cookie = name + '=' + value + ';' + expires;
    },

    // 获取cookie值
    getCookie(name) {
        let arr = [];
        let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        arr = document.cookie.match(reg);
        return arr ? arr[2] : null;
    },

    // 获取错误信息
    getErrorMsg(msg) {
        return notification.error({
            placement: 'bottomRight',
            message: '提示：',
            description: msg || '请求失败',
            duration: 2.5
        });
    }
};

