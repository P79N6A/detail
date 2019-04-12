/**
 * @file
 * @author chenling
 */
import React from 'react';
export default class ApiList extends React.Component {

    handleItemClick = item => {
        this.props.onClick && this.props.onClick(item);
    }

    render() {
        let {data, type} = this.props;
        return (
            data ? (
                <div className="page-service-name">
                    <span>使用服务名称</span>
                    {type === 'detail' ? <span>全部</span> : null}
                    {
                        data.apiList && data.apiList.map((item, index) => {
                            return (
                                <span key={item.apiId} onClick={this.handleItemClick.bind(this, item)}>{item.apiName}</span>
                            );
                        })
                    }
                </div>
            ) : null
        );
    }
}
