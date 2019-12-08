module.exports = {
    devServer: {
        proxy: {
            // 使用/api来代替接口地址，实现跨域访问
            '/api': {
                // 211.87.231.59
                target: 'http://localhost:8080', //对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        },
        host: '0.0.0.0',
        port: 8085
    }
}