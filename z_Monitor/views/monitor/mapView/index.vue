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
import {} from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
/////////////////////////////////
import Map from 'ol/Map'
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
    this.currentMap = new Map({
      target: this.$refs.mapArea as any,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    })
  }
}
</script>
<style scoped>
</style>
