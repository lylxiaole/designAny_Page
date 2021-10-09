<template>
  <div style="height:100%;width:100%;position:relative">
    <div ref="mapArea"></div>
    <button style="position:absolute;right:8px;top:8px" @click="drawerOpen=true">展示列表</button>
    <el-drawer show-close title="作业区概要" size="350px" style="height:100%" :visible.sync="drawerOpen" custom-class="mapdrawer">
      <div style="height:100%;width:100%;overflow-y:auto">
        <areaCard style="height:170px;margin:8px" />
        <areaCard style="height:170px;margin:8px" />
        <areaCard style="height:170px;margin:8px" />
        <areaCard style="height:170px;margin:8px" />
        <areaCard style="height:170px;margin:8px" />
        <areaCard style="height:170px;margin:8px" />
        <areaCard style="height:170px;margin:8px" />
        <areaCard style="height:170px;margin:8px" />
        <areaCard style="height:170px;margin:8px" />
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { getMapMarkerList } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import { getConfigByName } from '@src/baseConfigs'
import resizer from 'element-resize-detector'
// *****************************************************************
import areaCard from './areaCard.vue'
// *****************************************************************
require('ol/css')
import Map from 'ol/Map'
import * as olproj from 'ol/proj'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
// *****************************************************************
/***贮运厂总览 */
@Component({
  components: { areaCard }
})
export default class Index extends PageBase {
  private drawerOpen: boolean = false
  private currentMap: Map = null
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
  }

  destoryed() {
    this.unlisenDomSize()
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
  // ****************************************************
  private async getMapMarkers() {
    let markers = await getMapMarkerList()
    window.console.log('getMapMarkers:', markers)
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
