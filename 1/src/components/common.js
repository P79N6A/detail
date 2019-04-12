/**
 * @file common模块
 * @author yangxiaoxu@baidu.com
 */

/**
 * 公用函数库
 * @type {Object}
 */
export default {
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

    guid() {
        const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        const guid =  (S4 + S4 + '-' + S4 + '-' + S4 + '-' + S4 + '-' + S4 + S4 + S4);
        return 'static' + guid;
    },

    setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + '; ' + expires + ';path=/';
    },

    getCookie(name) {
        let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
        let arr = document.cookie.match(reg);
        return arr ? arr[2] : null;
    }
};
