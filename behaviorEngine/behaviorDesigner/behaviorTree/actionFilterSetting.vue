 <template>
  <el-dialog v-model="isVisible" title="配置条件" append-to-body :close-on-click-modal="false" :close-on-press-escape="false">

    <!-- <a-modal :maskClosable="false" title="配置条件" :destroyOnClose="true" v-model="isVisible" :width="900" @ok="onOk" @cancel="handleCancel"
      :cancelButtonProps="{ props: {icon: 'close'}}" :okButtonProps="{ props: {icon: 'check'}}" cancelText="取消" okText="确定"> -->
    <el-row style="height:500px">
      <el-row style="background:transparent;height:100%;padding:8px;overflow-y:auto;overflow-x:hidden">
        如果:
        <formulaSetting :forType="forType" :currentActionDetail="currentActionDetail" :actionFactory="actionFactory"
          @onFocusFormula="onFocusFormula" />
      </el-row>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="onOk">确认</el-button>
      </span>
    </template>
    <!-- </a-modal> -->
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'

import { EnginePage, EngineComponent, EngineLayout } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'

import {
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
} from '@behaviorEngine/index'
import formulaSetting from '../formulaSetting/formulaSetting.vue'

@Options({
  components: {
    formulaSetting: formulaSetting
  }
})
export default class actionFilterSetting extends Vue {
  @Prop() currentPage: EnginePage
  @Prop() currentSettingBehavior: behavior

  isVisible: boolean = false
  currentAction: action

  public show(act: action) {
    this.isVisible = true
    this.currentAction = act
  }

  @Watch('isVisible')
  onVisibleChanged(val: boolean) {
    if (val == false) {
      return
    }

    this.actionFactory = new factory(null, this.currentPage, this.currentSettingBehavior)

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
      var newObjClone = this.actionFactory.makeObject(obj.resourceType)
      newObjClone.cloneFrom(obj)
      newobjs.push(newObjClone)
    }
    // objJsonData.filter((jsondata) => {
    //   jsondata = this.actionFactory.makeObject(jsondata.resourceId, jsondata.name, jsondata.objType, jsondata.resourceType)
    // })
    //如果当前动作细节里面没有对象，添加一个
    if (newobjs.length < 1) {
      var first = this.actionFactory.makeObject(resourceType.variables)
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
    this.isVisible = false

    this.currentAction.judgingCondition = this.currentActionDetail.objs
  }
  private handleCancel() {
    this.isVisible = false
  }
}
</script>
