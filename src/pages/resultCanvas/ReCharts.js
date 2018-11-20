import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import * as echarts from 'echarts'
import './chart.less'
class Charts extends Component {

    chart = null;

    el = null;

    async componentDidMount() {
        console.log(this.el);
        // 初始化图表
        await this.initChart(this.el);
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

        return new Promise(resolve => {
            setTimeout(() => {
                this.chart = echarts.init(el, null, {
                    renderer,
                    width: 'auto',
                    height: 'auto'
                });
                resolve();
            }, 0);
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
                <div ref={this.refEl} style={{width:'100%',height:'300px'}}/>
                <View className="legend at-row" style={{textAlign:'center'}}>
                    <View className="at-col at-col-5 at-col__offset-1"><span style={{background:'#3dcca6'}}></span>实际电量</View>
                    <View className="at-col at-col-5 at-col__offset-1"><span style={{background:'#4a9df2'}}></span>预测电量</View>
                </View>
            </View>
        )
    }
}

export default class ReCharts extends Component {

    getOption = ()=>{
        return {
            title: {
                text: '年度购电量曲线',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1月','4月','7月','10月'],
                axisTick: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                }
            },
            series: [
                {
                    name:'实际电量',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134,],
                    lineStyle: {
                        color: '#3dcca6',
                        width: 3
                    },
                    itemStyle: {
                        opacity: 0                        
                    }
                },
                {
                    name:'预计电量',
                    type:'line',
                    stack: '总量',
                    data:[220, 182, 191, 234, 290],
                    lineStyle: {
                        color: '#4a9df2',
                        width: 3
                    },
                    itemStyle: {
                        opacity: 0
                    }
                }
            ]
        }
    }
    render() {
        const option = this.getOption();
        return (
            <Charts option={option}/>
        )
    }
}