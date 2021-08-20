import React from 'react'
import ReactDom from 'react-dom'
import _axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import initSystem, { getRoutes, getConfig } from '@src/baseConfigs'

// ***********系统环境初始化*********************************
let configs = (await _axios.get('configs.json')).data
import routes from './utils/routes'
initSystem(routes, configs)
window.console.log('configs:', getConfig())
window.console.log('routes:', getRoutes())
// ********************************************
ReactDom.render(getRoutes(), document.getElementById('app'))
