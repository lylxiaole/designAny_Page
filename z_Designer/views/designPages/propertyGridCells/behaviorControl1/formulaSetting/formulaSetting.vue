 
<template>
  <div style="width:100%">
    <div style="padding:0px 10px;width:100%;position:relative">
      <div v-for="obj in currentObjs" :key="obj.id" class="flexHorilanLayout" style="float:left;margin: 4px;">
        <bahaviorResourceSelectTree :forType="forType" :currentObj="obj" :canDeleteObj="true" @onSelectNodeChanged="onResourceNodeChanged"
          @onFocus="onFocusFormula" @onDelete="onDeleteFormula" />
      </div>
    </div>
    <div style="position:relative;width:100%;">
      <el-button v-show="currentActionDetail" @click="addObj" style="margin-left:8px;float:right" type="primary" shape="circle">添加</el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop, InjectReactive } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'

import { EnginePage, EngineComponent, EngineLayout, layoutEventBehaviors } from '@designEngine/index'
import {
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
  factory
} from '@behaviorEngine/index'
import bahaviorResourceTree from '../behaviorResources/behaviorResourcesSelect.vue'

@Options({
  components: {
    bahaviorResourceSelectTree: bahaviorResourceTree
  }
})
export default class formulaSetting extends Vue {
  @Prop() behaviorResources: any
  @Prop({ default: {} }) currentActionDetail: actionDetail
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
    //   var first = this.actionFactory.makeObject(getUuid(), '新建变量', objectType.variable, resourceType.variables)
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

  private onResourceNodeChanged(newObj: objectBase, oldObj: objectBase) {
    oldObj.resourceId = newObj.resourceId
    oldObj.name = newObj.name
    oldObj.objType = newObj.objType
    oldObj.resourceType = newObj.resourceType

    this.onFocusFormula(oldObj)
  }

  //添加一个公式
  private addObj() {
    var obj = this.currentActionDetail.objs[this.currentActionDetail.objs.length - 1]
    if (!obj || obj.objType == objectType.signs) {
      let newobj = this.actionFactory.makeObject(getUuid(), '', objectType.fixedVal, resourceType.fixedVal)
      this.currentActionDetail.objs.push(newobj)
    } else if (this.forType == formulaType.cute) {
      let newobj = this.actionFactory.makeObject(getUuid(), '等于', objectType.signs, resourceType.signs)
      this.currentActionDetail.objs.push(newobj)
    } else if (this.forType == formulaType.filter) {
      let newobj = this.actionFactory.makeObject(getUuid(), '相等于', objectType.signs, resourceType.filterSigns)
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