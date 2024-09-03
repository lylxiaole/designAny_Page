/**
 * 文本设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <el-button type="primary" class="themeButton"
      style="width:118px;height:34px;background:rgba(124,225,170,0.1);border-color:rgba(124,225,170,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEditTable" size="small">设置列</el-button>

    <el-dialog :maskClosable="false" title="编辑" v-model="windowVisible" :destroyOnClose="true" width="900px">
      <el-table size="small" :data="localData" :pagination="false" style="height:450px;" width="100%">
        <el-table-column prop="title" label="列名" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.title" size="small"></el-input>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="field" label="字段名" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.field" size="small"></el-input>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="type" label="列类型" width="150">
          <template #default="scope">
            <el-select v-model="scope.row.type" placeholder="Select" size="small" style="width: 100%">
              <el-option key="0" label="文字" value="" />
              <el-option key="1" label="序号" value="seq" />
              <el-option key="2" label="复选框" value="checkbox" />
              <el-option key="3" label="单选框" value="radio" />
              <el-option key="4" label="展开行" value="expand" />
            </el-select>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="isShow" label="是否显示" width="150">
          <template #default="scope">
            <el-switch v-model="scope.row.isShow" size="small"></el-switch>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="isShow" label="是否显示" width="150">
          <template #default="scope">
            <el-switch v-model="scope.row.isShow" size="small"></el-switch>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button size="small" @click="() => rowdelete(scope.row.key)">删除</el-button>
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
import propertyCellBase from '../common'
import { PropertyTypeEnum, TableColumn_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { CellSettingAttr } from '../common'
import { getUuid, deepClone } from '@common/utils'

class columnConfig {
  public key: string
  public type: string
  public title: string
  public field: string
  public isShow: boolean
}

@CellSettingAttr(PropertyTypeEnum.tableColumn)
@Options({})
export default class index extends propertyCellBase<TableColumn_Setting> {
  public windowVisible: boolean = false
  private localData: columnConfig[] = []

  mounted() {}

  private startEditTable() {
    this.windowVisible = true
    this.localData = this.currentValue
  }
  // ***********************************
  private async newParam() {
    var newRow = new columnConfig()
    newRow.key = getUuid()
    newRow.title = '新建'
    newRow.isShow = true
    this.localData.push(newRow)
  }
  private rowdelete(key: string) {
    const newData = [...this.localData]
    const target = newData.filter((item) => key === item.key)[0]
    if (target) {
      const index = newData.indexOf(target)
      newData.splice(index, 1)
      this.localData = newData
    }
  }
  // ***********************************
  private modalSure() {
    //window.console.log('确认提交')
    this.windowVisible = false
    this.currentValue = deepClone(this.localData)
    this.localData = []
  }
  private modalCancel() {
    this.windowVisible = false
  }
}
</script>



<style scoped>
</style>