<template>
  <div>
    <el-button type="primary" class="themeButton"
      style="width: 118px; height: 34px; background: rgba(124, 225, 170, 0.1); border-color: rgba(124, 225, 170, 0.1); border-radius: 4px; font-size: 14px; font-weight: 400; color: rgba(0, 0, 0, 1); line-height: 12px"
      @click="startEditTable" size="small">
      {{$t('tip.SettingColumns')}}
    </el-button>

    <el-dialog :maskClosable="false" title="Edit" v-model="windowVisible" :destroyOnClose="true" width="900px">
      <el-table size="small" :data="localData" :pagination="false" style="height: 450px" width="100%">
        <el-table-column prop="title" :label="$t('tip.ColumnName')" width="120">
          <template #default="scope">
            <el-input v-model="scope.row.title" size="small"></el-input>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="field" :label="$t('tip.Filed')" width="120">
          <template #default="scope">
            <el-input v-model="scope.row.field" size="small"></el-input>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="width" :label="$t('tip.Width')" width="120">
          <template #default="scope">
            <el-input v-model="scope.row.width" size="small"></el-input>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="type" :label="$t('tip.ColumnType')" width="120">
          <template #default="scope">
            <el-select v-model="scope.row.type" placeholder="" size="small" style="width: 100%">
              <el-option key="0" label="Text" value="text" />
              <el-option key="1" label="Index" value="seq" />
              <el-option key="2" label="Check Box" value="checkbox" />
              <el-option key="3" label="Radio Box" value="radio" />
              <el-option key="4" label="Expander" value="expand" />
              <el-option key="5" label="Image" value="image" />
              <el-option key="6" label="Template" value="template" />
            </el-select>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="isShow" :label="$t('tip.Display')" width="80">
          <template #default="scope">
            <el-switch v-model="scope.row.isShow" size="small"></el-switch>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column prop="template" :label="$t('tip.ColumnTemplate')" width="80">
          <template #default="scope">
            <el-button v-if="scope.row.type === 'template'" size="small"
              @click="() => settingColTemplate(scope.row.key)">{{$t('tip.Setting')}}</el-button>
          </template>
        </el-table-column>
        <!-- ********************* -->
        <el-table-column fixed="right" :label="$t('tip.options')">
          <template #default="scope">
            <el-icon style="margin: 0px 5px; cursor: pointer" @click="() => rowMoveDown(scope.row.key)">
              <Download />
            </el-icon>
            <el-icon style="margin: 0px 5px; cursor: pointer" @click="() => rowMoveUp(scope.row.key)">
              <Upload />
            </el-icon>
            <el-icon style="margin: 0px 5px; cursor: pointer" @click="() => rowdelete(scope.row.key)">
              <Delete />
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <div class="dialog-footer">
          <el-button style="float: left" type="primary" @click="newParam" size="small">{{$t('opts.addNew')}}</el-button>
          <el-button @click="modalCancel" size="small">{{$t('opts.cancel')}}</el-button>
          <el-button type="primary" @click="modalSure" size="small">{{$t('opts.sure')}}</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- ************************************************************** -->
    <tableColumnTemplateDesign ref="tableColumnTemplateDesign" @onSure="onTableColumnTemplateDesignSure" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import propertyCellBase from '../common'
import { PropertyTypeEnum, TableColumn_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { SaveInfo } from '@design-any/interface/dist/LayoutInterface/EngineLayout'

import { CellSettingAttr } from '../common'
import { getUuid, deepClone } from '@common/utils'
import tableColumnTemplateDesign from './tableColumnTemplateDesign/index.vue'
class columnConfig {
  public width: string
  public key: string
  public type: string
  public title: string
  public field: string
  public isShow: boolean
  public template: SaveInfo
}

@CellSettingAttr(PropertyTypeEnum.tableColumn)
@Options({ components: { tableColumnTemplateDesign } })
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
    newRow.width = 'auto'
    newRow.title = 'New Params'
    newRow.isShow = true
    newRow.type = 'text'
    this.localData.push(newRow)
  }
  private rowdelete(key: string) {
    const newData = deepClone(this.localData)
    const target = newData.find((item) => key === item.key)
    if (target) {
      const index = newData.indexOf(target)
      newData.splice(index, 1)
      this.localData = newData
    }
  }
  private rowMoveUp(key: string) {
    let targetIndex = this.localData.findIndex((item) => key === item.key)
    if (targetIndex === 0) {
      return
    }
    let newIndex = targetIndex - 1
    this.swapArrayElements(this.localData, targetIndex, newIndex)
  }
  private rowMoveDown(key: string) {
    let targetIndex = this.localData.findIndex((item) => key === item.key)
    if (targetIndex === this.localData.length - 1) {
      return
    }
    let newIndex = targetIndex + 1
    this.swapArrayElements(this.localData, targetIndex, newIndex)
  }
  private swapArrayElements(arr, indexA, indexB) {
    const temp = arr[indexA]
    arr[indexA] = arr[indexB]
    arr[indexB] = temp
  }
  private async settingColTemplate(key: string) {
    let target = this.localData.find((item) => key === item.key)
    await (this.$refs.tableColumnTemplateDesign as tableColumnTemplateDesign).show(key, target.template, this.currentLayouts[0] as any, this.page)
  }
  private onTableColumnTemplateDesignSure(columnKey: string, data: SaveInfo) {
    let target = this.localData.find((item) => columnKey === item.key)
    target.template = data
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
