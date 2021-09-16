
/**
 * 行为设置
 * By LYL
 * 日期
 */
<template>
  <div style="width:100%">
    <div style="padding:0px 10px;width:100%;position:relative">
      <div v-for="obj in currentObjs" :key="obj.id" class="flexHorilanLayout" style="float:left;margin: 4px;">
        <bahaviorResourceSelectTree :forType="forType" :currentObj.sync="obj" :canDeleteObj="true" @onSelectNodeChanged="onSelectNodeChanged"
          @onFocus="onFocusFormula" @onDelete="onDeleteFormula" />
      </div>
    </div>
    <div style="position:relative;width:100%;">
      <a-button v-if="currentActionDetail" @click="addObj" style="margin-left:8px;float:right" type="primary" shape="circle" icon="plus" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import common from '../../../02common/commonMethod'
import PageBase from '../../../05designerLayouts/PageBase'
import {
  layoutEventBehaviors,
  behavior,
  action,
  actionDetail,
  allCuteSigns,
  formulaType,
  allFilterSigns,
  objectBase,
  objectType,
  resourceType,
  object_Method,
  object_callback,
  factory,
} from '../../../02common/behavior'
import bahaviorResourceSelectTree from '../behaviorResources/bahaviorResourceSelectTree'
import bahaviorResourceTree from '../behaviorResources/behaviorResourcesSelect.vue'

@Component({
  components: {
    bahaviorResourceSelectTree: bahaviorResourceTree,
  },
})
export default class formulaSetting extends Vue {
  @Prop() behaviorResources: any
  @Prop() currentActionDetail: actionDetail
  @Prop() actionFactory: factory
  @Prop() forType: formulaType

  get currentObjs(): objectBase[] {
    if (!this.currentActionDetail) {
      return []
    }

    if (!this.currentActionDetail.objs) {
      this.currentActionDetail.objs = []
    }

    this.currentActionDetail.objs = this.dealOldJsonData(this.currentActionDetail.objs)
    return this.currentActionDetail.objs
  }

  mounted() {
    // if (this.currentActionDetail.objs && this.currentActionDetail.objs.length < 1) {
    //   var first = this.actionFactory.makeObject(common.getUuid(), '新建变量', objectType.variable, resourceType.variables)
    //   newobjs.push(first)
    // }
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

  @Watch('currentActionDetail')
  watchCurrentActionChanged(newval: actionDetail) {
    if (!newval) {
      return
    }
  }

  private onSelectNodeChanged(newObj: objectBase, oldObj: objectBase) {
    if (!newObj) {
      return
    }
    // window.console.log('重新选择了节点')
    var newObjClone = this.actionFactory.makeObject(newObj.resourceId, newObj.name, newObj.objType, newObj.resourceType)
    newObjClone.cloneFrom(newObj)
    newObjClone.id = common.getUuid()
    var selectFormulaIndex = this.currentActionDetail.objs.indexOf(oldObj)
    //替换旧节点
    this.currentActionDetail.objs.splice(selectFormulaIndex, 1, newObjClone)
    this.onFocusFormula(newObjClone)
  }

  //添加一个公式
  private addObj() {
    var obj = this.currentActionDetail.objs[this.currentActionDetail.objs.length - 1]
    if (!obj || obj.objType == objectType.signs) {
      let newobj = this.actionFactory.makeObject(common.getUuid(), '', objectType.fixedVal, resourceType.fixedVal)
      this.currentActionDetail.objs.push(newobj)
    } else if (this.forType == formulaType.cute) {
      let newobj = this.actionFactory.makeObject(common.getUuid(), '等于', objectType.signs, resourceType.signs)
      this.currentActionDetail.objs.push(newobj)
    } else if (this.forType == formulaType.filter) {
      let newobj = this.actionFactory.makeObject(common.getUuid(), '相等于', objectType.signs, resourceType.filterSigns)
      this.currentActionDetail.objs.push(newobj)
    }
  }

  private onDeleteFormula(obj: objectBase) {
    if (this.currentActionDetail.objs.length < 2) {
      this.currentActionDetail.objs = []
      // console.log('清除所有公式')
    } else {
      var index = this.currentActionDetail.objs.indexOf(obj)
      this.currentActionDetail.objs.splice(index, 1)
    }

    this.onFocusFormula(null)
  }

  @Emit('onFocusFormula')
  private onFocusFormula(obj: objectBase) {}
}
</script>
 
<style scoped>
</style>