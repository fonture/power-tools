import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import * as echarts from 'echarts'
import './chart.less'
class Charts extends Component {

    chart = null;

    el = null;

    componentDidMount() {
        // 初始化图表
        this.initChart(this.el);
        // 将传入的配置(包含数据)注入
        this.setOption(this.props.option);
    }
    componentDidShow() {
        // 每次更新组件都重置
        this.setOption(this.props.option);
    }
    componentWillUnmount() {
        // 组件卸载前卸载图表
        this.dispose();
    }

    initChart = el => {
        // renderer 用于配置渲染方式 可以是 svg 或者 canvas
        const renderer = 'canvas';
        this.chart = echarts.init(el, null, {
            renderer,
            width: 'auto',
            height: 'auto'
        });
    };
    setOption = option => {
        if (!this.chart) {
            return;
        }
        this.chart.setOption(option);
    };
    dispose = () => {
        if (!this.chart) {
            return;
        }

        this.chart.dispose();
        this.chart = null;
    };
    resize = () => {
        this.chart && this.chart.resize();
    };
    getInstance = () => {
        return this.chart;
    };
    refEl = (node) => this.el = node
    render() {
        return (
            <View>
                <div ref={this.refEl} style={{ width: '100%', height: '300px' }} />
            </View>
        )
    }
}

export default class ReCharts extends Component {

    getOption = () => {
        return {
            title: {
                text: '年度购电量曲线：',
                textStyle: {
                    color: '#fff',
                    fontSize: '13',
                    fontWeight: 400                    
                },
                left: '15px'
            },
            animation: false,
            legend: {
                type: 'plain',
                textStyle: {
                    color: '#B5BBC8'
                },
                top: '28px',
                right: '50px'
            },
            grid: {
                show: false,
                x: 50
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisLabel: {
                    color:'#80899C'
                },
                boundaryGap: ['8%',0]
            },
            yAxis: {
                type: 'value',
                axisLine:{
                    lineStyle:{
                        color: '#80899C'
                    }
                },
                axisTick: {
                    inside: true,
                    length: 3
                },
                axisLabel: {
                    color:'#80899C'
                },
                splitLine: {
                    show: false
                },
                name: '(万千瓦时)'
            },
            series: [
                {
                    name: '实际电量',
                    type: 'line',
                    stack: '总量',
                    data: [120, 132, 101, 134,120, 132, 101, 134,120, 132, 101, 134],
                    lineStyle: {
                        color: '#3dcca6',
                        width: 1
                    },
                    symbol: 'circle',
                    itemStyle: {
                        color: '#3dcca6',
                        borderColor: '#3dcca6'
                    }
                },
                {
                    name: '预计电量',
                    type: 'line',
                    stack: '总量',
                    data: [220, 182, 191, 234, 290,220, 182, 191, 234, 290,220, 182, 191, 234, 290],
                    lineStyle: {
                        color: '#4a9df2',
                        width: 1
                    },
                    symbol: 'circle',
                    itemStyle: {
                        color: '#4a9df2',
                        borderColor: '#4a9df2'
                    }
                }
            ]
        }
    }
    render() {
        const option = this.getOption();
        return (
            <Charts option={option} />
        )
    }
}