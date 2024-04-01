module.exports = {

    devServer: {
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        proxy: {
            '/api': {
                target: 'http://fan.onestyle.top',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        },
        watchOptions: {
            aggregateTimeout: 500, // delay before reloading
            poll: 1000, // enable polling since fsevents are not supported in docker
            ignored:/node_modules/
        }
    },
}
