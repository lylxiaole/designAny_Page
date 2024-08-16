<template>
  <div style="box-sizing:border-box;width:100%;height:100%;background-color:#cdcdcd">
    <div style="height:100%;width:100%">
      <el-row style="height: 50px; width: 100%;border-bottom: 1px solid rgb(223, 223, 223);">
        <el-row style="margin: 3px 15px">
          <el-input size="small" style="margin-bottom: 8px; height: 30px" v-model="seachVal" placeholder="请输入内容"></el-input>
        </el-row>
      </el-row>
      <el-row style="overflow: hidden; width: 100%; bottom: 0px;height:calc(100% - 50px)">
        <div style="overflow: auto; width: 100%; height: 100%; ">
          <el-tree node-key="id" :data="treeData" @node-drag-start="handleDragStart" :allow-drop="allowDrop" :allow-drag="allowDrag"
            :expand-on-click-node="false" draggable highlight-current>
            <template #default="{data}">
              <div draggable="true" v-if="data.type==='page'">
                <span class="icon iconfont">&#xe627;</span>
                <span>{{data.label}}</span>
              </div>
              <div draggable="true" v-if="data.type==='group'">
                <span class="icon iconfont">&#xe626;</span>
                <span>{{data.label}}</span>
              </div>
            </template>
          </el-tree>

        </div>
      </el-row>
    </div>
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
import { actionObj } from '@behaviorEngine/actObject'
//
import { EnginePage, EngineContainer } from '@designEngine/index'
import { deepClone, getUuid } from '@common/utils'
import LogicFlow from '@logicflow/core'
import { findFlowNode, flowNodeType, anchorType } from './flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'

class TreeNodeDC {
  id: string
  label: string
  type: string
  actObj: actionObj
  children: TreeNodeDC[] = []
}
@Options({
  components: {}
})
export default class index extends ComponentBase {
  //所有可用资源
  private objGroup: object_group[] = reactive([])
  private currentFlow: LogicFlow
  public setCurrentFlow(flow) {
    this.currentFlow = flow
  }

  currentPage: EnginePage
  public async init(page: EnginePage) {
    this.objGroup = []
    this.currentPage = page
    //计算当前页面可用资源
    let findObjGroupIndex = this.objGroup.findIndex((o) => o.key == page.Id)
    if (findObjGroupIndex > -1) {
      this.objGroup.splice(findObjGroupIndex, 1)
    }
    //计算页面
    let pageObjGroup = new object_group()
    pageObjGroup.key = page.Id
    pageObjGroup.title = '页面资源:' + page.name
    this.makeCurrentPageGroup(pageObjGroup, page)
    this.objGroup.push(pageObjGroup)
    //计算字典资源
    let dictionaryGroup = new object_group()
    dictionaryGroup.key = getUuid()
    dictionaryGroup.title = '字典'
    await this.makeDictionaryGroup(dictionaryGroup)
    this.objGroup.push(dictionaryGroup)
    //计算外部api资源
    let thirtyApiGroup = new object_group()
    thirtyApiGroup.key = getUuid()
    thirtyApiGroup.title = '外部接口'
    let datas = behaviorContext.allThirtyApis
    await this.makeApisGroup(thirtyApiGroup, datas)
    this.objGroup.push(thirtyApiGroup)
    //判断条件
    let judgeGroup = new object_group()
    judgeGroup.key = getUuid()
    judgeGroup.title = '判断条件'
    this.makejudgeGroup(judgeGroup)
    this.objGroup.push(judgeGroup)
  }

  mounted() {}

  // **********资源树操作**************************************************************
  private seachVal: string = ''
  private treeData: TreeNodeDC[] = []
  @Watch('objGroup', { deep: true, immediate: true })
  public onObjGroupChanged(val: object_group[]) {
    this.treeData = []
    if (!val) {
      return
    }
    this.treeData = this.organizeTree(val)
  }

  private organizeTree(groups: object_group[]): TreeNodeDC[] {
    let res: TreeNodeDC[] = []
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index]
      let treeNodeg = new TreeNodeDC()
      treeNodeg.id = group.key
      treeNodeg.label = group.title
      treeNodeg.type = 'group'
      treeNodeg.children = []

      for (let jndex = 0; jndex < group.childrenObjs.length; jndex++) {
        const childBoj = group.childrenObjs[jndex]
        let treeNodec = new TreeNodeDC()
        treeNodec.id = childBoj.id
        treeNodec.label = childBoj.name
        treeNodec.type = 'node'
        treeNodec.actObj = childBoj
        treeNodeg.children.push(treeNodec)
      }

      let childrenGroups = this.organizeTree(group.childrenGroups)
      treeNodeg.children = childrenGroups.concat(treeNodeg.children)
      res.push(treeNodeg)
    }

    return res
  }

  private handleDragStart(node, event) {
    if (node.data.type === 'group') {
      return
    }

    if (event.dataTransfer) {
      let newObj = deepClone(node.data.actObj) as actionObj
      newObj.id = getUuid()
      // ********************
      let flowNode = findFlowNode(newObj.funcCode)
      let dragData = {
        id: newObj.id,
        type: flowNode,
        properties: { actObj: newObj }
      }

      this.currentFlow.dnd.startDrag(dragData)
    }
  }

  private allowDrop(draggingNode, dropNode, type) {
    return false
  }
  private allowDrag(draggingNode) {
    if (draggingNode.data.type === 'node') {
      return true
    } else {
      return false
    }
  }
  // **********计算页面资源**************************************************************
  private makeCurrentPageGroup(targetGroup: object_group, layout: EngineContainer) {
    //页面方法
    for (let index = 0; index < layout.designerMethods.length; index++) {
      const dmethod = layout.designerMethods[index]
      let actObj = getFuncObjByType(funcCode.methodsInPage) as actionObj
      actObj.name = '方法:' + dmethod.methodName
      actObj.description = '组件:' + layout.name + '-方法:' + dmethod.methodName
      actObj.resourceFilter = {
        layoutId: layout.Id,
        methodField: dmethod.methodField
      }
      //入参
      if (dmethod.inParams) {
        for (let jndex = 0; jndex < dmethod.inParams.length; jndex++) {
          const inparam = dmethod.inParams[jndex]
          actObj.inputParams.push({
            key: getUuid(),
            name: inparam.name
          } as any)
        }
      }
      //出参
      if (dmethod.hasOutParam) {
        actObj.outParam = {
          key: getUuid(),
          name: ''
        } as any
      }
      targetGroup.childrenObjs.push(actObj)
    }
    //页面属性
    for (let index = 0; index < layout.properties.length; index++) {
      const lprop = layout.properties[index]
      if (lprop.canSetting === false) {
        continue
      }
      let actObj = getFuncObjByType(funcCode.propertiesInPage) as actionObj
      actObj.name = '属性:' + lprop.propertyName
      actObj.description = '组件:' + layout.name + '-属性:' + lprop.propertyName
      actObj.resourceFilter = {
        layoutId: layout.Id,
        propField: lprop.field
      }
      //入参
      actObj.inputParams.push({
        key: getUuid(),
        name: '设定值'
      } as any)
      //出参
      actObj.outParam = {
        key: getUuid(),
        name: ''
      } as any
      targetGroup.childrenObjs.push(actObj)
    }
    //递归遍历页面子组件
    if (layout.children.length > 0) {
      for (let index = 0; index < layout.children.length; index++) {
        let child = layout.children[index]
        let childrenGroup = new object_group()
        childrenGroup.title = '子组件:' + child.name
        childrenGroup.key = child.Id
        this.makeCurrentPageGroup(childrenGroup, child as EngineContainer)
        //子组件的分组信息添加到页面的分组中
        targetGroup.childrenGroups.push(childrenGroup)
      }
    }
  }
  // ***********计算后端字典资源树*******************************************************
  private async makeDictionaryGroup(targetGroup: object_group) {
    let datas = behaviorContext.allDictionary
    for (let index = 0; index < datas.length; index++) {
      const element = datas[index]
      let actObj = getFuncObjByType(funcCode.dictionary) as actionObj
      actObj.name = '字典:' + element.key
      actObj.description = '字典:' + element.key
      actObj.resourceFilter = {
        dicKey: element.key
      }
      actObj.outParam = { key: getUuid(), name: '' }
      targetGroup.childrenObjs = []
      targetGroup.childrenObjs.push(actObj)
    }
  }
  // ***********计算外部接口资源树*******************************************************
  private async makeApisGroup(targetGroup: object_group, topGroups: any[]) {
    for (let index = 0; index < topGroups.length; index++) {
      let group = topGroups[index]
      let actGroup = new object_group()
      actGroup.key = group.id
      actGroup.title = group.groupName
      actGroup.childrenObjs = []
      if (group.childrenGroups) {
        this.makeApisGroup(actGroup, group.childrenGroups)
      }
      if (group.childrenAPIs) {
        for (let index = 0; index < group.childrenAPIs.length; index++) {
          //根据接口内容，制作actObj
          const api = group.childrenAPIs[index]

          let actObj = getFuncObjByType(funcCode.thirtyApi) as actionObj
          actObj.name = api.name
          actObj.id = getUuid()
          actObj.description = api.name
          actObj.inputParams = []
          actObj.resourceFilter = {
            apiInfo: api
          }

          for (let index = 0; index < api.headers.length; index++) {
            const header = api.headers[index]
            actObj.inputParams.push({ key: header.key + '&header', name: '请求头:' + header.name })
          }
          for (let index = 0; index < api.inParams.length; index++) {
            const inparam = api.inParams[index]
            actObj.inputParams.push({ key: inparam.key + '&param', name: '链接参数:' + inparam.name })
          }
          //除了Get请求，其它的都需要使用body
          if (api.requestType !== 'Get' && api.bodyIsParam) {
            for (let index = 0; index < api.bodyContent.length; index++) {
              const body = api.bodyContent[index]
              actObj.inputParams.push({ key: body.key + '&body', name: 'body参数:' + body.name })
            }
          } else if (api.requestType !== 'Get' && !api.bodyIsParam) {
            actObj.inputParams.push({ key: '&body', name: 'body参数' })
          }

          actObj.outParam = { key: getUuid(), name: '' }
          actGroup.childrenObjs.push(actObj)
        }
      }

      targetGroup.childrenGroups.push(actGroup)
    }
  }
  //************计算判断条件**************************************************** */

  private async makejudgeGroup(targetGroup: object_group) {
    let actObj = getFuncObjByType(funcCode.oneParamJude) as actionObj
    actObj.name = '单条件判断'
    actObj.id = getUuid()
    actObj.description = '单条件判断'
    actObj.inputParams = []
    actObj.isJudeNode = true
    actObj.resourceFilter = {}
    actObj.outParam = null
    targetGroup.childrenObjs.push(actObj)
    //////
  }
}
</script>

<style>
</style>