/**
 * @file 业务 - 表格通用事件
 * @author
 */

export default {

    /**
     * 事件层 - 表格分页事件
     *
     * @param   {string} page 当前页码
     * @return {void}
     */
    handleChangePage(page, size) {
        this.setState({
            queryData: Object.assign(this.state.queryData, {
                pageNo: page,
                pageSize: size || 10
            }),
            tableLoading: true
        }, () => {
            this.getListData();
        });
    },

    /**
     * 事件层 - 查询事件
     * @param {Object} data 筛选数据
     * @param {Function} callback 回调函数
     */
    handleQuerySubmit(data, callback) {
        this.setState({
            queryData: Object.assign(this.state.queryData, data),
            tableLoading: true
        }, () => {
            this.getListData(callback);
        });
    }

};
