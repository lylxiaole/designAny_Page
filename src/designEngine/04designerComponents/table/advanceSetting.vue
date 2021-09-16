<template>
  <geno-modal :maskClosable="false" title="列表设置" :destroyOnClose="true" v-model="tableStyleSettingVisible" :height="600" :width="825"
    @ok="handleOk" @cancel="handleCancel" cancelText="取消" okText="确定" :okButtonProps="{ props: {icon: 'check'}}"
    :cancelButtonProps="{ props: {icon: 'close'}}">
    <div style="height:600px;overflow:hidden">
      <div class="stylesettingmain">
        <div class="table-operator">
          <AreaTitle :title='title'></AreaTitle>
          <a-input-search placeholder="搜索" style="width: 200px;float:right" @search="onSearch" />
        </div>
        <!-- 列样式 -->
        <a-row style="">
          <vxe-table row-id="field" class="vxe-table--header" :data="columnInfos" :stripe="true" :resizable="true" :show-header="true"
            width="100%" height="550px" :border="true" highlight-current-row highlight-hover-row ref="configTable" @select-change="selectChange"
            @select-all="selectChange">
            <vxe-table-column type="index" width="60" title="序号" background="rgba(235, 235, 235, 1);"></vxe-table-column>            
            <vxe-table-column field="title" title="字段列" width="150">
              <!-- <template v-slot="{ row, rowIndex }">
                <a-input :style="{width:'95%'}" v-model="row.title" size="small" placeholder="small size" />
              </template> -->
            </vxe-table-column>
            <vxe-table-column type="selection" width="80" title="显示" align="center" header-align="left"></vxe-table-column>
            <!-- <vxe-table-column title="显示" width="80">
              <template v-slot="{ row, rowIndex }">
                <a-checkbox v-model="row.isShow"></a-checkbox>
              </template>              
            </vxe-table-column> -->
            <vxe-table-column field="width" title="宽度">
              <template v-slot="{ row, rowIndex }">
                <a-input size="small" :min="1" v-model="row.width" />
              </template>
            </vxe-table-column>
            <vxe-table-column title="操作" :width="110">
              <template v-slot="{ row, rowIndex }">
                <a-row>
                  <a-col :span="8">
                    <a-button @click="()=>{moveUp(rowIndex)}" type="link" style="font-size:14px;">
                      <a-icon style="font-size:14px" :component="moveUpIcon" />
                    </a-button>
                  </a-col>
                  <a-col :span="1" style="width:1px;height:20px;background:rgba(203,203,203,1);margin-left:15px;margin-top:3px" />
                  <a-col :span="8">
                    <a-button @click="()=>{moveDown(rowIndex)}" type="link">
                      <a-icon style="font-size:14px" :component="moveDownIcon" />                      
                    </a-button>
                  </a-col>
                </a-row>
              </template>
            </vxe-table-column>
            <vxe-table-column title="选择排序">
              <template size="small" v-slot="{ row, rowIndex }">
                <a-select size="small" v-model="row.orderType" style="width:100px;" allowClear @change="()=>selectOrderType(row)">
                  <a-select-option v-for="item in sortTypeOptions" :key="item.key" :value="item.key">
                    <span style="display: inline-block;width: 100%">{{item.value}}</span>
                  </a-select-option>
                </a-select>
              </template>
            </vxe-table-column>
            <vxe-table-column title="排序优先级">
              <template v-slot="{ row, rowIndex }">
                <a-input size="small" v-model="row.orderIndex" @change="()=>{changeOrderIdx(row)}"/>
              </template>
            </vxe-table-column>
          </vxe-table>
        </a-row>
      </div>
    </div>
  </geno-modal>  
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import { columnInfo, tableStyle,personTableColumn } from '../../04designerComponents/table/tableCommonTypes'
import PageBase from '../../05designerLayouts/PageBase'
import { moveUpIco, unMoveUpIco, moveDownIco, unMoveDownIco } from '../../assets/icons.js'
import { AreaTitle } from '@/components'
import {forOf} from "xe-utils/methods";

@Component({
  name: 'advanceSetting',
  components: {
    AreaTitle
  },
})
export default class advanceSetting extends Vue {
  isShowChildSetting: boolean = false
  private moveUpIcon: any = moveUpIco
  private unMoveUpIcon: any = unMoveUpIco
  private moveDownIcon: any = moveDownIco
  private unMoveDownIcon: any = unMoveDownIco

  private tableStyleSettingVisible: boolean = false
  columnInfos: personTableColumn[] = []
  @Prop() parentPage: PageBase
  title:string=''
  allColumnInfos: personTableColumn[] = []


  sortTypeOptions: any[] = [{ key: 1, value: '升序' }, { key: 2, value: '降序' }]

  @Watch('currentTableStyle', { deep: true })
  private onCurrentTableStyleChanged(newval: any) {
    //window.console.log('列样式变化了', newval)
  }

  view(columns){
    let tempColumn = common.clone(columns)      
    this.columnInfos = tempColumn.filter(item=>item.field != 'action')
    this.allColumnInfos = common.clone(this.columnInfos)

    window.console.log('-------------xxxxxxxxxxxxxxxxxxxxxxxxxxthis.columnInfos',this.columnInfos)
    let showCol = this.columnInfos.filter(item=>item.isShow == true)
    this.title = '显示隐藏列（'+ showCol.length+'/'+this.columnInfos.length+'）'
    this.$nextTick(()=>{
      ;(this.$refs.configTable as any).setSelection(showCol, true)
    })    
    this.tableStyleSettingVisible = true
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

  showChildSetting() {
    this.isShowChildSetting = true
  }

  onChildShowParentSetting() {
    this.isShowChildSetting = false
  }

  private moveUp(rowIndex: number) {
    //window.console.log('rowIndex', rowIndex)
    if (rowIndex < 1) {
      return
    }
    let source = Object.assign(this.columnInfos[rowIndex])
    let target = Object.assign(this.columnInfos[rowIndex - 1])
    this.columnInfos[rowIndex - 1] = source
    this.columnInfos[rowIndex] = target
    let temp = common.clone(this.columnInfos)        
    //this.columnInfos = []
    this.$nextTick(() => {
      this.columnInfos = temp
    })
  }

  private moveDown(rowIndex: number) {    
    if (rowIndex >= this.columnInfos.length - 1) {
      return
    }    
    let source = Object.assign(this.columnInfos[rowIndex])
    let target = Object.assign(this.columnInfos[rowIndex + 1])
    this.columnInfos[rowIndex] = target
    this.columnInfos[rowIndex + 1] = source
    //this.columnInfos = this.columnInfos
    let temp = common.clone(this.columnInfos)        
    this.$nextTick(() => {      
      this.columnInfos = temp
    })
    //this.columnInfos = temp
  }

  private showTableStyleSettingModal() {
    //this.currentTableStyle = common.clone(this.currentValue)
    this.tableStyleSettingVisible = true
  }
  private handleOk() {
    //this.currentValue = common.clone(this.currentTableStyle)        
    //this.currentValue.columnInfos = []
    //保存列配置数据
    //let temp = (this.$refs.configTable as any).getSelectRecords()        
    
    //window.console.error('------------------保存列',this.columnInfos)
    //window.console.error('------------------保存列temp',temp)
    this.$emit('ok', this.allColumnInfos)
    this.tableStyleSettingVisible = false
  }
  private handleCancel() {
    this.tableStyleSettingVisible = false
  }

  onSearch(e){    
    //搜索完成之后，拿现有数据跟备份数据进行关联更新
    //this.allColumnInfos
    this.columnInfos.forEach(item=>{
      let idx = this.allColumnInfos.findIndex(element=>element.field == item.field)
      if (idx > -1){
        this.allColumnInfos[idx] = item
      }
    })
    window.console.error('------------------查询列this.allColumnInfos',this.allColumnInfos)    
    this.columnInfos = this.allColumnInfos.filter(item=>item.title.indexOf(e) > -1)
    this.$nextTick(()=>{
      let showCol = (this.$refs.configTable as any).getSelectRecords()
      this.title = '显示隐藏列（'+ showCol.length+'/'+this.columnInfos.length+'）'
    })    
  }

  selectChange(){
    window.console.log('-----------------选择列显示隐藏')
    let showCol = (this.$refs.configTable as any).getSelectRecords()
    this.title = '显示隐藏列（'+ showCol.length+'/'+this.columnInfos.length+'）'
    this.columnInfos.forEach(item=>{
      let idx = showCol.findIndex(element=>element.field == item.field)
      if (idx > -1){
        item.isShow = true
      }
      else{
        item.isShow = false
      }
    })
    this.allColumnInfos.forEach(item=>{
      let idx = showCol.findIndex(element=>element.field == item.field)
      if (idx > -1){
        item.isShow = true
      }
      else{
        item.isShow = false
      }
    })
  }

  //选择排序方式
  selectOrderType(row){
    for (let item of this.allColumnInfos) {
      if (item.field == row.field){
        item.orderType = row.orderType
        break
      }
    }
  }

  //选择排序顺序
  changeOrderIdx(row){
    // let idx = this.allColumnInfos.findIndex(element=>element.field == row.field)
    // if (idx > -1){
    //   this.allColumnInfos[idx].orderType = row.orderType
    // }
    for (let item of this.allColumnInfos) {
      if (item.field == row.field){
        item.orderIndex = row.orderIndex
        break
      }
    }
  }
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
/deep/.vxe-checkbox>input:checked+.vxe-checkbox--icon+.vxe-checkbox--label {
    color: black !important;
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