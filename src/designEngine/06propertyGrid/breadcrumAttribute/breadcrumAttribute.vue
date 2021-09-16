<template>
  <div>
    <a-button type="primary" @click="startEditTable" size="small">设置属性</a-button>
    <geno-modal :maskClosable="false" title="编辑" v-model="windowVisible" :width="900" cancelText="取消" okText="确定">
      <a-table size="small" :columns="columns" :dataSource="data" :pagination="false" style="height:450px;" :scroll="{y:420}">
        <template slot="breadcrumIconType" slot-scope="text,record">
          <div key="breadcrumIconType">
            <a-radio-group style="width:50%;float:left" :value="record.breadcrumIconType"
              @change="e=> handleChange(e.target.value,record.key,'breadcrumIconType')">
              <a-radio :value="1"> 直接设置 </a-radio>
              <a-radio :value="2"> 上传图片</a-radio>
            </a-radio-group>

            <a-tree-select v-if="record.breadcrumIconType==1" :value="record.breadcrumIcon" style="width:50%;" size="small"
              :dropdownStyle="{maxHeight:'400px',overflow:'auto'}" placeholder='请选择图标' :allowClear='false' treeDefaultExpandAll
              @change="e=>handleChange(e,record.key,'breadcrumIcon')">
              <a-tree-select-node v-for="icon in record.allBreadcrumIcons" :value='icon.value' :title="icon.name" :key="icon.value" />
            </a-tree-select>

            <div v-if="record.breadcrumIconType==2">
              <NpUploadFile :fileList.sync="record.breadcrumImage" maxFileLength=1 fileType="vectorgraph"></NpUploadFile>
            </div>

          </div>
        </template>
        <template slot="breadcrumName" slot-scope="text,record">
          <div key="breadcrumName">
            <a-input :value="text" size="small" @change="e => handleChange(e.target.value,record.key,'breadcrumName')" />
          </div>
        </template>
        <template slot="breadcrumRef" slot-scope="text,record">
          <div key="breadcrumRef">
            <a-radio-group :value="record.breadcrumRef" @change="e=>handleChange(e.target.value,record.key,'breadcrumRef')">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
            <!-- <a-input :value="text" size="small" @change="e => handleChange(e.target.value,record.key,'breadcrumRef')" /> -->
          </div>
        </template>

        <template slot="operation" slot-scope="text,record">
          <div style="width:80px;margin:0 5px;" class="editable-row-operations">
            <span>
              <a @click="()=>rowdelete(record.key)">删除</a>
            </span>
          </div>
        </template>
      </a-table>
      <template slot="footer">
        <a-button style="float:left" type="primary" @click="newBreadcrum" size="small">新增</a-button>
        <a-button @click="modalCancel" size="small">取消</a-button>
        <a-button type="primary" @click="modalSure" size="small">确定</a-button>
      </template>
    </geno-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import paramInfo from '../../02common/commonClasses/pageInParamInfo'

import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import breadcrumAttributeInfo from '../../02common/commonClasses/breadcrumAttributeInfo'
import { t } from 'vxe-table'
import npUploadFile from '../../07commonComponents/npUploadFile.vue'
import { CurrentContext } from '../../01designerContext'
@propertyCellTypeAttr(PropertyTypeEnum.breadcrumAttribute)
@Component({ components: { NpUploadFile: npUploadFile } })
export default class breadcrumAttribute extends propertyCellBase {
  public windowVisible: boolean = false
  private columns: any[] = [
    {
      title: '面包屑图标',
      dataIndex: 'breadcrumIconType',
      scopedSlots: { customRender: 'breadcrumIconType' },
      width: '35%',
    },
    {
      title: '面包屑名称',
      dataIndex: 'breadcrumName',
      scopedSlots: { customRender: 'breadcrumName' },
      width: '35%',
    },
    {
      title: '是否可跳转',
      dataIndex: 'breadcrumRef',
      scopedSlots: { customRender: 'breadcrumRef' },
      width: '20%',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      width: '10%',
    },
  ]

  private data: breadcrumAttributeInfo[] = []

  mounted() {
    this.data.push(this.initBreadcrum('Home'))
    this.data.push(this.initBreadcrum('Application'))
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

  private initBreadcrum(name: string): breadcrumAttributeInfo {
    var newRow = new breadcrumAttributeInfo()
    newRow.key = common.getUuid()
    newRow.breadcrumIconType = 1
    newRow.breadcrumIcon = undefined
    newRow.breadcrumImage = []
    newRow.breadcrumName = name
    newRow.breadcrumRef = false
    return newRow
  }

  private newBreadcrum() {
    var newRow = new breadcrumAttributeInfo()
    newRow.key = common.getUuid()
    newRow.breadcrumIconType = 1
    newRow.breadcrumIcon = undefined
    newRow.breadcrumImage = []
    newRow.breadcrumName = ''
    newRow.breadcrumRef = false
    this.data.push(newRow)
  }

  private startEditTable() {
    this.windowVisible = true
    if (!this.currentValue) {
      this.data = [this.initBreadcrum('Home'), this.initBreadcrum('Application')]
      return
    }
    this.data = []
    ;(this.currentValue as breadcrumAttributeInfo[]).filter((o) => {
      var newBreadcrum = new breadcrumAttributeInfo()
      newBreadcrum.key = o.key
      newBreadcrum.breadcrumIconType = o.breadcrumIconType
      newBreadcrum.breadcrumIcon = o.breadcrumIcon
      newBreadcrum.breadcrumImage = o.breadcrumImage

      newBreadcrum.breadcrumName = o.breadcrumName
      newBreadcrum.breadcrumRef = o.breadcrumRef
      this.data.push(newBreadcrum)
    })
  }

  private modalSure() {
    this.windowVisible = false
    this.currentValue = common.clone(this.data)
    this.data = [this.initBreadcrum('Home'), this.initBreadcrum('Application')]
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