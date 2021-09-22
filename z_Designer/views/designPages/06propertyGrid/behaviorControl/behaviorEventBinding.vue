<template>
  <a-layout style="height:100%">
    <a-row style="height:100%;background:#FFF;">
      <a-col style="height:100%;background:#FFF;" :span="6">
        <a-layout style="height:100%;background:#FFF">
          <a-row style="height:54px;padding:0px 0px 8px 8px;">
            <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6"
              class="flexHorilanLayout">
              <div style="background:#18aeb7;width:6px;height:46px;"></div>
              <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">事件列表</span>
            </div>
          </a-row>
          <a-row style="height: calc(100% - 58px);padding:0px 0px 8px 8px;">
            <a-menu v-model="selectedEventNames" style="height:100%;overflow-y:auto;overflow-x:hidden;border:1px solid #ccc;padding:0px 2px"
              mode="inline" size="small">
              <a-menu-item v-for="event in designerEvents" :key="event.eventName">
                <span>{{event.eventName}}</span>
              </a-menu-item>
            </a-menu>
          </a-row>
        </a-layout>
      </a-col>
      <a-col style="height:100%;background:#FFF;" :span="18">
        <a-layout style="height:100%;background:#FFF">
          <a-row class="behavior-list-header">
            <div style="width:100%;height:100%;justify-content:left;overflow:hidden;" class="flexHorilanLayout">
              <div style="background:#18aeb7;width:6px;height:46px;"></div>
              <span style="margin-left:9px;float:left;fontSize:18px;fontWeight:600">事件行为列表</span>
              <a-button class="behavior-list-header-button" style="width:104px;height:30px;background:rgba(245,166,35,1);color:rgba(255,255,255,1);"
                @click="toBehaviorList">
                <a-icon style="font-size:17px" :component="behaviorAddIcon" />添加行为
              </a-button>
            </div>
          </a-row>
          <a-row class="behavior-list-content">
            <a-table height="100%" rowKey="id" :columns="behaviorColumns" :dataSource="currentSelectedBehaviors" :pagination="false" bordered>
              <span slot="serial" slot-scope="text,record, index">
                {{ index + 1 }}
              </span>
              <a slot="name" slot-scope="text">{{text}}</a>
              <span slot="action" slot-scope="text,record">
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>上移</span>
                  </template>
                  <a-button @click="()=>{moveUpBehavior(record.id)}" type="link">
                    <a-icon style="font-size:14px" :component="moveUpIcon" />上移</a-button>
                </a-tooltip>
                <a-divider type="vertical" />
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>下移</span>
                  </template>
                  <a-button @click="()=>{moveDownBehavior(record.id)}" type="link">
                    <a-icon style="font-size:14px" :component="moveDownIcon" />下移</a-button>
                </a-tooltip>
                <a-divider type="vertical" />
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>编辑</span>
                  </template>
                  <a-button @click="()=>{editBehavior(record.id)}" type="link">
                    <a-icon style="font-size:14px" :component="buttonEditIcon" />编辑</a-button>
                </a-tooltip>
                <a-divider type="vertical" />
                <a-tooltip placement="top">
                  <template slot="title">
                    <span>移除</span>
                  </template>
                  <a-button @click="()=>{removeBehavior(record.id)}" type="link">
                    <a-icon style="font-size:14px" :component="buttonDeleteIcon" />移除</a-button>
                </a-tooltip>
              </span>
            </a-table>
          </a-row>
        </a-layout>
      </a-col>
    </a-row>
  </a-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../02common/commonMethod'
import { layoutEventBehaviors, behavior } from '../../02common/behavior'
import PageBase from '../../03designerLayoutBase/PageBase'
import { layoutEvent, layoutMethod, param, paramType } from '../../03designerLayoutBase'
import { behaviorBindingInParam, behaviorPageType, behaviorListData, behaviorDetailData } from './model'
import { moveUpIco, moveDownIco, buttonEditIco, buttonDeleteIco, buttonAddIco } from '../../assets/icons.js'

//事件行为绑定组件
@Component
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

  private behaviorColumns: any[] = [
    {
      title: '#',
      width: 50,
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '行为名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '操作',
      key: 'action',
      width: 420,
      scopedSlots: { customRender: 'action' }
    }
  ]

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
      back.eventBehavior = common.clone(event)
    } else {
      let neweventbeh = new layoutEventBehaviors()
      neweventbeh.eventName = this.selectedEventName
      neweventbeh.behaviorIds = []
      this.currentData.push(neweventbeh)
      back.eventBehavior = common.clone(neweventbeh)
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
      back.selectedBehavior = common.clone(behavior)
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