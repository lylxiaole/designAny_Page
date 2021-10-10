/**
 * 页面入参设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <el-button type="primary" class="themeButton" :icon="pageicon"
      style="width:118px;height:34px;background:rgba(124,225,170,0.1);border-color:rgba(124,225,170,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEditTable" size="small"> 设置入参</el-button>

    <el-dialog :maskClosable="false" title="编辑" :visible.sync="windowVisible" :destroyOnClose="true" width="900px">
      <el-table size="small" :columns="columns" :dataSource="data" :pagination="false" style="height:450px;" :scroll="{ y: 420 }">
        <el-table-column prop="paramName" label="入参名称" width="300">
        </el-table-column>
        <el-table-column prop="paramType" label="入参类型" width="300">
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <a @click="() => rowdelete(scope.row.key)">删除</a>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
        <el-button style="float:left" type="primary" @click="newParam" size="small">新增</el-button>
        <el-button @click="modalCancel" size="small">取消</el-button>
        <el-button type="primary" @click="modalSure" size="small">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import { paramInfo } from '@src/designEngine'
import propertyCellBase from '../common'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'
import { pageInParamsIco } from '@src/designEngine/assets/icons.js'

@propertyCellTypeAttr(PropertyTypeEnum.pageInParams)
@Component
export default class pageInParams extends propertyCellBase {
  public windowVisible: boolean = false
  private pageicon: any

  private columns: any[] = [
    {
      title: '入参名称',
      dataIndex: 'paramName',
      scopedSlots: { customRender: 'paramName' },
      width: '30%'
    },
    {
      title: '入参类型',
      dataIndex: 'paramType',
      scopedSlots: { customRender: 'paramType' },
      width: '40%'
    },
    {
      title: '集合/单模',
      dataIndex: 'paramIsList',
      scopedSlots: { customRender: 'paramIsList' },
      width: '20%'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      width: '10%'
    }
  ]

  private data: paramInfo[] = []

  created() {
    this.pageicon = pageInParamsIco
  }
  mounted() {}

  private rowdelete(key: string) {
    const newData = [...this.data]
    const target = newData.filter((item) => key === item.key)[0]
    if (target) {
      const index = newData.indexOf(target)
      newData.splice(index, 1)
      this.data = newData
    }
  }

  private async newParam() {
    var newRow = new paramInfo()
    newRow.key = getUuid()
    newRow.paramName = ''
    newRow.paramType = 1

    newRow.paramIsList = false
    this.data.push(newRow)
  }

  private onSelectParamClassChange() {}

  private startEditTable() {
    this.windowVisible = true
    this.data = []
    if (!this.currentValue) {
      return
    }

    ;(this.currentValue as paramInfo[]).filter((o) => {
      var newparaminfo = new paramInfo()
      newparaminfo.key = o.key
      newparaminfo.paramName = o.paramName
      newparaminfo.paramType = o.paramType
      newparaminfo.paramIsList = o.paramIsList
      this.data.push(newparaminfo)
    })
  }
  private modalSure() {
    //window.console.log('确认提交')
    this.windowVisible = false
    this.currentValue = deepClone(this.data)
    this.data = []
  }
  private modalCancel() {
    this.windowVisible = false
  }
  private handleChange(value: any, key: string, column: string) {
    const newData = [...this.data]
    const target = newData.filter((item) => key === item.key)[0]
    if (target) {
      ;(target as any)[column] = value
      this.data = newData
    }
  }
}
</script>

 
<style lang="less" scoped>
</style>