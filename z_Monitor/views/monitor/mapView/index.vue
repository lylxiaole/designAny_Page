<template>
  <div style="height:100%;width:100%">
    <div ref="mapArea"></div>

    <el-drawer title="我是标题" :visible.sync="drawerOpen" :with-header="false">
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
/////////////////////////////////
require('ol/css')
import Map from 'ol/Map'
import * as olproj from 'ol/proj'

import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
// *****************************************************************
/***贮运厂总览 */
@Component({
  components: {}
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
<style scoped>
</style>
