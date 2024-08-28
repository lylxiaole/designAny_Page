/**
 * 页面入参设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <el-button type="primary" class="themeButton"
      style="width:118px;height:34px;background:rgba(124,225,170,0.1);border-color:rgba(124,225,170,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEditTable" size="small"> 设置入参</el-button>

    <el-dialog :maskClosable="false" title="编辑" v-model="windowVisible" :destroyOnClose="true" width="900px">
      <el-table size="small" :data="localData" :pagination="false" style="height:450px;" width="100%">
        <el-table-column prop="name" label="入参名称" width="300">
        </el-table-column>
        <el-table-column prop="type" label="入参类型" width="300">
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <a @click="() => rowdelete(scope.row.key)">删除</a>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button style="float:left" type="primary" @click="newParam" size="small">新增</el-button>
          <el-button @click="modalCancel" size="small">取消</el-button>
          <el-button type="primary" @click="modalSure" size="small">确定</el-button>
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
import { PropertyTypeEnum, PageInParams_Setting } from '@design-any/interface/dist'
import { CellSettingAttr } from '../common'
import { param, paramType } from '@behaviorEngine/index'

@CellSettingAttr(PropertyTypeEnum.pageInParams)
@Options({})
export default class pageInParams extends propertyCellBase<PageInParams_Setting> {
  public windowVisible: boolean = false

  private localData: param[] = []

  created() {}
  mounted() {}

  private rowdelete(key: string) {
    const newData = [...this.localData]
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
    newRow.type = paramType.string
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
      newparaminfo.type = o.type
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
    const newData = [...this.localData]
    const target = newData.filter((item) => key === item.key)[0]
    if (target) {
      ;(target as any)[column] = value
      this.localData = newData
    }
  }
}
</script>

 
<style lang="less" scoped>
</style>