<template>
  <div style="height:100%;width:100%;position:relative">
    <div ref="mapArea"></div>
    <button style="position:absolute;right:8px;top:8px" @click="drawerOpen=true">展示列表</button>
    <el-drawer show-close title="作业区概要" size="400px" :modal="false" style="height:100%" :visible.sync="drawerOpen" custom-class="mapdrawer">
      <div style="height:100%;width:100%;overflow-y:auto">
        <areaCard v-for="item in cardInfos" :key="item.areaName" :cardInfo="item" style="height:170px;margin:8px" />
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { getMapMarkerList, getErrorFlowmeters } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { getConfigByName } from '@src/baseConfigs'
import resizer from 'element-resize-detector'
// *****************************************************************
import areaCard, { cardInfo } from './areaCard.vue'
// *****************************************************************
require('ol/css')
import Map from 'ol/Map'
import * as olproj from 'ol/proj'
import * as olgeom from 'ol/geom'
import * as olstyle from 'ol/style'
import * as olsource from 'ol/source'
import * as ollayer from 'ol/layer'
import Overlay from 'ol/Overlay'
import Feature from 'ol/Feature'

import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { request } from 'http'
import { randomInt } from 'crypto'
import { random } from 'xe-utils'
// *****************************************************************
var normalIcon = require('../../../assets/areaMap/dwg.png')
var warnIcon = require('../../../assets/areaMap/dwy.png')
var errorIcon = require('../../../assets/areaMap/dwr.png')
/***贮运厂总览 */
@Component({
  components: { areaCard }
})
export default class Index extends PageBase {
  private drawerOpen: boolean = true
  private currentMap: Map = null
  private cardInfos: cardInfo[] = []
  private timer: any = null
  // ********************************************************************************
  mounted() {
    let mapapiUrl = getConfigByName('mapApiAddr')
    this.currentMap = new Map({
      target: this.$refs.mapArea as any,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: mapapiUrl
          })
        })
      ],
      view: new View({
        center: olproj.transform([118.806063, 32.254807], 'EPSG:4326', 'EPSG:3857'),
        zoom: 13
      })
    })
    this.listenChartDomSize()
    this.getMapMarkers()
    this.timer = window.setInterval(this.getMapMarkers, 10000)
    this.currentMap.on('pointermove', this.onMapMouseMove)
  }

  destroyed() {
    this.unlisenDomSize()
    if (this.timer) {
      window.clearInterval(this.timer)
    }
    if (this.currentNotify) {
      this.currentNotify.close()
    }
  }
  private async getMapMarkers() {
    let markers = await getMapMarkerList()
    // window.console.log('getMapMarkers:', markers)
    //todo 加载地图
    for (let index = 0; index < this.allLayers.length; index++) {
      const element = this.allLayers[index]
      this.currentMap.removeLayer(element)
    }
    this.allLayers = []
    this.setMarkerInMap(markers)
    //todo加载卡片
    let cardList = markers.filter((o) => o.QYJKLX === '1')
    this.cardInfos = []
    window.console.log('cardList:', cardList)
    for (let index = 0; index < cardList.length; index++) {
      const cardinfo = cardList[index]
      this.cardInfos.push({
        areaId: cardinfo.QYID,
        areaName: cardinfo.QYMC,
        status: cardinfo.ZXZT,
        totalCount: cardinfo.jlbsl, //总数
        normalCount: cardinfo.zczt,
        normalRate: this.rateStrFormat(cardinfo.zclv), //正常率
        errorCount: cardinfo.gzzt, //故障数量
        infoCount: cardinfo.xxtxzt, //信息数量
        datacollectErrorCount: cardinfo.scczt, //数采异常数量
        forbiddenConntectCount: cardinfo.jztxzt, //禁止通讯数量
        conntectErrorCount: cardinfo.txsbzt //通讯失败数量
      })
    }
    //todo显示报警消息
    await this.notifyMessages(markers)
  }
  // ***************************************************************
  private currentResizer: any = null
  listenChartDomSize() {
    this.currentResizer = resizer()
    this.currentResizer.listenTo($(this.$el), (element) => {
      this.currentMap.updateSize()
    })
  }
  unlisenDomSize() {
    this.currentResizer.removeAllListeners($(this.$el))
  }
  // **************map操作**************************************
  private currentOverlay: any = null
  private needAddItem: any = null
  private needItemAddcallback: any = null
  private allLayers: any[] = []

  private rateStrFormat(val) {
    // window.console.log('rateStrFormat:', val)
    val = val.replace('%', '')
    return (parseFloat(val).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + '%'
  }
  private onMapMouseMove(e: any) {
    if (this.needAddItem) {
      var lastDragMovePoint = olproj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
      this.needAddItemAdd(lastDragMovePoint[0], lastDragMovePoint[1])
    }
    if (e.dragging) {
      return
    }

    var hit = this.currentMap.hasFeatureAtPixel(this.currentMap.getEventPixel(e.originalEvent))
    e.originalEvent.target.style.cursor = hit ? 'pointer' : ''
    if (!hit) {
      if (this.currentOverlay) {
        this.currentMap.removeOverlay(this.currentOverlay)
        this.currentOverlay = null
      }
      return
    }

    if (!this.currentOverlay) {
      var features = this.currentMap.getFeaturesAtPixel(this.currentMap.getEventPixel(e.originalEvent)) as any
      for (var i = 0; i < features.length; i++) {
        var feature = features[i]
        if (feature.values_.contentHtml) {
          this.currentOverlay = this.createPopupOverlay(feature.values_.contentHtml)
          this.currentOverlay.setPosition(e.coordinate)
          this.currentMap.addOverlay(this.currentOverlay)
          break
        }
      }
    }
    if (this.currentOverlay) {
      var position = olproj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326')
      this.currentOverlay.setPosition(e.coordinate)
    }
  }
  private setMarkerInMap(datalist) {
    var x1 = 0
    var y1 = 0
    var gs = 0
    var u = this.currentMap.getView().getZoom()
    var pyz = 0.0002
    if (u > 17) {
      pyz = 0.0001
    }

    for (let i = 0; i < datalist.length; i++) {
      const d = datalist[i]
      //同一个点有多个时，显示错开，根据打开的页面层级错开的距离不同
      if (x1 == d.DTX && y1 == d.DTY) {
        gs = gs + 1
      } else {
        gs = 0
        x1 = d.DTX
        y1 = d.DTY
      }
      //addSingleMapMarker(d.x, d.y, d.jobName, d.jobDetail, d.zttbh);
      var jd = parseFloat(d.DTX) + pyz * gs

      this.addSingleMapMarker(jd, d.DTY, d.QYMC, d.zyms, d.ZXZT, '', '', d.QYID, d.QYJKLX)
    }
  }
  /***
   * x:横坐标
   * y:纵坐标
   * title:区域名称
   * content:鼠标悬浮于点上时，要显示的html内容
   * dqzt：当前状态
   * zylxbm：未知
   * zylx：未知
   * qyid：区域Id
   * qyjklx：区域监控类型
   */
  private addSingleMapMarker(x, y, title, content, dqzt, zylxbm, zylx, qyid, qyjklx) {
    var iconurl = normalIcon
    //把marker点的信息显示在地图上
    //根据作业当前状态，显示不同的图标
    // 当前状态：0 绿色为正常；1 橙色为有信息提醒；2 红色为有故障；
    //          3 深蓝色为数采错误；4 紫色为数据以前的，长时间未数采。
    //          6 通讯失败，用橙色
    dqzt = parseInt(dqzt)
    switch (dqzt) {
      case 0:
        iconurl = normalIcon
        break
      case 1:
        iconurl = warnIcon
        break
      case 2:
        iconurl = errorIcon
        break
      case 3:
        iconurl = warnIcon
        break
      case 4:
        iconurl = warnIcon
        break
      case 5:
        iconurl = warnIcon
        break
      case 6:
        iconurl = warnIcon
        break
      default:
        break
    }

    if (isNaN(x) || isNaN(y) || x < 1 || y < 1) {
    } else {
      // window.console.log(`addSingleMapMarker  ${title}当前状态`, dqzt)
      this.addPoint(x, y, content, iconurl, title, qyid, qyjklx)
    }
  }
  private addPoint(x, y, content, iconUrl, title, qyid, qyjklx) {
    if (isNaN(x) || isNaN(y) || x < 1 || y < 1) {
      return
    }
    // window.console.log('addPoint', title, x, y)

    var marker = new olgeom.Point(olproj.transform([x, y], 'EPSG:4326', 'EPSG:3857'))
    var iconFeature1 = new Feature({
      name: title,
      qyid: qyid,
      qyjklx: qyjklx,
      contentHtml: content,
      geometry: marker
    })
    var iconStyle = new olstyle.Style({
      image: new olstyle.Icon({
        anchor: [0.5, 0.5], // 锚点 默认值为图片中心
        src: iconUrl // 图标路径
      }),
      text: new olstyle.Text({
        textAlign: 'center', //位置
        textBaseline: 'middle', //基准线
        font: 'normal 14px 微软雅黑', //文字样式

        text: title, //文本内容
        fill: new olstyle.Fill({
          //文本填充样式（即文字颜色)
          color: 'yellow'
        }),
        stroke: new olstyle.Stroke({
          color: 'green',
          width: 1
        })
      })
    })

    iconFeature1.setStyle(iconStyle)
    var vectorSource = new olsource.Vector({
      features: [iconFeature1]
    })
    var vectorLayer = new ollayer.Vector({
      source: vectorSource
    })
    this.currentMap.addLayer(vectorLayer)
    this.allLayers.push(vectorLayer)
  }
  private needAddItemAdd(x, y) {
    var item = this.needAddItem
    var data1: any = {}
    data1.wzx = x
    data1.wzy = y
    data1.tbr = item.QYMC
    data1.id = item.QYID
    data1.action = 'qyDwSave'
    if (this.needItemAddcallback) {
      this.needItemAddcallback(data1)
      this.needAddItem = null
    }
  }
  private createPopupOverlay(innerHtml) {
    var element = document.createElement('div')
    element.style.padding = '10px'
    element.style.width = '200px'
    element.style.background = 'white'
    element.innerHTML = innerHtml
    var overlay = new Overlay({
      element: element,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    })
    return overlay
  }
  // **********错误消息**************************************
  private currentNotify: any = null
  private currentNotifyString: string = ''
  private async notifyMessages(markers: any[]) {
    let errorFlows = await getErrorFlowmeters()
    // window.console.log('getErrorFlowmeters:', errorFlows)
    if (errorFlows.length < 1) {
      if (this.currentNotify) {
        this.currentNotifyString = ''
        this.currentNotify.close()
      }
      return
    }
    let messagestr = '故障计量表提醒: <br/>'
    for (let index = 0; index < errorFlows.length; index++) {
      const element = errorFlows[index]
      let newmessage = `<a href='#/flowmeterAlarm?id=${element.JLBID}'>${index + 1 + '.&nbsp;&nbsp;' + element.JLBMC}<a/><br/>`
      messagestr += newmessage
    }

    if (this.currentNotifyString === messagestr) {
      return
    }
    if (this.currentNotify) {
      this.currentNotify.close()
    }
    this.currentNotifyString = messagestr
    this.currentNotify = this.$notify.error({
      title: '故障',
      message: messagestr,
      dangerouslyUseHTMLString: true,
      duration: 0,
      position: 'bottom-right'
    })
  }

  private alarmHerfClick() {
    window.console.log('alarmHerfClick')
  }
}
</script>
<style lang="less" scoped>
/deep/ .mapdrawer {
  .el-drawer__header {
    padding: 0px !important;
    margin: 8px !important;
    box-sizing: border-box !important;
    height: 35px !important;
  }

  .el-drawer__body {
    box-sizing: border-box !important;
    height: calc(100% - 35px) !important;
  }
}
</style>
