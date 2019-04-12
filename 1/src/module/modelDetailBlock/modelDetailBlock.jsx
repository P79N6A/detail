/**
 * @file 公共的模型详情页面
 * @author
 */
import React from 'react';
import localFormData from '../localData/localForm.jsx';
import localTableData from '../localData/localTable.jsx';
import Integration from '../Integration/Integration.jsx';
import DuTable from '../../components/antComponent/duTable/duTable.jsx';
import formatMergeData from '../../components/antComponent/Integration/formatMergeData.jsx';
import formatTableData from '../../components/antComponent/Integration/formatTableData.jsx';

export default class ModelDetailCommon extends React.Component {
    constructor(props) {
        super(props);
        this.renderInfo = {
            addInforData: [],
            editInforData: [],
            reqData: [],
            resData: []
        };
    }
    // 数据处理
    formatData() {
        let editInforData = formatMergeData(localFormData.modelDetail.BASEINFOR, this.props.data);
        let addInforData = formatMergeData(localFormData.modelAdd.BASEINFOR, this.props.data);
        let reqData = formatTableData({
            data: this.props.data.reqParams,
            table: localTableData.modelDetail.REQUEST
        });
        let resData = formatTableData({
            data: this.props.data.respParams,
            table: localTableData.modelDetail.RESPOSE
        });
        this.renderInfo = {
            editInforData,
            addInforData,
            reqData,
            resData
        };
    }

    render() {
        this.formatData();
        // 基本信息
        let baseInforTpl = (
            this.props.type === 'add' ? Integration.getTextTpl(this.renderInfo.addInforData, 4)
            : Integration.getTextTpl(this.renderInfo.editInforData, 4)
        );
        return (
            <div>
                <p className="page-slide">基本信息</p>
                {baseInforTpl}
                <p className="page-slide">请求参数</p>
                <DuTable
                    tableWidth={this.props.width || 400}
                    tableHeight={this.props.height || 300}
                    listData={this.renderInfo.reqData}
                />
                <p className="page-slide">返回参数</p>
                <DuTable
                    tableWidth={this.props.width || 400}
                    listData={this.renderInfo.resData}
                />
            </div>
        );
    }
}






