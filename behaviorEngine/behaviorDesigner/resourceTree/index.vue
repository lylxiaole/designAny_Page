<template>
  <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">
    <resourceTree :objGroup="objGroup" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { reactive } from 'vue'
//
import { object_group, getFuncObjByType } from '@behaviorEngine/actResource'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { object_Method } from '@behaviorEngine/actObject'
//
import { EnginePage, EngineContainer } from '@designEngine/index'
import { getUuid } from '@common/utils'
//
import resourceTree from './resourceTree.vue'
@Options({
  components: { resourceTree }
})
export default class index extends ComponentBase {
  @Prop()
  currentPage: EnginePage

  private objGroup: object_group[] = reactive([])

  mounted() {}
  // **********计算页面资源树**************************************************************
  @Watch('currentPage', { deep: true, immediate: true })
  private onCurrentPageChanged(page: EnginePage) {
    let findObjGroupIndex = this.objGroup.findIndex((o) => o.key == page.Id)
    if (findObjGroupIndex > -1) {
      this.objGroup.splice(findObjGroupIndex, 1)
    }
    //
    let findObjGroup = new object_group()
    findObjGroup.key = page.Id
    findObjGroup.title = '当前页面:' + page.name
    this.makeCurrentPageGroup(findObjGroup, page)
    //
    this.objGroup.push(findObjGroup)
  }
  //组织页面资源
  private makeCurrentPageGroup(targetGroup: object_group, currentPage: EngineContainer) {
    //页面方法
    for (let index = 0; index < currentPage.designerMethods.length; index++) {
      const dmethod = currentPage.designerMethods[index]
      let actObj = getFuncObjByType(funcCode.methodsInPage) as object_Method
      actObj.name = '页面方法:' + dmethod.eventName
      //入参
      for (let jndex = 0; jndex < dmethod.inParams.length; jndex++) {
        const inparam = dmethod.inParams[jndex]
        actObj.inputParams.push({
          key: getUuid(),
          name: inparam.name
        } as any)
      }
      //出参
      if (dmethod.outParam) {
        actObj.outParam = {
          key: getUuid(),
          name: dmethod.outParam.name
        } as any
      }

      targetGroup.childrenObjs.push(actObj)
    }
    //页面属性
    for (let index = 0; index < currentPage.properties().length; index++) {
      const pageProp = currentPage.properties()[index]
      let actObj = getFuncObjByType(funcCode.propertiesInPage) as object_Method
      actObj.name = '页面属性:' + pageProp.propertyName
      targetGroup.childrenObjs.push(actObj)
    }
    //页面子组件
    if (currentPage.children.length > 0) {
      for (let index = 0; index < currentPage.children.length; index++) {
        let child = currentPage.children[index]
        let childrenGroup = new object_group()
        childrenGroup.title = '页面子组件:' + child.name
        childrenGroup.key = child.Id
        this.makeCurrentPageGroup(childrenGroup, child as EngineContainer)
        //子组件的分组信息添加到页面的分组中
        targetGroup.childrenGroups.push(childrenGroup)
      }
    }
  }
  // ************************************************************************
}
</script>

<style>
</style>