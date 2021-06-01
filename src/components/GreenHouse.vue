<template>
    <el-container>
        <el-aside :style="'height:'+sideHeight+'px'" :width="sideWidth+'px'">
            <el-menu :default-active="this.activeIndex" class="el-menu-vertical-demo"
                     @select="handleSelect"
            >
                <el-menu-item index="real">
                    <span slot="title">实时数据</span>
<!--                    <el-menu-item index="general">课程体系</el-menu-item>-->
<!--                    <el-menu-item index="famous">名师资源</el-menu-item>-->
<!--                    <el-menu-item index="featured">特色课程</el-menu-item>-->
                </el-menu-item>
                <el-submenu index="history">
                    <template slot="title">历史数据</template>
                    <el-menu-item index="soiltemp">土壤温度</el-menu-item>
                    <el-menu-item index="soilhum">土壤湿度</el-menu-item>
                    <el-menu-item index="soilPH">土壤PH值</el-menu-item>
                    <el-menu-item index="soilN">土壤氮</el-menu-item>
                    <el-menu-item index="soilP">土壤磷</el-menu-item>
                    <el-menu-item index="soilK">土壤钾</el-menu-item>
                </el-submenu>
<!--                <el-menu-item index="history">-->
<!--                    <span slot="title">历史数据</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="control">-->
<!--                    <span slot="title">控制</span>-->
<!--                </el-menu-item>-->
            </el-menu>
        </el-aside>
        <el-main>
            <div v-show="activeIndex=='real'" class="iotb">
                <div class="column">
                    <div id="temp" class="panel"></div>
                    <div id="humidity" class="panel"></div>
                    <div id="ph" class="panel"></div>
<!--                    <div id="beam" class="panel"></div>-->
                </div>
                <div class="column">
                    <div id="n" class="panel"></div>
                    <div id="p" class="panel"></div>
                    <div id="k" class="panel"></div>
                </div>
<!--                <div class="column">-->
<!--                    <div id="soil" class="soil-panel"></div>-->
<!--                </div>-->

            </div>
            <div v-show="activeIndex=='soiltemp'||activeIndex=='soilhum'||activeIndex=='soilPH'||activeIndex=='soilN'
||activeIndex=='soilP'||activeIndex=='soilK'">
                <div class="block">
                    <el-date-picker
                            v-model="timeValue"
                            type="daterange"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                    <el-button @click="searchHistoryData()">查询</el-button>
                </div>
                <div id="history" class="history"></div>
            </div>
            <div v-show="activeIndex=='control'">
                <div class="switch">
                    <span>水泵</span>
                    <el-switch
                        style="display: block"
                        v-model="water_pump"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        @change="(value) => {switchbtn(value,'water_pump')}"
                        active-text="开"
                        inactive-text="关">
                </el-switch>
                </div>
                <div class="switch">
                    <span>补光灯</span>
                    <el-switch
                            style="display: block"
                            v-model="fill_in"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="(value) => {switchbtn(value,'fill_in')}"
                            active-text="开"
                            inactive-text="关">
                    </el-switch>
                </div>
                <div class="switch">
                    <span>排风扇</span>
                    <el-switch
                            style="display: block"
                            v-model="fan"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="(value) => {switchbtn(value,'fan')}"
                            active-text="开"
                            inactive-text="关">
                    </el-switch>
                </div>
                <div class="switch">
                    <span>杀虫灯</span>
                    <el-switch
                            style="display: block"
                            v-model="insecticidal"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            @change="(value) => {switchbtn(value,'insecticidal')}"
                            active-text="开"
                            inactive-text="关">
                    </el-switch>
                </div>

            </div>
        </el-main>
    </el-container>

</template>

<script>
    import * as echarts from 'echarts'
    // var soil1_data = [[20,60,45]];
    // var soil2_data = [[30,40,27]];
    // var soil3_data = [[14,45,67]];
    // var soil4_data = [[4,32,46]];
    //
    // var soil = [
    //     {name: 'soiltemp', index: 0, text: '温度'},
    //     {name: 'soilhum', index: 1, text: '湿度'},
    //     {name: 'conductivity', index: 2, text: '电导率'},
    // ];
    //
    // var lineStyle = {
    //     normal: {
    //         width: 1,
    //         opacity: 0.5
    //     }
    // };
    export default {
        name: 'GreenHouse',
        data(){
            return{
                activeIndex:'real',
                water_pump:false,
                fill_in:false,
                fan:false,
                insecticidal:false,
                timeValue:'',
                sideHeight : document.documentElement.clientHeight,
                sideWidth:200,
                sensorData:[
                    {
                        name:'soilK',
                        addr:'manager-2'
                    },
                    {
                        name:'soilP',
                        addr:'manager-2'
                    },
                    {
                        name:'soilN',
                        addr:'manager-2'
                    },
                    {
                        name:'soilPH',
                        addr:'manager-2'
                    },
                    {
                        name:'soiltemp',
                        addr:'manager-2'
                    },
                    {
                        name:'soilhum',
                        addr:'manager-2'
                    },
                ],
                temp:{
                    series: [{
                        name: "当前温度",
                        type: "gauge",
                        min: -40,
                        max: 80,
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
                            fontSize: 15
                        },
                        title: {                // 仪表盘标题。
                            show: true,             // 是否显示标题,默认 true。
                            offsetCenter: [0,"100%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。// 文字的颜色,默认 #333。
                            fontSize: 20,           // 文字的字体大小,默认 15。
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value} ℃',
                            color: 'auto',
                            fontSize:20,
                        },
                        data: [{
                            value: 0,
                            name:'土壤温度',
                        }]
                    }]
                },
                humidity:{
                    series: [{
                        name: "当前湿度",
                        type: "gauge",
                        min: 0,
                        max: 100,
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
                            fontSize: 15
                        },
                        title: {                // 仪表盘标题。
                            show: true,             // 是否显示标题,默认 true。
                            offsetCenter: [0,"100%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。// 文字的颜色,默认 #333。
                            fontSize: 20,           // 文字的字体大小,默认 15。
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value}%',
                            color: 'auto',
                            fontSize:20
                        },
                        data: [{
                            value: 0,
                            name:'土壤湿度',
                        }]
                    }]
                },
                // beam:{
                //     series: [{
                //         name: "当前光照强度",
                //         type: "gauge",
                //         min: 0,
                //         max: 40,
                //         axisLine: {
                //             lineStyle: {
                //                 width: 30,
                //                 color: [
                //                     [0.25, "#4dabf7"],
                //                     [0.5, "#69db7c"],
                //                     [0.75, "#ffa94d"],
                //                     [1, "#ff6b6b"]
                //                 ]
                //             }
                //         },
                //         pointer: {
                //             itemStyle: {
                //                 color: 'auto'
                //             }
                //         },
                //         axisTick: {
                //             distance: -30,
                //             length: 8,
                //             lineStyle: {
                //                 color: '#fff',
                //                 width: 2
                //             }
                //         },
                //         splitLine: {
                //             distance: -30,
                //             length: 30,
                //             lineStyle: {
                //                 color: '#fff',
                //                 width: 4
                //             }
                //         },
                //         axisLabel: {
                //             color: 'auto',
                //             distance: 40,
                //             fontSize: 20
                //         },
                //         detail: {
                //             valueAnimation: true,
                //             formatter: '{value} ℃',
                //             color: 'auto'
                //         },
                //         data: [{
                //             value: 22,
                //             name:'光照强度',
                //         }]
                //     }]
                // },
                // co2:{
                //     series: [{
                //         name: "当前二氧化碳",
                //         type: "gauge",
                //         min: 0,
                //         max: 40,
                //         axisLine: {
                //             lineStyle: {
                //                 width: 30,
                //                 color: [
                //                     [0.25, "#4dabf7"],
                //                     [0.5, "#69db7c"],
                //                     [0.75, "#ffa94d"],
                //                     [1, "#ff6b6b"]
                //                 ]
                //             }
                //         },
                //         pointer: {
                //             itemStyle: {
                //                 color: 'auto'
                //             }
                //         },
                //         axisTick: {
                //             distance: -30,
                //             length: 8,
                //             lineStyle: {
                //                 color: '#fff',
                //                 width: 2
                //             }
                //         },
                //         splitLine: {
                //             distance: -30,
                //             length: 30,
                //             lineStyle: {
                //                 color: '#fff',
                //                 width: 4
                //             }
                //         },
                //         axisLabel: {
                //             color: 'auto',
                //             distance: 40,
                //             fontSize: 20
                //         },
                //         detail: {
                //             valueAnimation: true,
                //             formatter: '{value} ℃',
                //             color: 'auto'
                //         },
                //         data: [{
                //             value: 22,
                //             name:'二氧化碳',
                //         }]
                //     }]
                // },
                ph:{
                    series: [{
                        name: "当前PH值",
                        type: "gauge",
                        min: 0,
                        max: 14,
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
                            fontSize: 15
                        },
                        title: {                // 仪表盘标题。
                            show: true,             // 是否显示标题,默认 true。
                            offsetCenter: [0,"100%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。// 文字的颜色,默认 #333。
                            fontSize: 20,           // 文字的字体大小,默认 15。
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value}PH',
                            fontSize:20,
                            color: 'auto'
                        },
                        data: [{
                            value: 0,
                            name:'土壤PH值',
                        }]
                    }]
                },
                n:{
                    series: [{
                        name: "当前氮值",
                        type: "gauge",
                        min: 0,
                        max: 2000,
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
                            fontSize: 15
                        },
                        title: {                // 仪表盘标题。
                            show: true,             // 是否显示标题,默认 true。
                            offsetCenter: [0,"100%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。// 文字的颜色,默认 #333。
                            fontSize: 20,           // 文字的字体大小,默认 15。
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value}mg/kg',
                            fontSize:20,
                            color: 'auto'
                        },
                        data: [{
                            value: 0,
                            name:'土壤氮',
                        }]
                    }]
                },
                p:{
                    series: [{
                        name: "当前磷值",
                        type: "gauge",
                        min: 0,
                        max: 2000,
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
                            fontSize: 15
                        },
                        title: {                // 仪表盘标题。
                            show: true,             // 是否显示标题,默认 true。
                            offsetCenter: [0,"100%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。// 文字的颜色,默认 #333。
                            fontSize: 20,           // 文字的字体大小,默认 15。
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value}mg/kg',
                            color: 'auto',
                            fontSize:20,
                        },
                        data: [{
                            value: 0,
                            name:'土壤磷',
                        }]
                    }]
                },
                k:{
                    series: [{
                        name: "当前钾值",
                        type: "gauge",
                        min: 0,
                        max: 2000,
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
                            fontSize: 15
                        },
                        title: {                // 仪表盘标题。
                            show: true,             // 是否显示标题,默认 true。
                            offsetCenter: [0,"100%"],//相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。// 文字的颜色,默认 #333。
                            fontSize: 20,           // 文字的字体大小,默认 15。
                        },
                        detail: {
                            valueAnimation: true,
                            formatter: '{value}mg/kg',
                            fontSize:20,
                            color: 'auto'
                        },
                        data: [{
                            value: 0,
                            name:'土壤钾',
                        }]
                    }]
                },
                // soil : {
                //     backgroundColor: '#333',
                //     legend: {
                //         bottom: 30,
                //         data: ['传感器1', '传感器2', '传感器3','传感器4'],
                //         itemGap: 20,
                //         textStyle: {
                //             color: '#fff',
                //             fontSize: 14
                //         }
                //     },
                //     tooltip: {
                //         padding: 10,
                //         backgroundColor: '#222',
                //         borderColor: '#777',
                //         borderWidth: 1,
                //         formatter: function(param) {
                //             // /*console.log(1);
                //             // console.log(JSON.stringify(param));
                //             console.log(param.data);
                //             return '<div style="color: white"> <span>温度:'+ param.data[0] +'</span><br>'+
                //                 '<span>湿度:'+ param.data[1] +'</span><br>'+
                //                 '<span>电导率:'+ param.data[2] +'</span><br>'+
                //             '</div>';
                //
                //         }
                //     },
                //     parallelAxis: [
                //         {dim: 0, name: soil[0].text,max:40},
                //         {dim: 1, name: soil[1].text,max: 100},
                //         {dim: 2, name: soil[2].text,max: 100},
                //     ],
                //     parallel: {
                //         left: '5%',
                //         right: '18%',
                //         bottom: 100,
                //         parallelAxisDefault: {
                //             type: 'value',
                //             name: 'AQI指数',
                //             nameLocation: 'end',
                //             nameGap: 20,
                //             nameTextStyle: {
                //                 color: '#fff',
                //                 fontSize: 12
                //             },
                //             axisLine: {
                //                 lineStyle: {
                //                     color: '#aaa'
                //                 }
                //             },
                //             axisTick: {
                //                 lineStyle: {
                //                     color: '#777'
                //                 }
                //             },
                //             splitLine: {
                //                 show: false
                //             },
                //             axisLabel: {
                //                 color: '#fff'
                //             }
                //         }
                //     },
                //     series: [
                //         {
                //             name: '传感器1',
                //             type: 'parallel',
                //             lineStyle: lineStyle,
                //             data: soil1_data
                //         },
                //         {
                //             name: '传感器2',
                //             type: 'parallel',
                //             lineStyle: lineStyle,
                //             data: soil2_data
                //         },
                //         {
                //             name: '传感器3',
                //             type: 'parallel',
                //             lineStyle: lineStyle,
                //             data: soil3_data
                //         },
                //         {
                //             name: '传感器4',
                //             type: 'parallel',
                //             lineStyle: lineStyle,
                //             data: soil4_data
                //         }
                //     ]
                // },
                // npk : {
                //     xAxis: {
                //         type: 'category',
                //         data: ['氮','磷','钾']
                //     },
                //     yAxis: {
                //         type: 'value'
                //     },
                //     tooltip: {
                //         trigger: 'axis'
                //     },
                //     series: [{
                //         data: [150, 230, 224],
                //         type: 'line'
                //     }]
                // },
                history: {
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        name:'',
                        type: 'value',
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    series: [{
                        data: [],
                        type: 'line',
                        smooth: true
                    }]
                },

            }
        },
        created(){
            for (let i=0;i<this.sensorData.length;i++){
                this.getRealData(this.sensorData[i].name,this.sensorData[i].addr)
            }
            // console.log(22222222222222)
            // this.getRealData('airtemp','manager-1')
        },
        mounted() {
            window.setInterval(() => {
                setTimeout(() => {
                     for (let i=0;i<this.sensorData.length;i++){
                        this.getRealData(this.sensorData[i].name,this.sensorData[i].addr)
                     }
                }, 0)
            }, 10000)
            // DOM更新后渲染仪表盘图表
            this.$nextTick(() => {
                this.realinitEcharts('all');
            });
        },
        methods:{
            //初始化echarts渲染实时数据
            realinitEcharts(type) {
                // 基于准备好的dom，初始化echarts实例
                // let echarts = require("echarts");
                let temp = echarts.init(document.getElementById("temp"));
                let humidity = echarts.init(document.getElementById("humidity"));
                let ph = echarts.init(document.getElementById("ph"));
                let n = echarts.init(document.getElementById("n"));
                let p = echarts.init(document.getElementById("p"));
                let k = echarts.init(document.getElementById("k"));
                // let beam = echarts.init(document.getElementById("beam"));
                // let co2 = echarts.init(document.getElementById("co2"));
                // let soil = echarts.init(document.getElementById("soil"));
                // let npk = echarts.init(document.getElementById("npk"));
                //根据不同的请求去渲染不同的echarts图表
                switch (type) {
                    case 'soilhum':
                        humidity.setOption(this.humidity);
                        break;
                    case 'soiltemp':
                        temp.setOption(this.temp);
                        break;
                    case 'soilPH':
                        ph.setOption(this.ph);
                        break;
                    case 'soilN':
                        n.setOption(this.n);
                        break;
                    case 'soilP':
                        p.setOption(this.p);
                        break;
                    case 'soilK':
                        k.setOption(this.k);
                        break;
                    case 'all':
                        temp.setOption(this.temp);
                        humidity.setOption(this.humidity);
                        ph.setOption(this.ph)
                        n.setOption(this.n)
                        p.setOption(this.p)
                        k.setOption(this.k)
                        break;

                }
                // 绘制图表

                // beam.setOption(this.beam);
                // co2.setOption(this.co2);
                // soil.setOption(this.soil)
                // npk.setOption(this.npk)
            },
            historyEcharts(){
                let history = echarts.init(document.getElementById("history"));
                history.setOption(this.history)
            },
            handleSelect(key, keyPath){
                console.log(key, keyPath);
                this.activeIndex = key
                if (key == 'real'){
                    this.$nextTick(() => {
                        this.realinitEcharts('all');
                    });
                }else{
                    this.getHistoryData(key, 'manager-2')
                    switch (key) {
                        case 'soilhum':
                            this.history.yAxis.name='土壤湿度(%)';
                            break;
                        case 'soiltemp':
                            this.history.yAxis.name='土壤温度(℃)';
                            break;
                        case 'soilPH':
                            this.history.yAxis.name='土壤PH(PH)';
                            break;
                        case 'soilN':
                            this.history.yAxis.name='土壤氮(mg/kg)';
                            break;
                        case 'soilP':
                            this.history.yAxis.name='土壤磷(mg/kg)';
                            break;
                        case 'soilK':
                            this.history.yAxis.name='土壤钾(mg/kg)';
                            break;
                    }
                }
            },
            switchbtn(value,type){
                console.log(value,type)
            },
            getRealData(name,addr){
                // console.log(name,addr)
                this.$axios.get('/realdata',{
                    params:{
                        'devAddr':addr,
                        'name': name,
                    }
                }).then((res) =>{
                    if (res.data){
                        console.log(res.data)
                        if (res.data.name == 'soiltemp'){
                            this.temp.series[0].data[0].value=parseFloat(res.data.value)
                            this.temp.series[0].data[0].name = res.data.devAddr+'土壤温度'
                        }else if (res.data.name == 'soilhum'){
                            this.humidity.series[0].data[0].value=parseFloat(res.data.value)
                            this.humidity.series[0].data[0].name = res.data.devAddr+'土壤湿度'
                        }else if (res.data.name == 'soilPH'){
                            this.ph.series[0].data[0].value=parseFloat(res.data.value)
                            this.ph.series[0].data[0].name = res.data.devAddr+'土壤PH值'
                        }else if (res.data.name == 'soilN'){
                            this.n.series[0].data[0].value=parseFloat(res.data.value)
                            this.n.series[0].data[0].name = res.data.devAddr+'土壤氮'
                        }else if (res.data.name == 'soilP'){
                            this.p.series[0].data[0].value=parseFloat(res.data.value)
                            this.p.series[0].data[0].name = res.data.devAddr+'土壤磷'
                        } else if (res.data.name == 'soilK'){
                            this.k.series[0].data[0].value=parseFloat(res.data.value)
                            this.k.series[0].data[0].name = res.data.devAddr+'土壤钾'
                        }
                        this.$nextTick(() => {
                            this.realinitEcharts(res.data.name);
                        });
                    }else{
                        console.log(res)
                    }

                })
            },
            getHistoryData(name,addr){
                this.$axios.get('/hstdef',{
                    params:{
                        devAddr:addr,
                        name: name,
                    }
                }).then((res) =>{
                    if (res.data){
                        console.log(res.data)
                        let historyData=[]
                        let historyDataTime=[]
                        for (let i = 0;i<res.data.length;i++){
                            historyData.push(res.data[i].sensorValue)
                            historyDataTime.push(res.data[i].time)
                        }
                        this.history.series[0].data=historyData
                        this.history.xAxis.data =historyDataTime
                        this.$nextTick(() => {
                            this.historyEcharts();
                        });
                    }else{
                        console.log(res)
                    }

                })
            },
            searchHistoryData(){
                console.log(this.timeValue,this.timeValue[0],this.timeValue[1])
                this.$axios.get('/hstdef',{
                    params:{
                        devAddr:'manager-2',
                        name: this.activeIndex,
                        start:this.timeValue[0],
                        end:this.timeValue[1]
                    }
                }).then((res) =>{
                    if (res.data){
                        console.log(res.data)

                    }else{
                        console.log(res)
                    }

                })
            }
        }

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .iotb{
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
    }
    .column {
        flex-basis: 100%;
        display: flex;
        justify-content: space-between;
    }
    .panel{
        width: 400px;
        height: 400px;
    }
    .el-menu-vertical-demo{
        height: 100%;
    }
    .soil-panel{
        width: 500px;
        height: 500px;
    }
    .switch{
        margin: 50px 0 20px 50px;
    }
    .history{
        width: 1200px;
        height: 600px;
    }
</style>
