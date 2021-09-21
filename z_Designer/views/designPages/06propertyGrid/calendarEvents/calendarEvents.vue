<template>
  <div>
    <a-button type="primary" @click="startEditTable" size="small">设置日程</a-button>
    <geno-modal :maskClosable="false" title="编辑" v-model="windowVisible" :width="900" cancelText="取消" okText="确定">
      <a-table size="small" :columns="columns" :dataSource="data" :pagination="false" style="height:450px;" :scroll="{ y: 420 }">

        <template slot="eventTitle" slot-scope="text, record">
          <div key="eventTitle">
            <a-input :value="record.eventTitle" size="small" @change="e => handleChange(e.target.value, record.key, 'eventTitle')" />

          </div>
        </template>

        <template slot="startDate" slot-scope="text, record">
          <div key="startDate">
            <a-date-picker format="YYYY-MM-DD" :value="text" @change="e => handleChange(e, record.key, 'startDate')" size="small">
            </a-date-picker>
          </div>
        </template>

        <template slot="startTime" slot-scope="text, record">
          <div key="startTime">
            <a-time-picker dateType='time' style="width:100%" format="HH:mm" :value="record.startTime"
              @change="e => handleChange(e, record.key, 'startTime')" size="small">
            </a-time-picker>
          </div>
        </template>

        <template slot="endDate" slot-scope="text, record">
          <div key="endDate">
            <a-date-picker style="width:100%" format="YYYY-MM-DD" :value="record.endDate" @change="e => handleChange(e, record.key, 'endDate')"
              size="small">
            </a-date-picker>
          </div>
        </template>

        <template slot="endTime" slot-scope="text, record">
          <div key="endTime">
            <a-time-picker dateType='time' format="HH:mm" :value="record.endTime" @change="e => handleChange(e, record.key, 'endTime')" size="small">
            </a-time-picker>
          </div>
        </template>

        <template slot="color" slot-scope="text, record">
          <div key="color">
            <npColorPicker :color.sync="record.color">
            </npColorPicker>
          </div>
        </template>

        <template slot="operation" slot-scope="text, record">
          <div style="width: 30px;margin:0 5px" class="editable-row-operations">
            <span>
              <a @click="()=> rowDelete(record.key)">删除</a>
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
import npColorPicker from '../../07commonComponents/npColorPicker.vue'
import CalendarEventsInfo from '../../02common/commonClasses/CalendarEventsInfo'
import common from '../../02common/commonMethod'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'

@propertyCellTypeAttr(PropertyTypeEnum.calendarEvents)
@Component({
  components: {
    npColorPicker: npColorPicker,
  },
})
export default class calendarEvents extends propertyCellBase {
  public windowVisible: boolean = false

  private columns: any[] = [
    {
      title: '日程名称',
      dataIndex: 'eventTitle',
      scopedSlots: { customRender: 'eventTitle' },
      width: '20%',
      fixed: 'center',
    },
    {
      title: '开始日期',
      dataIndex: 'startDate',
      scopedSlots: { customRender: 'startDate' },
      width: '15%',
      fixed: 'center',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      scopedSlots: { customRender: 'startTime' },
      width: '10%',
      fixed: 'center',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
      scopedSlots: { customRender: 'endDate' },
      width: '15%',
      fixed: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      scopedSlots: { customRender: 'endTime' },
      width: '10%',
      fixed: 'center',
    },
    {
      title: '颜色',
      dataIndex: 'color',
      scopedSlots: { customRender: 'color' },
      width: '10%',
      fixed: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      width: '10%',
      fixed: 'center',
    },
  ]

  private data: CalendarEventsInfo[] = []

  private rowDelete(key: string) {
    const newData = [...this.data]
    const target = newData.filter((item) => key === item.key)[0]
    if (target) {
      const index = newData.indexOf(target)
      newData.splice(index, 1)
      this.data = newData
    }
  }

  private newParam() {
    var newRow = new CalendarEventsInfo()
    newRow.id = 1
    newRow.key = common.getUuid()
    newRow.eventTitle = 'dsfg'
    newRow.startDate = Vue.prototype.$moment('2019-09-06', 'YYYY-MM-DD')
    newRow.startTime = Vue.prototype.$moment('00:00', 'HH:mm')
    newRow.endDate = Vue.prototype.$moment('2019-09-07', 'YYYY-MM-DD')
    newRow.endTime = Vue.prototype.$moment('00:00', 'HH:mm')
    newRow.color = '#FFC107'
    this.data.push(newRow)
  }

  private startEditTable() {
    this.windowVisible = true

    if (typeof this.currentValue != 'undefined') {
      this.currentValue.forEach((element: any) => {
        let obj: any = {
          id: element.id,
          key: element.key,
          eventTitle: element.eventTitle,
          startDate: Vue.prototype.$moment(element.startDate),
          startTime: Vue.prototype.$moment(element.startTime, 'HH:mm'),
          endDate: Vue.prototype.$moment(element.endDate),
          endTime: Vue.prototype.$moment(element.endTime, 'HH:mm'),
          color: element.color,
        }
        this.data.push(obj)
      })
    } else {
      this.data = []
    }
  }

  private modalSure() {
    let changeData: CalendarEventsInfo[] = []
    this.data.forEach((element) => {
      let obj: any = {
        id: element.id,
        key: element.key,
        eventTitle: element.eventTitle,
        startDate: element.startDate,
        startTime: element.startTime,
        endDate: element.endDate,
        endTime: element.endTime,
        color: element.color,
      }
      changeData.push(obj)
    })
    this.data = []
    this.currentValue = common.clone(changeData)
    this.windowVisible = false
  }

  private modalCancel() {
    this.windowVisible = false
    this.data = []
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

<style scoped>
</style>