<template>
  <div style="padding:0px 10px;height:100%;">
    <div v-for="objParam in currentInParams" :key="objParam.obj.id"
      style="width:100%;padding:4px; display: flex;flex-wrap: nowrap;justify-content: left;align-items: left;">
      <span style="width:30%;text-align:right;padding-right:8px;margin-top:5px">{{objParam.name}}:</span>
      <bahaviorResourceSelectTree style="width:70%" :currentObj="objParam.obj" :canDeleteObj="currentObj&&currentObj.dynamic"
        :resourceTypesNotAllow="resourceTypesNotAllow" @onSelectNodeChanged="onSelectNodeChanged" @onDelete="onDeleteFormula" />
    </div>

    <div class="flexHorilanLayout" v-if="currentObj&&currentObj.dynamic">
      <a-modal :maskClosable="false" title="入参名称" v-model="newParanamVisible" width="350px" :destroyOnClose="true" @cancel="onCancelNewParam"
        @ok="onSureNewParam" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}" cancelText="取消" okText="确定">
        <a-input v-model="newParamName" />
      </a-modal>
      <a-button type="primary" @click="addParam">
        <a-icon type="plus" />添加参数
      </a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../../02common/commonMethod'
import PageBase from '../../../03designerLayoutBase/PageBase'
import bahaviorResourceTree from '../behaviorResources/behaviorResourcesSelect.vue'
import { param } from '../../../02common/commonClasses/layoutEvent'
import { message } from 'ant-design-vue'
import {
  layoutEventBehaviors,
  behavior,
  action,
  actionDetail,
  groupNode,
  objectBase,
  objectType,
  object_Method,
  object_Method_InParam,
  factory,
  resourceType
} from '../../../02common/behavior'

@Component({
  components: {
    bahaviorResourceSelectTree: bahaviorResourceTree
  }
})
export default class formulaInParamSetting extends Vue {
  @Prop() currentObj: object_Method
  @Prop() actionFactory: factory

  @Watch('currentObj', { deep: true, immediate: true })
  private onCurrentObjChange(newval: any) {
    // window.console.log('入参设置,当前选择的类型实例', newval)
  }

  private get resourceTypesNotAllow(): string[] {
    var array: string[] = []
    array.push(resourceType.workflows)
    array.push(resourceType.controlMethods)
    return array
  }

  //公式的入参
  private get currentInParams(): object_Method_InParam[] {
    if (!this.currentObj || this.currentObj.objType != objectType.method) {
      return []
    }
    var objmeth = this.currentObj as object_Method

    for (let index = 0; index < objmeth.inputParams.length; index++) {
      var param = objmeth.inputParams[index]
      var newobj = this.actionFactory.makeObject(param.obj.resourceId, param.obj.name, param.obj.objType, param.obj.resourceType)
      newobj.cloneFrom(param.obj)
      param.obj = newobj
    }
    return objmeth.inputParams
  }
  //
  private onSelectNodeChanged(newObj: objectBase, oldObj: objectBase) {
    if (!newObj) {
      return
    }
    // window.console.log('替换参数节点')
    var newObjClone = this.actionFactory.makeObject(newObj.resourceId, newObj.name, newObj.objType, newObj.resourceType)
    newObjClone.cloneFrom(newObj)
    newObjClone.id = common.getUuid()
    //找到原有节点，并用新的节点替代
    var currentObjMethod = this.currentObj as object_Method
    var findInParam = currentObjMethod.inputParams.find((o) => o.obj == oldObj)
    findInParam.obj = newObjClone
  }

  private addParam() {
    this.newParamName = ''
    this.newParanamVisible = true
  }

  newParamName: string = ''
  newParanamVisible: boolean = false
  private onDeleteFormula(obj: objectBase) {
    var find = this.currentObj.inputParams.find((o) => o.obj == obj)
    var index = this.currentObj.inputParams.indexOf(find)
    this.currentObj.inputParams.splice(index, 1)
  }

  private onCancelNewParam() {
    this.newParanamVisible = false
  }
  private onSureNewParam() {
    if (!this.newParamName) {
      return
    }
    var findsamename = this.currentObj.inputParams.find((o) => o.name == this.newParamName)
    if (findsamename) {
      this.$message.success('已经定义了相同名称的参数!', 3)
      return
    }

    var newobj = this.actionFactory.makeObject(common.getUuid(), this.newParamName, objectType.fixedVal, resourceType.fixedVal)
    this.currentObj.inputParams.push({ name: this.newParamName, obj: newobj, isModel: false })
    this.newParanamVisible = false
  }
}
</script>



<style scoped>
@import '../../../assets/globlaTheme.less';
</style>