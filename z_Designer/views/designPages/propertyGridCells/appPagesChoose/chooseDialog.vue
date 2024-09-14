 
<template>
  <el-dialog ref="previewPopup" class="bhaviorDialog" title="选择页面" style="height:600px" width="800px" v-model="windowVisible" append-to-body
    :before-close="onClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-row style="height:480px;width:100%;background:#FFF">
      <el-tree ref="leftTree" node-key="id" :data="allPageTree" show-checkbox default-expand-all :allow-drop="false" :allow-drag="false"
        :expand-on-click-node="false" draggable highlight-current>
        <template #default="{data}">
          <el-text>{{data.label}}</el-text>
        </template>
      </el-tree>
    </el-row>
    <!-- ************************************************************ -->
    <template #footer>
      <el-row class="dialog-footer">
        <div class="steps-action">
          <el-button @click="onCancel">
            取消
          </el-button>
          <el-button :style="{'margin-left':' 8px'}" type="primary" @click="onConfirm">
            确认
          </el-button>
        </div>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Emit, Watch, Prop } from 'vue-property-decorator'
import { TreeInstance } from 'element-plus'

import propertyCellBase from '../common'
import { PropertyTypeEnum, AppPagesChoose_Setting } from '@design-any/interface/dist/LayoutAttr/PropertyInfo'
import { CellSettingAttr } from '../common'
import { applicationType, ApplicationDC, GetApplication } from '@common/apis/designApplication'
import { DesignPageGroupDC, DesignPageDC, TreeNodeDC, GetApplicationPages, ChangeGroupGroup, ChangePageGroup } from '@common/apis/designPage'
import { debug } from 'webpack'
import { toRaw } from 'vue'
import { deepClone } from '@common/utils'

@Options({})
export default class chooseDialog extends Vue {
  private get leftTree(): TreeInstance {
    return this.$refs.leftTree as TreeInstance
  }
  // **************************************************
  private allPageTree: TreeNodeDC[] = []
  // **************************************************
  private windowVisible: boolean = false

  @Prop()
  private currentApplication: ApplicationDC

  mounted() {}

  public async show(selectedTree, allTree) {
    this.allPageTree = allTree
    this.windowVisible = true
    await this.$nextTick()
    let checkIds = this.cuteCheckKeys(selectedTree)
    this.leftTree.setCheckedKeys(checkIds)
  }

  private onClose(e: MouseEvent) {
    this.windowVisible = false
  }
  private onConfirm() {
    let checks = this.cuteSelectedTree()

    this.onChangeTree(checks)
    this.windowVisible = false
  }
  private onCancel() {
    this.windowVisible = false
  }

  private cuteCheckKeys(selectedTree: TreeNodeDC[]): string[] {
    let res = []
    for (let index = 0; index < selectedTree.length; index++) {
      const element = selectedTree[index]
      if (element.type === 'page') {
        res.push(element.id)
      }

      if (element.type === 'group' && element.children) {
        let childchecks = this.cuteCheckKeys(element.children)
        res = res.concat(childchecks)
      }
    }
    return res
  }

  private cuteSelectedTree(): TreeNodeDC[] {
    let allPageTreeCopy: TreeNodeDC[] = deepClone(this.allPageTree)
    let checkedNodes = this.leftTree.getCheckedNodes() as TreeNodeDC[]
    let halfcheckedNodes = this.leftTree.getHalfCheckedNodes() as TreeNodeDC[]
    checkedNodes = checkedNodes.concat(halfcheckedNodes)
    let nohitsIds = this.getNohitChecks(checkedNodes, allPageTreeCopy)

    for (let index = 0; index < nohitsIds.length; index++) {
      const nohitId = nohitsIds[index]
      this.deleteNodeById(nohitId, allPageTreeCopy)
    }

    return allPageTreeCopy
  }
  private deleteNodeById(id: string, parentNodes: TreeNodeDC[]) {
    for (let index = 0; index < parentNodes.length; index++) {
      const node = parentNodes[index]
      if (node.id === id) {
        parentNodes.splice(index, 1)
        continue
      }
      this.deleteNodeById(id, node.children)
    }
  }
  private getNohitChecks(allChecks: TreeNodeDC[], all: TreeNodeDC[]) {
    let noHitIds = []

    for (let index = 0; index < all.length; index++) {
      const node = all[index]
      let find = allChecks.find((o) => o.id === node.id)
      if (!find) {
        noHitIds.push(node.id)
      }

      if (node.type === 'group') {
        let childrennohits = this.getNohitChecks(allChecks, node.children)
        noHitIds = noHitIds.concat(childrennohits)
      }
    }
    return noHitIds
  }

  @Emit('onChangeTree')
  private onChangeTree(val) {}
}
</script>



<style scoped>
</style>