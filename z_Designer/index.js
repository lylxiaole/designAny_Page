import React from 'react'
import ReactDom from 'react-dom'
import _axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import initSystem, { getRoutes, getConfig } from '@src/baseConfigs'

import { getStore, IReduxAction } from '@src/baseConfigs'

// ***********系统环境初始化*********************************
let configs = (await _axios.get('configs.json')).data
import routes from './routes'
import appState from './appState'
initSystem(routes, configs, appState)
// ********************************************
ReactDom.render(getRoutes(), document.getElementById('app'))
