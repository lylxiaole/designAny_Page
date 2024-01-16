<template>
  <el-row style="height:100%">
    <el-row style="height:100%;background:#FFF;">
      <el-col style="height:100%;background:#FFF;" :span="6">
        <el-row style="height:100%;background:#FFF">
          <el-row style="height:34px;padding:0px 0px 8px 8px;box-sizing: border-box;">
            <div style="background:#18aeb7;width:6px;height:26px;"></div>
            <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">事件列表</span>
          </el-row>
          <el-row style="height: calc(100% - 58px);padding:0px 0px 8px 8px;">
            <el-menu v-model="selectedEventNames" style="height:100%;overflow-y:auto;overflow-x:hidden;border:1px solid #ccc;padding:0px 2px"
              mode="inline" size="small">
              <el-menu-item v-for="event in designerEvents" :key="event.eventName">
                <span>{{event.eventName}}</span>
              </el-menu-item>
            </el-menu>
          </el-row>
        </el-row>
      </el-col>
      <el-col style="height:100%;background:#FFF;" :span="18">
        <el-row style="height:100%;background:#FFF">
          <el-row class="behavior-list-header">
            <div style="width:100%;height:100%;justify-content:left;overflow:hidden;" class="flexHorilanLayout">
              <div style="background:#18aeb7;width:6px;height:26px;"></div>
              <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">事件行为列表</span>
              <el-button class="behavior-list-header-button" style="width:104px;height:30px;background:rgba(245,166,35,1);color:rgba(255,255,255,1);"
                @click="toBehaviorList">
                <a-icon style="font-size:17px" :component="behaviorAddIcon" />添加行为
              </el-button>
            </div>
          </el-row>
          <el-row class="behavior-list-content">
            <el-table height="100%" rowKey="id" :data="currentSelectedBehaviors" :pagination="false" bordered>
              <el-table-column type="index" />
              <el-table-column label="行为名称" prop="name" />
              <el-table-column label="操作" prop="action" width="420px">
                <template #default="record">
                  <el-button @click="()=>{moveUpBehavior(record.id)}" type="link"> 上移</el-button>
                  <el-button @click="()=>{moveDownBehavior(record.id)}" type="link"> 下移</el-button>
                  <el-button @click="()=>{editBehavior(record.id)}" type="link"> 编辑</el-button>
                  <el-button @click="()=>{removeBehavior(record.id)}" type="link"> 移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { behavior } from '@behaviorEngine/index'
import { layoutEvent, layoutMethod, layoutEventBehaviors } from '@designEngine/index'
import { paramType, param } from '@behaviorEngine/index'

import { behaviorBindingInParam, behaviorPageType, behaviorListData, behaviorDetailData } from './model'
import { moveUpIco, moveDownIco, buttonEditIco, buttonDeleteIco, buttonAddIco } from '@/assets/icons.js'

//事件行为绑定组件
@Options({})
export default class behaviorEventBinding extends Vue {
  @Prop() record: behaviorBindingInParam
  @Prop() designerEvents: layoutEvent[]
  @Prop() currentData: layoutEventBehaviors[]
  @Prop() currentPageBehaviors: behavior[]

  private selectedEventNames: string[] = []
  private moveUpIcon: any = moveUpIco
  private moveDownIcon: any = moveDownIco
  private buttonEditIcon: any = buttonEditIco
  private buttonDeleteIcon: any = buttonDeleteIco
  private behaviorAddIcon: any = buttonAddIco

  created() {
    if (this.record && this.record.selectedEventName) {
      this.selectedEventNames.push(this.record.selectedEventName)
    } else if (this.designerEvents && this.designerEvents.length > 0) {
      this.selectedEventNames.push(this.designerEvents[0].eventName)
    }
  }

  //当前选择的事件名称
  private get selectedEventName(): string {
    if (this.selectedEventNames && this.selectedEventNames.length > 0) {
      return this.selectedEventNames[0]
    } else {
      return null
    }
  }

  private get currentSelectedBehaviors(): behavior[] {
    if (this.selectedEventName === null) {
      return null
    }
    let event = this.designerEvents.filter((o) => o.eventName == this.selectedEventName)[0]
    if (!event) {
      return null
    }
    let behaviorIds: string[] = []
    if (this.currentData.find((o) => o.eventName == event.eventName)) {
      behaviorIds = this.currentData.find((o) => o.eventName == event.eventName).behaviorIds
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
    if (this.selectedEventName === null) {
      return
    }
    let event = this.designerEvents.filter((o) => o.eventName == this.selectedEventName)[0]
    if (!event) {
      return
    }
    let eventbehaviors = this.currentData.find((o) => o.eventName == event.eventName)
    if (!eventbehaviors) {
      let neweventbeh = new layoutEventBehaviors()
      neweventbeh.eventName = event.eventName
      neweventbeh.behaviorIds = []
      this.currentData.push(neweventbeh)
      eventbehaviors = this.currentData.find((o) => o.eventName == event.eventName)
    }

    let selectedIds = val.map((o) => o.id)
    let delteIds = eventbehaviors.behaviorIds.filter((o) => selectedIds.indexOf(o) > -1)
    let addedIds = selectedIds.filter((o) => delteIds.indexOf(o) < 0)

    eventbehaviors.behaviorIds = delteIds.concat(addedIds)
  }

  //行为顺序向上移动
  private moveUpBehavior(behaviorId: string) {
    let event = this.currentData.filter((o) => o.eventName == this.selectedEventName)[0]
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
    let event = this.currentData.filter((o) => o.eventName == this.selectedEventName)[0]
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
    let event = this.currentData.filter((o) => o.eventName == this.selectedEventName)[0]
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
    let back: behaviorListData = new behaviorListData()
    back.prePage = behaviorPageType.binding
    back.selectedEventName = this.selectedEventName
    // window.console.log('toBehaviorList')
    let event = this.currentData.filter((o) => o.eventName == this.selectedEventName)[0]
    if (event) {
      back.eventBehavior = deepClone(event)
    } else {
      let neweventbeh = new layoutEventBehaviors()
      neweventbeh.eventName = this.selectedEventName
      neweventbeh.behaviorIds = []
      this.currentData.push(neweventbeh)
      back.eventBehavior = deepClone(neweventbeh)
    }
    // this.$emit('onList', back)
    this.onList(back)
  }

  //编辑，跳转到行为细节详情
  private editBehavior(behaviorId: string) {
    let back: behaviorDetailData = new behaviorDetailData()
    back.prePage = behaviorPageType.binding
    back.selectedEventName = this.selectedEventName
    const behavior = this.currentPageBehaviors.find((o) => o.id == behaviorId)
    if (behavior) {
      back.selectedBehavior = deepClone(behavior)
    }
    // this.$emit('onDetail', back)
    this.onDetail(back)
  }

  @Emit('onList')
  protected onList(obj: behaviorListData) {}

  @Emit('onDetail')
  protected onDetail(obj: behaviorDetailData) {}
}
</script>

<style lang="less" scoped>
.ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
  color: #000;
}
.behavior-list-content {
  height: calc(100% - 57px);
  padding: 0px 0px 8px 8px;
}

.behavior-list-header {
  height: 46px;
  margin: 0px 0px 8px 8px;
  background: #f6f6f6;
  .behavior-list-header-button {
    margin-left: 24px;
  }
}
</style>