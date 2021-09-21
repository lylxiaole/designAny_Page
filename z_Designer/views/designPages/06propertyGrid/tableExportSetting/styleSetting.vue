<template>
  <div class="stylesettingmain">

    <!-- 列样式 -->
    <a-row style="margin-top:21px;">
      <vxe-table row-id="field" class="vxe-table--header" :data="currentTableStyle.columnInfos" :stripe="true" :resizable="true" :show-header="true"
        width="100%" height="550px" :border="true" highlight-current-row highlight-hover-row>
        <vxe-table-column type="index" width="60" background="rgba(235, 235, 235, 1);"></vxe-table-column>
        <vxe-table-column field="field" title="列名"></vxe-table-column>
        <vxe-table-column field="title" title="中文名">
          <template v-slot="{ row, rowIndex }">
            <a-input :style="{width:'95%'}" v-model="row.title" size="small" placeholder="small size" />
          </template>
        </vxe-table-column>
        <vxe-table-column field="isShow" title="是否显示">
          <template size="small" v-slot="{ row, rowIndex }">
            <a-switch v-model="row.isShow" :defaultChecked="true" checkedChildren="是" unCheckedChildren="否" @change="(e)=>onChangeIsShow(e,row)" />
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" :width="160">
          <template v-slot="{ row, rowIndex }">
            <a-row>
              <a-col :span="11">
                <a-button @click="()=>{moveUp(rowIndex)}" type="link" style="font-size:14px;">
                  <a-icon style="font-size:14px" :component="moveUpIcon" />上移
                </a-button>
              </a-col>
              <a-col :span="1" style="width:1px;height:20px;background:rgba(203,203,203,1);margin-left:10px;margin-top:3px" />
              <a-col :span="11">
                <a-button @click="()=>{moveDown(rowIndex)}" type="link">
                  <a-icon style="font-size:14px" :component="moveDownIcon" />下移</a-button>
              </a-col>
            </a-row>
          </template>
        </vxe-table-column>
      </vxe-table>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import { columnInfo, tableStyle } from '../../04designerComponents/table/tableCommonTypes'
import columnTemplateSetting from './columnTemplateSetting.vue'
import PageBase from '../../03designerLayoutBase/PageBase'
import { moveUpIco, unMoveUpIco, moveDownIco, unMoveDownIco } from '../../assets/icons.js'

@Component({
  name: 'styleSetting',
  components: {
    columnTemplateSetting: columnTemplateSetting
  }
})
export default class styleSetting extends Vue {
  isShowChildSetting: boolean = false
  private moveUpIcon: any = moveUpIco
  private unMoveUpIcon: any = unMoveUpIco
  private moveDownIcon: any = moveDownIco
  private unMoveDownIcon: any = unMoveDownIco

  @Prop() parrentTableStyle: tableStyle
  @Prop() currentTableStyle: tableStyle
  @Prop() parentPage: PageBase

  editModeOptions: any[] = [{ key: 'dblclick', value: '双击编辑' }, { key: 'manual', value: '手动编辑' }]

  @Watch('currentTableStyle', { deep: true })
  private onCurrentTableStyleChanged(newval: any) {
    //window.console.log('列样式变化了', newval)
  }
  onChangeShowIndex(value) {
    this.currentTableStyle.showIndex = value
  }
  onChangeIsShow(value, row) {
    row.isShow = value
  }
  onChangeSortable(value, row) {
    row.sortable = value
  }
  onChangeIsShowIcon(value, row) {
    row.isShowIcon = value
  }
  onChangeIsCanEdit(value, row) {
    row.isCanEdit = value
  }

  onChangeIsCanDropDown(value, row) {
    row.isCanDropDown = value
  }

  private get columnTemplateSettingRef(): columnTemplateSetting {
    return this.$refs.columnTemplateSettingRef as columnTemplateSetting
  }

  showChildSetting() {
    this.isShowChildSetting = true
  }

  onChildShowParentSetting() {
    this.isShowChildSetting = false
  }

  showParentSetting() {
    this.onShowParentSetting()
  }

  private moveUp(rowIndex: number) {
    //window.console.log('rowIndex', rowIndex)
    if (rowIndex < 1) {
      return
    }
    let source = Object.assign(this.currentTableStyle.columnInfos[rowIndex])
    let target = Object.assign(this.currentTableStyle.columnInfos[rowIndex - 1])
    this.currentTableStyle.columnInfos[rowIndex - 1] = source
    this.currentTableStyle.columnInfos[rowIndex] = target
    let temp = Object.assign(this.currentTableStyle.columnInfos)
    this.currentTableStyle.columnInfos = []
    this.$nextTick(() => {
      this.currentTableStyle.columnInfos = temp
    })
  }
  private moveDown(rowIndex: number) {
    if (rowIndex >= this.currentTableStyle.columnInfos.length - 1) {
      return
    }
    let source = Object.assign(this.currentTableStyle.columnInfos[rowIndex])
    let target = Object.assign(this.currentTableStyle.columnInfos[rowIndex + 1])
    this.currentTableStyle.columnInfos[rowIndex] = target
    this.currentTableStyle.columnInfos[rowIndex + 1] = source
    this.currentTableStyle.columnInfos = this.currentTableStyle.columnInfos
    let temp = Object.assign(this.currentTableStyle.columnInfos)
    this.currentTableStyle.columnInfos = []
    this.$nextTick(() => {
      this.currentTableStyle.columnInfos = temp
    })
  }
  @Emit('onShowParentSetting')
  onShowParentSetting() {}
}
</script>



<style scoped lang="less">
.stylesettingmain .ant-row {
  margin-bottom: 5px;
}
.vxe-table {
  /* position: relative; */
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 18px;
  /* font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, \\5fae\8f6f\96c5\9ed1, Arial, sans-serif; */
  // background: rgba(235, 235, 235, 1);
}
.ant-input {
  width: 80px;
  height: 28px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(217, 217, 217, 1);
}
/deep/.vxe-header--row {
  background: rgba(235, 235, 235, 1);
}
/deep/.ant-select-sm .ant-select-selection__rendered {
  line-height: 32px;
}
/deep/.ant-select-sm .ant-select-selection--single {
  height: 32px !important;
}
</style>