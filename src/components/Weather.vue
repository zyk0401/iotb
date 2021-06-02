<template>
    <el-container>
        <el-aside :width="sideWidth+'px'">
            <el-menu :default-active="this.activeIndex" class="el-menu-vertical-demo"
                     @select="handleSelect"
            >
                <el-menu-item index="real" class="history-menu">
                    <span slot="title" class="weather-side-menu">实时数据</span>
                </el-menu-item>
                <el-submenu index="history" class="history-menu">
                    <template slot="title"><span class="weather-side-menu" >历史数据</span></template>
                    <el-menu-item index="airtemp"><span class="history-menu-list">空气温度</span></el-menu-item>
                    <el-menu-item index="airhum"><span class="history-menu-list">空气湿度</span></el-menu-item>
                    <el-menu-item index="light"><span class="history-menu-list">光照强度</span></el-menu-item>
                    <el-menu-item index="CO2"><span class="history-menu-list">二氧化碳</span></el-menu-item>
                    <el-menu-item index="atmos"><span class="history-menu-list">大气压</span></el-menu-item>
                    <el-menu-item index="PM25"><span class="history-menu-list">PM2.5</span></el-menu-item>
                    <el-menu-item index="windspeed"><span class="history-menu-list">风速</span></el-menu-item>
<!--                    <el-menu-item index="winddirection">风向</el-menu-item>-->
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>
            <div v-show="activeIndex=='real'" class="iotb">
                <div class="column">
                    <div id="temp" class="panel"></div>
                    <div id="humidity" class="panel"></div>
                    <div id="beam" class="panel"></div>
                    <div id="co2" class="panel"></div>
                </div>
                <div class="column">
                    <div id="rainfall" class="panel"></div>
                    <div id="windspeed" class="panel"></div>
                    <div id="pm" class="panel"></div>
                    <div id="atmos" class="panel"></div>
                </div>
                <div class="column"><span class="banquan1">版权所有：山东管理学院</span>
                </div>
                <div class="column">
                    <span class="banquan2">
                        Copyright www.sdmu.edu.cn All Rights Reserved
                    </span>
                </div>
<!--                <div class="column">-->
<!--&lt;!&ndash;                    <div id="rainfall" class="panel"></div>&ndash;&gt;-->
<!--                    <div id="wind" class="wind-panel"></div>-->
<!--                </div>-->
            </div>
            <div v-show="activeIndex=='airtemp'||activeIndex=='airhum'||activeIndex=='light' ||activeIndex=='co2'
                        ||activeIndex=='atmos' ||activeIndex=='CO2' ||activeIndex=='PM25' || activeIndex=='rainfall'
                        ||activeIndex=='windspeed' || activeIndex=='winddirection'
                        ">
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
        </el-main>
    </el-container>
</template>

<script>
    import * as echarts from 'echarts'
    // var directionMap = {};
    // ['W', 'WSW', 'SW', 'SSW', 'S', 'SSE', 'SE', 'ESE', 'E', 'ENE', 'NE', 'NNE', 'N', 'NNW', 'NW', 'WNW'].forEach(
    //     function (name, index) {
    //
    //         directionMap[name] = Math.PI / 8 * index;
    //     }
    // );
    // console.log(directionMap)
    // var data = [[10,1],[3,2],[56,3]]
    //
    // var dims = {
    //     windSpeed: 0,
    //     R: 1,
    // };
    // var arrowSize = 18;
    //
    // function renderArrow(param, api) {
    //     var point = api.coord([
    //         api.value(dims.windSpeed)
    //     ]);
    //     var f  = ''
    //     switch (api.value(dims.R)) {
    //         case 1:
    //             f = 'N';
    //             break;
    //         case 2:
    //             f = 'SSW';
    //             break;
    //         case 3:
    //             f = 'E';
    //             break;
    //     }
    //     console.log(api.value(dims.R))
    //     return {
    //         type: 'path',
    //         shape: {
    //             pathData: 'M31 16l-15-15v9h-26v12h26v9z',
    //             x: -arrowSize / 2,
    //             y: -arrowSize / 2,
    //             width: arrowSize,
    //             height: arrowSize
    //         },
    //         rotation: directionMap[f],
    //         position: point,
    //         style: api.style({
    //             stroke: '#555',
    //             lineWidth: 1
    //         })
    //     };
    // }

    /**
     * times:YYYY-mm-dd HHMMSS
     * timeData:时间
     * windsData:风速
     * windxData:风向/等级
     * temData:温度
     * ,rainData:降水
     * humData:湿度
     */
    let Data = {
        windxData: ['无','无','无','无','无','无','无','无','无','无'],
        windsData: [0,0,0,0,0,0,0,0,0,0],
        windTime:[]
    }

    let colors = ['#FF6863', '#6EAB40', '#3BB5F5'];

    export default {
        name: "Weather",
        data(){
            return{
                activeIndex:'real',
                // sideHeight : document.documentElement.clientHeight,
                sideWidth:200,
                timeValue:'',
                // wind :{
                //     title: {
                //         text: '风向 风速',
                //         left: 'center'
                //     },
                //     tooltip: {
                //         trigger: 'axis',
                //         formatter: function (params) {
                //             // console.log(params)
                //             return '风速：' + params[0].value[dims.windSpeed]+'<br>'+
                //                 '风向：' + params[0].value[dims.R]
                //         }
                //     },
                //     grid: {
                //         top: 160,
                //         bottom: 125
                //     },
                //     xAxis: {
                //         type: 'time',
                //         maxInterval: 3600 * 1000 * 24,
                //         splitLine: {
                //             lineStyle: {
                //                 color: '#ddd'
                //             }
                //         }
                //     },
                //     yAxis: [{
                //         name: '风速（节）',
                //         nameLocation: 'middle',
                //         nameGap: 35,
                //         axisLine: {
                //             lineStyle: {
                //                 color: '#666'
                //             }
                //         },
                //         splitLine: {
                //             lineStyle: {
                //                 color: '#ddd'
                //             }
                //         }
                //     }, {
                //
                //
                //     }, {
                //         axisLine: {show: false},
                //         axisTick: {show: false},
                //         axisLabel: {show: false},
                //         splitLine: {show: false}
                //     }],
                //     visualMap: {
                //         type: 'piecewise',
                //         // show: false,
                //         orient: 'horizontal',
                //         left: 'center',
                //         bottom: 10,
                //         pieces: [{
                //             gte: 17,
                //             color: '#18BF12',
                //             label: '大风（>=17节）'
                //         }, {
                //             gte: 11,
                //             lt: 17,
                //             color: '#f4e9a3',
                //             label: '中风（11  ~ 17 节）'
                //         }, {
                //             lt: 11,
                //             color: '#D33C3E',
                //             label: '微风（小于 11 节）'
                //         }],
                //         seriesIndex: 1,
                //         dimension: 1
                //     },
                //     series: [{
                //         type: 'line',
                //         yAxisIndex: 1,
                //         showSymbol: false,
                //         hoverAnimation: false,
                //         symbolSize: 10,
                //         areaStyle: {
                //             color: {
                //                 type: 'linear',
                //                 x: 0,
                //                 y: 0,
                //                 x2: 0,
                //                 y2: 1,
                //                 colorStops: [{
                //                     offset: 0, color: 'rgba(88,160,253,1)'
                //                 }, {
                //                     offset: 0.5, color: 'rgba(88,160,253,0.7)'
                //                 }, {
                //                     offset: 1, color: 'rgba(88,160,253,0)'
                //                 }]
                //             }
                //         },
                //     }, {
                //         type: 'custom',
                //         renderItem: renderArrow,
                //         encode: {
                //             x: dims.time,
                //             y: dims.windSpeed
                //         },
                //         data: data,
                //         z: 10
                //     }]
                // },
                wind : {
                    color: colors,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {type: 'cross'},
                    },
                    grid: {
                        top: '30%',
                        bottom: '30%',
                        left: '14%',
                        right: '8%'
                    },

                    xAxis: [
                        {
                            name: '风向',
                            type: 'category',
                            position: 'bottom',
                            offset: 20,
                            axisTick: {show: false},
                            axisLine: {show: false},
                            axisLabel: {
                                show: true,
                                // textStyle: {color: '#000000', fontSize: 14, lineHeight: 20},
                                interval: 0,
                                formatter: (value) => {
                                    return  value+'';
                                },
                                rich: {
                                    value: {
                                        lineHeight: 16,
                                        align: 'left'
                                    },

                                }
                            },
                            nameTextStyle: {color: '#585858', padding: [0, 0, -38]},
                            nameLocation: 'start',
                            data: Data.windxData
                        },


                    ],
                    yAxis: [{
                        type: 'value',
                        name: '风速(m/s)',
                        scale: true,
                        position: 'left',
                        offset: 54,
                        axisTick: {lineStyle: {color: colors[0]}, inside: true},
                        nameTextStyle: {color: colors[0]},
                        axisLabel: {color: colors[0]},
                        splitLine: {show: false}
                    },

                    ],
                    series: [{
                        name: '风速(m/s)',
                        type: 'line',
                        step: false,
                        label: {normal: {show: true, position: 'top'}},
                        data: Data.windsData
                    },
                    ]
                },
                temp:{
                    series: [{
                        name: "当前温度",
                        type: "gauge",
                        min: -20,
                        max: 60,
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
                            name:'空气温度',
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
                            name:'空气湿度',
                        }]
                    }]
                },
                beam:{
                    series: [{
                        name: "当前光照强度",
                        type: "gauge",
                        min: 0,
                        max: 50000,
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
                            formatter: '{value}Lux',
                            color: 'auto',
                            fontSize:20
                        },
                        data: [{
                            value: 0,
                            name:'光照强度',
                        }]
                    }]
                },
                co2:{
                    series: [{
                        name: "当前二氧化碳",
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
                            formatter: '{value}ppm',
                            color: 'auto',
                            fontSize:20
                        },
                        data: [{
                            value: 0,
                            name:'二氧化碳',
                        }]
                    }]
                },
                pm:{
                    series: [{
                        name: "当前PM2.5值",
                        type: "gauge",
                        min: 0,
                        max: 1000,
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
                            formatter: '{value} ug/m3',
                            color: 'auto',
                            fontSize:20
                        },
                        data: [{
                            value: 0,
                            name:'PM2.5值',
                        }]
                    }]
                },
                atmos:{
                    series: [{
                        name: "当前大气压",
                        type: "gauge",
                        min: 0,
                        max: 12000,
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
                            formatter: '{value} kPa',
                            color: 'auto',
                            fontSize:20
                        },
                        data: [{
                            value: 0,
                            name:'大气压',
                        }]
                    }]
                },
                rainfall:{
                    series: [{
                        name: "当前雨量",
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
                            formatter: '{value} mm',
                            color: 'auto',
                            fontSize:20
                        },
                        data: [{
                            value: 0,
                            name:'雨量',
                        }]
                    }]
                },
                windspeed:{
                    series: [{
                        name: "当前风速",
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
                            formatter: '{value} m/s',
                            color: 'auto',
                            fontSize:20
                        },
                        data: [{
                            value: 0,
                            name:'风速',
                        }]
                    }]
                },
                history: {
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
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
                sensorData:[
                    {
                        name:'light',
                        addr:'manager-1'
                    },
                    {
                        name:'winddirection',
                        addr:'manager-1'
                    },
                    {
                        name:'windspeed',
                        addr:'manager-1'
                    },
                    {
                        name:'PM25',
                        addr:'manager-1'
                    },
                    {
                        name:'CO2',
                        addr:'manager-1'
                    },
                    {
                        name:'atmos',
                        addr:'manager-1'
                    },
                    {
                        name:'airhum',
                        addr:'manager-1'
                    },
                    {
                        name:'airtemp',
                        addr:'manager-1'
                    }
                ],
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
            console.log(this.$route)
            window.setInterval(() => {
                setTimeout(() => {
                    // if (this.$route.name=='weather'){
                        for (let i=0;i<this.sensorData.length;i++){
                            this.getRealData(this.sensorData[i].name,this.sensorData[i].addr)
                        }
                    // }
                    // this.getRealData('airtemp','manager-1')
                }, 0)
            }, 10000)
            // DOM更新后渲染仪表盘图表
            this.$nextTick(() => {
                this.realinitEcharts('all');
            });
        },
        methods:{
            realinitEcharts(type) {
                // let wind = echarts.init(document.getElementById("wind"));
                let temp = echarts.init(document.getElementById("temp"));
                let humidity = echarts.init(document.getElementById("humidity"));
                let beam = echarts.init(document.getElementById("beam"));
                let co2 = echarts.init(document.getElementById("co2"));
                let pm = echarts.init(document.getElementById("pm"));
                let atmos = echarts.init(document.getElementById("atmos"));
                let rainfall = echarts.init(document.getElementById("rainfall"));
                let windspeed = echarts.init(document.getElementById("windspeed"));

                // 基于准备好的dom，初始化echarts实例
                // let echarts = require("echarts");
                switch (type) {
                    // case 'wind':
                    //     wind.setOption(this.wind);
                    //     break;
                    case 'airtemp':
                        temp.setOption(this.temp);
                        break;
                    case 'airhum':
                        humidity.setOption(this.humidity);
                        break;
                    case 'light':
                        beam.setOption(this.beam);
                        break;
                    case 'PM25':
                        pm.setOption(this.pm);
                        break;
                    case 'CO2':
                        co2.setOption(this.co2);
                        break;
                    case 'atmos':
                        atmos.setOption(this.atmos);
                        break;
                    case 'rainfall':
                        rainfall.setOption(this.rainfall);
                        break;
                    case 'windspeed':
                        windspeed.setOption(this.windspeed);
                        break;
                    case 'all':
                        // wind.setOption(this.wind);
                        temp.setOption(this.temp);
                        humidity.setOption(this.humidity);
                        beam.setOption(this.beam);
                        co2.setOption(this.co2);
                        pm.setOption(this.pm);
                        atmos.setOption(this.atmos);
                        rainfall.setOption(this.rainfall);
                        windspeed.setOption(this.windspeed);
                        break;

                }


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
                }else {
                    this.getHistoryData(key, 'manager-1')
                    switch (key) {
                        case 'airhum':
                            this.history.yAxis.name='空气湿度(%)';
                            break;
                        case 'airtemp':
                            this.history.yAxis.name='空气温度(℃)';
                            break;
                        case 'light':
                            this.history.yAxis.name='光照强度(PH)';
                            break;
                        case 'PM25':
                            this.history.yAxis.name='PM2.5(ug/m3)';
                            break;
                        case 'CO2':
                            this.history.yAxis.name='CO2(ppm)';
                            break;
                        case 'atmos':
                            this.history.yAxis.name='大气压(kPa)';
                            break;
                        case 'rainfall':
                            this.history.yAxis.name='雨量(mm)';
                            break;
                        case 'windspeed':
                            this.history.yAxis.name='风速(m/s)';
                            break;

                    }
                }
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
                        // console.log(res.data)
                        if (res.data.name == 'airtemp'){
                            this.temp.series[0].data[0].value=parseFloat(res.data.value)
                            this.temp.series[0].data[0].name = res.data.devAddr+'空气温度'
                        }else if (res.data.name == 'light'){
                            this.beam.series[0].data[0].value=parseFloat(res.data.value)
                            this.beam.series[0].data[0].name = res.data.devAddr+'光照强度'
                        }else if (res.data.name == 'airhum'){
                            this.humidity.series[0].data[0].value=parseFloat(res.data.value)
                            this.humidity.series[0].data[0].name = res.data.devAddr+'空气湿度'
                        }else if (res.data.name == 'PM25'){
                            this.pm.series[0].data[0].value=parseFloat(res.data.value)
                            this.pm.series[0].data[0].name = res.data.devAddr+'PM2.5'
                        }else if (res.data.name == 'CO2'){
                            this.co2.series[0].data[0].value=parseFloat(res.data.value)
                            this.co2.series[0].data[0].name = res.data.devAddr+'CO2'
                        }else if (res.data.name == 'atmos'){
                            this.atmos.series[0].data[0].value=parseFloat(res.data.value)
                            this.atmos.series[0].data[0].name = res.data.devAddr+'大气压'
                        } else if (res.data.name == 'rainfall'){
                            this.rainfall.series[0].data[0].value=parseFloat(res.data.value)
                            this.rainfall.series[0].data[0].name = res.data.devAddr+'雨量'
                        }else if (res.data.name == 'windspeed'){
                            this.windspeed.series[0].data[0].value=parseFloat(res.data.value)
                            this.windspeed.series[0].data[0].name = res.data.devAddr+'风速'
                        }
                        // else if (res.data.name == 'windspeed'){
                        //     Data.windsData.push(parseFloat(res.data.value))
                        //     if (Data.windsData.length>10){
                        //         Data.windsData.splice(0,1)
                        //     }
                        //     this.$nextTick(() => {
                        //         this.realinitEcharts('wind');
                        //     });
                        // }else if (res.data.name == 'winddirection'){
                        //     Data.windTime.push(res.data.time)
                        //     Data.windxData.push(res.data.value)
                        //     if (Data.windxData.length>10){
                        //         Data.windxData.splice(0,1)
                        //         Data.windTime.splice(0,1)
                        //     }
                        //     this.$nextTick(() => {
                        //         this.realinitEcharts('wind');
                        //     });
                        // }
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
                        this.history.yAxis.data =historyDataTime
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
                        devAddr:'manager-1',
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
    .wind-panel{
        width: 900px;
        height: 400px;
    }
    .panel{
        width: 400px;
        height: 400px;
    }
    .el-menu-vertical-demo{
        height: 100%;
    }
    .history{
        width: 1200px;
        height: 600px;
    }
    .weather-side-menu{
        font-size: 25px;
    }
    .history-menu{
        margin-top: 50px;
    }
    .history-menu-list{
        font-size: 20px;
    }
    .banquan1{
        display: block;
        font-size: 18px;
        margin: 50px auto 0;
    }
    .banquan2{
        display: block;
        font-size: 18px;
        margin: 0 auto;
    }
</style>
