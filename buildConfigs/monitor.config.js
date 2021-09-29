let initConifg = require('./webpack.webConfigBase')
// console.log('initConifg:', initConifg)
let config = initConifg('dist_monitor', 'z_Monitor', 'designer_page/index.html', 9007)
// console.log('config:', config)
module.exports = config
