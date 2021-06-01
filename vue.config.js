module.exports = {
    // 已省略其他配置项
    devServer: {
        proxy: {
            // '/api': {//业务类的接口请求地址，这里的api可以是后端的工程名
            //     changeOrigin: true,
            //     target: 'http://192.168.1.1:8080/'
            // },
            '/realdata':{                                // 要代理的接口名
                target:'http://192.168.1.177:8080/realdata',   // 要代理的接口地址
                changeOrigin:true,                            // 允许跨域
                pathRewrite:{'^/realdata':''}            // 接口名重写
            },
            '/hstdef':{                                // 要代理的接口名
                target:'http://192.168.1.177:8080/hstdef',   // 要代理的接口地址
                changeOrigin:true,                            // 允许跨域
                pathRewrite:{'^/hstdef':''}            // 接口名重写
            }
        }
    }

}
