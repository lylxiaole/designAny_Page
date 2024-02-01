<template style="height:100%">
  <el-row style="height:100%;background:#FFF;">
    <el-row style="height:100%;background:#FFF;">
      <el-col style="height:100%;background:#FFF;width:220px;max-width:220px">
        <el-row style="height:100%;background:#FFF;">
          <el-row style="height:54px;background:#FFF;">
            <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6"
              class="flexHorilanLayout">
              <div style="background:#18aeb7;width:6px;height:46px;"></div>
              <span style="margin-left:9px;float:left;fontSize:18px">动作</span>
            </div>
          </el-row>
          <el-row style="height:calc(100% - 54px);width:100%;background:#eeeeee;">
            <el-row style="height:100%;width:100%;background:#FFF;">
              <behaviorTree style="height:100%;width:100%;background:#eeeeee;" v-model:currentLayout="currentLayout" v-model:currentPage="currentPage"
                v-model:currentSettingBehavior="currentSettingBehavior" v-model:actionFactory="actionFactory"
                @currentSelectAction="currentSelectAction" />
            </el-row>
          </el-row>
        </el-row>
      </el-col>
      <el-col style="height:100%;width:calc(100% - 220px);max-width:calc(100% - 220px)">
        <el-row style="height:100%;">
          <el-row style="height:54px;padding:0px 0px 8px 8px;background:#FFF;">
            <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6"
              class="flexHorilanLayout">
              <div style="background:#18aeb7;width:6px;height:46px;"></div>
              <span style="margin-left:9px;float:left;fontSize:18px">配置条件</span>
            </div>
          </el-row>
          <el-row style="height:40%;padding:8px;overflow-y:auto;background:#FFF;">
            <formulaSetting :forType="forType" :currentActionDetail="currentActionDetail" :actionFactory="actionFactory"
              @onFocusFormula="onFocusFormula" />
          </el-row>
          <el-row style="height:54px;padding:0px 0px 8px 8px;background:#FFF;">
            <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6"
              class="flexHorilanLayout">
              <div style="background:#18aeb7;width:6px;height:46px;"></div>
              <span style="margin-left:9px;float:left;fontSize:18px">参数</span>
            </div>
          </el-row>
          <el-row style="height:54%;padding:8px;overflow-y:auto;background:#FFF;">
            <formulaInParamSetting :actionFactory="actionFactory" :currentObj="currentFocusObj" />
          </el-row>
        </el-row>
      </el-col>
    </el-row>
  </el-row>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { behavior, action, actionDetail, factory, resourceType, formulaType, objectBase, objectType, object_Method } from '@behaviorEngine/index'
import { EnginePage, EngineComponent, EngineLayout, layoutEventBehaviors } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'

import behaviorTree from './behaviorTree/behaviorTree.vue'
import formulaSetting from './formulaSetting/formulaSetting.vue'
import formulaInParamSetting from './formulaSetting/formulaInParamSetting.vue'
import { behaviorPageType, behaviorDetailInParam } from './model'

@Options({
  components: {
    behaviorTree: behaviorTree,
    formulaSetting: formulaSetting,
    formulaInParamSetting: formulaInParamSetting
  }
})
export default class behaviorDeatilSetting extends Vue {
  currentLayout: EngineLayout = null
  currentPage: EnginePage = null
  /**当前正在设置的行为 */
  currentSettingBehavior: behavior = null

  //行为明细中，当前被选中的对象
  private currentFocusObj: objectBase = null
  private currentActionDetail: actionDetail = null
  private actionFactory: factory = null
  private forType: formulaType = formulaType.cute

  public init(behav: behavior, layout: EngineLayout, page: EnginePage) {
    this.currentSettingBehavior = behav
    this.currentLayout = layout
    this.currentPage = page

    // **************************************************
    this.actionFactory = new factory(this.currentLayout, this.currentPage, this.currentSettingBehavior)
  }

  @Watch('currentSettingBehavior', { deep: true, immediate: true })
  private oncurrentSettingBehaviorChanged(newval: behavior, oldval: behavior) {
    if (oldval != newval) {
      this.currentActionDetail = null
      this.currentFocusObj = null
    }
  }

  private currentSelectAction(newval: actionDetail | action) {
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
      var newObjClone = this.actionFactory.makeObject('', obj.name, '' as any, obj.resourceType)
      // newObjClone.cloneFrom(obj)
      // newobjs.push(newObjClone)
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
    }
  }
}
</script>

<style scoped>
</style>