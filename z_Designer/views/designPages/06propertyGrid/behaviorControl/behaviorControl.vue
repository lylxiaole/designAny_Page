<template>
  <div>
    <a-button type="primary" class="themeButton"
      style="width:118px;height:34px;background:rgba(0,103,138,0.1);border-color:rgba(0,103,138,0.1);border-radius:4px;font-size:14px;font-weight:400;color:rgba(0,0,0,1);line-height:12px;"
      @click="startEdit" size="small">
      <a-icon style="font-size:20px" :component="behavioricon" />行为设置</a-button>
    <a-modal ref="previewPopup" title="行为设置" style="height:80.37%" width="70.94%" centered :bodyStyle="modalBodyStyle" class="behavior-modal"
      :visible="windowVisible" :maskClosable="false" destroyOnClose :footer="null" @cancel="onClose">
      <a-layout style="height:100%;background:#FFF">
        <component ref="comp" :prePage="prePage" :record="record" :currentData="currentData" :designerEvents="designerLayoutEvents"
          :currentPageBehaviors="currentPageBehaviors" :currentPage="currentPage" :currentLayout="currentLayouts" :is="currentComp"
          @onList="handleList" @onDetail="handleDetail">
        </component>
        <a-layout-footer class="behavior-footer">
          <div class="steps-action">
            <a-button @click="onCancel">
              取消
            </a-button>
            <a-button :style="{'margin-left':' 8px'}" type="primary" @click="onConfirm">
              确认
            </a-button>
          </div>
        </a-layout-footer>
      </a-layout>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { deepClone } from '@src/utils'
import { PageBase } from '@src/designEngine/03designerLayoutBase'
import propertyCellBase from '../propertyCellBase'
import { propertyCellTypeAttr, PropertyTypeEnum } from '../commonTypes'
import { layoutEvent } from '@src/designEngine/03designerLayoutBase'
import { layoutEventBehaviors, behavior } from '@src/designEngine/03designerLayoutBase/behavior'
import behaviorListInPage from './behaviorListInPage.vue'
import behaviorDeatilSetting from './behaviorDeatilSetting.vue'
import behaviorEventBinding from './behaviorEventBinding.vue'
import { behaviorPageType, behaviorListData, behaviorDetailData, behaviorBindingInParam, behaviorListInParam, behaviorDetailInParam } from './model'
// import { behaviorIco } from '../../assets/icons.js'
import { alert } from 'devextreme/ui/dialog'

@propertyCellTypeAttr(PropertyTypeEnum.behavior)
@Component({
  components: {
    behaviorListInPage: behaviorListInPage,
    behaviorDeatilSetting: behaviorDeatilSetting,
    behaviorEventBinding: behaviorEventBinding
  }
})
export default class behaviorControl extends propertyCellBase {
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
    // this.behavioricon = behaviorIco
  }

  // 开始行为设置
  private startEdit() {
    if (!this.currentLayoutsGetter) {
      return
    }
    if (this.currentLayoutsGetter.length > 1) {
      // alert('请不要选择多个目标！')
    }

    this.currentPageBehaviors = deepClone(this.currentPage.behaviors)
    this.designerLayoutEvents = deepClone(this.currentLayoutsGetter[0].designerEvents)
    if (this.currentValue) {
      this.currentData = deepClone(this.currentValue) as layoutEventBehaviors[]
    } else {
      this.currentData = []
    }
    this.currentComp = behaviorPageType.binding
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
    this.prePage = backData.prePage
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
@import '../../assets/globlaTheme.less';
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
 