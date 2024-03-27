<template>
  <div>
    <el-button type="primary" class="themeButton"
      style="width:118px;height:34px;background:rgba(0,103,138,0.1);border-color:rgba(0,103,138,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEdit" size="small">
      行为绑定
    </el-button>
    <!-- ************************************************************ -->
    <el-dialog ref="previewPopup" class="bhaviorDialog" title="行为绑定" style="height:600px" width="800px" v-model="windowVisible" append-to-body
      :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row style="height:480px;width:100%;background:#FFF">
        <behaviorEventBinding v-if="currentComp==='eventBinding'" :designerLayoutEvents="designerLayoutEvents" :currentData="currentData"
          :currentPageBehaviors="currentPageBehaviors" @onList="onOpenBehaviorList" />
        <behaviorListInPage v-if="currentComp==='allBehaviorList'" ref="behaviorList" :currentPage="currentPage" />
      </el-row>
      <!-- ************************************************************ -->
      <template #footer>
        <el-row v-if="currentComp==='eventBinding'" class="dialog-footer">
          <div class="steps-action">
            <el-button @click="onCancel">
              取消
            </el-button>
            <el-button :style="{'margin-left':' 8px'}" type="primary" @click="onConfirm">
              确认
            </el-button>
          </div>
        </el-row>
        <!-- ************************************************************* -->
        <el-row v-if="currentComp==='allBehaviorList'" class="dialog-footer">
          <div class="steps-action">
            <el-button @click="onBackUp">
              取消
            </el-button>
            <el-button :style="{'margin-left':' 8px'}" type="primary" @click="onSureReference">
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
import { layoutEvent, layoutEventBehaviors } from '@designEngine/index'
import { behavior } from '@behaviorEngine/index'
import { behaviorBindingInParam, behaviorPageType, behaviorListData, behaviorDetailData } from './model'
import behaviorEventBinding from './behaviorEventBinding.vue'
import behaviorListInPage from './behaviorListInPage.vue'
import { toRaw } from 'vue'

@propertyCellTypeAttr(PropertyTypeEnum.behavior)
@Options({
  components: { behaviorEventBinding, behaviorListInPage }
})
export default class index extends propertyCellBase {
  private currentComp: string = 'eventBinding' //eventBinding,allBehaviorList

  private designerLayoutEvents: layoutEvent[] = []
  private currentPageBehaviors: behavior[] = []
  private currentData: layoutEventBehaviors[] = []

  private windowVisible: boolean = false
  private startEdit() {
    if (!this.currentLayoutsGetter) {
      return
    }
    if (this.currentLayoutsGetter.length > 1) {
      alert('请不要选择多个目标！')
    }

    this.windowVisible = true
    this.loadBaseData()
  }

  private loadBaseData() {
    this.currentComp = 'eventBinding'
    // 当前选中控件已经绑定的行为列表
    this.currentPageBehaviors = deepClone(this.currentPage.behaviors)
    // 当前选中控件的事件列表
    this.designerLayoutEvents = deepClone(this.currentLayoutsGetter[0].designerEvents)
    //当前选中控件的事件已绑定的行为
    if (this.currentValue) {
      this.currentData = deepClone(this.currentValue) as layoutEventBehaviors[]
    } else {
      this.currentData = []
    }

    let x = this.currentData
    debugger
  }
  // ************事件绑定行为控件********************************************************
  private selectedEventName: string = ''
  // 打开行为列表页面
  private onOpenBehaviorList(backData: behaviorListData) {
    this.currentComp = 'allBehaviorList'
    this.selectedEventName = backData.selectedEventName
    // this.currentEventBehavior = backData.eventBehavior
    // this.record = {
    //   allBehaviors: this.currentPageBehaviors,
    //   selectedEventName: backData.selectedEventName,
    //   eventBehavior: backData.eventBehavior
    // }
    // this.currentComp = behaviorPageType.list
  }
  // ********************************************************************
  private onClose(e: MouseEvent) {
    this.windowVisible = false
  }
  private onConfirm() {
    let x = this.currentData
    debugger
    this.currentValue = this.currentData
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }
  private onBackUp() {
    this.currentComp = 'eventBinding'
  }

  private onSureReference() {
    let res = (this.$refs.behaviorList as any).getSelectedBehaviors() as behavior[]
    let x = this.currentData
    debugger
    let bids: string[] = []
    for (let index = 0; index < res.length; index++) {
      const element = res[index]
      bids.push(element.id)
    }

    let findeventbind = this.currentData.find((o) => o.eventName === this.selectedEventName)
    if (!findeventbind) {
      debugger
      this.currentData.push({ eventName: this.selectedEventName, behaviorIds: [] })
    }
    findeventbind = this.currentData.find((o) => o.eventName === this.selectedEventName)
    findeventbind.behaviorIds = bids
    this.currentComp = 'eventBinding'
    debugger
  }
}
</script>

<style lang="less" scoped>
</style>
 