import VueRouter from 'vue-router'
import Vue from 'vue'
// import Index from '@/components/Index'
import GreenHouse from '@/components/GreenHouse'
import Weather from '@/components/Weather'
Vue.use(VueRouter)
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default new VueRouter({
    mode:"history",
    routes: [
        {
            path: '/',
            redirect:'/greenhouse',
        },
        // {
        //     path: '/index',
        //     name: 'Index',
        //     component: Index
        // },
        {
            path: '/greenhouse',
            name: 'GreenHouse',
            component: GreenHouse
        },
        {
            path: '/weather',
            name: 'Weather',
            component: Weather
        },
    ]
})
