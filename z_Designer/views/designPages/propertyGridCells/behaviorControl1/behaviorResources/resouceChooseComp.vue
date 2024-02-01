<template>
  <div class="resource-tree" :style="{height:'100%'}">
    <div :style="{padding:'0px 3px',width:itemWidth?itemWidth:'200px'}">
      <a-input-search v-if="canSearch" v-model="currentSearchStr" size="middle" style="margin-bottom: 8px" @search="onSearch" />
      <div :style="{height:canSearch?'460px':'500px',overflow:'auto'}">
        <a-menu :style="{width:'100%',overflow:'auto',height:'100%'}" @select="onSelectItem">
          <template v-for="item in currentItems">
            <a-menu-item v-if="item.key" size="small" :tooltip="item.title" :key="item.key">
              <a-tooltip :title="item.title">
                <a-icon type="folder" />{{item.title}}
              </a-tooltip>
            </a-menu-item>
            <a-menu-item v-else size="small" :tooltip="item.name" :key="item.id">
              <a-tooltip :title="item.name">
                <a-icon type="tag" />{{item.name}}
              </a-tooltip>
            </a-menu-item>
          </template>
        </a-menu>
      </div>
    </div>
    <resouce-choose-comp v-if="isShowNextList" itemWidth="300px" ref="resourceTree" @onSelectedObj="onSelectedObj"
      :canSearch="currentSelectNode.canSearch" :canScrollPage="currentSelectNode.canScrollPage" :parentGroup="currentSelectNode" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { object_group, objectBase, objectType, object_Variable, object_FixedVal, resourceType } from '@behaviorEngine/index'
import { getFuncObjsTree } from '@behaviorEngine/index'

@Options({ name: 'resouceChooseComp' })
export default class resouceChooseComp extends Vue {
  @Prop() parentGroup: object_group
  @Prop() itemWidth: any

  @Watch('parentGroup', { deep: true, immediate: true })
  private watchParentGroupChanges(val: object_group) {
    this.refreshCurrentItems()
  }

  @Prop() canSearch: boolean
  @Prop() canScrollPage: boolean

  private currentItems: (object_group | objectBase)[] = []

  public async refreshCurrentItems() {
    let x = getFuncObjsTree()
    this.currentItems = x
  }

  private currentSelectKeys: string[] = []

  private isShowNextList: boolean = false

  /*************************************************************************** */
  mounted() {}
  /*************************************************************************** */
  /**选择树节点 */
  private onSelectItem(selecteditem: any) {
    this.currentSelectKeys = []
    // window.console.log('选择了节点')
    if (!selecteditem) {
      this.onSelectedObj(null)
      return
    }
    let key = selecteditem.key
    this.currentSelectKeys = [key]
    //
    let res = null
    this.currentItems.filter((item) => {
      if ((item as any).id == key || (item as any).key == key) {
        res = item
      }
    })

    if (res.id) {
      this.onSelectedObj(res as objectBase)
    } else {
      this.onSelectedObj(null)
    }
    /** */
    // var resourceTree = this.$refs['resourceTree'] as any
    // resourceTree.refreshCurrentItems()
  }

  @Emit('onSelectedObj')
  private onSelectedObj(obj: objectBase) {}
}
</script>

<style lang="less" scoped>
.ant-list-split .ant-list-item {
  border-bottom: none;
}

.resource-tree {
  display: flex;
  flex-wrap: nowrap;
  justify-content: left;
  // justify-content: center;
  // align-items: center;
}

.ant-menu-item:hover,
.ant-menu-item-active,
.ant-menu:not(.ant-menu-inline) .ant-menu-submenu-open,
.ant-menu-submenu-active,
.ant-menu-submenu-title:hover {
  color: #000;
}
</style>
 