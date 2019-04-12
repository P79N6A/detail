/**
 * @file 任务列表
 * @author
 */

import React, {Component} from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

import config from '../../../config/project.config.jsx';

export default class ChartDetail extends Component {

    /**
     * 状态
     */
    state = {
        color: this.props.colorArray || {
            '通过': '#108CEE',
            '拒绝': '#EA2E2E',
            '面审': '#F38800',
            '中断': '#545FC8'
        }
    }

    getChartDataKey = data => {
        return data.map(item => item.name);
    }

    getChartValue = (name, data) => {
        let totalCount = 0;
        let keyCount = 0;
        for (let item of data) {
            totalCount += Number(item.value);
            if (item.name === name) {
                keyCount = item.value;
            }
        }
        return (keyCount / totalCount * 100).toFixed(2);
    }

    getOption = () => {
        let option = {
            tooltip: {
                alwaysShowContent: false,
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)'
            },
            legend: {
                orient: 'vertical',
                left: '60%',
                top: 'middle',
                align: 'left',
                itemGap: 20,
                itemWidth: 15,
                itemHeight: 15,
                textStyle: {
                    padding: [0, 10]
                },
                data: this.getChartDataKey(this.props.data),
                formatter: name => `${name}，${this.getChartValue(name, this.props.data)}%`
            },
            series: [
                {
                    name: '统计详情',
                    type: 'pie',
                    center: ['25%', '50%'],
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '20'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: value => {
                                return this.state.color[value.name]
                                    || config.echartColor[value.dataIndex]
                                    || '#' + Math.floor(Math.random() * 0xffffff).toString(16);
                            }
                        }
                    },
                    data: this.props.data
                }
            ]
        };
        return option;
    }

    componentDidMount() {
        let echartTpl = echarts.init(document.getElementById(this.props.id));
        echartTpl.setOption(this.getOption());
    }

    render() {
        return (
            <div>
                <div id={this.props.id} style={{height: '300px'}}></div>
            </div>
        );
    }
}
