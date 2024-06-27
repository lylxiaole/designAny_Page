<template>
  <div style="height:100%;width:100%;position:relative">
    <tableList ref="tableList" @onCurrentTableChanged="onCurrentTableChanged" style="width:250px;height:100%;float:left" />
    <tableDeatil v-show="currentTable" :currentTable="currentTable" style="width:calc(100% - 250px);height:100%;float:left" />
    <!-- <applicationDetail :currentApplication="currentApplication" style="width:calc(100% - 250px);height:100%;float:left"></applicationDetail> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import tableList from './tableList.vue'
import tableDeatil from './tableDeatil.vue'
@Options({
  components: {
    tableList: tableList,
    tableDeatil: tableDeatil
  }
})
export default class tableIndex extends PageBase {
  @Prop({ default: null })
  private currentDB: any
  @Watch('currentDB')
  private async oncurrentDBChanged(val) {
    if (!val) {
      return
    }
    ;(this.$refs.tableList as tableList).setDB(val)
  }

  mounted() {}
  private currentTable: any = null
  private async onCurrentTableChanged(db: any) {
    this.currentTable = db
  }
}
</script>

<style>
</style>