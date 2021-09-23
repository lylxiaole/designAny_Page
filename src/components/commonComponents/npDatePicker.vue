<template>
  <div style="width:100%;height:100%">
    <a-week-picker v-if="dateType=='week'" v-model="currentTime" @change="onValChange" size="small" style="width:100%">
      <div slot="suffixIcon"></div>
    </a-week-picker>

    <a-month-picker v-else-if="dateType=='month'" v-model="currentTime" format="YYYY-MM" @change="onValChange" size="small" style="width:100%">
      <div slot="suffixIcon"></div>
    </a-month-picker>

    <a-time-picker v-else-if="dateType=='time'" v-model="currentTime" :format="format" @change="onValChange" size="small" style="width:100%">
      <div slot="suffixIcon"></div>
    </a-time-picker>

    <a-date-picker v-else :format="format" v-model="currentTime" @change="onValChange" size="small" style="width:100%" :showTime="showTime">
      <div slot="suffixIcon"></div>
    </a-date-picker>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import moment from 'moment'

@Component
export default class npDatePicker extends Vue {
  private get currentTime(): moment.Moment {
    if (this.value) {
      if (this.dateType == 'week') {
        return moment(this.value, 'YYYY-MM-DD')
      } else if (this.dateType == 'month') {
        return moment(this.value, 'YYYY-MM')
      } else if (this.dateType == 'time') {
        return moment(this.value, this.format)
      } else {
        return moment(this.value, this.format)
      }
    }

    return null
  }

  private set currentTime(val: moment.Moment) {
    if (!val) {
      this.UpdateValue_Inner(null)
      return
    }

    if (this.dateType == 'week') {
      this.UpdateValue_Inner(val.format('YYYY-MM-DD'))
    } else if (this.dateType == 'month') {
      this.UpdateValue_Inner(val.format('YYYY-MM'))
    } else if (this.dateType == 'time') {
      this.UpdateValue_Inner(val.format(this.format))
    } else {
      this.UpdateValue_Inner(val.format(this.format))
    }
  }

  @Prop() private value: string
  @Prop() private showTime: boolean | any
  @Prop() private format: string
  @Emit('update:value')
  UpdateValue_Inner(val: string) {}

  @Prop() private dateType: string

  private onValChange(val: any, timestr: string) {
    //window.console.log(timestr)
  }
}
</script>



<style scoped>
</style>