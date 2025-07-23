<template>
  <el-row style="width: 100%; height: 100%">
    <!-- ********************************************* -->
    <el-row style="width:100%">
      <el-col :span="6">数据库:</el-col>
      <el-col :span="18">
        <el-select v-model="selectedDbId" placeholder="Select" size="small" style="width: 100%">
          <el-option v-for="db in allDatabases" :key="db.id" :label="db.databaseName" :value="db.id" />
        </el-select>
      </el-col>
    </el-row>
    <!-- ********************************************* -->
    <el-row style="width:100%">
      <el-col :span="6">表:</el-col>
      <el-col :span="18">
        <el-select v-model="selectedTableId" placeholder="Select" size="small" style="width: 100%">
          <el-option v-for="tab in allTables" :key="tab.tableId" :label="tab.tableName" :value="tab.tableId" />
        </el-select>
      </el-col>
    </el-row>
    <!-- ********************************************* -->
  </el-row>
</template>

<script lang="ts">
import { inject, watch } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@design-any/interface/dist/bahaviorEngine/actObject'
import { flowDesignNode } from '../../flowTypes'
import { funcCode } from '@design-any/interface/dist/bahaviorEngine/actFunc'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { makeParamKey } from '@behaviorEngine/flowDesigner/common'

@flowDesignNode(funcCode.dataBaseUpdateOpt, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class dataBaseUpdateOptNode extends Vue {
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
  // ********表********************************************
  private selectedTableId: string = null
  private get allTables() {
    return this.selectedDb ? this.selectedDb.tables : []
  }
  // *****************************************************
  mounted() {
    this.initData()
  }
  private async initData() {
    //
    this.allDatabases = await behaviorContext.getAllDatabases()
    this.selectedDbId = this.actObj.resourceFilter.dbId
    this.selectedTableId = this.actObj.resourceFilter.tableId
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
    if (!newVal) {
      this.actObj.inputParams = []
      this.actObj.outParam = null
      return
    } else {
      this.actObj.inputParams = []
      this.actObj.inputParams.push({ key: makeParamKey(this.actObj.id, 'indata'), name: '新增数据' })
      this.actObj.outParam = { key: makeParamKey(this.actObj.id, 'output'), name: '返回结果' }
    }
  }
}
</script>

<style lang="less" scoped></style>
