<template>
  <div>
    <el-button type="primary" class="themeButton" style="width: 118px; height: 34px; background: rgba(124, 225, 170, 0.1); border-color: rgba(124, 225, 170, 0.1); border-radius: 4px; font-size: 14px; font-weight: 400; color: rgba(0, 0, 0, 1); line-height: 12px" @click="startEditTable" size="small">
      Setting InParams
    </el-button>

    <el-dialog :maskClosable="false" title="Edit" v-model="windowVisible" :destroyOnClose="true" width="900px">
      <el-table size="small" :data="localData" :pagination="false" style="height: 450px" width="100%">
        <el-table-column prop="name" label="Param Name" width="300"></el-table-column>
        <el-table-column prop="type" label="Param Type" width="300"></el-table-column>
        <el-table-column fixed="right" label="Options">
          <template #default="scope">
            <a @click="() => rowdelete(scope.row.key)">Delete</a>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button style="float: left" type="primary" @click="newParam" size="small">Add New</el-button>
          <el-button @click="modalCancel" size="small">Cancel</el-button>
          <el-button type="primary" @click="modalSure" size="small">Sure</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { getUuid, deepClone } from '@common/utils'
import propertyCellBase from '../common'
import { PropertyTypeEnum, PageInParams_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { CellSettingAttr } from '../common'
import { param, paramType } from '@design-any/interface/dist/bahaviorEngine/behavior'

@CellSettingAttr(PropertyTypeEnum.pageInParams)
@Options({})
export default class pageInParams extends propertyCellBase<PageInParams_Setting> {
  public windowVisible: boolean = false

  private localData: param[] = []

  created() {}
  mounted() {}

  private rowdelete(key: string) {
    const newData = deepClone(this.localData)
    const target = newData.filter((item) => key === item.key)[0]
    if (target) {
      const index = newData.indexOf(target)
      newData.splice(index, 1)
      this.localData = newData
    }
  }

  private async newParam() {
    var newRow = new param()
    newRow.key = getUuid()
    newRow.name = ''
    this.localData.push(newRow)
  }

  private onSelectParamClassChange() {}

  private startEditTable() {
    this.windowVisible = true
    this.localData = []
    if (!this.currentValue) {
      return
    }

    ;(this.currentValue as param[]).filter((o) => {
      var newparaminfo = new param()
      newparaminfo.key = o.key
      newparaminfo.name = o.name
      this.localData.push(newparaminfo)
    })
  }
  private modalSure() {
    //window.console.log('确认提交')
    this.windowVisible = false
    this.currentValue = deepClone(this.localData)
    this.localData = []
  }
  private modalCancel() {
    this.windowVisible = false
  }
  private handleChange(value: any, key: string, column: string) {
    const newData = deepClone(this.localData)
    const target = newData.filter((item) => key === item.key)[0]
    if (target) {
      ;(target as any)[column] = value
      this.localData = newData
    }
  }
}
</script>

<style lang="less" scoped></style>
