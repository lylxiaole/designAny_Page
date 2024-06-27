<template>
  <div style="height:100%;width:100%;position:relative">
    <dbList @onCurrentDBChanged="onCurrentDBChanged" style="width:250px;height:100%;float:left">
    </dbList>
    <tableIndex v-show="currentDB" :currentDB="currentDB" ref="tableIndex" style="width:calc(100% - 250px);height:100%;float:left"></tableIndex>
    <!-- <applicationDetail :currentApplication="currentApplication" style="width:calc(100% - 250px);height:100%;float:left"></applicationDetail> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import dbList from './dbList.vue'
import tableIndex from './logicDB/tableIndex.vue'

@Options({
  components: {
    dbList: dbList,
    tableIndex: tableIndex
  }
})
export default class index extends PageBase {
  private currentDB: any = null

  mounted() {}

  private async onCurrentDBChanged(db: any) {
    this.currentDB = db
  }
}
</script>

<style>
</style>