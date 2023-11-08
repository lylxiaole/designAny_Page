 <template>
  <a-modal :maskClosable="false" title="配置条件" :destroyOnClose="true" v-model="isVisible" :width="900" @ok="onOk" @cancel="handleCancel"
    :cancelButtonProps="{ props: {icon: 'close'}}" :okButtonProps="{ props: {icon: 'check'}}" cancelText="取消" okText="确定">
    <a-layout style="height:500px">
      <a-layout style="background:transparent;height:40%;padding:8px;overflow-y:auto">
        如果:
        <formulaSetting :forType="forType" :currentActionDetail="currentActionDetail" :actionFactory="actionFactory"
          @onFocusFormula="onFocusFormula" />
      </a-layout>
      <a-layout style="background:transparent;height:10%;padding:8px;overflow-y:auto">
        <div style="width:100%;height:100%;justify-content:left;padding:6px 0px;overflow:hidden;background-color:#F6F6F6" class="flexHorilanLayout">
          <div style="background:#18aeb7;width:6px;height:20px; "></div>
          <span style="margin-left:9px;float:left;fontSize:18px">参数</span>
        </div>
      </a-layout>
      <a-layout style="background:transparent;height:54%;padding:8px;overflow-y:auto">
        <formulaInParamSetting :actionFactory="actionFactory" :currentObj="currentFocusObj" />
      </a-layout>
    </a-layout>
  </a-modal>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'

import { EnginePage, EngineComponent, EngineLayout } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'

import {
  groupNode,
  action,
  behavior,
  factory,
  actionDetail,
  objectBase,
  objectType,
  object_Variable,
  object_FixedVal,
  object_Method,
  formulaType,
  resourceType
} from '@designEngine/index'
import { getSearchClass, pageSearchBase } from '@designEngine/index'
import formulaSetting from '../formulaSetting/formulaSetting.vue'
import formulaInParamSetting from '../formulaSetting/formulaInParamSetting.vue'
import resouceChooseComp from '../behaviorResources/resouceChooseComp.vue'

@Options({
  components: {
    resouceChooseComp: resouceChooseComp,
    formulaSetting: formulaSetting,
    formulaInParamSetting: formulaInParamSetting
  }
})
export default class actionFilterSetting extends Vue {
  @Prop() currentLayout: LayoutBase
  @Prop() currentPage: PageBase
  @Prop() currentSettingBehavior: behavior

  @Prop() isVisible: boolean
  @Prop() currentAction: action

  @Emit('update:isVisible')
  private updateIsVisible_Inner(val: any) {}

  @Watch('isVisible')
  onVisibleChanged(val: boolean) {
    if (val == false) {
      return
    }

    this.actionFactory = new factory(this.currentLayout, this.currentPage, this.currentSettingBehavior)
    pageSearchBase.currentPage = this.currentPage
    pageSearchBase.actionFctory = this.actionFactory
    pageSearchBase.currentBehavior = this.currentSettingBehavior
    //
    //window.console.log('设置动作的判断条件')
    if (!this.currentAction.judgingCondition) {
      this.currentAction.judgingCondition = []
    }
    var newactdeatil = new actionDetail()
    newactdeatil.isActionDetail = true
    newactdeatil.id = getUuid()
    // newactdeatil.objs = this.dealOldJsonData(this.currentAction.judgingCondition)
    newactdeatil.objs = this.currentAction.judgingCondition
    this.currentActionDetail = newactdeatil
  }

  private dealOldJsonData(objJsonData: objectBase[]): objectBase[] {
    var newobjs: objectBase[] = []

    //将就数据重新实例化成类型
    for (let index = 0; index < objJsonData.length; index++) {
      const obj = objJsonData[index]
      var newObjClone = this.actionFactory.makeObject(obj.resourceId, obj.name, obj.objType, obj.resourceType)
      newObjClone.cloneFrom(obj)
      newobjs.push(newObjClone)
    }
    // objJsonData.filter((jsondata) => {
    //   jsondata = this.actionFactory.makeObject(jsondata.resourceId, jsondata.name, jsondata.objType, jsondata.resourceType)
    // })
    //如果当前动作细节里面没有对象，添加一个
    if (newobjs.length < 1) {
      var first = this.actionFactory.makeObject(getUuid(), '新建变量', objectType.variable, resourceType.variables)
      newobjs.push(first)
    }
    return newobjs
  }

  /**为了复用公式编辑界面，这个使用外部action来创造一个 actionDetail，*/
  private actionFactory: factory = null
  private currentActionDetail: actionDetail = null
  private currentFocusObj: objectBase = null
  private forType: formulaType = formulaType.filter

  private onFocusFormula(obj: objectBase) {
    this.currentFocusObj = obj
  }

  private onOk() {
    // window.console.log('关闭弹窗')
    this.updateIsVisible_Inner(false)
    this.currentAction.judgingCondition = this.currentActionDetail.objs
  }
  private handleCancel() {
    this.updateIsVisible_Inner(false)
  }
}
</script>
