<template>
  <el-row style="height: 100%; width: 100%; background: #fff">
    <el-col :span="6">
      <el-menu @select="onSelectedEvent" style="height: 100%; overflow-y: auto; overflow-x: hidden; border: 1px solid #ccc; padding: 0px 2px"
        mode="vertical" size="small">
        <el-menu-item v-for="(event, index) in designerLayoutEvents" :index="index" :key="event.eventName">
          <span>{{ event.eventName }}</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col :span="18">
      <div style="width: 100%; height: 30px; justify-content: left; overflow: hidden" class="flexHorilanLayout">
        <div style="background: #18aeb7; width: 6px; height: 26px"></div>
        <span style="margin-left: 9px; float: left; fontsize: 18px; fontweight: 600">Behavior List</span>
        <el-button class="behavior-list-header-button"
          style="width: 140px; height: 30px; background: rgba(245, 166, 35, 1); color: rgba(255, 255, 255, 1); margin-left: 10px"
          @click="toBehaviorList">Rerfence Behavior</el-button>
      </div>
      <el-table :data="currentSelectedBehaviors" style="width: 100%" height="calc(100% - 30px)">
        <el-table-column fixed type="index" width="30" />
        <el-table-column type="selection" width="30" />
        <el-table-column prop="name" label="Name" />
        <el-table-column prop="description" label="Desc" />
        <el-table-column label="Options" width="250px">
          <template #default="{ row }">
            <el-button link type="primary" @click="
                () => {
                  moveUpBehavior(row.id)
                }
              ">
              Move Up
            </el-button>
            <el-button @click="
                () => {
                  moveDownBehavior(row.id)
                }
              " link type="primary">
              Move Down
            </el-button>
            <el-button @click="
                () => {
                  removeBehavior(row.id)
                }
              " link type="primary">
              Remove
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { LayoutEvent, LayoutEventBehaviors } from '@design-any/interface/dist/LayoutAttr/EventInfo'
import { behavior } from '@design-any/interface/dist/bahaviorEngine/behavior'
import { deepClone, getUuid } from '@common/utils'

export enum behaviorPageType {
  binding = 'behaviorEventBinding'
}

export class behaviorListData {
  prePage: behaviorPageType
  eventField: string
  selectedEventName: string
  eventBehavior: LayoutEventBehaviors
}

//事件行为绑定组件
@Options({})
export default class behaviorEventBinding extends Vue {
  @Prop() designerLayoutEvents: LayoutEvent[]
  @Prop() currentData: LayoutEventBehaviors[]
  @Prop() currentPageBehaviors: behavior[]
  // **********************************
  private selectedEventField: string = ''
  private selectedEventName: string = ''

  private onSelectedEvent(index, indexPath, item, routeResult) {
    this.selectedEventField = this.designerLayoutEvents[index].eventField
    this.selectedEventName = this.designerLayoutEvents[index].eventName
  }
  private get currentSelectedBehaviors(): behavior[] {
    if (this.selectedEventField === null) {
      return null
    }
    let event = this.designerLayoutEvents.filter((o) => o.eventField == this.selectedEventField)[0]
    if (!event) {
      return null
    }
    let behaviorIds: string[] = []
    if (this.currentData.find((o) => o.eventField == event.eventField)) {
      behaviorIds = this.currentData.find((o) => o.eventField == event.eventField).behaviorIds
    }

    let res: behavior[] = []
    behaviorIds.filter((bid) => {
      let find = this.currentPageBehaviors.find((o) => o.id == bid)
      if (find) {
        res.push(find)
      }
    })
    return res
  }
  private set currentSelectedBehaviors(val: behavior[]) {
    if (this.selectedEventField === null) {
      return
    }
    let event = this.designerLayoutEvents.filter((o) => o.eventField == this.selectedEventField)[0]
    if (!event) {
      return
    }
    let eventbehaviors = this.currentData.find((o) => o.eventField == event.eventField)
    if (!eventbehaviors) {
      let neweventbeh = new LayoutEventBehaviors()
      neweventbeh.eventName = event.eventName
      neweventbeh.eventField = event.eventField
      neweventbeh.behaviorIds = []
      this.currentData.push(neweventbeh)
      eventbehaviors = this.currentData.find((o) => o.eventField == event.eventField)
    }

    let selectedIds = val.map((o) => o.id)
    let delteIds = eventbehaviors.behaviorIds.filter((o) => selectedIds.indexOf(o) > -1)
    let addedIds = selectedIds.filter((o) => delteIds.indexOf(o) < 0)

    eventbehaviors.behaviorIds = delteIds.concat(addedIds)
  }
  // **********************************
  //行为顺序向上移动
  private moveUpBehavior(behaviorId: string) {
    let event = this.currentData.filter((o) => o.eventField == this.selectedEventField)[0]
    if (!event) {
      return
    }
    let findindex = event.behaviorIds.findIndex((o) => o == behaviorId)
    if (findindex == 0) {
      return
    }
    let tagetBehaviorId = event.behaviorIds[findindex - 1]
    event.behaviorIds[findindex] = tagetBehaviorId
    event.behaviorIds[findindex - 1] = behaviorId
    this.currentSelectedBehaviors = this.currentSelectedBehaviors
  }
  //行为顺序向下移动
  private moveDownBehavior(behaviorId: string) {
    let event = this.currentData.filter((o) => o.eventField == this.selectedEventField)[0]
    if (!event) {
      return
    }
    let findindex = event.behaviorIds.findIndex((o) => o == behaviorId)
    if (findindex == event.behaviorIds.length - 1) {
      return
    }
    let tagetBehaviorId = event.behaviorIds[findindex + 1]
    event.behaviorIds[findindex] = tagetBehaviorId
    event.behaviorIds[findindex + 1] = behaviorId
    this.currentSelectedBehaviors = this.currentSelectedBehaviors
  }
  //删除行为
  private removeBehavior(behaviorId: string) {
    let event = this.currentData.filter((o) => o.eventField == this.selectedEventField)[0]
    if (!event) {
      return
    }

    let findindex = event.behaviorIds.findIndex((o) => o == behaviorId)
    if (findindex >= 0) {
      event.behaviorIds.splice(findindex, 1)
    }
    this.currentSelectedBehaviors = this.currentSelectedBehaviors
  }

  //编辑，跳转到行为列表
  private toBehaviorList() {
    //
    let back: behaviorListData = new behaviorListData()
    back.prePage = behaviorPageType.binding
    back.selectedEventName = this.selectedEventName
    back.eventField = this.selectedEventField
    // window.console.log('toBehaviorList')
    let event = this.currentData.filter((o) => o.eventField == this.selectedEventField)[0]
    if (event) {
      back.eventBehavior = deepClone(event)
    } else {
      let neweventbeh = new LayoutEventBehaviors()
      neweventbeh.eventName = this.selectedEventName
      neweventbeh.eventField = this.selectedEventField
      neweventbeh.behaviorIds = []
      this.currentData.push(neweventbeh)
      back.eventBehavior = deepClone(neweventbeh)
    }
    this.onList(back)
  }

  @Emit('onList')
  protected onList(obj: behaviorListData) {}
}
</script>

<style lang="less" scoped></style>
