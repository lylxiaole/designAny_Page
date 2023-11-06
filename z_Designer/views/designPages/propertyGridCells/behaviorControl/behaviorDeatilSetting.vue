<template style="height:100%">
  <a-layout style="height:100%;background:#FFF;">
    <a-row style="height:100%;background:#FFF;">
      <a-col style="height:100%;background:#FFF;" :span="6">
        <a-layout style="height:100%;background:#FFF;">
          <a-layout style="height:54px;padding:0px 0px 8px 8px;background:#FFF;">
            <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6"
              class="flexHorilanLayout">
              <div style="background:#18aeb7;width:6px;height:46px;"></div>
              <span style="margin-left:9px;float:left;fontSize:18px">动作</span>
            </div>
          </a-layout>
          <a-layout style="height:calc(100% - 54px);width:100%;background:#eeeeee;">
            <a-layout-content style="height:100%;width:100%;background:#FFF;">
              <behaviorTree style="height:100%;width:100%;background:#eeeeee;" :currentLayout="currentLayout" :currentPage="currentPage"
                :currentSettingBehavior="currentSettingBehavior" :actionFactory="actionFactory" @currentActionChanged="currentActionChanged" />
            </a-layout-content>
          </a-layout>
        </a-layout>
      </a-col>
      <a-col style="height:100%;" :span="18">
        <a-layout style="height:100%;">
          <a-layout style="height:54px;padding:0px 0px 8px 8px;background:#FFF;">
            <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6"
              class="flexHorilanLayout">
              <div style="background:#18aeb7;width:6px;height:46px;"></div>
              <span style="margin-left:9px;float:left;fontSize:18px">配置条件</span>
            </div>
          </a-layout>
          <a-layout style="height:40%;padding:8px;overflow-y:auto;background:#FFF;">
            <formulaSetting :forType="forType" :currentActionDetail="currentActionDetail" :actionFactory="actionFactory"
              @onFocusFormula="onFocusFormula" />
          </a-layout>
          <a-layout style="height:54px;padding:0px 0px 8px 8px;background:#FFF;">
            <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6"
              class="flexHorilanLayout">
              <div style="background:#18aeb7;width:6px;height:46px;"></div>
              <span style="margin-left:9px;float:left;fontSize:18px">参数</span>
              <a-button type="primary" size="small" style="margin-left:24px;" icon="unordered-list" @click="showModelList">模型实例</a-button>
            </div>
          </a-layout>
          <a-layout style="height:54%;padding:8px;overflow-y:auto;background:#FFF;">
            <formulaInParamSetting :actionFactory="actionFactory" :currentObj="currentFocusObj" />
          </a-layout>
        </a-layout>
      </a-col>
    </a-row>
    <modelListPop :isShow="modelListVisible" :currentPage="currentPage" @close="closeModelList"></modelListPop>
  </a-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import {} from '../../02common/commonMethod'

import {
  layoutEventBehaviors,
  behavior,
  action,
  actionDetail,
  factory,
  resourceType,
  formulaType,
  objectBase,
  objectType,
  object_Method,
} from '../../02common/behavior'
import PageBase from '../../05designerLayouts/PageBase'
import LayoutBase from '../../03designerLayoutBase/LayoutBase'
import behaviorTree from './behaviorTree/behaviorTree.vue'
import formulaSetting from './formulaSetting/formulaSetting.vue'
import formulaInParamSetting from './formulaSetting/formulaInParamSetting.vue'
import { pageSearchBase } from '../../02common/behavior/04_actionReaourceTree'
import { behaviorPageType, behaviorDetailInParam } from './model'
import modelListPop from '../bindingModels/modelListPop.vue'

@Component({
  components: {
    behaviorTree: behaviorTree,
    formulaSetting: formulaSetting,
    formulaInParamSetting: formulaInParamSetting,
    modelListPop: modelListPop,
  },
})
export default class behaviorDeatilSetting extends Vue {
  @Prop() prePage: behaviorPageType
  @Prop() currentLayout: LayoutBase
  @Prop() currentPage: PageBase
  @Prop() record: behaviorDetailInParam

  /**当前正在设置的行为 */
  private currentSettingBehavior: behavior = null
  //行为明细中，当前被选中的对象
  private currentFocusObj: objectBase = null
  private currentActionDetail: actionDetail = null
  private actionFactory: factory = null
  private forType: formulaType = formulaType.cute
  private modelListVisible: boolean = false

  created() {
    if (this.record && this.record.selectedBehavior) {
      this.currentSettingBehavior = common.clone(this.record.selectedBehavior)
    }
    this.actionFactory = new factory(this.currentLayout, this.currentPage, this.currentSettingBehavior)
    pageSearchBase.currentPage = this.currentPage
    pageSearchBase.actionFctory = this.actionFactory
    pageSearchBase.currentBehavior = this.currentSettingBehavior
  }

  @Watch('currentSettingBehavior', { deep: true, immediate: true })
  private oncurrentSettingBehaviorChanged(newval: behavior, oldval: behavior) {
    if (oldval != newval) {
      this.currentActionDetail = null
      this.currentFocusObj = null
    }
  }

  private currentActionChanged(newval: actionDetail | action) {
    // window.console.log('选择的动作节点变化了')
    if (newval == null || (newval as any).actionDetails) {
      this.currentActionDetail = null
    } else {
      if (!(newval as actionDetail).objs) {
        this.currentActionDetail.objs = []
      }
      this.currentActionDetail = newval as actionDetail
    }
    this.currentFocusObj = null
  }
  //处理就数据
  private dealOldJsonData(objJsonData: objectBase[]): objectBase[] {
    var newobjs: objectBase[] = []

    //将就数据重新实例化成类型
    for (let index = 0; index < objJsonData.length; index++) {
      const obj = objJsonData[index]
      var newObjClone = this.actionFactory.makeObject(obj.resourceId, obj.name, obj.objType, obj.resourceType)
      newObjClone.cloneFrom(obj)
      newobjs.push(newObjClone)
    }
    return newobjs
  }
  /**判断节点是否是动作 */
  private nodeIsAction(node: actionDetail | action): boolean {
    if ((node as action).actionDetails) {
      return true
    } else {
      return false
    }
  }

  private onFocusFormula(obj: objectBase) {
    this.currentFocusObj = obj
    if (this.currentFocusObj) {
      this.currentFocusObj.updateInparamsFunction()
    }
  }

  private showModelList(): void {
    this.modelListVisible = true
  }

  private closeModelList(): void {
    window.console.log('closeModelList')
    this.modelListVisible = false
  }
}
</script>

<style scoped>
</style>