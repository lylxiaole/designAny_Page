<template>
  <div>
    <el-button type="primary" class="themeButton"
      style="width:118px;height:34px;background:rgba(0,103,138,0.1);border-color:rgba(0,103,138,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEdit" size="small">
      行为设置
    </el-button>

    <el-dialog ref="previewPopup" class="bhaviorDialog" title="行为设置" style="height:600px" width="800px" v-model="windowVisible" append-to-body
      :before-close="onClose">
      <el-row style="height:500px;background:#FFF">
        <behaviorListInPage v-if="currentComp==='behaviorListInPage'" :record="record" @onDetail="handleDetail" />
        <behaviorDeatilSetting v-if="currentComp==='behaviorDeatilSetting'" :record="record" :prePage="prePage" :currentPage="currentPage"
          :currentLayout="currentLayouts" />
        <behaviorEventBinding v-if="currentComp==='behaviorEventBinding'" :record="record" :currentData="currentData"
          :designerEvents="designerLayoutEvents" :currentPageBehaviors="currentPageBehaviors" @onList="handleList" />
      </el-row>
      <template #footer>
        <el-row class="dialog-footer">
          <div class="steps-action">
            <el-button @click="onCancel">
              取消
            </el-button>
            <el-button :style="{'margin-left':' 8px'}" type="primary" @click="onConfirm">
              确认
            </el-button>
          </div>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import propertyCellBase from '../common'

import { propertyCellTypeAttr, PropertyTypeEnum } from '../common'
import { layoutEvent } from '@designEngine/03designerLayoutBase/index'
import { layoutEventBehaviors, behavior } from '@behaviorEngine/index'
import behaviorListInPage from './behaviorListInPage.vue'
import behaviorDeatilSetting from './behaviorDeatilSetting.vue'
import behaviorEventBinding from './behaviorEventBinding.vue'
import { behaviorPageType, behaviorListData, behaviorDetailData, behaviorBindingInParam, behaviorListInParam, behaviorDetailInParam } from './model'
import { behaviorIco } from '@designEngine/assets/icons.js'

@propertyCellTypeAttr(PropertyTypeEnum.behavior)
@Options({
  components: {
    behaviorListInPage: behaviorListInPage,
    behaviorDeatilSetting: behaviorDeatilSetting,
    behaviorEventBinding: behaviorEventBinding
  }
})
export default class behaviorControl extends propertyCellBase {
  private getBehaviorComp(compType): Function {
    if (compType === behaviorPageType.binding) {
      return behaviorEventBinding
    } else if (compType === behaviorPageType.list) {
      return behaviorListInPage
    } else if (compType === behaviorPageType.detail) {
      return behaviorDeatilSetting
    }
  }

  private readonly modalBodyStyle: any = { padding: '0px', height: 'calc(100% - 110px)' }
  private behavioricon: any
  private windowVisible: boolean = false
  private record: any = null

  private prePage: behaviorPageType = null
  private currentComp: behaviorPageType = null

  private selectedEventName: string = null
  private currentEventBehavior: layoutEventBehaviors = null

  private currentData: layoutEventBehaviors[] = []
  private designerLayoutEvents: layoutEvent[] = []
  private currentPageBehaviors: behavior[] = []

  private listTempAllBehaviors: behavior[] = []
  private listTempEventBehavior: layoutEventBehaviors = null

  created() {
    this.behavioricon = behaviorIco
  }

  // 开始行为设置
  private startEdit() {
    if (!this.currentLayoutsGetter) {
      return
    }
    if (this.currentLayoutsGetter.length > 1) {
      this.$message.warn('请不要选择多个目标！')
    }

    this.currentPageBehaviors = deepClone(this.currentPage.behaviors)

    this.designerLayoutEvents = deepClone(this.currentLayoutsGetter[0].designerEvents)
    if (this.currentValue) {
      this.currentData = deepClone(this.currentValue) as layoutEventBehaviors[]
    } else {
      this.currentData = []
    }

    this.currentComp = behaviorPageType.binding

    let x = this.record
    let y = this.designerLayoutEvents
    let z = this.currentData
    let u = this.currentPageBehaviors
    this.windowVisible = true
  }

  // 到行为列表页面
  private handleList(backData: behaviorListData) {
    this.selectedEventName = backData.selectedEventName
    this.currentEventBehavior = backData.eventBehavior

    this.record = {
      allBehaviors: this.currentPageBehaviors,
      selectedEventName: backData.selectedEventName,
      eventBehavior: backData.eventBehavior
    }

    this.currentComp = behaviorPageType.list
  }

  // 到行为细节设置页面
  private handleDetail(backData: behaviorDetailData) {
    // this.prePage = backData.prePage

    this.selectedEventName = backData.selectedEventName
    if (backData.listTempAllBehaviors) {
      this.listTempAllBehaviors = backData.listTempAllBehaviors
    }
    if (backData.listTempEventBehavior) {
      this.listTempEventBehavior = backData.listTempEventBehavior
    }

    this.record = { selectedBehavior: backData.selectedBehavior }
    this.currentComp = behaviorPageType.detail
  }

  // 关闭窗口
  private onClose(e: MouseEvent) {
    this.windowVisible = false
    this.initCompData()
  }

  // 取消操作
  private onCancel() {
    switch (this.currentComp) {
      case behaviorPageType.binding: {
        this.windowVisible = false
        this.initCompData()
        break
      }
      case behaviorPageType.list: {
        let bindInData: behaviorBindingInParam = new behaviorBindingInParam()
        bindInData.selectedEventName = this.selectedEventName
        this.record = bindInData

        this.currentComp = behaviorPageType.binding

        this.prePage = null
        break
      }
      case behaviorPageType.detail: {
        if (this.prePage === behaviorPageType.list) {
          let listInData: behaviorListInParam = new behaviorListInParam()
          listInData.selectedEventName = this.selectedEventName
          listInData.eventBehavior = deepClone(this.listTempEventBehavior)
          listInData.allBehaviors = deepClone(this.listTempAllBehaviors)
          this.record = listInData

          this.currentComp = this.prePage
          this.prePage = behaviorPageType.binding
        } else {
          let bindInData: behaviorBindingInParam = new behaviorBindingInParam()
          bindInData.selectedEventName = this.selectedEventName
          this.record = bindInData
          this.currentComp = this.prePage
          this.prePage = null
        }

        break
      }
      default:
        break
    }
  }

  // 确认操作
  private onConfirm() {
    switch (this.currentComp) {
      case behaviorPageType.binding: {
        this.currentValue = deepClone(this.currentData)
        this.currentPage.behaviors = deepClone(this.currentPageBehaviors)
        this.windowVisible = false
        this.initCompData()
        break
      }
      case behaviorPageType.list: {
        this.record = { selectedEventName: this.selectedEventName }
        //保存行为
        if (this.$refs.comp['allBehaviors']) {
          this.currentPageBehaviors = this.$refs.comp['allBehaviors']
        }
        //保存事件行为的绑定关系
        const eventBehavior = this.currentData.find((x) => x.eventName === this.selectedEventName)
        const selectedIds = this.$refs.comp['currentSelectedKeys']
        if (eventBehavior && selectedIds) {
          if (selectedIds.length > 0) {
            //已有的行为ID集合
            const oldIds = eventBehavior.behaviorIds.filter((x) => selectedIds.indexOf(x) >= 0)
            //新增的行为ID集合
            const addIds = selectedIds.filter((s) => eventBehavior.behaviorIds.indexOf(s) < 0)
            eventBehavior.behaviorIds = oldIds.concat(addIds)
          } else {
            eventBehavior.behaviorIds = []
          }
        }

        this.currentComp = behaviorPageType.binding
        break
      }
      case behaviorPageType.detail: {
        let theSettingBehavior: behavior = null
        if (this.$refs.comp['currentSettingBehavior']) {
          theSettingBehavior = this.$refs.comp['currentSettingBehavior']
        }

        if (this.prePage === behaviorPageType.list) {
          if (this.listTempAllBehaviors) {
            let tempBehavior = this.listTempAllBehaviors.find((x) => x.id === theSettingBehavior.id)
            if (tempBehavior) {
              tempBehavior.variableFormulas = theSettingBehavior.variableFormulas
              tempBehavior.inparam = theSettingBehavior.inparam
              tempBehavior.variables = theSettingBehavior.variables
              tempBehavior.actions = theSettingBehavior.actions
            }
          }

          let listInData: behaviorListInParam = new behaviorListInParam()
          listInData.selectedEventName = this.selectedEventName
          listInData.eventBehavior = deepClone(this.listTempEventBehavior)
          listInData.allBehaviors = deepClone(this.listTempAllBehaviors)
          this.record = listInData

          this.currentComp = this.prePage
          this.prePage = behaviorPageType.binding
        } else {
          if (this.currentPageBehaviors) {
            let pageBehavior = this.currentPageBehaviors.find((x) => x.id === theSettingBehavior.id)
            if (pageBehavior) {
              pageBehavior.variableFormulas = theSettingBehavior.variableFormulas
              pageBehavior.inparam = theSettingBehavior.inparam
              pageBehavior.variables = theSettingBehavior.variables
              pageBehavior.actions = theSettingBehavior.actions
            }
          }
          let bindInData: behaviorBindingInParam = new behaviorBindingInParam()
          bindInData.selectedEventName = this.selectedEventName
          this.record = bindInData
          this.currentComp = this.prePage
          this.prePage = null
        }

        break
      }
      default:
        break
    }
  }

  //初始化组件里的数据
  private initCompData() {
    this.record = null
    this.prePage = null
    this.currentComp = null
    this.selectedEventName = null
    this.currentEventBehavior = null
    this.currentData = []
    this.designerLayoutEvents = []
    this.currentPageBehaviors = []
    this.listTempAllBehaviors = []
    this.listTempEventBehavior = null
  }
}
</script>

<style lang="less" scoped>
// @import '@designEngine/assets/globlaTheme.less';
.footterBtns {
  text-align: right;
  height: 50px;
  align-self: center;
}

.steps-action {
  margin-top: 12px;
  text-align: right;
}

.behavior-footer {
  position: absolute;
  background-color: #fff;
  bottom: 0px;
  right: 0px;
  width: 100%;
  border: 1px solid #ccc;
  padding-left: 0px;
  padding-top: 0px;
  padding-bottom: 12px;
  padding-right: 36px;
}

.behavior-header-title {
  font-size: 18px;
  margin: 0px 0px 10px 20px;
}
</style>
 