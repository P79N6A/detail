/**
 * @file 任务列表
 * @author
 */

import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
// 系统
import request from '../../../module/system/request.jsx';
import config from '../../../../config/project.config.jsx';
// 业务组件
import Crumb from '../../../module/crumb/crumb.jsx';
import ChartDetail from '../../../module/chartDetail/chartDetail.jsx';
// 业务操作
import getQueryString from '../../../module/Integration/getQueryString.jsx';


import style from './taskLogContrast.useable.less';

class taskLogContrast extends Component {

    /**
     * 状态
     */
    state = {
        isMounting: true,
        logId1: getQueryString('id1'),
        logId2: getQueryString('id2'),
        chartData1: null,
        chartData2: null
    }

    /**
     * 数据层 - 查询
     *
     * @param {Function} key 1、2
     * @return {void}
     */
    getChartData = key => {
        request({
            url: config.api.taskLogStat,
            data: {
                logId: this.state['logId' + key]
            },
            success: data => {
                this.state.isMounting && this.setState({
                    ['chartData' + key]: data.content
                });
            }
        });
    }

    componentDidMount() {
        this.getChartData(1);
        this.getChartData(2);
    }



    componentWillMount() {
        style.use();
    }

    componentWillUnmount() {
        style.unuse();
        this.state.isMounting = false;
    }

    render() {
        let colorArray = {};
        let {chartData1, chartData2} = this.state;
        // 获取对比饼图的颜色
        chartData1 && chartData2 && chartData1.result.concat(chartData2.result).forEach((key, i) => {
            colorArray[key.name] = colorArray[key.name] || config.echartColor[i];
        });

        return (
            <Crumb
                page={this.props.title}
            >
                <div>
                    <div className="task-chart">
                    {
                        chartData1 && chartData2 && [1, 2].map((item, index) => {
                            let chartData = this.state[`chartData${item}`];
                            let logId = this.state[`logId${item}`];

                            return (
                                <div className="task-contrast-part" key={index}>
                                    <h2 className="page-slide task-page-slide">
                                        任务名称: {chartData.taskName}
                                        <a
                                            href="javascript:void(0)"
                                            onClick={() => this.props.history.push(
                                                `/task/log/detail?id=${logId}`
                                            )}
                                        >查看统计详情</a>
                                    </h2>

                                    <ChartDetail
                                        data={chartData.result}
                                        id={`echart-pie-${item}`}
                                        colorArray={colorArray}
                                    />
                                </div>
                            );
                        })
                    }
                    </div>
                </div>
            </Crumb>
        );
    }
}
export default withRouter(taskLogContrast);
