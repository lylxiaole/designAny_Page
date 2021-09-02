let initConifg = require('./webpack.webConfigBase')
// console.log('initConifg:', initConifg)
let config = initConifg('dist_designer', 'z_Designer', 'designer_page/index.html', 9005)
// console.log('config:', config)
module.exports = config
