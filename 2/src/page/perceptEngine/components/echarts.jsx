/**
 * @file Echarts图
 * @author chenling
 */
import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/legend';
export default class Pecharts extends React.Component {

    handleFormatData = type => {
        if (this.props.data) {
            return this.props.data.map(item => item[type]);
        }
    }

    getOption = () => ({
        title: {
            text: `${this.props.detailAppName}${this.props.detailApiName}调用统计表`,
            left: 'center',
            textStyle: {
                fontSize: 24
            }
        },
        legend: {
            bottom: '0%',
            data: ['调用次数', '成功次数', '业务成功次数', '成功率', '业务成功率']
        },
        xAxis: {
            data: this.handleFormatData('tongjiDate')
        },
        yAxis: [
            {
                position: 'left',
                name: '调用次数',
                nameLocation: 'center',
                nameRotate: 90,
                nameGap: 30,
                nameTextStyle: {
                    fontSize: 18
                },
                min: 0,
                max: 100,
                interval: 20
            },
            {
                position: 'right',
                name: '成功率',
                nameLocation: 'center',
                nameRotate: 90,
                nameGap: 40,
                nameTextStyle: {
                    fontSize: 18
                },
                min: 50,
                max: 100,
                interval: 10,
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        series: [{
            name: '调用次数',
            type: 'bar',
            data: this.handleFormatData('count')
        }, {
            name: '成功次数',
            type: 'bar',
            data: this.handleFormatData('sys_succ_count')
        }, {
            name: '业务成功次数',
            type: 'bar',
            data: this.handleFormatData('biz_succ_count')
        }, {
            name: '成功率',
            type: 'line',
            data: this.handleFormatData('sys_succ_rate')
        }, {
            name: '业务成功率',
            type: 'line',
            data: this.handleFormatData('biz_succ_rate')
        }
    ]
    });

    componentWillReceiveProps(nextProps) {
        if (nextProps.detailApiName) {
            let echartTpl = echarts.init(document.getElementById('echart'));
            echartTpl.setOption(this.getOption());
        }
    }

    render() {
        return (
            <div className="echart-box">
                <div id="echart" style={{height: '400px'}}></div>
            </div>
        );
    }
}
