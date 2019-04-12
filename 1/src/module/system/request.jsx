/**
 * @file request
 * @author
 * ------------------------------
 * @note 系统层 - http请求
 * @param    {[type]}   options  [description]
 *           {
 *               isParallel:        // 是否并行  默认 false:串行  true:并行
 *               isCoverSuccess:    // 是否覆盖成功回调
 *               type:,
 *               url:,
 *               data:,
 *               success:,
 *               error,
 *               complete:
 *           }
 * @return {void}
 */

// React
import {notification} from 'antd';
// delta-config
import Config from '../../../config/project.config.jsx';

export default function (options) {
    options = options ? options : {};
    let type = options.type || 'GET';

    let data = options.data || {};
    data = options.contentType === 'application/json' ? JSON.stringify(data) : data;

    if (window['decisionRequestStatus'] && (type.toLowerCase() === 'post')) {
        return;
    }
    if (type.toLowerCase() === 'post') {
        window['decisionRequestStatus'] = true;
    }
    $.ajax({
        type: type,
        url: options.url,
        data: data,
        dataType: 'json',
        crossDomain: options.crossDomain || false,
        contentType: options.contentType === undefined ? '' : options.contentType,
        processData: options.processData === undefined ? true : false,
        timeout: options.timeout || 30000,
        success: data => {
            if (!options.isCoverSuccess) {
                if (data.ret !== 'SUCCESS' && data.ret !== 'MIND_REQ_FAIL') {
                    if (data.ret === 'NO_LOGIN') {
                        if (data.content) {
                            window.location.replace(data.content + '?service=' + encodeURIComponent(Config.apiLoginUrl + '?redirect=' + encodeURIComponent(window.location.href)));
                        }
                    }
                    else {
                        let errorObj = {
                            // 错误状态码
                            code: -1,
                            // 错误相关描述
                            msg: data.msg || Config.systemError,
                            // 针对ajax层报错设置
                            xhr: null
                        };
                        if (options.error) {
                            options.error && options.error(errorObj);
                        }
                        else {
                            notification.error({
                                message: '错误提示',
                                description: errorObj.msg
                            });
                        }
                    }
                    return;
                }
                // 业务通用退出登录url
                if (data.content && data.content.logoutUrl) {
                    window.CASLogoutUrl = data.content.logoutUrl;
                }
            }
            options.success && options.success(data);
        },
        error: xhr => {
            let errorObj = {
                // 错误状态码
                code: -10000,
                // 错误相关描述
                msg: Config.networkError,
                // 针对ajax层报错设置
                xhr: xhr
            };
            if (options.error) {
                options.error && options.error(errorObj);
            }
            else {
                notification.error({
                    message: '错误提示',
                    description: errorObj.msg
                });
            }
        },
        complete: () => {
            window['decisionRequestStatus'] = false;
            options.complete && options.complete();
        }
    });
}
