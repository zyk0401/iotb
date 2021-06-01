<template>
    <el-menu
            :default-active="activeIndex"
            class="nav el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#409EFF"
            text-color="#fff"
            active-text-color="#ffd04b">
<!--        <el-menu-item index="index">首页</el-menu-item>-->
        <el-menu-item index="greenhouse">智慧农业</el-menu-item>
        <el-menu-item index="weather">智慧气象</el-menu-item>

    </el-menu>
</template>

<script>
    export default {
        name: "Navigate",

        data() {
            return {
                activeIndex: 'greenhouse',
            };
        },
        methods: {
            handleScroll() {
                this.scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
            },
            // 处理导航选中事件
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                this.activeIndex = key;
                this.$router.push('/'+key)
            },
        },
        mounted(){
            let thisUrl=this.$route.path
            let urlLast=thisUrl.substr(thisUrl.lastIndexOf("/")+1)
            this.activeIndex = urlLast
            window.addEventListener('scroll', this.handleScroll, true)
        },

        destroyed() {
            window.removeEventListener('scroll', this.handleScroll) //  离开页面清除（移除）滚轮滚动事件
        },
    }
</script>

<style scoped>
    .nav{
        padding-left: 20%;
    }
    .link-format a{
        color: #EBEEF5;
    }
    .link-format a:hover{
        color: #FFFFFF;
        border-bottom:1px solid #F6F6F6
    }
    .login-link .el-dropdown .el-dropdown-link .el-avatar--circle{
        position: absolute;
        top:-24px;
    }
</style>
