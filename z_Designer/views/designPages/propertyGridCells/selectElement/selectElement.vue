<template>
  <div>
    <a-button type="primary" @click="startEditTable" size='small'>设置属性</a-button>
    <geno-modal :maskClosable="false" title="编辑" v-model="windowVisible" :width="900" cancelText="取消" okText="确定">
      <a-table size="small" :columns="columns" :dataSource="data" :pagination="false" style="height:450px;" :scroll="{y:420}">
        <template slot="selectEleName" slot-scope="text,record">
          <div key="selectEleName">
            <a-input :value="text" size="small" @change="e => handleChange(e.target.value,record.key,'selectEleName')" />
          </div>
        </template>
        <template slot="selectEleDisabled" slot-scope="text,record">
          <div key="selectEleDisabled">
            <a-radio-group :value="record.selectEleDisabled" @change="e=>handleChange(e.target.value,record.key,'selectEleDisabled')">
              <a-radio :value="false">是</a-radio>
              <a-radio :value="true">否</a-radio>
            </a-radio-group>
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
        <a-button style="float:left" type="primary" @click="newSelectEle" size="small">新增</a-button>
        <a-button @click="modalCancel" size="small">取消</a-button>
        <a-button type="primary" @click="modalSure" size="small">确定</a-button>
      </template>
    </geno-modal>
  </div>
</template>
<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit } from 'vue-property-decorator'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'
import propertyCellBase from '../common'
import { getUuid, deepClone } from '@src/utils'
class groupInfo {
  name: string
  disabled: boolean
}
class selectElementInfo {
  key: string
  //是否设置组别 2:不设置   1：设置
  // selectGroupType: number
  //组别名称
  selectGroupName: string
  //选择项名称
  selectEleName: string
  //选择项是否可选
  selectEleDisabled: boolean
  selectGroupEleInfo: groupInfo[]
}

@propertyCellTypeAttr(PropertyTypeEnum.selectElement)
@Options({})
export default class selectElement extends propertyCellBase {
  public windowVisible: boolean = false
  private disabled: boolean = true
  private columns: any[] = [
    {
      title: '选择项名称',
      dataIndex: 'selectEleName',
      scopedSlots: { customRender: 'selectEleName' },
      width: '60%'
    },
    {
      title: '选择项是否可选',
      dataIndex: 'selectEleDisabled',
      scopedSlots: { customRender: 'selectEleDisabled' },
      width: '20%'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      width: '20%'
    }
  ]

  private data: selectElementInfo[] = []

  private startEditTable() {
    this.windowVisible = true
    this.data = []
    if (!this.currentValue) {
      return
    }

    ;(this.currentValue as selectElementInfo[]).filter((o) => {
      var newSelect = new selectElementInfo()
      newSelect.key = o.key
      // newSelect.selectGroupType = o.selectGroupType
      newSelect.selectGroupName = o.selectGroupName
      newSelect.selectEleName = o.selectEleName
      newSelect.selectEleDisabled = o.selectEleDisabled
      this.data.push(newSelect)
    })
  }
  private newSelectEle() {
    var newRow = new selectElementInfo()
    newRow.key = getUuid()
    // newRow.selectGroupType = 2
    newRow.selectGroupName = ''
    newRow.selectEleName = ''
    newRow.selectEleDisabled = false
    newRow.selectGroupEleInfo = []
    this.data.push(newRow)
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

  private modalSure() {
    this.windowVisible = false
    this.currentValue = deepClone(this.data)
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