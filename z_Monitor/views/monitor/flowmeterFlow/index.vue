<template>
  <div style="height:100%;width:100%;display:flex;flex-wrap:nowrap">
    <div style="height:100%;width:280px;overflow:auto">
      <el-tree :data="flowTreeData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
    </div>
    <div style="height:100%;width:calc(100% - 280px)">
      <el-tabs v-model="tabActiveName" @tab-click="handleTabClick">
        <el-tab-pane label="流程图" name="first">
          <flowmeterView />
        </el-tab-pane>
        <el-tab-pane label="表格" name="second">
          <flowmeterTable />
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import PageBase from '@src/views/PageBase'
import { jkzl, jlbjk, appTokenValidate } from '../../../serviceAPIs/service'
import { Route } from 'vue-router'
import flowmeterTable from './flowmeterTable.vue'
import flowmeterView from './flowmeterView.vue'

// *****************************************************************
/***物料流程流量计 */
@Component({
  components: {
    flowmeterView,
    flowmeterTable
  }
})
export default class Index extends PageBase {
  // *************Tree****************************************
  private flowTreeData: any[] = [
    {
      label: '位置流程',
      children: [
        {
          label: '炼油厂柴油'
        },
        {
          label: '乙烯'
        },
        {
          label: '汽油'
        },
        {
          label: '油品'
        }
      ]
    }
  ]
  private defaultProps: any = {
    children: 'children',
    label: 'label'
  }
  private async handleNodeClick(data) {
    console.log(data)
  }
  // *************Tabs****************************************
  private tabActiveName: string = 'first'
  handleTabClick(tab, event) {
    console.log(tab, event)
  }
  // ********************************************************************************
  mounted() {}
  // ***************底部Tab*********************************************
}
</script>
<style scoped>
</style>
