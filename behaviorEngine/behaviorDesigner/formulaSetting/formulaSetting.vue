 
<template>
  <div style="width:100%">
    <div style="padding:0px 10px;width:100%;position:relative">
      <span v-if="currentIsAction" style="float:left;margin: 4px;">如果:</span>
      <div v-for="(obj,index) in currentObjs" :key="obj.id" class="flexHorilanLayout" style="float:left;margin:2px 2px;">
        <!-- <bahaviorResourceSelectTree v-model:currentObj="currentObjs[index]" :canDeleteObj="true" @onSelectNodeChanged="onResourceNodeChanged"
          @onFocus="onFocusFormula" @onDelete="onDeleteFormula" /> -->
        <template v-if="obj.objType=='signs'">
          <signChooser v-model:signObj="currentObjs[index]" />
        </template>
        <template v-else>
          <resourceChooser v-model:resourceObj="currentObjs[index]" />
        </template>
      </div>
      <el-button v-show="currentActionDetail" @click="addObj" style="margin:2px;float:left" size="small" type="primary" shape="circle">添加</el-button>
    </div>
    <!-- <div style="position:relative;width:100%;">
      <el-button v-show="currentActionDetail" @click="addObj" style="margin-left:8px;float:right" size="small" type="primary"
        shape="circle">添加</el-button>
    </div> -->
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop, InjectReactive, ProvideReactive } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'

import {
  behavior,
  action,
  actionDetail,
  formulaType,
  objectBase,
  objectType,
  resourceType,
  object_Method,
  object_callback,
  factory
} from '@behaviorEngine/index'
import bahaviorResourceTree from '../behaviorResources/behaviorResourcesSelect.vue'
import signChooser from '../behaviorResources/signChooser.vue'
import resourceChooser from '../behaviorResources/resourceChooser.vue'

@Options({
  components: {
    bahaviorResourceSelectTree: bahaviorResourceTree,
    signChooser: signChooser,
    resourceChooser: resourceChooser
  }
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
    return this.currentActionDetail.objs
  }

  mounted() {
    // if (this.currentActionDetail.objs && this.currentActionDetail.objs.length < 1) {
    //   var first = this.actionFactory.makeObject(getUuid(), '新建变量', objectType.variable, resourceType.variables)
    //   newobjs.push(first)
    // }
  }

  get currentIsAction(): boolean {
    if (!this.currentActionDetail) {
      return true
    } else if (this.currentActionDetail.isActionDetail) {
      return false
    } else {
      return true
    }
  }

  @Watch('currentActionDetail', { deep: true, immediate: true })
  watchCurrentActionChanged(newval: actionDetail) {
    window.console.log('2动作节点变化了', newval)
  }

  private onResourceNodeChanged(newObj: objectBase, oldObj: objectBase) {
    // oldObj.resourceId = newObj.resourceId
    // oldObj.name = newObj.name
    // oldObj.objType = newObj.objType
    // oldObj.resourceType = newObj.resourceType

    this.onFocusFormula(newObj)
  }

  //添加一个公式
  private addObj() {
    //当前公式的最后一个元素
    var obj = this.currentActionDetail.objs[this.currentActionDetail.objs.length - 1]

    let newobj = null
    if (obj && obj.objType === objectType.signs) {
      newobj = this.actionFactory.makeObject(resourceType.fixedValString)
    } else if (obj && obj.objType !== objectType.signs && this.currentIsAction === false) {
      newobj = this.actionFactory.makeObject(resourceType.signAssign)
    } else if (obj && obj.objType !== objectType.signs && this.currentIsAction === true) {
      newobj = this.actionFactory.makeObject(resourceType.signEqual)
    } else if (!obj && this.currentIsAction === false) {
      newobj = this.actionFactory.makeObject(resourceType.variables)
    } else if (!obj && this.currentIsAction === true) {
      newobj = this.actionFactory.makeObject(resourceType.fixedValString)
    }
    this.currentActionDetail.objs.push(newobj)
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