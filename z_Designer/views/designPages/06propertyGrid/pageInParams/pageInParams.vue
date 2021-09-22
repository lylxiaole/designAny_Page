/**
 * 页面入参设置
 * By LYL
 * 日期
 */
<template>
  <div>
    <a-button type="primary" class="themeButton"
      style="width:118px;height:34px;background:rgba(124,225,170,0.1);border-color:rgba(124,225,170,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEditTable" size="small">
      <a-icon style="font-size:20px" :component="pageicon" />设置入参</a-button>
    <geno-modal :maskClosable="false" title="编辑" v-model="windowVisible" :destroyOnClose="true" :okButtonProps="{ props: {icon: 'check'}}"
      :cancelButtonProps="{ props: {icon: 'close'}}" :width="900" cancelText="取消" okText="确定" @cancel="modalCancel">

      <a-table size="small" :columns="columns" :dataSource="data" :pagination="false" style="height:450px;" :scroll="{ y: 420 }">
        <template slot="paramName" slot-scope="text, record">
          <div key="paramName">
            <a-input :value="text" size="small" @change="e => handleChange(e.target.value, record.key, 'paramName')" />
          </div>
        </template>

        <template slot="paramType" slot-scope="text, record">
          <div key="paramType">
            <a-radio-group style="width:50%;float:left" :value="record.paramType"
              @change="e => handleChange(e.target.value, record.key, 'paramType')">
              <a-row>
                <a-col>
                  <a-radio :value="1">系统模型</a-radio>
                </a-col>
                <a-col>
                  <a-radio :value="2">简单类型</a-radio>
                </a-col>
              </a-row>
            </a-radio-group>

            <a-tree-select v-if="record.paramType==2" :allowClear='false' style="width:50%;float:right" size="small"
              :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" placeholder='请选择' treeDefaultExpandAll
              @change="e => handleChange(e, record.key, 'paramClass')">

              <a-tree-select-node v-for="classinfo in allSimpleClasses" :value='classinfo.modelCode' :title='classinfo.name'
                :key='classinfo.modelCode' />
            </a-tree-select>

          </div>
        </template>

        <template slot="paramIsList" slot-scope="text, record">
          <div key="paramIsList">
            <a-radio-group style="width:70px" :value="record.paramIsList" @change="e => handleChange(e.target.value, record.key, 'paramIsList')">
              <a-radio :value="true">集合</a-radio>
              <a-radio :value="false">单模</a-radio>
            </a-radio-group>
          </div>
        </template>

        <template slot="operation" slot-scope="text, record">
          <div style="width:80px;margin:0 5px" class='editable-row-operations'>
            <span>
              <a @click="() => rowdelete(record.key)">删除</a>
            </span>
          </div>
        </template>
      </a-table>

      <template slot="footer">
        <a-button style="float:left" type="primary" @click="newParam" size="small">新增</a-button>
        <a-button @click="modalCancel" size="small">取消</a-button>
        <a-button type="primary" @click="modalSure" size="small">确定</a-button>
      </template>
    </geno-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { getUuid, deepClone } from '@src/utils'
import paramInfo from '../../02common/commonClasses/pageInParamInfo'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import modelAnalysis, { modelSimpleInfo } from '../../02common/impResourcesCache/modelAnalysis'
import { pageInParamsIco } from '../../assets/icons.js'

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

  private allSimpleClasses: modelSimpleInfo[] = []
  created() {
    this.pageicon = pageInParamsIco
  }
  mounted() {
    this.allSimpleClasses = modelAnalysis.getAllSimpleClass()
  }

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
    newRow.key = common.getUuid()
    newRow.paramName = ''
    newRow.paramType = 1

    newRow.paramClass = this.allSimpleClasses[0]
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
      newparaminfo.paramClass = o.paramClass
      newparaminfo.paramIsList = o.paramIsList
      this.data.push(newparaminfo)
    })
  }
  private modalSure() {
    //window.console.log('确认提交')
    this.windowVisible = false
    this.currentValue = common.clone(this.data)
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
@import '../../assets/globlaTheme.less';
</style>