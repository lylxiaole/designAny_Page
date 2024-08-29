<template>
  <el-row style="width:100%;height:100%">
    <el-col>选择接口:</el-col>
    <el-col>
      <el-tree-select node-key="id" size="small" :check-on-click-node="true" v-model="currentSelectId" :data="allApisTree" :render-after-expand="true"
        @check-change="onCurrentNodeChange" default-expand-all check-strictly />
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { inject } from 'vue'
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { deepClone, getUuid } from '@common/utils'
import { actionObj } from '@behaviorEngine/actObject'
import { flowDesignNode } from '../flowTypes'
import { funcCode } from '@behaviorEngine/actFuncBase'
import { flowNodeType } from '@behaviorEngine/flowDesigner/flowTypes'
import behaviorContext from '@behaviorEngine/01designerContext/context'
import { EnginePage } from '@design-any/interface/dist/index'

@flowDesignNode(funcCode.thirtyApi, flowNodeType.funcNormalNode)
@Options({
  components: {}
})
export default class thirtyApiNode extends Vue {
  @Prop()
  private actObj: actionObj
  @Prop()
  private currentPage: EnginePage
  public makeParamKey(key) {
    return this.actObj.id + '&' + key
  }

  mounted() {
    this.loadAllApis()

    if (this.actObj.resourceFilter.apiInfo) {
      this.currentSelectId = this.actObj.resourceFilter.apiInfo.id
    }
  }

  private currentSelectId: string = null
  private allApisTree: any[] = []
  private loadAllApis() {
    let allApis = behaviorContext.allThirtyApis
    this.allApisTree = this.orgnizeTree(allApis)
  }

  private orgnizeTree(allApis: any[]): any[] {
    let trees: any = []
    for (let index = 0; index < allApis.length; index++) {
      const apiinfo = allApis[index]
      if (apiinfo.groupName) {
        let children = apiinfo.childrenAPIs.concat(apiinfo.childrenGroups)
        let childrenTree = this.orgnizeTree(children)
        trees.push({
          type: 'group',
          id: apiinfo.id,
          label: apiinfo.groupName,
          children: childrenTree
        })
      } else {
        trees.push({
          type: 'api',
          id: apiinfo.id,
          label: apiinfo.name,
          apidata: apiinfo
        })
      }
    }

    return trees
  }

  private onCurrentNodeChange(nodedata, node, e: Event) {
    if (nodedata.type === 'group') {
      throw '分组不能被选中'
    }

    this.actObj.resourceFilter.apiInfo = nodedata.apidata
    this.currentSelectId = this.actObj.resourceFilter.apiInfo.id

    this.actObj.inputParams = []
    for (let index = 0; index < nodedata.apidata.headers.length; index++) {
      const header = nodedata.apidata.headers[index]
      this.actObj.inputParams.push({ key: this.makeParamKey(header.key + '&header'), name: '请求头:' + header.name })
    }
    for (let index = 0; index < nodedata.apidata.inParams.length; index++) {
      const inparam = nodedata.apidata.inParams[index]
      this.actObj.inputParams.push({ key: this.makeParamKey(inparam.key + '&param'), name: '链接参数:' + inparam.name })
    }
    //除了Get请求，其它的都需要使用body
    if (nodedata.apidata.requestType !== 'Get' && nodedata.apidata.bodyIsParam) {
      for (let index = 0; index < nodedata.apidata.bodyContent.length; index++) {
        const body = nodedata.apidata.bodyContent[index]
        this.actObj.inputParams.push({ key: this.makeParamKey(body.key + '&body'), name: 'body参数:' + body.name })
      }
    } else if (nodedata.apidata.requestType !== 'Get' && !nodedata.apidata.bodyIsParam) {
      this.actObj.inputParams.push({ key: this.makeParamKey('body'), name: 'body参数' })
    }

    this.actObj.outParam = { key: this.makeParamKey('输出'), name: '输出' }
  }
}
</script>


<style lang="less" scoped>
</style>