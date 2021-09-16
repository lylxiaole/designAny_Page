import Vue from 'vue'

/**主题样式 */
import './assets/globlaTheme.less'
/** */
import npModal from './07commonComponents/npModal'
/** */
import $ from 'jquery'
/** */
import { Modal, message } from 'ant-design-vue'
/** */
import dragula from 'dragula'
import 'dragula/dist/dragula.min.css'
/** */
import controls from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'
/** */
import 'xe-utils'
import VXETable from 'vxe-table'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table/lib/index.css'
/** */
import moment from 'moment'
import 'moment/locale/zh-cn'
/** */
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
/**引用图标库 */
// require('./assets/iconfont1/iconfont')
// require('./assets/iconfont1/iconfont.css')
/**设计器页面 */
import genoDesigner from './genoDesigner.vue'
import genoPrintDesigner from './genoPrintDesigner.vue'
/**设计器主要组件 */
import Layout_Professional from './05designerLayouts/layout_Professional/Layout_Professional.vue'

import PropertyGrid from './06propertyGrid/PropertyGrid.vue'
import ComponentListControl from './components/ComponentListControl.vue'
import ComponentTemplateControl from './components/ComponentTemplateControl.vue'
import PageListControl from './components/PageListControl.vue'
import AllPageListControl from './components/AllPageListControl.vue'
import ModelControl from './components/ModelControl.vue'
import behaviorDeatilSetting from './06propertyGrid/behaviorControl/behaviorDeatilSetting.vue'
import tableComponentListControl from './06propertyGrid/tableStyleSetting/tableComponentListControl.vue'
import npUploadFile2 from './07commonComponents/npUploadFile2.vue'
import npUploadFile from './07commonComponents/npUploadFile.vue'
import npUploadFileSignle from './07commonComponents/npUploadFileSingle.vue'
//
import './02common/layer/theme/default/layer.css'
require('./02common/layer/layer.js')
//
moment.locale('zh-cn')
import VueStorage from 'vue-ls/dist/vue-ls'
//
import { GenoAnyMind } from 'genoany-g6-v2/src/main'
import GenoAnyEditor from '../x6/flow.vue'
//
var Pickr = require('@simonwep/pickr/dist/pickr.min.js')
require('@simonwep/pickr/dist/themes/classic.min.css')
require('@simonwep/pickr/dist/themes/monolith.min.css')
require('@simonwep/pickr/dist/themes/nano.min.css')
//
import { CurrentStore } from './01designerContext'
/**设计器上下文 */
export { RegisterContext, RegisterApis, RegisterStore, IApiBase, IContext, CurrentApis, CurrentContext, CurrentStore } from './01designerContext'

import { findSystemComp, findSystemCompByCode } from './04designerComponents'
//一些通用组件
export default function install(vue: typeof Vue): void {
  message.config({
    maxCount: 1
  })
  vue.use(VueStorage)
  vue.use(VXETable)
  VXETable.use(VXETablePluginAntd)
  vue.use(VueVideoPlayer)
  //vue.use(GenoAnyEditor)
  vue.use(GenoAnyMind)
  vue.use(controls)
  vue.prototype.$moment = moment
  vue.prototype.$store = CurrentStore
  vue.prototype.$pickr = Pickr
  vue.prototype.findSystemComp = findSystemComp
  vue.prototype.findSystemCompByCode = findSystemCompByCode
  vue.component('geno-modal', npModal)
  /** */
  vue.component('geno-designer', genoDesigner)
  vue.component('genoPrint-designer', genoPrintDesigner)
  /**设计器主要组件 */
  vue.component('geno-layoutProfessional', Layout_Professional)

  vue.component('geno-propertyGrid', PropertyGrid)
  vue.component('geno-componentListControl', ComponentListControl)
  vue.component('geno-pageListControl', PageListControl)
  vue.component('geno-allPageListControl', AllPageListControl)
  vue.component('geno-modelcontrol', ModelControl)
  vue.component('geno-componentTemplateControl', ComponentTemplateControl)
  vue.component('geno-npUploadFile', npUploadFile2)
  vue.component('geno-npUploadFile-all', npUploadFileSignle)
  /** 一些通用组件*/
  vue.component('geno-behaviorDeatilSetting', behaviorDeatilSetting)
  vue.component('geno-tableComponentListControl', tableComponentListControl)
}
