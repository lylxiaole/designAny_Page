<template style="height:100%">
  <el-dialog ref="previewPopup" class="bhaviorDialog" title="行为绑定" style="height:600px" width="800px" v-model="windowVisible" append-to-body
    :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row style="height:calc(100% - 130px);background:#FFF;">
      <el-col :span="6" style="border-right:1px solid #cdcdcd">
        <behaviorTree style="height:100%;width:100%;background:#eeeeee;" v-model:currentPage="currentPage"
          v-model:currentSettingBehavior="currentSettingBehavior" v-model:actionFactory="actionFactory" @currentSelectAction="currentSelectAction" />
      </el-col>
      <el-col :span="12" style="border-right:1px solid #cdcdcd">
        <formulaSetting :currentActionDetail="currentActionDetail" :actionFactory="actionFactory" @onFocusFormula="onFocusFormula" />
      </el-col>
      <el-col :span="6">
        <!-- <formulaInParamSetting :actionFactory="actionFactory" :currentObj="currentFocusObj" /> -->
      </el-col>
    </el-row>
    <template #footer>
      <el-row class="dialog-footer" style="height:50px">
        <div class="steps-action">
          <el-button @click="onCancel">
            取消
          </el-button>
          <el-button :style="{'margin-left':'8px'}" type="primary" @click="onConfirm">
            确认
          </el-button>
        </div>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { ref, toRaw } from '@vue/reactivity'

import { Component, Emit, Watch, Prop, Ref } from 'vue-property-decorator'
import { behavior, action, actionDetail, factory, objectBase, objectType, object_Method } from '@behaviorEngine/index'
import { EnginePage, EngineComponent, EngineLayout, layoutEventBehaviors } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'

import behaviorTree from './behaviorTree/behaviorTree.vue'
import formulaSetting from './formulaSetting/formulaSetting.vue'
// import formulaInParamSetting from './formulaSetting/formulaInParamSetting.vue'

@Options({
  components: {
    behaviorTree: behaviorTree,
    formulaSetting: formulaSetting
    // formulaInParamSetting: formulaInParamSetting
  }
})
export default class behaviorDeatilSetting extends Vue {
  // ************************************************************
  private windowVisible: boolean = false
  public show(behav: behavior, page: EnginePage) {
    this.currentSettingBehavior = behav
    this.currentPage = page
    // **************************************************
    this.actionFactory = new factory(null, this.currentPage, this.currentSettingBehavior)
    this.windowVisible = true
  }
  private onClose() {
    this.windowVisible = false
  }
  private onConfirm() {
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }
  // ***********************************************************
  currentPage: EnginePage = null
  /**当前正在设置的行为 */
  currentSettingBehavior: behavior = null
  //行为明细中，当前被选中的对象
  private currentFocusObj: objectBase = null
  private currentActionDetail: actionDetail | action = null
  private actionFactory: factory = null

  @Watch('currentSettingBehavior', { deep: true, immediate: true })
  private oncurrentSettingBehaviorChanged(newval: behavior, oldval: behavior) {
    if (oldval != newval) {
      this.currentActionDetail = null
      this.currentFocusObj = null
    }
  }

  private currentSelectAction(newval: actionDetail | action) {
    window.console.log('1动作节点变化了', newval)

    this.currentActionDetail = newval
    this.currentFocusObj = null
  }
  //处理就数据
  private dealOldJsonData(objJsonData: objectBase[]): objectBase[] {
    var newobjs: objectBase[] = []

    //将就数据重新实例化成类型
    for (let index = 0; index < objJsonData.length; index++) {
      const obj = objJsonData[index]
      var newObjClone = this.actionFactory.makeObject(obj.funcCode)
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