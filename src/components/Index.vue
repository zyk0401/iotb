<template>
    <div id="iotb" class="iotb">
    </div>
</template>

<script>
    import * as echarts from 'echarts'
    export default {
        name: 'Index',
        data(){
            return{
                option:{
                    series: [{
                        name: "当前温度",
                        type: "gauge",
                        min: 0,
                        max: 40,
                        axisLine: {
                            lineStyle: {
                                width: 30,
                                color: [
                                    [0.25, "#4dabf7"],
                                    [0.5, "#69db7c"],
                                    [0.75, "#ffa94d"],
                                    [1, "#ff6b6b"]
                                ]
                            }
                        },
                        pointer: {
                            itemStyle: {
                                color: 'auto'
                            }
                        },
                        axisTick: {
                            distance: -30,
                            length: 8,
                            lineStyle: {
                                color: '#fff',
                                width: 2
                            }
                        },
                        splitLine: {
                            distance: -30,
                            length: 30,
                            lineStyle: {
                                color: '#fff',
                                width: 4
                            }
                        },
                        axisLabel: {
                            color: 'auto',
                            distance: 40,
                            fontSize: 20
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value} ℃',
                            color: 'auto'
                        },
                        data: [{
                            value: 22,
                            name:'温度',
                        }]
                    }]
                },
            }
        },
        mounted() {
            // DOM更新后渲染仪表盘图表
            this.$nextTick(() => {
                this.initEcharts();
            });
        },
        methods:{
            initEcharts() {

                // 基于准备好的dom，初始化echarts实例
                // let echarts = require("echarts");
                let myChart = echarts.init(document.getElementById("iotb"));
                // 绘制图表
                myChart.setOption(this.option);
            }
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .iotb{
        width: 500px;
        height: 500px;
    }
</style>
