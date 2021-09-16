import { Moment } from 'moment'

export default class CalendarEventsInfo {
  id: number

  key: string

  eventTitle: string

  startDate: Number

  startTime: Number

  endDate: Number

  endTime: Number

  color: String

  isEdit: boolean

  popTrigger: String

  popVisible: boolean

  status: String //工作状态
}
