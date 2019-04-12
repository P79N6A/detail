/**
 * @file
 * @author chenling
 */
import React from 'react';
export default class TableCell extends React.Component {
    render() {
        let {data} = this.props;
        return (
            data ? (
                <div key={data.apiId} className="page-table-cell-child">
                    <div>{data.apiName}</div>
                    <div>
                        <div>接口调用总量：{data.count}</div>
                        <div>接口调用成功：{data.sys_succ_count}</div>
                        <div>接口调用成功率：{data.sys_succ_rate}</div>
                        <div>业务成功：{data.biz_succ_count}</div>
                        <div>业务成功率：{data.biz_succ_rate}</div>
                    </div>
                </div>
            ) : null
        );
    }
}
