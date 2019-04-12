/**
 * @file hyphenate
 * @author luoxiaolan@badu.com
 */
import JSEncrypt from 'jsencrypt';
export default {
    propRE: /[\{|,][\s|"]*([a-zA-Z|_])+[\s|"]*(?=:)/g,
    camelCaseRE: /_([a-z])/g,
    kebabCaseRE: /([^_])([A-Z])/g,
    toCamelCaseJSON(json) {
        const self = this;
        return json.replace(self.propRE, function ($0) {
            return self.toCamelCase($0);
        });
    },
    toKebabCaseJSON(json) {
        const self = this;
        return json.replace(self.propRE, function ($0, $1) {
            return self.toKebabCase($0);
        });
    },
    toCamelCase(str) {
        const self = this;
        return str ? str.replace(self.camelCaseRE, function ($0, $1) {
            return $1.toUpperCase();
        }) : str;
    },
    toKebabCase(str) {
        const self = this;
        return str ? str.replace(self.kebabCaseRE, '$1_$2').toLowerCase() : str;
    },
    encodeData(data) {
        if (!data) {
            return '';
        }
        let pairs = [];
        for (let name in data) {
            if (!data.hasOwnProperty(name)) {
                continue;
            }
            if (typeof data[name] === 'function') {
                continue;
            }
            if (data[name] !== undefined && data[name] !== null) {
                let value = '';
                if (Array.isArray(data[name])) {
                    value = JSON.stringify(data[name]);
                } else {
                    value = data[name].toString();
                }
                name = encodeURIComponent(name.replace('%20', '+'));
                value = encodeURIComponent(value.replace('%20', '+'));
                pairs.push(name + '=' + value);
            }

        }
        return pairs.join('&');
    },
    getSearchString() {
        let str = location.search.replace('?', '');
        let obj = {};

        if (str) {
            let arr = str.split('&');

            arr.forEach((item, index) => {
                let tmpArr = item.split('=');
                obj[decodeURIComponent(tmpArr[0])] = decodeURIComponent(tmpArr[1]);
            });
        }

        return obj;
    },
    setSearchString(data) {
        let params = this.encodeData(data);
        let href = location.href;
        // 无刷新修改页面 url
        if (params) {
            if (/\?/.test(href)) {
                href = href.replace(/\?.*/, '?' + params);
            } else {
                href += '?' + params;
            }
        }

        // 替换当前历史纪录
        history.replaceState(null, null, href);
    },
    concatChnQuery(str = '', params = '') {
        let path = str.split('?')[0];
        let search = str.split('?')[1];
        let totalParams = '';
        search && (totalParams += search);
        params && (totalParams += ('&' + params));
        totalParams = this.linkPams(totalParams);
        totalParams && (str = (path + '?' + totalParams).replace('?&', '?'));
        !totalParams && (str = path);
        return str;
    },
    encodeParams() {
        let pams = '';
        pams =  this.linkPams(pams);
        pams = ('?' + pams).replace('?&', '?');
        return encodeURIComponent(pams);
    },
    linkPams(pams) {
        let searchObj = this.getSearchString();
        searchObj.requestFrom && (pams += ('&requestFrom=' + searchObj.requestFrom));
        searchObj.tid && (pams += ('&tid=' + searchObj.tid));
        return pams;
    },
    getTime() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        let time = year
            + (month < 9 ? '0' + (month + 1) : month + 1)
            + (day < 10 ? '0' + day : day)
            + (hour < 10 ? '0' + hour : hour)
            + (minute < 10 ? '0' + minute : minute)
            + (second < 10 ? '0' + second : second);
        return time;
    },
    setEncryption(value) {
        let publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCMQMXJ\
        vNNpAkhYL5qGoVjuOldnmv00Kmjyo2zm4/1aaMvZYHmZGvVsQ7qUVVd5nHsr\
        1M5CW2ftKrEKxdnT4mTnPc+WZmL6TE15PCCjiLRhhGE28tZC9YCO7q7\
        FoF9DDryN22dORNqL1KGZMxNYsa6GBg00jDp9h6Tr3GzF0h3hgwIDAQAB';
        let encrypt = new JSEncrypt();
        value && encrypt.setPublicKey(publicKey);
        return encrypt.encrypt(value);
    }
};
