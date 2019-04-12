/**
 * @file 流程图默认的查看
 * @author
 */
import jsonqueryjs from 'jsonqueryjs/json.js';
import common from '../../components/common.js';

let IntegrateFlow = {
     // 为每一个json数据添加唯一标记tmpKey，便于后续jsonqueryjs进行处理
    formatData(data) {
        let result = jsonqueryjs.toolUtil.isJson(data) ? {} : [];
        let type = jsonqueryjs.toolUtil.isJson(data) ? 'json' : 'other';
        if (type === 'json') {
            result.tmpKey = common.guid();
        }
        for (let key in data) {
            if (typeof data[key] === 'object') {
                result[key] = this.formatData(data[key]);
            }
            else {
                result[key] = data[key];
            }
        }
        return result;
    },
    // 弹窗关闭事件
    handleModalCancel(type) {
        this.setState({
            [type]: false
        });
    }
};
export default IntegrateFlow;
