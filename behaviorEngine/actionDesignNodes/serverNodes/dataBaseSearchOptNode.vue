<template>
  <div style="width: 100%; height: 100%">
    <!-- ********************************************* -->
    <el-row style="width:100%;height:25px">
      <el-col :span="6">数据库:</el-col>
      <el-col :span="18">
        <el-select v-model="selectedDbId" placeholder="Select" size="small" style="width: 100%">
          <el-option v-for="db in allDatabases" :key="db.id" :label="db.databaseName" :value="db.id" />
        </el-select>
      </el-col>
    </el-row>
    <!-- ********************************************* -->
    <el-row style="width:100%;height:25px;margin-top:3px;">
      <el-col :span="6">表:</el-col>
      <el-col :span="18">
        <el-select v-model="selectedTableId" placeholder="Select" size="small" style="width: 100%">
          <el-option v-for="tab in allTables" :key="tab.tableId" :label="tab.tableName" :value="tab.tableId" />
        </el-select>
      </el-col>
    </el-row>
    <!-- ********************************************* -->
    <div style="height:1px;width:100%;margin-top:3px;border-top:1px solid #cdcdcd"></div>
    <!-- ********************************************* -->
    <el-row style="width:100%;margin-top:3px;">
      <div style="width:100%;height:25px;position:relative">
        <span style="float:left;margin-left:8px;font-weight:600">筛选条件:</span>
        <el-button @click="onAddFilter" size="small" style="float:right;margin-right:8px">新增</el-button>
      </div>
      <template v-for="(filter,index) in searchFilters" :key="index">
        <searchFilterEditor :filter="filter" :allInparams="allInParams" :columns="currentColumns" :isLast="index===(searchFilters.length-1)"
          @onDelete="onDeleteSearchFilter(index)" />
      </template>
    </el-row>
  </div>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode } from '@behaviorEngine/flowDesigner/flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

import searchFilterEditor, { seacrchFilter } from './utils/searchFilterEditor.vue'

@flowDesignNode(funcCode.dataBaseSearchOpt, flowNodeType.funcNormalNode)
@Options({
  components: { searchFilterEditor }
})
export default class dataBaseSearchOptNode extends Vue {
  @Prop()
  private i18n: any
  @Prop()
  private actObj: actionObj
  // ********数据库*****************************************
  private allDatabases: any[] = []
  private selectedDbId: string = null
  private get selectedDb() {
    return this.allDatabases.find((db) => db.id === this.selectedDbId)
  }
  // ********表*****************************************
  private selectedTableId: string = null
  private get allTables() {
    return this.selectedDb ? this.selectedDb.tables : []
  }
  // ********搜索条件*************************************
  private searchFilters: seacrchFilter[] = []
  private get allInParams() {
    if (!this.actObj) {
      return []
    }

    return this.actObj.inputParams
  }
  private get currentColumns() {
    if (!this.selectedTableId) {
      return
    }
    var table = this.allTables.find((o) => o.tableId === this.selectedTableId)
    if (!table) {
      return
    }
    return table.columns
  }

  @Watch('searchFilters', { deep: true })
  private onsearchFilterschanged(val: any) {
    this.actObj.resourceFilter.searchFilters = val
  }
  // *****************************************************
  mounted() {
    this.initData()
  }
  private async initData() {
    //初始化
    this.allDatabases = await behaviorContext.getAllDatabases()
    this.selectedDbId = this.actObj.resourceFilter.dbId
    this.selectedTableId = this.actObj.resourceFilter.tableId
    if (this.actObj.resourceFilter.searchFilters) {
      this.searchFilters = this.actObj.resourceFilter.searchFilters
    } else {
      this.searchFilters = []
    }
    //监视数据库选项变化
    this.$watch(() => this.selectedDbId, this.onselectedDbIdChanged)
    //监视表选项变化
    this.$watch(() => this.selectedTableId, this.onSelectedTableIdChanged)
    //初始化一下table结构
    this.onSelectedTableIdChanged(this.selectedTableId)
  }
  private onselectedDbIdChanged(newVal: string, oldVal: string) {
    if (newVal !== oldVal) {
      this.selectedTableId = null
    }
    this.actObj.resourceFilter.dbId = newVal
  }
  private onSelectedTableIdChanged(newVal: string) {
    this.actObj.resourceFilter.tableId = newVal
    this.actObj.inputParams = []
    if (!newVal) {
      this.actObj.outParam = null
      return
    } else {
      this.actObj.outParam = { key: makeParamKey(this.actObj.id, 'output'), name: '返回结果' }
    }
    this.makeSeachInparams(newVal)
  }
  private makeSeachInparams(tableId) {
    this.actObj.inputParams = []
    if (!tableId) {
      return
    }
    var table = this.allTables.find((o) => o.tableId === tableId)
    if (!table) {
      return
    }
    for (let index = 0; index < table.columns.length; index++) {
      const col = table.columns[index]
      this.actObj.inputParams.push({ key: makeParamKey(this.actObj.id, col.columnCode), name: '条件-' + col.columnName })
    }
  }
  // *****************************************************
  private onAddFilter() {
    this.searchFilters.push({ columnCode: null, filter: null, inParamId: null, filterEnd: null })
  }
  private onDeleteSearchFilter(index) {
    this.searchFilters.splice(index, 1)
  }
}
</script>

<style lang="less" scoped></style>
