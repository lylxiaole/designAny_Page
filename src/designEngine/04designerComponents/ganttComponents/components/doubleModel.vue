<template>
  <geno-modal @cancel="handleCancel" :width="700" cancelText="取消" okText="保存" :maskClosable="false" title="详细信息" :destroyOnClose="true"
    v-model="visible" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}" @ok="handleOk">
    <template slot="footer" v-if="disable==false">
      <a-button icon='close' key="取消" @click="handleCancel">取消</a-button>
    </template>
    <a-form>
      <a-row>
        <a-col :md="12">
          <a-form-item label="名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input v-model="record.taskName" :disabled="!disable"></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="12">
          <a-form-item label="进度" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input v-model="percentage" :disabled="!(disable&&perAble)"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <!-- <a-row>
        <a-col :md="24">
          <a-form-item label="项目" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input v-model='project'></a-input>
          </a-form-item>
        </a-col>
        <a-col :md="24">
          <a-form-item label="产线" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input v-model='line'></a-input>
          </a-form-item>
        </a-col>
      </a-row> -->
      <a-row>
        <a-col :md="12">
          <a-form-item label="开始" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker style="width:100%" :disabledDate="disabledStartDate" showTime format="YYYY-MM-DD HH:mm" v-model="startValue"
              placeholder="Start" @openChange="handleStartOpenChange" :disabled="!(disable&&!timeAble)" />
          </a-form-item>
        </a-col>
        <a-col :md="12">
          <a-form-item label="结束" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-date-picker style="width:100%" :disabledDate="disabledEndDate" showTime format="YYYY-MM-DD HH:mm" placeholder="End" v-model="endValue"
              :open="endOpen" @openChange="handleEndOpenChange" :disabled="!(disable&&!timeAble)" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :md="12">
          <a-form-item label="类型" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select v-model="record.type" :disabled="!disable">
              <a-select-option value="project">project</a-select-option>
              <a-select-option value="middle">middle</a-select-option>
              <a-select-option value="task">task</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <!-- <a-col :md="12">
          <a-form-item label="锁定产线" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-switch :disabled="!disable" defaultChecked />
          </a-form-item>
        </a-col> -->
      </a-row>
      <a-row>
        <a-form-item label="描述" :label-col="{span:3}" :wrapper-col="{span:21}">
          <a-textarea :rows="4" v-model="text" :disabled="!disable"></a-textarea>
        </a-form-item>
      </a-row>
    </a-form>
  </geno-modal>
</template>

<script>
import moment from 'moment'
export default {
  props: ['taskList', 'disable'],
  data() {
    return {
      moment,
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      startValue: null,
      endValue: null,
      endOpen: false,
      record: {},
      line: null,
      project: null,
      text: null,
      timeAble: true,
      perAble: true,
      percentage: null,
    }
  },
  methods: {
    view(taskItem) {
      this.record = { ...taskItem }
      if (this.record.planBeginTime && this.record.planEndTime) {
        this.timeAble = false
        this.startValue = moment(this.record.planBeginTime)
        this.endValue = moment(this.record.planEndTime)
        this.percentage = this.record.percentage
      } else if (this.record.children && this.record.children.length > 0) {
        this.timeAble = true
        var time = { planBeginTime: null, planEndTime: null }
        this.handleTime(this.record, time)
        this.startValue = moment(time.planBeginTime)
        this.endValue = moment(time.planEndTime)
        this.percentage = this.getTotalPer(this.record)
      } else {
        this.timeAble = true
        this.startValue = null
        this.endValue = null
        this.percentage = null
      }
      if (this.record.children && this.record.children.length > 0) {
        this.perAble = false
      } else {
        this.perAble = true
      }
      this.visible = true
    },
    getTotalPer(task) {
      var perList = []
      var percentage = 0
      task.children.forEach((child) => {
        if (child.children && child.children.length > 0) {
          var sPer = 0
          sPer = this.getTotalPer(child)
          perList.push(sPer)
          percentage += sPer
        } else {
          perList.push(child.percentage)
          percentage += child.percentage
        }
      })
      percentage = percentage / perList.length
      return percentage
    },
    handleCancel() {
      this.visible = false
    },
    handleOk() {
      // console.log(this.$parent)
      this.record.percentage = this.percentage
      this.record.planBeginTime = this.startValue
      this.record.planEndTime = this.endValue
      this.$parent.changeTask(this.record, 'add')
      this.visible = false
    },
    handleTime(taskItem, time) {
      taskItem.children.forEach((child) => {
        if (child.planBeginTime && child.planEndTime) {
          if (time.planBeginTime == null || time.planBeginTime > child.planBeginTime) {
            time.planBeginTime = child.planBeginTime
          }
          if (time.planEndTime == null || time.planEndTime < child.planEndTime) {
            time.planEndTime = child.planEndTime
          }
          if (child.children && child.children.length > 0) {
            this.handleTime(child, time)
          }
        }
      })
      // return time
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open
    },
  },
}
</script>

<style lang='less'>
// .taskDetel {
//   .ant-modal-content {
//     .ant-modal-header {
//       background-color: #2f54eb;
//     }
//   }
// }
</style>