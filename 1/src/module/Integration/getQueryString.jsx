/**
 * @file 获取url中的指定参数值
 * @author
 * ---------------------------------------
 * @param  {string} name [指定的查找字段]
 * @return {void}        [无]
 */

/**
 * 过滤危险字符
 *
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
let filterStr = function (str) {
    str = str + '';
    str = str.replace(/\&/g, '&amp;');
    str = str.replace(/\</g, '&lt;');
    str = str.replace(/\>/g, '&gt;');
    str = str.replace(/\'/g, '&#39;');
    str = str.replace(/\"/g, '&quot;');
    // str = str.replace(/\;/g, '');
    // str = str.replace(/\-\-/g, ' ');
    // str = str.replace(/\//g, '');
    return str;
};

export default function (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return filterStr(decodeURIComponent(r[2]));
    }
    return null;
}
