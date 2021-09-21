<template>
  <div class="stylesettingmain">
    <a-row v-if="parrentTableStyle&&isShowChildSetting==false">
      <a href="#" v-if="isShowChildSetting==false" @click="showParentSetting">设置上一级表格</a>
    </a-row>
    <!-- 表格样式 -->
    <a-row v-if="!parrentTableStyle &&isShowChildSetting==false">
      <!-- <a-col :span="3"> </a-col> -->
      <a-col :span="2" style="font-size:14px;font-weight:400;color:rgba(0,0,0,0.85);line-height:32px;">行编辑模式:</a-col>
      <a-col :span="4">
        <a-select size="small" v-model="currentTableStyle.editMode" style="width:350px;">
          <a-select-option v-for="item in editModeOptions" :key="item.key" :value="item.key">
            <span style="display: inline-block;width: 100%">{{item.value}}</span>
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3"> </a-col>
      <a-col :span="2" style="font-size:14px;font-weight:400;color:rgba(0,0,0,0.85);line-height:32px;">是否显示序号:</a-col>
      <a-col :span="3">
        <a-switch v-model="currentTableStyle.showIndex" :defaultChecked="true" checkedChildren="是" unCheckedChildren="否"
          @change="onChangeShowIndex" />
      </a-col>
      <a-col :span="2"> </a-col>
      <a-col :span="2" style="font-size:14px;font-weight:400;color:rgba(0,0,0,0.85);line-height:32px;">标识子节点字段:</a-col>
      <a-col :span="2">
        <a-select size="small" v-model="currentTableStyle.hasChildTag" style="width:300px;">
          <a-select-option v-for="item in currentTableStyle.columnInfos" :key="item.field" :value="item.field">
            <span v-if="item.field != 'action'" style="display: inline-block;width: 100%">{{item.title}}</span>
          </a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <a-row v-if="!parrentTableStyle &&isShowChildSetting==false" style="margin-top:26px">
      <a-col :span="2">排序字段</a-col>
      <a-col :span="4">
        <a-select size="small" v-model="currentTableStyle.orderCode" style="width:350px">
          <a-select-option v-for="item in currentTableStyle.columnInfos" :key="item.field" :value="item.field">
            <span v-if="item.field != 'action'" style="display: inline-block;width: 100%">{{item.title}}</span>
          </a-select-option>
        </a-select>
      </a-col>
      <a-col :span="3"> </a-col>
      <a-col :span="2">排序规则</a-col>
      <a-col :span="3">
        <a-radio-group v-model="currentTableStyle.orderType">
          <a-radio :value="true">升序</a-radio>
          <a-radio :value="false">降序</a-radio>
        </a-radio-group>
      </a-col>
      <a-col :span="2"> </a-col>
      <a-col :span="2" style="font-size:14px;font-weight:400;color:rgba(0,0,0,0.85);line-height:32px;">是否tab内表格:</a-col>
      <a-col :span="3">
        <a-switch v-model="currentTableStyle.isTabInner" :defaultChecked="true" checkedChildren="是" unCheckedChildren="否"
          @change="onChangeInnerTab" />
      </a-col>
    </a-row>
    <a-row v-if="parrentTableStyle&&isShowChildSetting==false" style="margin-top:26px">
      <a-col :span="2"> </a-col>
      <a-col :span="2">是否显示序号</a-col>
      <a-col :span="3">
        <a-radio-group v-model="currentTableStyle.showIndex">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-col>
      <a-col :span="3"> </a-col>
      <a-col :span="2">是否可勾选</a-col>
      <a-col :span="3">
        <a-radio-group v-model="currentTableStyle.isCanCheck">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
    <!-- /***** -->

    <!-- 列样式 -->
    <a-row v-if="isShowChildSetting==false" style="margin-top:21px;">
      <vxe-table row-id="field" class="vxe-table--header" :data="currentTableStyle.columnInfos" :stripe="true" :resizable="true" :show-header="true"
        width="100%" height="450px" :border="true" highlight-current-row highlight-hover-row>
        <vxe-table-column type="index" width="60" background="rgba(235, 235, 235, 1);"></vxe-table-column>
        <vxe-table-column field="field" title="列名"></vxe-table-column>
        <vxe-table-column field="title" title="中文名">
          <template v-slot="{ row, rowIndex }">
            <a-input :style="{width:'95%'}" v-model="row.title" size="small" placeholder="small size" />
          </template>
        </vxe-table-column>
        <vxe-table-column field="width" title="列宽">
          <template v-slot="{ row, rowIndex }">
            <a-input size="small" :min="1" v-model="row.width" />
          </template>
        </vxe-table-column>
        <vxe-table-column field="formatString" title="格式化">
          <template v-slot="{ row, rowIndex }">
            <a-input size="small" v-model="row.formatString" />
          </template>
        </vxe-table-column>
        <!-- <vxe-table-column field="fixed" title="列固定">
          <template v-slot="{ row, rowIndex }">
            <a-select size="small" v-model="row.fixed" style="width:60px">
              <a-select-option value="none">不固定</a-select-option>
              <a-select-option value="left">左固定</a-select-option>
              <a-select-option value="right">右固定</a-select-option>
            </a-select>
          </template>
        </vxe-table-column> -->
        <vxe-table-column field="isShow" title="是否显示">
          <template size="small" v-slot="{ row, rowIndex }">
            <a-switch v-model="row.isShow" :defaultChecked="true" checkedChildren="是" unCheckedChildren="否" @change="(e)=>onChangeIsShow(e,row)" />
            <!-- <a-radio-group v-model="row.isShow">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group> -->
          </template>
        </vxe-table-column>
        <vxe-table-column field="sortable" title="是否可排序">
          <template size="small" v-slot="{ row, rowIndex }">
            <a-switch v-model="row.sortable" :defaultChecked="false" checkedChildren="是" unCheckedChildren="否"
              @change="(e)=>onChangeSortable(e,row)" />
            <!-- <a-radio-group v-model="row.sortable">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group> -->
          </template>
        </vxe-table-column>
        <vxe-table-column field="isShowIcon" title="是否展示图标">
          <template size="small" v-slot="{ row, rowIndex }">
            <a-switch v-model="row.isShowIcon" :defaultChecked="false" checkedChildren="是" unCheckedChildren="否"
              @change="(e)=>onChangeIsShowIcon(e,row)" />
            <!-- <a-radio-group v-model="row.isShowIcon">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group> -->
          </template>
        </vxe-table-column>
        <vxe-table-column field="isCanEdit" title="是否可编辑">
          <template size="small" v-slot="{ row, rowIndex }">
            <a-switch v-model="row.isCanEdit" :defaultChecked="false" checkedChildren="是" unCheckedChildren="否"
              @change="(e)=>onChangeIsCanEdit(e,row)" />
            <!-- <a-radio-group v-model="row.isCanEdit" :style="{display:row.field === 'action'?'none':''}">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group> -->
          </template>
        </vxe-table-column>
        <vxe-table-column field="isCanDropDown" title="是否显示下拉">
          <template size="small" v-slot="{ row, rowIndex }">
            <a-switch v-model="row.isCanDropDown" :defaultChecked="false" checkedChildren="是" unCheckedChildren="否"
              @change="(e)=>onChangeIsCanDropDown(e,row)" />
          </template>
        </vxe-table-column>
        <!-- <vxe-table-column field="fixed" title="是否固定">
          <template size="small" v-slot="{ row, rowIndex }">
            <a-radio-group v-model="row.fixed">
              <a-radio :value="0">否</a-radio>
              <a-radio :value="1">左</a-radio>
              <a-radio :value="2">右</a-radio>
            </a-radio-group>
          </template>
        </vxe-table-column> -->
        <vxe-table-column field="colTemplateData" title="列模板">
          <template size="small" v-slot="{ row, rowIndex }">
            <columnTemplateSetting :rowHeight.sync="row.colTemplateHeight" :layoutData.sync="row.colTemplateData" ref="columnTemplateSettingRef"
              :style="{height:'100%',width:'100%',display:row.field === 'action'?'':'none'}" :parentPage="parentPage" />
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
    <!-- 设置子级table -->
    <a-row v-if="currentTableStyle.child" style="margin-top:10px;">
      <a href="#" v-if="isShowChildSetting==false" @click="showChildSetting">设置子表格</a>
      <styleSetting v-if="isShowChildSetting==true" :currentTableStyle="currentTableStyle.child" :parrentTableStyle="currentTableStyle"
        @onShowParentSetting="onChildShowParentSetting" :parentPage="parentPage">
      </styleSetting>
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
    columnTemplateSetting: columnTemplateSetting,
  },
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
  onChangeInnerTab(value) {
    this.currentTableStyle.isTabInner = value
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