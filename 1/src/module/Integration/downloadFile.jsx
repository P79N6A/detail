/**
 * @file 下载文件
 * @author
 * ---------------------------------------
 * @param  {string} name [指定的查找字段]
 * @return {void}        [无]
 */

export default function (url, data, method) {
    // url and data options required
    if (url && data) {
        // data can be string of parameters or array/object
        data = typeof data === 'string' ? data : $.param(data);
        // split params into form inputs
        let inputs = '';
        $.each(data.split('&'), function () {
            let pair = this.split('=');
            inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
        });
        // send request
        $('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
            .appendTo('body').submit().remove();
    }
}
