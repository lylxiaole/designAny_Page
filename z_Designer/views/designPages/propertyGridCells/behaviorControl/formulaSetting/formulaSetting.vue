 
<template>
  <div style="width:100%">
    <div style="padding:0px 10px;width:100%;position:relative">
      <div v-for="(obj,index) in currentObjs" :key="obj.id" class="flexHorilanLayout" style="float:left;margin: 4px;">
        <bahaviorResourceSelectTree :forType="forType" v-model:currentObj="currentObjs[index]" :canDeleteObj="true"
          @onSelectNodeChanged="onResourceNodeChanged" @onFocus="onFocusFormula" @onDelete="onDeleteFormula" />
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

import { behavior, action, actionDetail, formulaType, actionObj, funcCode, factory } from '@behaviorEngine/index'
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

  get currentObjs(): actionObj[] {
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
    //   var first = this.actionFactory.makeObject(getUuid(), '新建变量', objectType.variable, funcCode.variables)
    //   newobjs.push(first)
    // }
  }

  @Watch('currentActionDetail')
  watchCurrentActionChanged(newval: actionDetail) {
    if (!newval) {
      return
    }
  }

  private onResourceNodeChanged(newObj: actionObj, oldObj: actionObj) {
    // oldObj.resourceId = newObj.resourceId
    // oldObj.name = newObj.name
    // oldObj.objType = newObj.objType
    // oldObj.funcCode = newObj.funcCode

    this.onFocusFormula(newObj)
  }

  //添加一个公式
  private addObj() {
    //当前公式的最后一个元素
    var obj = this.currentActionDetail.objs[this.currentActionDetail.objs.length - 1]

    // if (!obj || obj.objType == objectType.signs) {
    //   let newobj = this.actionFactory.makeObject(funcCode.fixedValString)
    //   this.currentActionDetail.objs.push(newobj)
    // } else if (this.forType == formulaType.cute) {
    //   let newobj = this.actionFactory.makeObject(funcCode.signAssign)
    //   this.currentActionDetail.objs.push(newobj)
    // } else if (this.forType == formulaType.filter) {
    //   let newobj = this.actionFactory.makeObject(funcCode.signEqual)
    //   this.currentActionDetail.objs.push(newobj)
    // }
  }

  private onDeleteFormula(obj: actionObj) {
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
  private onFocusFormula(obj: actionObj) {}
}
</script>
 
<style scoped>
</style>