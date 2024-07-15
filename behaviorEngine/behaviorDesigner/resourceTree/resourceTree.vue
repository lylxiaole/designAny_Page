<template>
  <div style="height:100%;width:100%" @click="onClickBlankArea">
    <el-row style="height: 50px; width: 100%;border-bottom: 1px solid rgb(223, 223, 223);">
      <el-row style="margin: 3px 15px">
        <el-input size="small" style="margin-bottom: 8px; height: 30px" v-model="seachVal" placeholder="请输入内容"></el-input>
      </el-row>
    </el-row>
    <el-row style="overflow: hidden; width: 100%; bottom: 0px;height:calc(100% - 50px)">
      <div style="overflow: auto; width: 100%; height: 100%; ">
        <el-tree node-key="id" :data="treeData" default-expand-all @node-drag-start="handleDragStart" @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave" @node-drag-over="handleDragOver" @node-drag-end="handleDragEnd" @node-drop="handleDrop"
          :allow-drop="allowDrop" :allow-drag="allowDrag" :expand-on-click-node="false" draggable highlight-current>
          <template #default="{  data}">
            <div v-if="data.type==='page'">
              <span class="icon iconfont">&#xe627;</span>
              <span>{{data.label}}</span>
            </div>
            <div v-if="data.type==='group'">
              <span class="icon iconfont">&#xe626;</span>
              <span>{{data.label}}</span>
            </div>
          </template>
        </el-tree>

      </div>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { GetApplicationPages } from '@common/apis/designPage'

import btreeNode from '@common/components/Treenode/bTreeNode.vue'
import { applicationType, ApplicationDC, GetApplication } from '@common/apis/designApplication'
import { object_group, getFuncObjByType } from '@behaviorEngine/actResource'
import { watch } from 'vue'

class TreeNodeDC {
  id: string
  label: string
  type: string
  children: TreeNodeDC[] = []
}

@Options({
  components: {
    btreeNode: btreeNode
  }
})
export default class index extends ComponentBase {
  private seachVal: string = ''
  private treeData: TreeNodeDC[] = []

  @Prop()
  private objGroup: object_group[]

  @Watch('objGroup', { deep: true, immediate: true })
  public onObjGroupChanged(val: object_group[]) {
    this.treeData = []
    if (!val) {
      return
    }
    this.treeData = this.organizeTree(val)
    /////////////
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
        treeNodeg.children.push(treeNodec)
      }

      let childrenGroups = this.organizeTree(group.childrenGroups)
      treeNodeg.children = childrenGroups.concat(treeNodeg.children)
      res.push(treeNodeg)
    }

    return res
  }

  mounted() {}
  // ***************树********************************************
  private handleDragStart(node, ev) {
    // console.log('drag start', node)
  }
  private handleDragEnter(draggingNode, dropNode, ev) {
    // console.log('tree drag enter: ', dropNode.label)
  }
  private handleDragLeave(draggingNode, dropNode, ev) {
    // console.log('tree drag leave: ', dropNode.label)
  }
  private handleDragOver(draggingNode, dropNode, ev) {
    // console.log('tree drag over: ', dropNode.label)
  }
  private handleDragEnd(draggingNode, dropNode, dropType, ev) {
    // console.log('tree drag end: ', dropNode && dropNode.label, dropType)
  }
  private async handleDrop(draggingNode, dropNode, dropType, ev) {}
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
  /**当节点名称改变后 */
  private async onNodeNameChanged(id: string, newtitle: string, nodedata: any) {}
  /**当确定节点的新名称 */
  private async onSureNodeName(id: string, newtitle: string, nodedata: any) {}

  // **************对外事件*****************************************************
  @Emit('onEditPage')
  private async onEditPage(pageId: string) {}
  @Emit('onDeletePage')
  private async onDeletePage(pageId: string) {}
}
</script>

<style lang="less" scoped>
/deep/.el-tree-node__content {
  height: 32px !important;
}
.themeHover:hover {
  background: #83c346;
  cursor: pointer;
  color: white;
}
.rightMenuNode {
  padding-left: 5px;
}

.pageListItem .iconfont {
  color: #9e9e9e;
}

.pageListItem:hover .iconfont {
  color: white;
}

.pageFontHover:hover {
  color: #ffffff;
}

.ant-tree-node-content-wrapper:hover .pageListItem {
  background-color: rgba(121, 169, 229, 0.3);
}

.ant-tree-node-selected .pageListItem {
  background-color: rgba(121, 169, 229, 0.3) !important;
}

.ant-tree-node-selected .pageFontHover {
  color: #ffffff !important;
}

.gad-plc-menu-icon {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65) !important;
}

.gad-plc {
  padding: 10px 0px;
  position: relative;
}
</style>