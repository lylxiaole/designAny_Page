<template style="height:100%">
  <div style="height:100%;background:#FFF;">
    <a-row style="height:46px;margin:0px 0px 8px 8px;background:#F6F6F6;">
      <a-col :span="10">
        <div style="width:100%;height:100%;justify-content:left;overflow:hidden;" class="flexHorilanLayout">
          <div style="background:#18aeb7;width:6px;height:46px;"></div>
          <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">行为列表</span>
          <a-input style="margin-left:24px;width:300px" allowClear v-model="searchStr">
            <a-icon slot="addonBefore" type="search" />
          </a-input>
          <el-button style="margin-left:24px;" icon="plus" @click="bahaviorListAdd"></el-button>
        </div>
      </a-col>
      <a-col :offset="0" :span="14" style="text-align: left;padding-top:8px;">
        <span style="text-align:center;fontSize:16px">【当前事件：{{record.selectedEventName}}】</span>
      </a-col>
    </a-row>
    <a-row style="padding:0px 0px 8px 8px;height:calc(100% - 50px);">
      <a-table :scroll="{ y: tableMaxHeight}" :columns="behaviorColumns" :dataSource="tempBehaviors" rowKey="id"
        :rowSelection="{selectedRowKeys: currentSelectedKeys,onSelectAll:onSelectAll,onSelect:onSelect}" :pagination="false" bordered>
        <span slot="serial" slot-scope="text,record,index">
          {{ index + 1 }}
        </span>
        <template slot="name" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.id, 'name', $event)" />
        </template>
        <template slot="description" slot-scope="text, record">
          <editable-cell :text="text" @change="onCellChange(record.id, 'description', $event)" />
        </template>
        <span slot="action" slot-scope="record">
          <a-tooltip placement="top">
            <template slot="title">
              <span>编辑</span>
            </template>
            <el-button icon="edit" @click="()=>{editBehavior(record)}" type="link">编辑</el-button>
          </a-tooltip>
          <a-divider type="vertical" />
          <a-tooltip placement="top">
            <template slot="title">
              <span>移除</span>
            </template>
            <el-button icon="delete" @click="()=>{deleteBehavior(record.id)}" type="link">移除</el-button>
          </a-tooltip>
          <a-tooltip placement="top">
            <template slot="title">
              <span>上移</span>
            </template>
            <el-button icon="up" @click="()=>{moveUpBehavior(record.id)}" type="link">上移</el-button>
          </a-tooltip>
          <a-tooltip placement="top">
            <template slot="title">
              <span>下移</span>
            </template>
            <el-button icon="down" @click="()=>{moveDownBehavior(record.id)}" type="link">下移</el-button>
          </a-tooltip>
        </span>
      </a-table>
    </a-row>
  </div>

</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { behavior } from '@behaviorEngine/index'
import {  layoutEventBehaviors } from  '@designEngine/index'



import { behaviorListInParam, behaviorPageType, behaviorDetailData } from './model'

@Options({
  components: {}
})
export default class behaviorListInPage extends Vue {
  @Prop() record: behaviorListInParam

  private searchStr: string = null

  // 当前页面中的所有行为列表
  private allBehaviors: behavior[] = []

  get tempBehaviors(): behavior[] {
    if (this.searchStr && this.searchStr != '') {
      return this.allBehaviors.filter((x) => x.name.indexOf(this.searchStr) >= 0 || x.description.indexOf(this.searchStr) >= 0)
    } else {
      return this.allBehaviors
    }
  }

  //当前设计的布局所选中的行为列表
  private currentSelectedBehaviors: behavior[] = []

  get currentSelectedKeys(): string[] {
    if (this.currentSelectedBehaviors) {
      var res = this.currentSelectedBehaviors.map((o) => o.id)
      return res
    } else {
      return []
    }
  }

  private behaviorColumns: any[] = [
    {
      title: '#',
      width: 50,
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '行为名称',
      dataIndex: 'name',
      key: 'name',
      scopedSlots: { customRender: 'name' },
      width: '40%'
    },
    {
      title: '描述',
      dataIndex: 'description',
      scopedSlots: { customRender: 'description' },
      key: 'description',
      width: '20%'
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      scopedSlots: { customRender: 'action' }
    }
  ]

  private tableMaxHeight: number = 0

  created() {
    if (this.record && this.record.allBehaviors) {
      this.allBehaviors = deepClone(this.record.allBehaviors)
    }
    if (this.record && this.record.eventBehavior && this.record.eventBehavior.behaviorIds) {
      const selected = this.allBehaviors.filter((x) => this.record.eventBehavior.behaviorIds.indexOf(x.id) >= 0)
      this.currentSelectedBehaviors = deepClone(selected)
    }
    const that = this
    // 1、数据首次加载完后 →设置表格其高度
    this.$nextTick(() => {
      that.reSetTableMaxHeight()
    })
    // 2、挂载 reisze 事件 → 屏幕缩放时监听其高度变化
    window.onresize = () => {
      return (() => {
        that.$nextTick(() => {
          that.reSetTableMaxHeight()
        })
      })()
    }
  }

  private reSetTableMaxHeight() {
    this.tableMaxHeight = document.body.clientHeight * 0.85 - 260
  }

  private onSelect(record, selected, selectedRows) {
    let behavior = record as behavior
    if (selected) {
      this.currentSelectedBehaviors.push(behavior)
    } else {
      let findIndex = this.currentSelectedBehaviors.findIndex((o) => o.id == behavior.id)
      this.currentSelectedBehaviors.splice(findIndex, 1)
    }
  }

  private onSelectAll(selected, selectedRows, changeRows) {
    this.allBehaviors.forEach((element) => {
      if (selected == true) {
        this.currentSelectedBehaviors.push(element)
      } else {
        let findIndex = this.currentSelectedBehaviors.findIndex((o) => o.id == element.id)
        this.currentSelectedBehaviors.splice(findIndex, 1)
      }
    })
  }

  private onCellChange(key, dataIndex, value) {
    const dataSource = [...this.allBehaviors]
    const target = dataSource.find((item) => item.id === key)
    if (target) {
      target[dataIndex] = value
      this.allBehaviors = dataSource
    }
  }

  // ***********************行为列表处理*************************************************************

  private deleteBehavior(behaviorId: string) {
    const findIndex = this.allBehaviors.findIndex((o) => o.id == behaviorId)
    if (findIndex >= 0) {
      this.allBehaviors.splice(findIndex, 1)
    }
  }

  private bahaviorListAdd() {
    var newbehavior = new behavior()
    newbehavior.id = getUuid()
    newbehavior.name = '新建行为'
    newbehavior.description = ''
    this.allBehaviors.unshift(newbehavior)
  }

  /**开始编辑一个行为 */
  private editBehavior(thebehavior: behavior) {
    let backData: behaviorDetailData = new behaviorDetailData()
    backData.prePage = behaviorPageType.list
    backData.selectedEventName = this.record.selectedEventName
    backData.selectedBehavior = deepClone(thebehavior)
    backData.listTempAllBehaviors = deepClone(this.allBehaviors)

    let eventbehaviors: layoutEventBehaviors = new layoutEventBehaviors()
    eventbehaviors.eventName = this.record.selectedEventName
    eventbehaviors.behaviorIds = [...this.currentSelectedKeys]
    backData.listTempEventBehavior = eventbehaviors
    // this.$emit('onDetail', backData)
    this.onDetail(backData)
  }

  //行为顺序向上移动
  private moveUpBehavior(behaviorId: string) {
    let findindex = this.allBehaviors.findIndex((o) => o.id == behaviorId)
    if (findindex == 0) {
      return
    }
    let find = this.allBehaviors.find((o) => o.id == behaviorId)
    let tagetBehavior = this.allBehaviors[findindex - 1]
    this.allBehaviors[findindex] = tagetBehavior
    this.allBehaviors[findindex - 1] = find
    this.$forceUpdate()
  }

  //行为顺序向下移动
  private moveDownBehavior(behaviorId: string) {
    let findindex = this.allBehaviors.findIndex((o) => o.id == behaviorId)
    if (findindex == this.allBehaviors.length - 1) {
      return
    }
    let find = this.allBehaviors.find((o) => o.id == behaviorId)
    let tagetBehavior = this.allBehaviors[findindex + 1]
    this.allBehaviors[findindex] = tagetBehavior
    this.allBehaviors[findindex + 1] = find
    this.$forceUpdate()
  }

  @Emit('onDetail')
  protected onDetail(obj: behaviorDetailData) {}
}
</script>



<style lang="less" scoped>
.behavior-header-title {
  font-size: 18px;
  margin: 0px 0px 10px 20px;
}
</style>