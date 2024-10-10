<template>
  <div>
    <el-button type="primary" class="themeButton" style="width: 118px; height: 34px; background: rgba(124, 225, 170, 0.1); border-color: rgba(124, 225, 170, 0.1); border-radius: 4px; font-size: 14px; font-weight: 400; color: rgba(0, 0, 0, 1); line-height: 12px" @click="startEditTable" size="small">
      Setting Columns
    </el-button>

    <el-dialog :maskClosable="false" title="Edit" v-model="windowVisible" :destroyOnClose="true" width="900px">
      <el-table size="small" :data="localData" :pagination="false" style="height: 450px" width="100%">
        <el-table-column prop="title" label="Column Name" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.title" size="small"></el-input>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="field" label="Filed" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.field" size="small"></el-input>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="type" label="Column Type" width="150">
          <template #default="scope">
            <el-select v-model="scope.row.type" placeholder="Select" size="small" style="width: 100%">
              <el-option key="0" label="Text" value="" />
              <el-option key="1" label="Index" value="seq" />
              <el-option key="2" label="Check Box" value="checkbox" />
              <el-option key="3" label="Radio Box" value="radio" />
              <el-option key="4" label="Expander" value="expand" />
            </el-select>
          </template>
        </el-table-column>

        <!-- ********************* -->
        <el-table-column prop="isShow" label="Display" width="150">
          <template #default="scope">
            <el-switch v-model="scope.row.isShow" size="small"></el-switch>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column fixed="right" label="Options">
          <template #default="scope">
            <el-button size="small" @click="() => rowdelete(scope.row.key)">Delete</el-button>
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
    newRow.title = 'New Params'
    newRow.isShow = true
    this.localData.push(newRow)
  }
  private rowdelete(key: string) {
    const newData = deepClone(this.localData)
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

<style scoped></style>
