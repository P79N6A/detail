/**
 * @file 公共的模型详情页面
 * @author
 */
import React from 'react';
import DuTable from '../../components/antComponent/duTable/duTable.jsx';
import formatTableData from '../../components/antComponent/Integration/formatTableData.jsx';
import localTableData from '../localData/localTable.jsx';


export default class ModelDetailCommon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ruleScoreDetail: {}
        };
    }
    
    formatData(data) {
        var conditions = data.toList || [];
        var ruleType = data.ruleType;
        var results = [];
        for (var i = 0; i < conditions.length; i++) {
            var tmpCondition = conditions[i];
            if (ruleType === 'SCORE') {
                results.push({
                    key: tmpCondition.condition.tmpKey,
                    input: tmpCondition.condition.input,
                    minValue: tmpCondition.condition.value[0],
                    maxValue: tmpCondition.condition.value[1],
                    resName: tmpCondition.condition.resName || ''
                });
            } else if (ruleType === 'HIT') {
                results.push({
                    key: tmpCondition.condition.tmpKey,
                    input: tmpCondition.condition.input,
                    opName: tmpCondition.condition.opName || (tmpCondition.condition.op === 'EQUAL' ? '命中' : '非命中'),
                    value: tmpCondition.condition.value[0],
                    resName: tmpCondition.condition.resName || ''
                });
            } else if (ruleType === 'WHITELIST') {
                results.push({
                    tmpKey: tmpCondition.tmpKey,
                    input: tmpCondition.condition.input,
                    op: tmpCondition.condition.op,
                    opName: tmpCondition.condition.opName || (tmpCondition.condition.op === 'IN_WHITELIST' ? '命中' : '非命中'),
                    value: tmpCondition.condition.value.join(','),
                    resCode: tmpCondition.condition.resCode,
                    resName: tmpCondition.condition.resName || '',
                    to: tmpCondition.to || []
                });
            } else {
                results.push({
                    key: tmpCondition.condition.tmpKey,
                    input: tmpCondition.condition.input,
                    opName: tmpCondition.condition.opName || (tmpCondition.condition.op === 'EQUAL' ? '命中' : '非命中'),
                    value: tmpCondition.condition.value.join(','),
                    resName: tmpCondition.condition.resName || ''
                });
            } 
        }
        return results;
    }
    render() {
        var formatData = this.formatData(this.props.data);
        var ruleType = this.props.data.ruleType;
        let resData = formatTableData({
            data: formatData,
            table: localTableData.flow[ruleType === 'SCORE' ? 'ruleScoreDetail' : 'ruleHitDetail']
        });
        return (
            <div>
                <DuTable tableWidth ={400} listData={resData}></DuTable>
            </div>
        );
    }
}






